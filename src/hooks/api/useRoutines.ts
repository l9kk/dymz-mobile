/**
 * Routines React Query Hooks
 * Manages all routine-related data fetching and mutations
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    routinesApi,
    Routine,
    RoutineListResponse,
    RoutineCreateRequest,
    RoutineUpdateRequest,
    RoutineRecommendationRequest,
    RoutineRecommendationResponse,
    RoutineStatsResponse,
    RoutineProgress,
    ProgressCreateRequest
} from '../../services/routinesApi';
import { useAuthStore } from '../../stores/authStore';

// Query keys for React Query
export const routineKeys = {
    all: ['routines'] as const,
    lists: () => [...routineKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...routineKeys.lists(), filters] as const,
    details: () => [...routineKeys.all, 'detail'] as const,
    detail: (id: string) => [...routineKeys.details(), id] as const,
    active: () => [...routineKeys.all, 'active'] as const,
    stats: () => [...routineKeys.all, 'stats'] as const,
    recommendations: (analysisId: string) => [...routineKeys.all, 'recommendations', analysisId] as const,
    progress: (routineId: string) => [...routineKeys.all, 'progress', routineId] as const,
};

/**
 * Main hook for listing routines with enhanced error handling
 */
export const useRoutines = (
    routineType?: 'morning' | 'evening',
    isActive?: boolean,
    page = 1,
    limit = 20,
    enabled = true
) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: routineKeys.list({ routineType, isActive, page, limit }),
        queryFn: async () => {
            try {
                return await routinesApi.listRoutines(routineType, isActive, page, limit);
            } catch (error: any) {
                console.log('🔴 Routines List Error:', {
                    message: error?.message,
                    status: error?.status,
                    url: error?.config?.url,
                    params: { routineType, isActive, page, limit }
                });

                // Handle specific backend errors gracefully
                if (error?.status === 403) {
                    console.log('🔐 Authentication error - user may need to re-login');
                } else if (error?.status === 422) {
                    console.log('🚨 Backend validation error');
                } else if (error?.message?.includes('Network')) {
                    console.log('🌐 Network error - backend may be offline');
                }

                // Return empty routines structure (no mock data)
                return {
                    routines: [],
                    total: 0,
                    page: page,
                    per_page: limit,
                    has_next: false
                };
            }
        },
        enabled: enabled && isAuthenticated,
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: (failureCount, error: any) => {
            // Don't retry authentication or client errors
            if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
                console.log(`🚫 Not retrying error ${error.status} - client/auth issue`);
                return false;
            }
            // Retry up to 2 times for server errors
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

/**
 * Hook for fetching active routines with enhanced error handling
 */
export const useActiveRoutines = (enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: routineKeys.active(),
        queryFn: async () => {
            try {
                return await routinesApi.getActiveRoutines();
            } catch (error: any) {
                console.log('🔴 Active Routines Error:', {
                    message: error?.message,
                    status: error?.status,
                    url: error?.config?.url
                });

                // Handle specific backend errors gracefully
                if (error?.status === 403) {
                    console.log('🔐 Authentication error - user may need to re-login');
                } else if (error?.status === 422) {
                    console.log('🚨 Backend validation error');
                } else if (error?.message?.includes('Network')) {
                    console.log('🌐 Network error - backend may be offline');
                }

                // Return empty routines structure (no mock data)
                return {
                    routines: [],
                    total: 0,
                    page: 1,
                    per_page: 20,
                    has_next: false
                };
            }
        },
        enabled: enabled && isAuthenticated,
        staleTime: 1 * 60 * 1000, // 1 minute - active routines change frequently
        retry: (failureCount, error: any) => {
            // Don't retry authentication or client errors
            if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
                console.log(`🚫 Not retrying error ${error.status} - client/auth issue`);
                return false;
            }
            // Retry up to 2 times for server errors
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

/**
 * Hook for getting a single routine by ID
 */
export const useRoutine = (routineId: string, enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: routineKeys.detail(routineId),
        queryFn: () => routinesApi.getRoutine(routineId),
        enabled: enabled && isAuthenticated && !!routineId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for getting morning routines
 */
export const useMorningRoutines = (isActive = true, enabled = true) => {
    return useRoutines('morning', isActive, 1, 20, enabled);
};

/**
 * Hook for getting evening routines
 */
export const useEveningRoutines = (isActive = true, enabled = true) => {
    return useRoutines('evening', isActive, 1, 20, enabled);
};

/**
 * Hook for getting routine recommendations
 */
export const useRoutineRecommendations = (
    request: RoutineRecommendationRequest,
    enabled = true
) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: routineKeys.recommendations(request.analysis_id),
        queryFn: () => routinesApi.getRoutineRecommendations(request),
        enabled: enabled && isAuthenticated && !!request.analysis_id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for fetching routine statistics with enhanced error handling
 */
export const useRoutineStats = (enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: routineKeys.stats(),
        queryFn: async () => {
            try {
                return await routinesApi.getRoutineStats();
            } catch (error: any) {
                console.log('🔴 Routine Stats Error:', {
                    message: error?.message,
                    status: error?.status,
                    url: error?.config?.url
                });

                // For specific backend errors, return empty structure instead of failing
                if (error?.status === 403) {
                    console.log('🔐 Authentication error - user may need to re-login');
                } else if (error?.status === 422) {
                    console.log('🚨 Backend UUID parsing error - this is a backend routing issue');
                } else if (error?.status === 500) {
                    console.log('🔧 Backend server error (database/timezone issue) - using fallback data');
                } else if (error?.message?.includes('Network')) {
                    console.log('🌐 Network error - backend may be offline');
                }

                // Return empty stats structure (no mock data)
                return {
                    total_routines: 0,
                    active_routines: 0,
                    total_completions: 0,
                    current_week_completions: 0,
                    average_completion_rate: 0,
                    favorite_routine_type: null,
                    average_duration_minutes: null,
                    most_skipped_step: null
                };
            }
        },
        enabled: enabled && isAuthenticated,
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: (failureCount, error: any) => {
            // Don't retry authentication errors or client errors
            if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
                console.log(`🚫 Not retrying error ${error.status} - client/auth issue`);
                return false;
            }
            // Retry up to 2 times for server errors
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

/**
 * Hook for creating a new routine
 */
export const useCreateRoutine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (routine: RoutineCreateRequest) => routinesApi.createRoutine(routine),

        onSuccess: (newRoutine) => {
            // Add to cache
            queryClient.setQueryData(routineKeys.detail(newRoutine.id), newRoutine);

            // Invalidate lists to include new routine
            queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
            queryClient.invalidateQueries({ queryKey: routineKeys.active() });
            queryClient.invalidateQueries({ queryKey: routineKeys.stats() });
        },
    });
};

/**
 * Hook for updating a routine
 */
export const useUpdateRoutine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            routineId,
            updates
        }: {
            routineId: string;
            updates: RoutineUpdateRequest;
        }) => routinesApi.updateRoutine(routineId, updates),

        onMutate: async ({ routineId, updates }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: routineKeys.detail(routineId) });

            // Snapshot previous value
            const previousRoutine = queryClient.getQueryData<Routine>(routineKeys.detail(routineId));

            // Optimistically update cache
            if (previousRoutine) {
                queryClient.setQueryData(routineKeys.detail(routineId), {
                    ...previousRoutine,
                    ...updates,
                    updated_at: new Date().toISOString(),
                });
            }

            return { previousRoutine };
        },

        onError: (err, { routineId }, context) => {
            // Rollback on error
            if (context?.previousRoutine) {
                queryClient.setQueryData(routineKeys.detail(routineId), context.previousRoutine);
            }
        },

        onSuccess: (updatedRoutine) => {
            // Update cache
            queryClient.setQueryData(routineKeys.detail(updatedRoutine.id), updatedRoutine);

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
            queryClient.invalidateQueries({ queryKey: routineKeys.active() });
        },
    });
};

/**
 * Hook for deleting a routine
 */
export const useDeleteRoutine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (routineId: string) => routinesApi.deleteRoutine(routineId),

        onSuccess: (_, routineId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: routineKeys.detail(routineId) });

            // Invalidate lists to reflect deletion
            queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
            queryClient.invalidateQueries({ queryKey: routineKeys.active() });
            queryClient.invalidateQueries({ queryKey: routineKeys.stats() });
        },
    });
};

/**
 * Hook for recording routine progress
 */
export const useRecordRoutineProgress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (progress: ProgressCreateRequest) => routinesApi.recordProgress(progress),

        onSuccess: (_, progress) => {
            // Invalidate routine stats and progress to reflect new completion
            queryClient.invalidateQueries({ queryKey: routineKeys.stats() });
            queryClient.invalidateQueries({ queryKey: routineKeys.progress(progress.routine_id) });

            // Update routine data
            const routineKey = routineKeys.detail(progress.routine_id);
            const routine = queryClient.getQueryData<Routine>(routineKey);
            if (routine) {
                queryClient.setQueryData(routineKey, {
                    ...routine,
                    updated_at: new Date().toISOString(),
                });
            }
        },
    });
};

/**
 * Hook for creating a custom routine
 */
export const useCreateCustomRoutine = () => {
    const createRoutine = useCreateRoutine();

    return {
        createCustomRoutine: (
            name: string,
            type: 'morning' | 'evening',
            analysisId: string,
            productIds: string[]
        ) => {
            return createRoutine.mutate({
                name,
                routine_type: type,
                steps: productIds.map((productId, index) => ({
                    step: `Step ${index + 1}`,
                    product_id: productId,
                    duration_seconds: 120,
                    order: index + 1,
                    instructions: 'Apply as directed',
                    optional: false,
                })),
            });
        },
        isLoading: createRoutine.isPending,
        error: createRoutine.error,
        isSuccess: createRoutine.isSuccess,
    };
};

/**
 * Hook for toggling routine active state
 */
export const useToggleRoutineActive = () => {
    const updateRoutine = useUpdateRoutine();

    return {
        toggleActive: (routineId: string, isActive: boolean) => {
            return updateRoutine.mutate({
                routineId,
                updates: { is_active: isActive },
            });
        },
        isLoading: updateRoutine.isPending,
        error: updateRoutine.error,
    };
};

/**
 * Hook for routine management with state
 */
export const useRoutineManager = () => {
    const [selectedRoutineType, setSelectedRoutineType] = useState<'morning' | 'evening'>('morning');
    const [showInactive, setShowInactive] = useState(false);

    const morningRoutines = useMorningRoutines(!showInactive);
    const eveningRoutines = useEveningRoutines(!showInactive);
    const routineStats = useRoutineStats();

    const currentRoutines = selectedRoutineType === 'morning' ? morningRoutines : eveningRoutines;

    return {
        // State
        selectedRoutineType,
        setSelectedRoutineType,
        showInactive,
        setShowInactive,

        // Data
        routines: currentRoutines.data?.routines || [],
        stats: routineStats.data,
        isLoading: currentRoutines.isLoading || routineStats.isLoading,
        error: currentRoutines.error || routineStats.error,

        // Actions
        refetch: () => {
            morningRoutines.refetch();
            eveningRoutines.refetch();
            routineStats.refetch();
        },
    };
};

/**
 * Hook for prefetching routine data
 */
export const usePrefetchRoutines = () => {
    const queryClient = useQueryClient();

    return {
        prefetchActiveRoutines: () => {
            queryClient.prefetchQuery({
                queryKey: routineKeys.active(),
                queryFn: () => routinesApi.getActiveRoutines(),
                staleTime: 1 * 60 * 1000,
            });
        },

        prefetchRoutineStats: () => {
            queryClient.prefetchQuery({
                queryKey: routineKeys.stats(),
                queryFn: () => routinesApi.getRoutineStats(),
                staleTime: 2 * 60 * 1000,
            });
        },

        prefetchMorningRoutines: () => {
            queryClient.prefetchQuery({
                queryKey: routineKeys.list({ routineType: 'morning', isActive: true, page: 1, limit: 20 }),
                queryFn: () => routinesApi.getMorningRoutines(),
                staleTime: 2 * 60 * 1000,
            });
        },

        prefetchEveningRoutines: () => {
            queryClient.prefetchQuery({
                queryKey: routineKeys.list({ routineType: 'evening', isActive: true, page: 1, limit: 20 }),
                queryFn: () => routinesApi.getEveningRoutines(),
                staleTime: 2 * 60 * 1000,
            });
        },
    };
};

// Export the routines API service instance for direct use if needed
export { routinesApi };

/**
 * React Query hooks for Routines API
 */

// Get Routine Progress
export function useRoutineProgress(
    routineId: string,
    page = 1,
    limit = 10,
    enabled = true
) {
    return useQuery({
        queryKey: routineKeys.progress(routineId),
        queryFn: () => routinesApi.getRoutineProgress(routineId, page, limit),
        enabled: enabled && !!routineId,
        staleTime: 2 * 60 * 1000,
    });
}

// Record Progress Mutation
export function useRecordProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (progress: ProgressCreateRequest) => routinesApi.recordProgress(progress),
        onSuccess: (newProgress) => {
            // Invalidate progress for this routine
            queryClient.invalidateQueries({
                queryKey: routineKeys.progress(newProgress.routine_id)
            });

            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: routineKeys.stats() });
        },
    });
}

// Complete Routine (shortcut mutation)
export function useCompleteRoutine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            routineId,
            totalTimeMinutes,
            userNotes,
            difficultyRating,
        }: {
            routineId: string;
            totalTimeMinutes?: number;
            userNotes?: string;
            difficultyRating?: number;
        }) => routinesApi.completeRoutine(routineId, totalTimeMinutes, userNotes, difficultyRating),
        onSuccess: (newProgress) => {
            // Invalidate progress for this routine
            queryClient.invalidateQueries({
                queryKey: routineKeys.progress(newProgress.routine_id)
            });

            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: routineKeys.stats() });
        },
    });
}

// Activate/Deactivate Routine Mutations
export function useActivateRoutine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (routineId: string) => routinesApi.activateRoutine(routineId),
        onSuccess: (updatedRoutine) => {
            queryClient.setQueryData(
                routineKeys.detail(updatedRoutine.id),
                updatedRoutine
            );
            queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
            queryClient.invalidateQueries({ queryKey: routineKeys.active() });
        },
    });
}

export function useDeactivateRoutine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (routineId: string) => routinesApi.deactivateRoutine(routineId),
        onSuccess: (updatedRoutine) => {
            queryClient.setQueryData(
                routineKeys.detail(updatedRoutine.id),
                updatedRoutine
            );
            queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
            queryClient.invalidateQueries({ queryKey: routineKeys.active() });
        },
    });
}

// Helper hooks for common use cases
export function useTodayRoutines() {
    const { data: morningRoutines, isLoading: isLoadingMorning } = useMorningRoutines();
    const { data: eveningRoutines, isLoading: isLoadingEvening } = useEveningRoutines();

    return {
        morningRoutines: morningRoutines?.routines || [],
        eveningRoutines: eveningRoutines?.routines || [],
        isLoading: isLoadingMorning || isLoadingEvening,
        totalRoutines: (morningRoutines?.routines?.length || 0) + (eveningRoutines?.routines?.length || 0),
    };
}

export function useRoutineCompletion() {
    const recordProgress = useRecordProgress();
    const completeRoutine = useCompleteRoutine();

    return {
        recordProgress: recordProgress.mutate,
        completeRoutine: completeRoutine.mutate,
        isRecording: recordProgress.isPending || completeRoutine.isPending,
        error: recordProgress.error || completeRoutine.error,
    };
}

/**
 * Hook for debugging routine database state
 */
export const useDebugRoutines = (enabled = false) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ['routines', 'debug'],
        queryFn: () => routinesApi.debugRoutineState(),
        enabled: enabled && isAuthenticated,
        staleTime: 0, // Always fresh for debugging
        retry: false, // Don't retry debug calls
    });
};

// Debug hooks removed - main functionality is working correctly 