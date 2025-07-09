/**
 * User React Query Hooks
 * Manages all user profile and onboarding related data fetching and mutations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    userApi,
    OnboardingRequest,
    UserProfileUpdateRequest,
    CheckInRequest,
    DeviceTokenRequest
} from '../../services/userApi';
import { UserProfile } from '../../stores/authStore';
import { useAuthStore } from '../../stores/authStore';
import { queryKeys } from '../../lib/queryClient';
import { OnboardingData } from '../../types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Query keys for React Query
export const userKeys = {
    all: ['user'] as const,
    profile: () => [...userKeys.all, 'profile'] as const,
    stats: () => [...userKeys.all, 'stats'] as const,
};

/**
 * Hook for getting user profile
 */
export const useUserProfile = (enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: userKeys.profile(),
        queryFn: () => userApi.getUserProfile(),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            // Don't retry 404 errors (profile doesn't exist yet)
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for updating user profile
 */
export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: (updates: UserProfileUpdateRequest) => userApi.updateUserProfile(updates),

        onMutate: async (updates) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: userKeys.profile() });

            // Snapshot previous value
            const previousProfile = queryClient.getQueryData<UserProfile>(userKeys.profile());

            // Optimistically update cache
            if (previousProfile) {
                queryClient.setQueryData(userKeys.profile(), {
                    ...previousProfile,
                    ...updates,
                    updated_at: new Date().toISOString(),
                });
            }

            return { previousProfile };
        },

        onError: (err, updates, context) => {
            // Rollback on error
            if (context?.previousProfile) {
                queryClient.setQueryData(userKeys.profile(), context.previousProfile);
            }
        },

        onSuccess: (updatedProfile) => {
            // Update auth store with new profile
            authStore.userProfile = updatedProfile;

            // Update cache
            queryClient.setQueryData(userKeys.profile(), updatedProfile);
        },
    });
};

/**
 * Hook for completing onboarding
 */
export const useCompleteOnboarding = () => {
    const queryClient = useQueryClient();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: (data: OnboardingRequest) => userApi.completeOnboarding(data),

        onSuccess: (profile) => {
            // Update auth store
            authStore.userProfile = profile;

            // Update cache
            queryClient.setQueryData(userKeys.profile(), profile);

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: userKeys.stats() });
        },
    });
};

/**
 * Hook for daily check-in
 */
export const useDailyCheckIn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CheckInRequest) => userApi.dailyCheckIn(data),

        onSuccess: () => {
            // Invalidate user stats and profile to reflect new streak
            queryClient.invalidateQueries({ queryKey: userKeys.stats() });
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
        },
    });
};

/**
 * Hook for getting user statistics
 */
export const useUserStats = (enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: userKeys.stats(),
        queryFn: () => userApi.getUserStats(),
        enabled: enabled && isAuthenticated,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook for registering device token
 */
export const useRegisterDeviceToken = () => {
    return useMutation({
        mutationFn: (token: DeviceTokenRequest) => userApi.registerDeviceToken(token),
    });
};

/**
 * Hook for deleting user profile
 */
export const useDeleteUserProfile = () => {
    const queryClient = useQueryClient();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            const userId = authStore.user?.id;

            // Clear all routine completion data before deleting account
            try {
                const keys = await AsyncStorage.getAllKeys();
                const routineKeys = keys.filter(key => key.startsWith('@daily_completion_status'));

                if (routineKeys.length > 0) {
                    await AsyncStorage.multiRemove(routineKeys);
                    console.log('🗑️ All routine completion data cleared on account deletion');
                }
            } catch (error) {
                console.error('Error clearing routine data on account deletion:', error);
            }

            // Delete the user profile from backend
            return await userApi.deleteUserProfile();
        },

        onSuccess: () => {
            // Clear all user data
            queryClient.clear();
            authStore.signOut();
        },
    });
};

/**
 * Helper hook for updating specific preference types
 */
export const useUpdatePreferences = () => {
    const updateProfile = useUpdateUserProfile();

    return {
        updateSkinType: (skinType: string) =>
            updateProfile.mutate({
                preferences: { skin_type: skinType as any }
            }),

        updateSkinConcerns: (concerns: string[]) =>
            updateProfile.mutate({
                preferences: { skin_concerns: concerns }
            }),

        updateBudgetRange: (budgetRange: 'budget' | 'mid_range' | 'luxury') =>
            updateProfile.mutate({
                preferences: { budget_range: budgetRange }
            }),

        updateRoutineTimes: (morning: string, evening: string) =>
            updateProfile.mutate({
                preferences: {
                    routine_time_morning: morning,
                    routine_time_evening: evening
                }
            }),
    };
};

/**
 * Helper hook for notification settings
 */
export const useUpdateNotificationSettings = () => {
    const updateProfile = useUpdateUserProfile();

    return {
        toggleNotifications: (enabled: boolean) =>
            updateProfile.mutate({
                notification_settings: {
                    notification_enabled: enabled,
                    reminders: enabled,
                    tips: enabled,
                    progress_updates: enabled,
                    streak_alerts: enabled,
                }
            }),

        updateSpecificSetting: (setting: string, value: boolean) =>
            updateProfile.mutate({
                notification_settings: {
                    notification_enabled: true,
                    reminders: true,
                    tips: true,
                    progress_updates: true,
                    streak_alerts: true,
                    [setting]: value
                }
            }),
    };
};

/**
 * Hook for creating onboarding data from app's UserData
 */
export const useCreateOnboardingFromUserData = () => {
    const completeOnboarding = useCompleteOnboarding();

    return {
        submitUserData: (userData: any) => {
            const onboardingData = userApi.createOnboardingRequestFromUserData(userData);
            return completeOnboarding.mutate(onboardingData);
        },

        isLoading: completeOnboarding.isPending,
        error: completeOnboarding.error,
        isSuccess: completeOnboarding.isSuccess,
    };
};

/**
 * Hook for profile completion status
 */
export const useProfileCompletion = () => {
    const { data: profile } = useUserProfile();

    const isComplete = profile ? userApi.isProfileComplete(profile) : false;
    const completionPercentage = profile ? userApi.getProfileCompletionPercentage(profile) : 0;

    return {
        isComplete,
        completionPercentage,
        profile,
    };
};

/**
 * Hook for prefetching user data
 */
export const usePrefetchUser = () => {
    const queryClient = useQueryClient();

    return {
        prefetchProfile: () => {
            queryClient.prefetchQuery({
                queryKey: userKeys.profile(),
                queryFn: () => userApi.getUserProfile(),
                staleTime: 5 * 60 * 1000,
            });
        },

        prefetchStats: () => {
            queryClient.prefetchQuery({
                queryKey: userKeys.stats(),
                queryFn: () => userApi.getUserStats(),
                staleTime: 2 * 60 * 1000,
            });
        },
    };
}; 