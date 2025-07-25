/**
 * Analysis React Query Hooks
 * Manages all analysis-related data fetching and mutations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analysisApi, Analysis, AnalysisListResponse, AnalysisUploadResponse } from '../../services/analysisApi';
import { useAuthStore } from '../../stores/authStore';

// Query keys for React Query
export const analysisKeys = {
    all: ['analysis'] as const,
    lists: () => [...analysisKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...analysisKeys.lists(), filters] as const,
    details: () => [...analysisKeys.all, 'detail'] as const,
    detail: (id: string) => [...analysisKeys.details(), id] as const,
    status: (id: string) => [...analysisKeys.all, 'status', id] as const,
    latest: () => [...analysisKeys.all, 'latest'] as const,
};

/**
 * Hook for uploading analysis image
 */
export const useAnalysisUpload = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            imageUri,
            onProgress
        }: {
            imageUri: string;
            onProgress?: (progress: number) => void;
        }) => analysisApi.uploadImage(imageUri, onProgress),

        onSuccess: (data: AnalysisUploadResponse) => {
            // Invalidate analysis lists to include new upload
            queryClient.invalidateQueries({ queryKey: analysisKeys.lists() });

            // Start polling for the new analysis
            queryClient.setQueryData(
                analysisKeys.detail(data.analysis_id),
                {
                    id: data.analysis_id,
                    status: 'processing',
                    created_at: new Date().toISOString(),
                }
            );
        },
    });
};

/**
 * Hook for getting analysis by ID
 */
export const useAnalysis = (analysisId: string, enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: analysisKeys.detail(analysisId),
        queryFn: () => analysisApi.getAnalysis(analysisId),
        enabled: enabled && !!analysisId && isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes for all analyses
        retry: (failureCount, error: any) => {
            // Don't retry 404/403 errors (analysis not found/not authenticated)
            if (error?.status === 404 || error?.status === 403) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for polling analysis status
 * Automatically polls until analysis is complete or failed
 */
export const useAnalysisWithPolling = (analysisId: string, enabled = true) => {
    return useQuery({
        queryKey: analysisKeys.detail(analysisId),
        queryFn: () => analysisApi.getAnalysis(analysisId),
        enabled: enabled && !!analysisId,
        refetchInterval: (query) => {
            // Poll every 3 seconds if processing, stop if completed/failed
            const data = query.state.data;
            if (!data) return 3000;
            return data.status === 'processing' ? 3000 : false;
        },
        staleTime: 0, // Always refetch when polling
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for getting analysis status only (lighter weight for polling)
 */
export const useAnalysisStatus = (analysisId: string, enabled = true) => {
    return useQuery({
        queryKey: analysisKeys.status(analysisId),
        queryFn: () => analysisApi.getAnalysisStatus(analysisId),
        enabled: enabled && !!analysisId,
        refetchInterval: (query) => {
            // Poll every 3 seconds if processing
            const data = query.state.data;
            return data?.status === 'processing' ? 3000 : false;
        },
        staleTime: 0,
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for getting user's latest analysis
 */
export const useLatestAnalysis = (enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: analysisKeys.latest(),
        queryFn: () => analysisApi.getLatestAnalysis(),
        enabled: enabled && isAuthenticated, // Only fetch if authenticated
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: (failureCount, error: any) => {
            // Don't retry if no analyses found or if not authenticated
            if (error?.status === 404 || error?.status === 403) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for listing user's analyses
 */
export const useAnalysesList = (page = 1, limit = 10, enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: analysisKeys.list({ page, limit }),
        queryFn: () => analysisApi.listAnalyses(page, limit),
        enabled: enabled && isAuthenticated,
        staleTime: 60 * 1000, // 1 minute
        placeholderData: (previousData) => previousData, // Keep previous data while loading
    });
};

/**
 * Hook for deleting an analysis
 */
export const useDeleteAnalysis = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (analysisId: string) => analysisApi.deleteAnalysis(analysisId),
        onSuccess: (_, analysisId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: analysisKeys.detail(analysisId) });
            queryClient.removeQueries({ queryKey: analysisKeys.status(analysisId) });

            // Invalidate lists to reflect deletion
            queryClient.invalidateQueries({ queryKey: analysisKeys.lists() });
            queryClient.invalidateQueries({ queryKey: analysisKeys.latest() });
        },
    });
};

/**
 * Hook for complete analysis upload and polling workflow
 * Uploads image and automatically polls until completion
 */
export const useAnalysisWorkflow = () => {
    const queryClient = useQueryClient();
    const uploadMutation = useAnalysisUpload();

    return useMutation({
        mutationFn: async ({
            imageUri,
            onProgress,
            onStatusUpdate
        }: {
            imageUri: string;
            onProgress?: (progress: number) => void;
            onStatusUpdate?: (status: string, progress?: number) => void;
        }) => {
            console.log('🚀 Starting complete analysis workflow for imageUri:', imageUri);
            console.log('📋 Workflow callbacks provided:', {
                hasOnProgress: !!onProgress,
                hasOnStatusUpdate: !!onStatusUpdate
            });

            try {
                // Step 1: Compress image (show as part of upload process)
                console.log('🔵 Step 1: Compressing image for optimal upload');
                onStatusUpdate?.('compressing', 0);
                onProgress?.(5); // Show 5% progress for compression start

                // Step 2: Upload image
                console.log('🔵 Step 2: Starting image upload for URI:', imageUri);
                onStatusUpdate?.('uploading', 10);

                console.log('📤 About to call analysisApi.uploadImage...');
                const uploadResult = await analysisApi.uploadImage(imageUri, (progress) => {
                    console.log(`📤 Upload progress callback: ${progress.toFixed(1)}%`);
                    // Map upload progress to 10-80% of total progress
                    const adjustedProgress = 10 + (progress * 0.7);
                    onProgress?.(adjustedProgress);
                });

                console.log('✅ Upload completed successfully:', {
                    analysisId: uploadResult.analysis_id,
                    status: uploadResult.status,
                    taskId: uploadResult.task_id,
                    message: uploadResult.message
                });

                // Step 3: Poll until completion
                console.log('🔵 Step 3: Starting analysis polling for ID:', uploadResult.analysis_id);
                onStatusUpdate?.('processing', 80);
                onProgress?.(80);

                console.log('🔄 About to call analysisApi.pollAnalysisUntilComplete...');
                const completedAnalysis = await analysisApi.pollAnalysisUntilComplete(
                    uploadResult.analysis_id,
                    60, // 5 minutes max
                    3000 // 3 second intervals
                );

                console.log('✅ Analysis workflow completed successfully:', {
                    id: completedAnalysis.id,
                    status: completedAnalysis.status,
                    hasSkinMetrics: !!completedAnalysis.skin_metrics,
                    processingDuration: completedAnalysis.processing_duration,
                    isValidData: completedAnalysis.skin_metrics?.confidence_score !== undefined ?
                        completedAnalysis.skin_metrics.confidence_score > 0.3 : 'unknown'
                });

                onStatusUpdate?.('completed', 100);
                console.log('🎯 About to return completed analysis from mutationFn');
                return completedAnalysis;
            } catch (error: any) {
                console.error('❌ Analysis workflow failed with comprehensive error details:', {
                    errorMessage: error.message,
                    errorStatus: error.status,
                    errorCode: error.code,
                    isNetworkError: error.isNetworkError,
                    isRetryable: error.isRetryable,
                    errorDetails: error.details,
                    stackTrace: error.stack,
                    isBackendAIFailure: error.message?.includes('fallback') ||
                        error.message?.includes('invalid data') ||
                        error.message?.includes('Gemini')
                });

                // Provide specific error context for backend AI failures
                if (error.message?.includes('fallback') ||
                    error.message?.includes('invalid data') ||
                    error.message?.includes('Gemini')) {

                    console.error('🚨 CRITICAL: Backend AI processing failure detected!');
                    console.error('This indicates your Gemini API integration in analysis.py is broken.');

                    // Enhance error message for better user understanding
                    const enhancedError = new Error(
                        'Backend AI processing failed. The Gemini API integration is not working properly. ' +
                        'Your analysis.py file needs to be fixed to return valid skin analysis data instead of fallback responses.'
                    );
                    enhancedError.name = 'BackendAIFailure';
                    throw enhancedError;
                }

                onStatusUpdate?.('failed', 0);
                throw error;
            }
        },

        onSuccess: (data) => {
            console.log('🎉 Analysis workflow mutation succeeded, updating query cache');
            console.log('📊 Mutation success data:', {
                id: data?.id,
                status: data?.status,
                hasSkinMetrics: !!data?.skin_metrics,
                dataKeys: Object.keys(data || {})
            });

            // Invalidate and update relevant queries
            queryClient.invalidateQueries({ queryKey: analysisKeys.lists() });
            queryClient.invalidateQueries({ queryKey: analysisKeys.latest() });

            // Update the specific analysis in cache
            queryClient.setQueryData(analysisKeys.detail(data.id), data);

            console.log('✅ Query cache updated successfully - mutation onSuccess complete');
        },

        onError: (error: any) => {
            console.error('❌ Analysis workflow mutation error with details:', {
                error: error.message,
                status: error.status,
                isNetworkError: error.isNetworkError,
                errorType: error.name,
                stack: error.stack
            });
            console.error('🚨 Mutation onError complete - error should be handled by calling code');
        },
    });
};

/**
 * Hook for prefetching analysis data
 */
export const usePrefetchAnalysis = () => {
    const queryClient = useQueryClient();

    return {
        prefetchAnalysis: (analysisId: string) => {
            queryClient.prefetchQuery({
                queryKey: analysisKeys.detail(analysisId),
                queryFn: () => analysisApi.getAnalysis(analysisId),
                staleTime: 5 * 60 * 1000,
            });
        },
        prefetchLatestAnalysis: () => {
            queryClient.prefetchQuery({
                queryKey: analysisKeys.latest(),
                queryFn: () => analysisApi.getLatestAnalysis(),
                staleTime: 2 * 60 * 1000,
            });
        },
    };
};

/**
 * Hook for optimistic analysis updates
 */
export const useOptimisticAnalysis = () => {
    const queryClient = useQueryClient();

    return {
        setOptimisticAnalysis: (analysisId: string, updates: Partial<Analysis>) => {
            queryClient.setQueryData(
                analysisKeys.detail(analysisId),
                (oldData: Analysis | undefined) =>
                    oldData ? { ...oldData, ...updates } : undefined
            );
        },

        setOptimisticStatus: (analysisId: string, status: Analysis['status']) => {
            queryClient.setQueryData(
                analysisKeys.detail(analysisId),
                (oldData: Analysis | undefined) =>
                    oldData ? { ...oldData, status } : undefined
            );
        },
    };
}; 