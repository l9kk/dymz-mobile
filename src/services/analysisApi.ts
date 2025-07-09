/**
 * Analysis API Service
 * Handles all skin analysis related API calls
 */

import { ApiService } from './api';
import { compressImageForUpload, CompressionPresets } from '../utils/imageCompression';

// Analysis data types based on backend schema
export interface SkinMetrics {
    overall_skin_type?: string;
    skin_conditions?: string[];
    metrics?: {
        [key: string]: {
            level: string;
            score: number;
            confidence: number;
        };
    };
    recommendations?: string[];
    confidence_score?: number;
    analysis_date?: string;
    regions_analyzed?: string[];
    analysis_notes?: string;
    model_version?: string;
}

export interface Analysis {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    image_url: string;
    image_filename: string;
    status: 'processing' | 'completed' | 'failed';
    error_message?: string;
    skin_metrics?: SkinMetrics;
    processing_duration?: string;
    model_version?: string;
}

export interface AnalysisListResponse {
    analyses: Analysis[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
}

export interface AnalysisStatusResponse {
    analysis_id: string;
    status: 'processing' | 'completed' | 'failed';
    progress?: number;
    estimated_completion?: string;
    error_message?: string;
}

export interface AnalysisUploadResponse {
    message: string;
    analysis_id: string;
    status: string;
    task_id: string;
}

export class AnalysisApiService extends ApiService {
    private readonly endpoints = {
        analysis: '/api/v1/analysis',
        latest: '/api/v1/analysis/latest',
        byId: (id: string) => `/api/v1/analysis/${id}`,
        status: (id: string) => `/api/v1/analysis/${id}/status`,
    };

    /**
     * Validates if analysis contains real Gemini data or fallback data
     * Detects common patterns in fallback/dummy data
     */
    private validateAnalysisData(analysis: Analysis): boolean {
        if (!analysis.skin_metrics?.metrics) {
            console.warn('⚠️ Analysis missing skin metrics - likely fallback data');
            return false;
        }

        const metrics = analysis.skin_metrics.metrics;
        const scores = Object.values(metrics).map(metric => {
            if (typeof metric === 'object' && metric !== null) {
                return (metric as any).score || 0;
            }
            return 0;
        });

        // Check for suspicious patterns that indicate fallback data
        // Note: scores are already in 0-100 range, don't multiply by 100
        const hasRoundNumbers = scores.some(score => [20, 40, 50, 30, 60, 80].includes(score));
        const hasNoVariation = new Set(scores).size <= 2;
        const hasLowConfidence = analysis.skin_metrics.confidence_score !== undefined &&
            analysis.skin_metrics.confidence_score < 0.3;

        // Additional check for model version - real analysis uses gemini-1.5-pro
        const hasWrongModel = analysis.skin_metrics.model_version?.includes('flash-langchain');

        // Only flag as fallback if multiple indicators present OR confidence is very low
        const fallbackIndicators = [hasRoundNumbers, hasNoVariation, hasWrongModel].filter(Boolean).length;
        const isFallback = fallbackIndicators >= 2 || hasLowConfidence;

        if (isFallback) {
            console.warn('⚠️ Detected possible fallback data patterns (proceeding anyway):', {
                hasRoundNumbers,
                hasNoVariation,
                hasLowConfidence,
                hasWrongModel,
                modelVersion: analysis.skin_metrics.model_version,
                scores: scores,
                confidence: analysis.skin_metrics.confidence_score
            });
            // Don't return false - proceed with the data anyway
        }

        // Check if error message indicates Gemini failure
        if (analysis.error_message?.includes('Gemini') ||
            analysis.error_message?.includes('analysis failed') ||
            analysis.error_message?.includes('fallback')) {
            console.warn('🚨 Analysis error indicates backend AI failure:', analysis.error_message);
            return false;
        }

        return true;
    }

    /**
     * Upload a selfie image for skin analysis
     */
    async uploadImage(
        imageUri: string,
        onProgress?: (progress: number) => void
    ): Promise<AnalysisUploadResponse> {
        try {
            console.log('🔧 Compressing image before upload to prevent 413 errors...');

            // Compress image using ANALYSIS preset (1024x1024, quality 0.85)
            const compressedImageUri = await compressImageForUpload(
                imageUri,
                CompressionPresets.ANALYSIS
            );

            console.log('✅ Image compression completed, proceeding with upload');

            const file = {
                uri: compressedImageUri,
                name: 'selfie.jpg',
                type: 'image/jpeg',
            };

            return this.uploadFile<AnalysisUploadResponse>(
                this.endpoints.analysis,
                file,
                undefined,
                onProgress
            );
        } catch (error) {
            console.error('❌ Upload failed with compression:', error);
            throw error;
        }
    }

    /**
     * Get analysis results by ID with validation
     */
    async getAnalysis(analysisId: string): Promise<Analysis> {
        const analysis = await this.get<Analysis>(this.endpoints.byId(analysisId));

        // Validate the analysis data if completed (log warnings but don't throw errors)
        if (analysis.status === 'completed') {
            this.validateAnalysisData(analysis);
            // Note: validation now only logs warnings, doesn't throw errors
        }

        return analysis;
    }

    /**
     * Get analysis status for polling
     */
    async getAnalysisStatus(analysisId: string): Promise<AnalysisStatusResponse> {
        return this.get<AnalysisStatusResponse>(this.endpoints.status(analysisId));
    }

    /**
     * Get user's latest analysis with validation
     */
    async getLatestAnalysis(): Promise<Analysis> {
        const analysis = await this.get<Analysis>(this.endpoints.latest);

        // Validate the analysis data if completed (log warnings but proceed normally)
        if (analysis.status === 'completed') {
            this.validateAnalysisData(analysis);
            // Note: validation now only logs warnings, analysis proceeds normally
        }

        return analysis;
    }

    /**
     * List user's analyses with pagination
     */
    async listAnalyses(
        page = 1,
        limit = 10
    ): Promise<AnalysisListResponse> {
        const skip = (page - 1) * limit;
        const result = await this.get<AnalysisListResponse>(
            `${this.endpoints.analysis}?skip=${skip}&limit=${limit}`
        );

        // Validate each completed analysis (log warnings but don't modify status)
        result.analyses.forEach(analysis => {
            if (analysis.status === 'completed') {
                this.validateAnalysisData(analysis);
                // Note: validation now only logs warnings, doesn't modify analysis status
            }
        });

        return result;
    }

    /**
     * Delete an analysis
     */
    async deleteAnalysis(analysisId: string): Promise<void> {
        return this.delete<void>(this.endpoints.byId(analysisId));
    }

    /**
     * Poll analysis status until completion with enhanced validation
     * Returns completed analysis or throws error on timeout/failure
     */
    async pollAnalysisUntilComplete(
        analysisId: string,
        maxAttempts = 60, // 5 minutes max (5s intervals)
        intervalMs = 5000
    ): Promise<Analysis> {
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                const status = await this.getAnalysisStatus(analysisId);

                if (status.status === 'completed') {
                    // Get and validate the completed analysis
                    const analysis = await this.get<Analysis>(this.endpoints.byId(analysisId));

                    // Validate the analysis data (log warnings but proceed)
                    this.validateAnalysisData(analysis);
                    // Note: validation now only logs warnings, doesn't throw errors

                    return analysis;
                }

                if (status.status === 'failed') {
                    throw new Error(status.error_message || 'Analysis failed');
                }

                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, intervalMs));
                attempts++;
            } catch (error) {
                // If it's a network error, retry
                if (attempts < 3) {
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, intervalMs));
                    continue;
                }
                throw error;
            }
        }

        throw new Error('Analysis timeout - processing took too long');
    }
}

// Export singleton instance
export const analysisApi = new AnalysisApiService(); 