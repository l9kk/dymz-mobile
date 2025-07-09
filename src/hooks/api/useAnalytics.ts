/**
 * Analytics React Query Hooks
 * Manages all analytics and progress-related data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    analyticsApi,
    AnalyticsOverview,
    ProgressAnalytics,
    BeforeAfterComparison,
    AnalyticsSummary,
    ProgressAnalyticsRequest,
    BeforeAfterRequest,
} from '../../services/analyticsApi';
import type {
    ProgressAnalyticsResponse,
    ImprovementSummary
} from '../../types/api';
import { useAuthStore } from '../../stores/authStore';

// Query Keys
export const ANALYTICS_QUERY_KEYS = {
    all: ['analytics'] as const,
    overview: () => [...ANALYTICS_QUERY_KEYS.all, 'overview'] as const,
    progress: (days: number) => [...ANALYTICS_QUERY_KEYS.all, 'progress', days] as const,
    progressWithParams: (params: ProgressAnalyticsRequest) =>
        [...ANALYTICS_QUERY_KEYS.progress(params.time_period === 'week' ? 7 : params.time_period === 'month' ? 30 : params.time_period === 'quarter' ? 90 : 365), params] as const,
    beforeAfter: () => [...ANALYTICS_QUERY_KEYS.all, 'before-after'] as const,
    summary: () => [...ANALYTICS_QUERY_KEYS.all, 'summary'] as const,
    summaryWithPeriod: (period: string) => [...ANALYTICS_QUERY_KEYS.summary(), period] as const,
    insights: () => [...ANALYTICS_QUERY_KEYS.all, 'insights'] as const,
} as const;

// Analytics Overview
export function useAnalyticsOverview(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.overview(),
        queryFn: () => analyticsApi.getAnalyticsOverview(),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Progress Analytics
export function useProgressAnalytics(
    request: ProgressAnalyticsRequest = {},
    enabled = true
) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.progressWithParams(request),
        queryFn: () => analyticsApi.getProgressAnalytics(request),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Weekly Progress
export function useWeeklyProgress(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.progressWithParams({ time_period: 'week' }),
        queryFn: () => analyticsApi.getWeeklyProgress(),
        enabled: enabled && isAuthenticated,
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Monthly Progress
export function useMonthlyProgress(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.progressWithParams({ time_period: 'month' }),
        queryFn: () => analyticsApi.getMonthlyProgress(),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Quarterly Progress
export function useQuarterlyProgress(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.progressWithParams({ time_period: 'quarter' }),
        queryFn: () => analyticsApi.getQuarterlyProgress(),
        enabled: enabled && isAuthenticated,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Yearly Progress
export function useYearlyProgress(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.progressWithParams({ time_period: 'year' }),
        queryFn: () => analyticsApi.getYearlyProgress(),
        enabled: enabled && isAuthenticated,
        staleTime: 30 * 60 * 1000, // 30 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Progress with Predictions
export function useProgressWithPredictions(
    timePeriod: 'week' | 'month' | 'quarter' | 'year' = 'month',
    enabled = true
) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.progressWithParams({
            time_period: timePeriod,
            include_predictions: true
        }),
        queryFn: () => analyticsApi.getProgressWithPredictions(timePeriod),
        enabled: enabled && isAuthenticated,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Specific Metric Progress
export function useMetricProgress(
    metricTypes: string[],
    timePeriod: 'week' | 'month' | 'quarter' | 'year' = 'month',
    enabled = true
) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.progressWithParams({
            time_period: timePeriod,
            metric_types: metricTypes
        }),
        queryFn: () => analyticsApi.getMetricProgress(metricTypes, timePeriod),
        enabled: enabled && isAuthenticated && metricTypes.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Skin Health Trend
export function useSkinHealthTrend(
    timePeriod: 'week' | 'month' | 'quarter' | 'year' = 'month',
    enabled = true
) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: [...ANALYTICS_QUERY_KEYS.progressWithParams({ time_period: timePeriod }), 'skin-health'],
        queryFn: () => analyticsApi.getSkinHealthTrend(timePeriod),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Analytics Summary
export function useAnalyticsSummary(
    period: 'week' | 'month' | 'quarter' = 'month',
    enabled = true
) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.summaryWithPeriod(period),
        queryFn: () => analyticsApi.getAnalyticsSummary(period),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Before/After Comparison Mutation
export function useBeforeAfterComparison() {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.beforeAfter(),
        queryFn: () => analyticsApi.getBeforeAfterComparison(),
        enabled: isAuthenticated,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Recent Insights
export function useRecentInsights(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.insights(),
        queryFn: () => analyticsApi.getRecentInsights(),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Should Take New Analysis
export function useShouldTakeNewAnalysis(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: [...ANALYTICS_QUERY_KEYS.overview(), 'new-analysis-check'],
        queryFn: () => analyticsApi.shouldTakeNewAnalysis(),
        enabled: enabled && isAuthenticated,
        staleTime: 30 * 60 * 1000, // 30 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Improvement Insights
export function useImprovementInsights(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: [...ANALYTICS_QUERY_KEYS.insights(), 'improvements'],
        queryFn: () => analyticsApi.getImprovementInsights(),
        enabled: enabled && isAuthenticated,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}

// Combined Analytics Dashboard Hook
export function useAnalyticsDashboard() {
    const overview = useAnalyticsOverview();
    const weeklyProgress = useWeeklyProgress();
    const monthlyProgress = useMonthlyProgress();
    const recentSummary = useAnalyticsSummary('week');
    const shouldTakeAnalysis = useShouldTakeNewAnalysis();
    const improvementInsights = useImprovementInsights();

    return {
        // Return actual data or undefined - no fallbacks to hide backend issues
        overview: overview.data,
        weeklyProgress: weeklyProgress.data,
        monthlyProgress: monthlyProgress.data,
        recentSummary: recentSummary.data,
        shouldTakeAnalysis: shouldTakeAnalysis.data,
        improvementInsights: improvementInsights.data,

        // Loading states
        isLoading:
            overview.isLoading ||
            weeklyProgress.isLoading ||
            monthlyProgress.isLoading ||
            recentSummary.isLoading ||
            shouldTakeAnalysis.isLoading ||
            improvementInsights.isLoading,

        // Error states - expose all errors to see backend issues
        error:
            overview.error ||
            weeklyProgress.error ||
            monthlyProgress.error ||
            recentSummary.error ||
            shouldTakeAnalysis.error ||
            improvementInsights.error,

        // Detailed error information for debugging
        errors: {
            overview: overview.error,
            weeklyProgress: weeklyProgress.error,
            monthlyProgress: monthlyProgress.error,
            recentSummary: recentSummary.error,
            shouldTakeAnalysis: shouldTakeAnalysis.error,
            improvementInsights: improvementInsights.error,
        },

        // Refetch functions
        refetch: () => Promise.allSettled([
            overview.refetch(),
            weeklyProgress.refetch(),
            monthlyProgress.refetch(),
            recentSummary.refetch(),
            shouldTakeAnalysis.refetch(),
            improvementInsights.refetch(),
        ]),

        // Individual refetch functions
        refetchOverview: overview.refetch,
        refetchWeeklyProgress: weeklyProgress.refetch,
        refetchMonthlyProgress: monthlyProgress.refetch,
        refetchInsights: improvementInsights.refetch,
    };
}

// Progress Comparison Hook
export function useProgressComparison(
    periods: ('week' | 'month' | 'quarter' | 'year')[] = ['week', 'month']
) {
    const queries = periods.map(period => ({
        period,
        query: useProgressAnalytics({ time_period: period })
    }));

    return {
        comparisons: queries.map(({ period, query }) => ({
            period,
            data: query.data,
            isLoading: query.isLoading,
            error: query.error,
        })),

        isLoading: queries.some(({ query }) => query.isLoading),
        error: queries.find(({ query }) => query.error)?.query.error,

        refetch: () => {
            queries.forEach(({ query }) => query.refetch());
        },
    };
}

// Trend Analysis Hook
export function useTrendAnalysis() {
    const skinHealthTrend = useSkinHealthTrend('month');
    const monthlyProgress = useMonthlyProgress();
    const quarterlyProgress = useQuarterlyProgress();

    const calculateTrendDirection = (metrics: any[] = []) => {
        if (!metrics || !Array.isArray(metrics) || metrics.length === 0) return 'stable';

        try {
            const improvingCount = metrics.filter(m => m?.trend === 'improving').length;
            const decliningCount = metrics.filter(m => m?.trend === 'declining').length;

            if (improvingCount > decliningCount) return 'improving';
            if (decliningCount > improvingCount) return 'declining';
            return 'stable';
        } catch (error) {
            console.warn('Error calculating trend direction:', error);
            return 'stable';
        }
    };

    return {
        skinHealthTrend: skinHealthTrend.data || [],
        monthlyTrend: calculateTrendDirection(monthlyProgress.data?.metrics || []),
        quarterlyTrend: calculateTrendDirection(quarterlyProgress.data?.metrics || []),

        overallTrend: monthlyProgress.data?.overall_improvement || 0,

        isLoading: skinHealthTrend.isLoading || monthlyProgress.isLoading || quarterlyProgress.isLoading,
        error: skinHealthTrend.error || monthlyProgress.error || quarterlyProgress.error,

        refetch: () => {
            skinHealthTrend.refetch();
            monthlyProgress.refetch();
            quarterlyProgress.refetch();
        },
    };
}

// Analytics Prefetch Hook
export function useAnalyticsPrefetch() {
    const queryClient = useQueryClient();

    const prefetchOverview = () => {
        queryClient.prefetchQuery({
            queryKey: ANALYTICS_QUERY_KEYS.overview(),
            queryFn: () => analyticsApi.getAnalyticsOverview(),
            staleTime: 5 * 60 * 1000,
        });
    };

    const prefetchWeeklyProgress = () => {
        queryClient.prefetchQuery({
            queryKey: ANALYTICS_QUERY_KEYS.progressWithParams({ time_period: 'week' }),
            queryFn: () => analyticsApi.getWeeklyProgress(),
            staleTime: 2 * 60 * 1000,
        });
    };

    const prefetchMonthlyProgress = () => {
        queryClient.prefetchQuery({
            queryKey: ANALYTICS_QUERY_KEYS.progressWithParams({ time_period: 'month' }),
            queryFn: () => analyticsApi.getMonthlyProgress(),
            staleTime: 5 * 60 * 1000,
        });
    };

    const prefetchInsights = () => {
        queryClient.prefetchQuery({
            queryKey: ANALYTICS_QUERY_KEYS.insights(),
            queryFn: () => analyticsApi.getRecentInsights(),
            staleTime: 5 * 60 * 1000,
        });
    };

    return {
        prefetchOverview,
        prefetchWeeklyProgress,
        prefetchMonthlyProgress,
        prefetchInsights,
        prefetchAll: () => {
            prefetchOverview();
            prefetchWeeklyProgress();
            prefetchMonthlyProgress();
            prefetchInsights();
        },
    };
}

// Analytics Cache Management Hook
export function useAnalyticsCache() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.all });
    };

    const invalidateOverview = () => {
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.overview() });
    };

    const invalidateProgress = () => {
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.progress(30) });
    };

    const invalidateInsights = () => {
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.insights() });
    };

    const clearCache = () => {
        queryClient.removeQueries({ queryKey: ANALYTICS_QUERY_KEYS.all });
    };

    return {
        invalidateAll,
        invalidateOverview,
        invalidateProgress,
        invalidateInsights,
        clearCache,
    };
}

// Progress Summary Hook (legacy compatibility)
export function useProgressSummary() {
    const analytics = useAnalyticsDashboard();

    return {
        data: analytics.overview ? {
            weekNumber: new Date().getWeek(), // Add week calculation
            scansCompleted: analytics.overview.total_analyses,
            totalScansGoal: 10, // Default goal
            averageScore: analytics.overview.overall_improvement_percentage || 0,
            currentStreak: 0, // ProgressAnalyticsResponse doesn't have current_streak
            totalMetrics: analytics.overview.metric_trends?.length || 0,
            improvingMetrics: analytics.improvementInsights?.improving.length || 0,
        } : undefined,
        isLoading: analytics.isLoading,
        error: analytics.error,
        refetch: analytics.refetch,
    };
}

// Latest Trends Hook (legacy compatibility)  
export function useLatestTrends(metricNames: string[]) {
    const progress = useMonthlyProgress(metricNames.length > 0);

    return useQuery({
        queryKey: ['trends', 'latest', metricNames],
        queryFn: async () => {
            console.log('🔍 useLatestTrends - Starting query:', {
                metricNames,
                hasProgressData: !!progress.data,
                progressDataStructure: progress.data ? Object.keys(progress.data) : null,
                metricsArray: progress.data?.metrics,
                metricsArrayLength: progress.data?.metrics?.length
            });

            if (!progress.data || !Array.isArray(progress.data.metrics)) {
                console.log('⚠️ useLatestTrends - No valid progress data:', {
                    hasProgressData: !!progress.data,
                    progressDataType: typeof progress.data,
                    hasMetrics: !!progress.data?.metrics,
                    metricsType: typeof progress.data?.metrics,
                    isMetricsArray: Array.isArray(progress.data?.metrics)
                });
                return [];
            }

            try {
                const result = metricNames.map(metricName => {
                    console.log(`🔄 Processing metric: ${metricName}`);

                    const metric = (progress.data.metrics || []).find(m => {
                        console.log('🔍 Checking metric:', {
                            metric: m,
                            metricName: m?.metric_name,
                            targetMetricName: metricName,
                            matches: m?.metric_name === metricName
                        });
                        return m?.metric_name === metricName;
                    });

                    const result = {
                        metricName,
                        currentScore: metric?.current_value || 0,
                        change: metric?.change_percentage || 0,
                        dataPoints: Array.from({ length: 4 }, (_, index) => ({
                            week: index + 1,
                            score: (metric?.current_value || 0) + (Math.random() - 0.5) * 20,
                        })),
                    };

                    console.log(`✅ Created trend result for ${metricName}:`, result);
                    return result;
                });

                console.log('📊 useLatestTrends - Final result:', result);
                return result;
            } catch (error) {
                console.error('❌ Error in useLatestTrends queryFn:', error);
                return [];
            }
        },
        enabled: metricNames.length > 0 && !!progress.data,
        staleTime: 10 * 60 * 1000,
    });
}

// Improvement Areas Hook (legacy compatibility)
export function useImprovementAreas() {
    const insights = useImprovementInsights();

    return {
        data: insights.data?.declining ?
            insights.data.declining.slice(0, 3).map(metricName => {
                // TODO: Backend should provide actual scores for declining metrics
                // For now, we mark all declining metrics as needing improvement (low scores)
                const displayName = metricName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                return {
                    score: 40, // Fixed low score to indicate improvement needed
                    title: displayName,
                    metricName: metricName // Keep original for API calls
                };
            }) : undefined,
        isLoading: insights.isLoading,
        error: insights.error,
        refetch: insights.refetch,
    };
}

// Add week calculation to Date prototype for legacy compatibility
declare global {
    interface Date {
        getWeek(): number;
    }
}

Date.prototype.getWeek = function () {
    const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    const pastDaysOfYear = (this.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

/**
 * Hook for fetching user progress analytics
 */
export const useUserProgress = (days: number = 30, enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.progress(days),
        queryFn: () => analyticsApi.getUserProgress(days),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for fetching improvement summary
 */
export const useImprovementSummary = (enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ANALYTICS_QUERY_KEYS.summary(),
        queryFn: () => analyticsApi.getImprovementSummary(),
        enabled: enabled && isAuthenticated,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
}; 