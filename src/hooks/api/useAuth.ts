/**
 * Authentication API Hooks
 * React Query hooks for authentication operations
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { authHelpers } from '../../lib/supabase';
import { api } from '../../services/api';
import { queryKeys, cacheUtils } from '../../lib/queryClient';
import { Config } from '../../config/env';
import { UserProfile, OnboardingData } from '../../types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear routine completion data for current user
const clearRoutineCompletionData = async (userId?: string) => {
    try {
        if (userId) {
            // Clear specific user's routine data
            const storageKey = `@daily_completion_status_${userId}`;
            await AsyncStorage.removeItem(storageKey);
            console.log('🗑️ User routine completion data cleared on sign out');
        } else {
            // Clear all routine completion data as fallback
            const keys = await AsyncStorage.getAllKeys();
            const routineKeys = keys.filter(key => key.startsWith('@daily_completion_status'));

            if (routineKeys.length > 0) {
                await AsyncStorage.multiRemove(routineKeys);
                console.log('🗑️ All routine completion data cleared on sign out');
            }
        }
    } catch (error) {
        console.error('Error clearing routine completion data:', error);
    }
};

/**
 * Hook for Google OAuth sign in
 */
export const useGoogleSignIn = () => {
    const { signInWithGoogle } = useAuthStore();

    return useMutation({
        mutationFn: signInWithGoogle,
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate auth-related queries
                cacheUtils.invalidateUser();
                console.log('Google sign in successful');
            }
        },
        onError: (error) => {
            console.error('Google sign in failed:', error);
        },
    });
};

/**
 * Hook for email signup
 */
export const useEmailSignUp = () => {
    const { signUpWithEmail } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, password, options }: {
            email: string;
            password: string;
            options?: { redirectTo?: string; data?: object }
        }) => signUpWithEmail(email, password, options),
        onSuccess: (result) => {
            if (result.success) {
                console.log('Email signup successful', { needsVerification: result.needsVerification });
            }
        },
        onError: (error) => {
            console.error('Email signup failed:', error);
        },
    });
};

/**
 * Hook for email sign in
 */
export const useEmailSignIn = () => {
    const { signInWithEmail } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            signInWithEmail(email, password),
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate auth-related queries
                cacheUtils.invalidateUser();
                console.log('Email sign in successful');
            }
        },
        onError: (error) => {
            console.error('Email sign in failed:', error);
        },
    });
};

/**
 * Hook for magic link sign in
 */
export const useMagicLink = () => {
    const { signInWithMagicLink } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, options }: {
            email: string;
            options?: { redirectTo?: string }
        }) => signInWithMagicLink(email, options),
        onSuccess: (result) => {
            if (result.success) {
                console.log('Magic link sent successfully');
            }
        },
        onError: (error) => {
            console.error('Magic link failed:', error);
        },
    });
};

/**
 * Hook for OTP sign in
 */
export const useOTPSignIn = () => {
    const { signInWithOTP } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, options }: {
            email: string;
            options?: { shouldCreateUser?: boolean }
        }) => signInWithOTP(email, options),
        onSuccess: (result) => {
            if (result.success) {
                console.log('OTP sent successfully');
            }
        },
        onError: (error) => {
            console.error('OTP sign in failed:', error);
        },
    });
};

/**
 * Hook for OTP verification
 */
export const useOTPVerify = () => {
    const { verifyOTP } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, token }: { email: string; token: string }) =>
            verifyOTP(email, token),
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate auth-related queries
                cacheUtils.invalidateUser();
                console.log('OTP verification successful');
            }
        },
        onError: (error) => {
            console.error('OTP verification failed:', error);
        },
    });
};

/**
 * Hook for password reset
 */
export const usePasswordReset = () => {
    const { resetPassword } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, options }: {
            email: string;
            options?: { redirectTo?: string }
        }) => resetPassword(email, options),
        onSuccess: (result) => {
            if (result.success) {
                console.log('Password reset email sent successfully');
            }
        },
        onError: (error) => {
            console.error('Password reset failed:', error);
        },
    });
};

/**
 * Hook for password update
 */
export const usePasswordUpdate = () => {
    const { updatePassword } = useAuthStore();

    return useMutation({
        mutationFn: ({ password }: { password: string }) => updatePassword(password),
        onSuccess: (result) => {
            if (result.success) {
                console.log('Password updated successfully');
            }
        },
        onError: (error) => {
            console.error('Password update failed:', error);
        },
    });
};

/**
 * Hook for resending confirmation email
 */
export const useResendConfirmation = () => {
    const { resendConfirmation } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, options }: {
            email: string;
            options?: { redirectTo?: string }
        }) => resendConfirmation(email, options),
        onSuccess: (result) => {
            if (result.success) {
                console.log('Confirmation email resent successfully');
            }
        },
        onError: (error) => {
            console.error('Resend confirmation failed:', error);
        },
    });
};

/**
 * Hook for signing out
 */
export const useSignOut = () => {
    const { signOut, user } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            // Clear routine completion data before signing out
            await clearRoutineCompletionData(user?.id);

            // Perform the sign out
            return await signOut();
        },
        onSuccess: () => {
            // Clear all cached data on sign out
            cacheUtils.clearAll();
            console.log('Sign out successful');
        },
        onError: (error) => {
            console.error('Sign out failed:', error);
        },
    });
};

/**
 * Hook to get current user profile
 */
export const useUserProfile = () => {
    const { isAuthenticated, user } = useAuthStore();

    return useQuery({
        queryKey: queryKeys.user.profile(user?.id),
        queryFn: async (): Promise<UserProfile> => {
            // TODO: Replace with real API call when backend is connected
            // return api.get<UserProfile>(Config.ENDPOINTS.USER_PROFILE);

            // For now, return mock data based on Supabase user
            if (!user) throw new Error('No authenticated user');

            return {
                id: `profile_${user.id}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_id: user.id,
                display_name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                onboarding_completed: false,
                preferences: {
                    skin_type: undefined,
                    skin_concerns: [],
                    budget_range: undefined,
                },
                notification_settings: {
                    notification_enabled: true,
                    reminders: true,
                    tips: true,
                    progress_updates: true,
                    streak_alerts: true,
                },
                game_metrics: {
                    current_streak: 0,
                    longest_streak: 0,
                    total_check_ins: 0,
                    profile_completion_score: 0.1,
                },
            };
        },
        enabled: isAuthenticated && !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to update user profile
 */
export const useUpdateUserProfile = () => {
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
            // TODO: Replace with real API call when backend is connected
            // return api.put<UserProfile>(Config.ENDPOINTS.USER_PROFILE, updates);

            // For now, return the updated data (optimistic update)
            if (!user) throw new Error('No authenticated user');

            return {
                ...updates,
                id: `profile_${user.id}`,
                user_id: user.id,
                updated_at: new Date().toISOString(),
            } as UserProfile;
        },
        onSuccess: (updatedProfile) => {
            // Update the cached profile data
            if (user?.id) {
                cacheUtils.updateUserProfileCache(user.id, () => updatedProfile);
            }
        },
        onError: (error) => {
            console.error('Failed to update user profile:', error);
        },
    });
};

/**
 * Hook to submit onboarding data
 */
export const useSubmitOnboarding = () => {
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (onboardingData: OnboardingData): Promise<UserProfile> => {
            // TODO: Replace with real API call when backend is connected
            // return api.post<UserProfile>(Config.ENDPOINTS.USER_ONBOARDING, onboardingData);

            // For now, return mock success response
            if (!user) throw new Error('No authenticated user');

            return {
                id: `profile_${user.id}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_id: user.id,
                display_name: onboardingData.display_name || user.email?.split('@')[0] || 'User',
                timezone: onboardingData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                preferences: onboardingData.preferences,
                notification_settings: onboardingData.notification_settings,
                onboarding_completed: true,
                game_metrics: {
                    current_streak: 0,
                    longest_streak: 0,
                    total_check_ins: 0,
                    profile_completion_score: 0.8, // Higher score after onboarding
                },
            };
        },
        onSuccess: (profile) => {
            // Update cached profile data
            if (user?.id) {
                cacheUtils.updateUserProfileCache(user.id, () => profile);
            }
            // Also invalidate to refetch fresh data
            cacheUtils.invalidateUser();
            console.log('Onboarding completed successfully');
        },
        onError: (error) => {
            console.error('Failed to submit onboarding data:', error);
        },
    });
};

/**
 * Hook to check authentication status
 */
export const useAuthStatus = () => {
    const { isLoading, isAuthenticated, error } = useAuthStore();

    return {
        isLoading,
        isAuthenticated,
        error,
    };
};

/**
 * Hook to get current session information
 */
export const useSession = () => {
    return useQuery({
        queryKey: queryKeys.auth.session(),
        queryFn: async () => {
            const { session, error } = await authHelpers.getSession();
            if (error) throw error;
            return session;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

/**
 * Hook to test API connectivity
 */
export const useHealthCheck = () => {
    return useQuery({
        queryKey: queryKeys.health,
        queryFn: async () => {
            try {
                return await api.healthCheck();
            } catch (error) {
                console.log('Health check failed - API might not be available:', error);
                return {
                    status: 'unavailable',
                    timestamp: new Date().toISOString(),
                    error: 'API not reachable'
                };
            }
        },
        retry: 1,
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Refetch every minute
    });
}; 