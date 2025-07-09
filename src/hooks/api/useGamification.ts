/**
 * React Query hooks for Gamification API
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    gamificationApi,
    StreakResponse,
    GamificationStats,
} from '../../services/gamificationApi';
import { useAuthStore } from '../../stores/authStore';

// Query Keys
export const GAMIFICATION_QUERY_KEYS = {
    all: ['gamification'] as const,
    streaks: () => [...GAMIFICATION_QUERY_KEYS.all, 'streaks'] as const,
    stats: () => [...GAMIFICATION_QUERY_KEYS.all, 'stats'] as const,
} as const;

// User Streaks
export function useUserStreaks(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: GAMIFICATION_QUERY_KEYS.streaks(),
        queryFn: async () => {
            try {
                return await gamificationApi.getUserStreaks();
            } catch (error: any) {
                console.log('🔴 User Streaks Error:', {
                    message: error?.message,
                    status: error?.status,
                    url: error?.config?.url
                });

                // Return null data on error to let UI handle it
                throw error;
            }
        },
        enabled: enabled && isAuthenticated,
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        retry: (failureCount, error: any) => {
            // Don't retry client errors
            if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Gamification Stats
export function useGamificationStats(enabled = true) {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: GAMIFICATION_QUERY_KEYS.stats(),
        queryFn: async () => {
            try {
                return await gamificationApi.getGamificationStats();
            } catch (error: any) {
                console.log('🔴 Gamification Stats Error:', {
                    message: error?.message,
                    status: error?.status,
                    url: error?.config?.url
                });

                // Log specific error types for debugging
                if (error?.status === 403) {
                    console.log('🔐 Gamification: Authentication error');
                } else if (error?.status === 422) {
                    console.log('🚨 Gamification: Backend validation error');
                } else if (error?.message?.includes('Network')) {
                    console.log('🌐 Gamification: Network error');
                }

                // Return null data on error to let UI handle it
                throw error;
            }
        },
        enabled: enabled && isAuthenticated,
        staleTime: 2 * 60 * 1000,
        retry: (failureCount, error: any) => {
            // Don't retry client errors
            if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Combined Gamification Dashboard Hook
export function useGamificationDashboard() {
    const streaks = useUserStreaks();
    const stats = useGamificationStats();

    return {
        // Return actual data or undefined - no fallbacks to hide backend issues
        streaks: streaks.data,
        stats: stats.data,

        // Loading states
        isLoading: streaks.isLoading || stats.isLoading,

        // Error states - expose all errors to see backend issues
        error: streaks.error || stats.error,

        // Refetch functions
        refetch: () => Promise.all([streaks.refetch(), stats.refetch()]),
        refetchStreaks: streaks.refetch,
        refetchStats: stats.refetch,
    };
}

// Streak Progress Helper Hook
export function useStreakProgress() {
    const { data: streaks } = useUserStreaks();

    const getCurrentStreak = () => streaks?.current_streak || 0;
    const getLongestStreak = () => streaks?.longest_streak || 0;
    // Note: streak_level removed from backend API
    const getNextMilestone = () => streaks?.next_milestone || 7;
    const isStreakActive = () => streaks?.completed_both_today || false;

    const getStreakMotivation = () => {
        const currentStreak = getCurrentStreak();
        const nextMilestone = getNextMilestone();

        if (currentStreak === 0) {
            return "Start your skincare journey today! 🌟";
        }

        if (currentStreak < 7) {
            return `${currentStreak} day streak! Keep going! 💪`;
        }

        if (currentStreak < 30) {
            return `Amazing ${currentStreak}-day streak! You're building great habits! 🔥`;
        }

        return `Incredible ${currentStreak}-day streak! You're a skincare superstar! ⭐`;
    };

    const getProgressToNextMilestone = () => {
        const currentStreak = getCurrentStreak();
        const nextMilestone = getNextMilestone();

        if (currentStreak >= nextMilestone) {
            return { progress: 100, daysToGo: 0 };
        }

        const progress = (currentStreak / nextMilestone) * 100;
        const daysToGo = nextMilestone - currentStreak;

        return { progress: Math.round(progress), daysToGo };
    };

    return {
        getCurrentStreak,
        getLongestStreak,
        getNextMilestone,
        isStreakActive,
        getStreakMotivation,
        getProgressToNextMilestone,
    };
}

// Gamification Cache Management
export function useGamificationCache() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: GAMIFICATION_QUERY_KEYS.all });
    };

    const invalidateStreaks = () => {
        queryClient.invalidateQueries({ queryKey: GAMIFICATION_QUERY_KEYS.streaks() });
    };

    const invalidateStats = () => {
        queryClient.invalidateQueries({ queryKey: GAMIFICATION_QUERY_KEYS.stats() });
    };

    const clearCache = () => {
        queryClient.removeQueries({ queryKey: GAMIFICATION_QUERY_KEYS.all });
    };

    return {
        invalidateAll,
        invalidateStreaks,
        invalidateStats,
        clearCache,
    };
}

// Gamification Prefetching
export function useGamificationPrefetch() {
    const queryClient = useQueryClient();

    const prefetchStats = () => {
        queryClient.prefetchQuery({
            queryKey: GAMIFICATION_QUERY_KEYS.stats(),
            queryFn: () => gamificationApi.getGamificationStats(),
            staleTime: 2 * 60 * 1000,
        });
    };

    const prefetchStreaks = () => {
        queryClient.prefetchQuery({
            queryKey: GAMIFICATION_QUERY_KEYS.streaks(),
            queryFn: () => gamificationApi.getUserStreaks(),
            staleTime: 2 * 60 * 1000,
        });
    };

    const prefetchAll = () => {
        prefetchStats();
        prefetchStreaks();
    };

    return {
        prefetchStats,
        prefetchStreaks,
        prefetchAll,
    };
}

// Motivation Insights based on streaks only
export function useMotivationInsights() {
    const { data: streaks } = useUserStreaks();
    const { data: stats } = useGamificationStats();

    const getMotivationMessage = () => {
        if (!streaks) {
            return "Connect with your skincare routine to start tracking progress! 🌟";
        }

        const currentStreak = streaks.current_streak;

        if (currentStreak === 0) {
            return "Ready to start your skincare journey? Today's the perfect day! ✨";
        }

        if (currentStreak === 1) {
            return "Great start! One day down, let's keep the momentum going! 🚀";
        }

        if (currentStreak < 7) {
            return `${currentStreak} days strong! You're building something amazing! 💪`;
        }

        if (currentStreak < 30) {
            return `${currentStreak} days of consistency! Your skin is thanking you! 🌟`;
        }

        return `${currentStreak} days of excellence! You're truly dedicated to your skin health! 👑`;
    };

    const getNextGoal = () => {
        if (!streaks) return null;

        const currentStreak = streaks.current_streak;
        const nextMilestone = streaks.next_milestone;

        return {
            type: 'streak',
            current: currentStreak,
            target: nextMilestone,
            daysToGo: nextMilestone - currentStreak,
            message: `${nextMilestone - currentStreak} more days to reach your ${nextMilestone}-day milestone!`
        };
    };

    const getOverallProgress = () => {
        if (!stats) return null;

        return {
            totalAnalyses: stats.total_analyses,
            routinesCompleted: stats.routines_completed,
            daysActive: stats.days_active,
            improvementScore: stats.improvement_score,
            rankPercentile: stats.rank_percentile
        };
    };

    return {
        getMotivationMessage,
        getNextGoal,
        getOverallProgress,
    };
} 