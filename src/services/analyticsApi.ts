/**
 * Analytics API Service
 * Handles all analytics and progress-related API calls
 */

import { ApiService } from './api';
import type {
    ProgressAnalyticsResponse,
    BeforeAfterComparison,
    ImprovementSummary
} from '../types/api';

// Analytics data types based on backend schema
export interface AnalyticsOverview {
    user_id: string;
    total_analyses: number;
    total_routines_completed: number;
    current_streak: number;
    longest_streak: number;
    skin_health_score: number;
    progress_percentage: number;
    last_analysis_date?: string;
    next_analysis_recommendation?: string;
    achievements_unlocked: number;
    total_products_tried: number;
}

export interface ProgressMetric {
    metric_name: string;
    current_value: number;
    previous_value?: number;
    change_percentage: number;
    trend: 'improving' | 'stable' | 'declining';
    measurement_unit: string;
    measurement_date: string;
}

export interface ProgressAnalytics {
    user_id: string;
    time_period: 'week' | 'month' | 'quarter' | 'year';
    metrics: ProgressMetric[];
    overall_improvement: number;
    areas_of_improvement: string[];
    areas_needing_attention: string[];
    recommendations: string[];
    generated_at: string;
}

export interface AnalyticsSummary {
    user_id: string;
    summary_period: 'week' | 'month' | 'quarter';
    start_date: string;
    end_date: string;
    key_metrics: {
        routines_completed: number;
        analyses_performed: number;
        products_used: number;
        improvement_score: number;
    };
    achievements: {
        new_badges: number;
        streak_milestones: number;
        goal_completions: number;
    };
    insights: string[];
    recommendations: string[];
    next_analysis_suggestion?: string;
}

export interface ProgressAnalyticsRequest {
    time_period?: 'week' | 'month' | 'quarter' | 'year';
    include_predictions?: boolean;
    metric_types?: string[];
}

export interface BeforeAfterRequest {
    before_analysis_id: string;
    after_analysis_id: string;
    include_images?: boolean;
}

export class AnalyticsApiService extends ApiService {
    private readonly endpoints = {
        overview: '/api/v1/analytics/overview',
        progress: '/api/v1/analytics/progress',
        beforeAfter: '/api/v1/analytics/before-after',
        summary: '/api/v1/analytics/summary',
    };

    /**
     * Get analytics overview (last 30 days)
     */
    async getAnalyticsOverview(): Promise<ProgressAnalyticsResponse> {
        console.log('📊 Fetching analytics overview...');
        try {
            const data = await this.get<ProgressAnalyticsResponse>(this.endpoints.overview);
            console.log('✅ Analytics overview fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch analytics overview:', error);
            throw error;
        }
    }

    /**
     * Get user progress analytics over specified time period
     */
    async getUserProgress(days: number = 30): Promise<ProgressAnalyticsResponse> {
        console.log(`📈 Fetching user progress for ${days} days...`);
        try {
            const data = await this.get<ProgressAnalyticsResponse>(
                `${this.endpoints.progress}?days=${days}`
            );
            console.log('✅ User progress fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch user progress:', error);
            throw error;
        }
    }

    /**
     * Get before/after comparison using first and latest analyses
     */
    async getBeforeAfterComparison(): Promise<BeforeAfterComparison> {
        console.log('🔄 Fetching before/after comparison...');
        try {
            const data = await this.get<BeforeAfterComparison>(this.endpoints.beforeAfter);
            console.log('✅ Before/after comparison fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch before/after comparison:', error);
            throw error;
        }
    }

    /**
     * Get overall improvement summary for the user
     */
    async getImprovementSummary(): Promise<ImprovementSummary> {
        console.log('📋 Fetching improvement summary...');
        try {
            const data = await this.get<ImprovementSummary>(this.endpoints.summary);
            console.log('✅ Improvement summary fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch improvement summary:', error);
            throw error;
        }
    }

    /**
     * Get progress analytics for a specific time period
     */
    async getProgressAnalytics(
        request: ProgressAnalyticsRequest = {}
    ): Promise<ProgressAnalytics> {
        try {
            const params = new URLSearchParams();

            if (request.time_period) {
                params.append('time_period', request.time_period);
            }

            if (request.include_predictions !== undefined) {
                params.append('include_predictions', request.include_predictions.toString());
            }

            if (request.metric_types && request.metric_types.length > 0) {
                request.metric_types.forEach(type => params.append('metric_types', type));
            }

            const queryString = params.toString();
            const url = queryString ? `${this.endpoints.progress}?${queryString}` : this.endpoints.progress;

            // Get backend data with correct type
            const backendData = await this.get<ProgressAnalyticsResponse>(url);

            // Map backend SkinMetricTrend to frontend ProgressMetric interface
            const mappedMetrics: ProgressMetric[] = (backendData.metric_trends || []).map(trend => ({
                metric_name: trend.metric_name,
                current_value: trend.current_value,
                previous_value: trend.initial_value, // Map initial_value to previous_value
                change_percentage: trend.improvement_percentage, // Map improvement_percentage to change_percentage
                trend: trend.trend_direction as 'improving' | 'stable' | 'declining', // Map trend_direction to trend
                measurement_unit: 'score', // Default unit
                measurement_date: new Date().toISOString(), // Default to current date
            }));

            // Build areas lists based on trends
            const areas_of_improvement = mappedMetrics
                .filter(m => m.trend === 'improving')
                .map(m => m.metric_name);

            const areas_needing_attention = mappedMetrics
                .filter(m => m.trend === 'declining')
                .map(m => m.metric_name);

            return {
                user_id: '',
                time_period: request.time_period || 'month',
                metrics: mappedMetrics,
                overall_improvement: backendData.overall_improvement_percentage || 0,
                areas_of_improvement,
                areas_needing_attention,
                recommendations: [], // Could be populated from backend if available
                generated_at: new Date().toISOString(),
            };
        } catch (error) {
            console.warn('Progress analytics endpoint failed, returning default data:', error);
            return {
                user_id: '',
                time_period: request.time_period || 'month',
                metrics: [],
                overall_improvement: 0,
                areas_of_improvement: [],
                areas_needing_attention: [],
                recommendations: [],
                generated_at: new Date().toISOString(),
            };
        }
    }

    /**
     * Get analytics summary for a period
     */
    async getAnalyticsSummary(
        period: 'week' | 'month' | 'quarter' = 'month'
    ): Promise<AnalyticsSummary> {
        try {
            const params = new URLSearchParams();
            params.append('period', period);

            return await this.get<AnalyticsSummary>(`${this.endpoints.summary}?${params.toString()}`);
        } catch (error) {
            console.warn('Analytics summary endpoint failed, returning default data:', error);
            return {
                user_id: '',
                summary_period: period,
                start_date: new Date().toISOString(),
                end_date: new Date().toISOString(),
                key_metrics: {
                    routines_completed: 0,
                    analyses_performed: 0,
                    products_used: 0,
                    improvement_score: 0,
                },
                achievements: {
                    new_badges: 0,
                    streak_milestones: 0,
                    goal_completions: 0,
                },
                insights: [],
                recommendations: [],
                next_analysis_suggestion: undefined,
            };
        }
    }

    /**
     * Helper: Get weekly progress
     */
    async getWeeklyProgress(): Promise<ProgressAnalytics> {
        return this.getProgressAnalytics({ time_period: 'week' });
    }

    /**
     * Helper: Get monthly progress
     */
    async getMonthlyProgress(): Promise<ProgressAnalytics> {
        return this.getProgressAnalytics({ time_period: 'month' });
    }

    /**
     * Helper: Get quarterly progress
     */
    async getQuarterlyProgress(): Promise<ProgressAnalytics> {
        return this.getProgressAnalytics({ time_period: 'quarter' });
    }

    /**
     * Helper: Get yearly progress
     */
    async getYearlyProgress(): Promise<ProgressAnalytics> {
        return this.getProgressAnalytics({ time_period: 'year' });
    }

    /**
     * Helper: Get progress with predictions
     */
    async getProgressWithPredictions(
        timePeriod: 'week' | 'month' | 'quarter' | 'year' = 'month'
    ): Promise<ProgressAnalytics> {
        return this.getProgressAnalytics({
            time_period: timePeriod,
            include_predictions: true
        });
    }

    /**
     * Helper: Get specific metric progress
     */
    async getMetricProgress(
        metricTypes: string[],
        timePeriod: 'week' | 'month' | 'quarter' | 'year' = 'month'
    ): Promise<ProgressAnalytics> {
        return this.getProgressAnalytics({
            time_period: timePeriod,
            metric_types: metricTypes
        });
    }

    /**
     * Helper: Get skin health score trend
     */
    async getSkinHealthTrend(
        timePeriod: 'week' | 'month' | 'quarter' | 'year' = 'month'
    ): Promise<ProgressMetric[]> {
        const analytics = await this.getProgressAnalytics({
            time_period: timePeriod,
            metric_types: ['skin_health_score', 'overall_improvement']
        });

        // Now return the correctly mapped metrics
        return (analytics.metrics || []).filter(metric =>
            metric?.metric_name === 'skin_health_score' ||
            metric?.metric_name === 'overall_improvement'
        );
    }

    /**
     * Helper: Get recent summary with insights
     */
    async getRecentInsights(): Promise<{
        overview: AnalyticsOverview;
        summary: AnalyticsSummary;
        recentProgress: ProgressAnalytics;
    }> {
        const [overview, summary, recentProgress] = await Promise.all([
            this.getAnalyticsOverview(),
            this.getAnalyticsSummary('week'),
            this.getWeeklyProgress()
        ]);

        // Convert ProgressAnalyticsResponse to AnalyticsOverview format
        const analyticsOverview: AnalyticsOverview = {
            user_id: '',
            total_analyses: overview.total_analyses,
            total_routines_completed: 0,
            current_streak: 0,
            longest_streak: 0,
            skin_health_score: overview.overall_improvement_percentage,
            progress_percentage: overview.overall_improvement_percentage,
            last_analysis_date: overview.latest_analysis_date,
            next_analysis_recommendation: undefined,
            achievements_unlocked: 0,
            total_products_tried: 0,
        };

        return {
            overview: analyticsOverview,
            summary,
            recentProgress
        };
    }

    /**
     * Helper: Check if user should take new analysis
     */
    async shouldTakeNewAnalysis(): Promise<{
        shouldTake: boolean;
        reason?: string;
        daysSinceLastAnalysis?: number;
        recommendedDate?: string;
    }> {
        const overview = await this.getAnalyticsOverview();

        if (!overview.latest_analysis_date) {
            return {
                shouldTake: true,
                reason: 'No previous analysis found'
            };
        }

        const lastAnalysisDate = new Date(overview.latest_analysis_date);
        const now = new Date();
        const daysSince = Math.floor((now.getTime() - lastAnalysisDate.getTime()) / (1000 * 60 * 60 * 24));

        // Recommend new analysis after 30 days
        const shouldTake = daysSince >= 30;

        return {
            shouldTake,
            daysSinceLastAnalysis: daysSince,
            reason: shouldTake ? `${daysSince} days since last analysis` : undefined,
            recommendedDate: shouldTake ? undefined : new Date(lastAnalysisDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString()
        };
    }

    /**
     * Helper: Get improvement insights
     */
    async getImprovementInsights(): Promise<{
        improving: string[];
        stable: string[];
        declining: string[];
        recommendations: string[];
    }> {
        const progress = await this.getMonthlyProgress();

        // Now using the correctly mapped data from getProgressAnalytics
        const improving = (progress.metrics || [])
            .filter(m => m?.trend === 'improving')
            .map(m => m.metric_name);

        const stable = (progress.metrics || [])
            .filter(m => m?.trend === 'stable')
            .map(m => m.metric_name);

        const declining = (progress.metrics || [])
            .filter(m => m?.trend === 'declining')
            .map(m => m.metric_name);

        return {
            improving,
            stable,
            declining,
            recommendations: progress.recommendations || []
        };
    }
}

// Export singleton instance
export const analyticsApi = new AnalyticsApiService();

// Re-export types for convenience
export type { ProgressAnalyticsResponse, BeforeAfterComparison, ImprovementSummary }; 