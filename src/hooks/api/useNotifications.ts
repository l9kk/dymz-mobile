/**
 * Notifications React Query Hooks
 * Manages all notification-related data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../../services/notificationsApi';
import type {
    NotificationPreferencesResponse,
    NotificationPreferencesRequest,
    DeviceTokenRequest,
    TestNotificationRequest
} from '../../types/api';
import { useAuthStore } from '../../stores/authStore';

// Query keys for React Query
export const notificationKeys = {
    all: ['notifications'] as const,
    preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

/**
 * Hook for fetching notification preferences
 */
export const useNotificationPreferences = (enabled = true) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: notificationKeys.preferences(),
        queryFn: () => notificationsApi.getNotificationPreferences(),
        enabled: enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for registering device token
 */
export const useRegisterDeviceToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tokenRequest: DeviceTokenRequest) =>
            notificationsApi.registerDeviceToken(tokenRequest),
        onSuccess: () => {
            // Invalidate notification preferences to update device token count
            queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
        },
    });
};

/**
 * Hook for unregistering device token
 */
export const useUnregisterDeviceToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (deviceType: string) =>
            notificationsApi.unregisterDeviceToken(deviceType),
        onSuccess: () => {
            // Invalidate notification preferences to update device token count
            queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
        },
    });
};

/**
 * Hook for updating notification preferences
 */
export const useUpdateNotificationPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (preferences: NotificationPreferencesRequest) =>
            notificationsApi.updateNotificationPreferences(preferences),
        onSuccess: () => {
            // Invalidate and refetch notification preferences
            queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
        },
    });
};

/**
 * Hook for sending test notifications
 */
export const useSendTestNotification = () => {
    return useMutation({
        mutationFn: (testRequest: TestNotificationRequest) =>
            notificationsApi.sendTestNotification(testRequest),
    });
};

/**
 * Hook for notification settings management
 */
export const useNotificationSettings = () => {
    const preferences = useNotificationPreferences();
    const updatePreferences = useUpdateNotificationPreferences();

    const toggleSetting = async (setting: keyof NotificationPreferencesRequest, value: boolean) => {
        await updatePreferences.mutateAsync({ [setting]: value });
    };

    return {
        preferences: preferences.data,
        toggleSetting,
        isLoading: preferences.isLoading || updatePreferences.isPending,
        error: preferences.error || updatePreferences.error,
    };
};

/**
 * Hook for notification cache management
 */
export const useNotificationCache = () => {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    };

    const invalidatePreferences = () => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
    };

    const clearCache = () => {
        queryClient.removeQueries({ queryKey: notificationKeys.all });
    };

    return {
        invalidateAll,
        invalidatePreferences,
        clearCache,
    };
}; 