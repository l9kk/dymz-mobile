/**
 * React Query Client Configuration
 * Centralized configuration for data fetching, caching, and synchronization
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { Config } from '../config/env';

// Default query and mutation options
const defaultOptions: DefaultOptions = {
    queries: {
        // Cache for 5 minutes by default
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)

        // Retry configuration
        retry: (failureCount, error: any) => {
            // Don't retry for 4xx errors (client errors)
            if (error?.status >= 400 && error?.status < 500) {
                return false;
            }

            // Retry up to 3 times for other errors
            return failureCount < 3;
        },

        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus only in production
        refetchOnWindowFocus: !Config.APP.DEBUG,

        // Don't refetch on reconnect to avoid excessive requests
        refetchOnReconnect: false,

        // Refetch on mount if data is stale
        refetchOnMount: true,
    },

    mutations: {
        // Retry mutations once on failure
        retry: 1,

        // Retry delay for mutations
        retryDelay: 1000,
    },
};

// Create query client with default options
export const queryClient = new QueryClient({
    defaultOptions,

    // Remove logger config - not available in this React Query version
});

// Query keys factory for consistent cache management
export const queryKeys = {
    // Authentication
    auth: {
        all: ['auth'] as const,
        session: () => [...queryKeys.auth.all, 'session'] as const,
        profile: () => [...queryKeys.auth.all, 'profile'] as const,
    },

    // User management
    user: {
        all: ['user'] as const,
        profile: (userId?: string) => [...queryKeys.user.all, 'profile', userId] as const,
        onboarding: () => [...queryKeys.user.all, 'onboarding'] as const,
    },

    // Analysis
    analysis: {
        all: ['analysis'] as const,
        list: (filters?: any) => [...queryKeys.analysis.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.analysis.all, 'detail', id] as const,
        latest: () => [...queryKeys.analysis.all, 'latest'] as const,
        status: (id: string) => [...queryKeys.analysis.all, 'status', id] as const,
    },

    // Products
    products: {
        all: ['products'] as const,
        list: (filters?: any) => [...queryKeys.products.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
        recommendations: (analysisId?: string) =>
            [...queryKeys.products.all, 'recommendations', analysisId] as const,
        search: (query?: string) => [...queryKeys.products.all, 'search', query] as const,
    },

    // Routines
    routines: {
        all: ['routines'] as const,
        list: (filters?: any) => [...queryKeys.routines.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.routines.all, 'detail', id] as const,
        recommendations: (analysisId?: string) =>
            [...queryKeys.routines.all, 'recommendations', analysisId] as const,
    },

    // Analytics
    analytics: {
        all: ['analytics'] as const,
        progress: (timeframe?: string) =>
            [...queryKeys.analytics.all, 'progress', timeframe] as const,
        insights: (period?: string) =>
            [...queryKeys.analytics.all, 'insights', period] as const,
    },

    // Gamification
    gamification: {
        all: ['gamification'] as const,
        stats: () => [...queryKeys.gamification.all, 'stats'] as const,
        achievements: () => [...queryKeys.gamification.all, 'achievements'] as const,
        leaderboard: () => [...queryKeys.gamification.all, 'leaderboard'] as const,
    },

    // Health check
    health: ['health'] as const,
} as const;

// Cache management utilities
export const cacheUtils = {
    // Invalidate all queries for a specific domain
    invalidateAnalysis: () => {
        return queryClient.invalidateQueries({ queryKey: queryKeys.analysis.all });
    },

    invalidateProducts: () => {
        return queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },

    invalidateRoutines: () => {
        return queryClient.invalidateQueries({ queryKey: queryKeys.routines.all });
    },

    invalidateUser: () => {
        return queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },

    invalidateAnalytics: () => {
        return queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },

    // Clear all cache
    clearAll: () => {
        return queryClient.clear();
    },

    // Remove specific queries
    removeAnalysis: (id: string) => {
        return queryClient.removeQueries({ queryKey: queryKeys.analysis.detail(id) });
    },

    // Prefetch commonly needed data
    prefetchUserProfile: (userId?: string) => {
        return queryClient.prefetchQuery({
            queryKey: queryKeys.user.profile(userId),
            // queryFn will be added when we implement the hooks
        });
    },

    // Update cached data optimistically
    updateAnalysisCache: (id: string, updater: (old: any) => any) => {
        return queryClient.setQueryData(queryKeys.analysis.detail(id), updater);
    },

    updateUserProfileCache: (userId: string, updater: (old: any) => any) => {
        return queryClient.setQueryData(queryKeys.user.profile(userId), updater);
    },
};

// Background sync utilities for when app comes back online
export const syncUtils = {
    // Refetch critical data when coming back online
    refetchCriticalData: async () => {
        const queries = [
            queryClient.refetchQueries({ queryKey: queryKeys.auth.session() }),
            queryClient.refetchQueries({ queryKey: queryKeys.analysis.latest() }),
            queryClient.refetchQueries({ queryKey: queryKeys.user.profile() }),
        ];

        await Promise.allSettled(queries);
    },

    // Refetch all stale queries
    refetchStaleQueries: () => {
        return queryClient.refetchQueries({ stale: true });
    },
};

export default queryClient; 