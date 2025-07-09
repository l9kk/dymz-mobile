import { apiClient } from './api';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { ApiService } from './api';
import type {
    NotificationPreferencesResponse,
    NotificationPreferencesRequest,
    DeviceTokenRequest,
    TestNotificationRequest
} from '../types/api';

// Notification Data Types
export interface NotificationPreferences {
    id: string;
    user_id: string;
    notifications_enabled: boolean;
    routine_reminders: boolean;
    progress_updates: boolean;
    tips_and_insights: boolean;
    achievement_alerts: boolean;
    streak_reminders: boolean;
    product_recommendations: boolean;
    challenge_notifications: boolean;
    quiet_hours: {
        enabled: boolean;
        start_time: string; // HH:MM format
        end_time: string; // HH:MM format
    };
    routine_reminder_times: {
        morning?: string; // HH:MM format
        evening?: string; // HH:MM format
    };
    frequency_settings: {
        tips: 'daily' | 'weekly' | 'never';
        progress: 'daily' | 'weekly' | 'monthly';
        streaks: 'daily' | 'weekly' | 'never';
    };
}

export interface NotificationTemplate {
    id: string;
    type: 'routine_reminder' | 'progress_update' | 'tip' | 'achievement' | 'streak' | 'challenge';
    title: string;
    body: string;
    category?: string;
    priority: 'low' | 'normal' | 'high';
    action_buttons?: Array<{
        id: string;
        title: string;
        action: string;
    }>;
}

export interface ScheduledNotification {
    id: string;
    user_id: string;
    template_id: string;
    scheduled_time: string;
    status: 'pending' | 'sent' | 'failed' | 'cancelled';
    device_token: string;
    notification_data: {
        title: string;
        body: string;
        data?: Record<string, any>;
    };
    recurring?: {
        type: 'daily' | 'weekly' | 'monthly';
        interval: number;
        end_date?: string;
    };
}

export interface NotificationHistory {
    id: string;
    user_id: string;
    template_id: string;
    sent_at: string;
    opened_at?: string;
    action_taken?: string;
    notification_title: string;
    notification_body: string;
    engagement_score?: number;
}

export interface DeviceToken {
    token: string;
    platform: 'ios' | 'android' | 'web';
    device_id: string;
    app_version: string;
    is_active: boolean;
    registered_at: string;
    last_used_at: string;
}

// Notification API Functions

/**
 * Notifications API Service
 * Handles all notification management API calls
 */

export class NotificationsApiService extends ApiService {
    private readonly endpoints = {
        deviceToken: '/api/v1/notifications/device-token',
        preferences: '/api/v1/notifications/preferences',
        test: '/api/v1/notifications/test',
    };

    /**
     * Register or update device token for push notifications
     */
    async registerDeviceToken(tokenRequest: DeviceTokenRequest): Promise<{ message: string }> {
        console.log('📱 Registering device token for push notifications...');
        try {
            const data = await this.post<{ message: string }>(this.endpoints.deviceToken, tokenRequest);
            console.log('✅ Device token registered successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to register device token:', error);
            throw error;
        }
    }

    /**
     * Unregister device token to stop receiving push notifications
     */
    async unregisterDeviceToken(deviceType: string): Promise<{ message: string }> {
        console.log(`🚫 Unregistering device token for device type: ${deviceType}...`);
        try {
            const data = await this.delete<{ message: string }>(
                `${this.endpoints.deviceToken}?device_type=${deviceType}`
            );
            console.log('✅ Device token unregistered successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to unregister device token:', error);
            throw error;
        }
    }

    /**
     * Get current notification preferences for the user
     */
    async getNotificationPreferences(): Promise<NotificationPreferencesResponse> {
        console.log('⚙️ Fetching notification preferences...');
        try {
            const data = await this.get<NotificationPreferencesResponse>(this.endpoints.preferences);
            console.log('✅ Notification preferences fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch notification preferences:', error);
            throw error;
        }
    }

    /**
     * Update notification preferences for the user
     */
    async updateNotificationPreferences(
        preferences: NotificationPreferencesRequest
    ): Promise<{ message: string }> {
        console.log('🔄 Updating notification preferences...', preferences);
        try {
            const data = await this.put<{ message: string }>(this.endpoints.preferences, preferences);
            console.log('✅ Notification preferences updated successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to update notification preferences:', error);
            throw error;
        }
    }

    /**
     * Send a test notification to the user
     */
    async sendTestNotification(testRequest: TestNotificationRequest): Promise<{ message: string }> {
        console.log('🔔 Sending test notification...', testRequest);
        try {
            const data = await this.post<{ message: string }>(this.endpoints.test, testRequest);
            console.log('✅ Test notification sent successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to send test notification:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const notificationsApi = new NotificationsApiService();

// Re-export types for convenience
export type {
    NotificationPreferencesResponse,
    NotificationPreferencesRequest,
    DeviceTokenRequest,
    TestNotificationRequest
};

/**
 * Register device for push notifications
 */
export const registerForPushNotifications = async (): Promise<{
    success: boolean;
    token?: string;
    error?: string;
}> => {
    try {
        if (!Device.isDevice) {
            return {
                success: false,
                error: 'Push notifications only work on physical devices',
            };
        }

        // Check existing permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Request permissions if not granted
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return {
                success: false,
                error: 'Notification permissions not granted',
            };
        }

        // Get push token
        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: process.env.EXPO_PROJECT_ID,
        });

        const token = tokenData.data;

        // Register token with backend
        const deviceInfo = {
            token,
            platform: Platform.OS as 'ios' | 'android',
            device_id: Device.deviceName || 'unknown',
            app_version: '1.0.0', // Get from app.json
        };

        await registerDeviceToken(deviceInfo);

        return {
            success: true,
            token,
        };
    } catch (error) {
        console.error('Push notification registration failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

/**
 * Register device token with backend
 */
export const registerDeviceToken = async (deviceInfo: {
    token: string;
    platform: 'ios' | 'android';
    device_id: string;
    app_version: string;
}): Promise<DeviceToken> => {
    const response = await apiClient.post('/notifications/device-tokens', deviceInfo);
    return response.data;
};

/**
 * Get user notification preferences
 */
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
    const response = await apiClient.get('/notifications/preferences');
    return response.data;
};

/**
 * Update user notification preferences
 */
export const updateNotificationPreferences = async (
    preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
    const response = await apiClient.put('/notifications/preferences', preferences);
    return response.data;
};

/**
 * Schedule a notification
 */
export const scheduleNotification = async (data: {
    template_id: string;
    scheduled_time: string;
    custom_data?: Record<string, any>;
    recurring?: {
        type: 'daily' | 'weekly' | 'monthly';
        interval: number;
        end_date?: string;
    };
}): Promise<ScheduledNotification> => {
    const response = await apiClient.post('/notifications/schedule', data);
    return response.data;
};

/**
 * Get user's scheduled notifications
 */
export const getScheduledNotifications = async (params?: {
    status?: 'pending' | 'sent' | 'failed' | 'cancelled';
    type?: string;
    limit?: number;
}): Promise<ScheduledNotification[]> => {
    const response = await apiClient.get('/notifications/scheduled', { params });
    return response.data;
};

/**
 * Cancel a scheduled notification
 */
export const cancelScheduledNotification = async (notificationId: string): Promise<{
    success: boolean;
    message: string;
}> => {
    const response = await apiClient.delete(`/notifications/scheduled/${notificationId}`);
    return response.data;
};

/**
 * Send immediate notification
 */
export const sendImmediateNotification = async (data: {
    title: string;
    body: string;
    data?: Record<string, any>;
    target_users?: string[];
    template_id?: string;
}): Promise<{
    success: boolean;
    notification_id: string;
    sent_count: number;
}> => {
    const response = await apiClient.post('/notifications/send', data);
    return response.data;
};

/**
 * Get notification templates
 */
export const getNotificationTemplates = async (params?: {
    type?: string;
    category?: string;
}): Promise<NotificationTemplate[]> => {
    const response = await apiClient.get('/notifications/templates', { params });
    return response.data;
};

/**
 * Get notification history
 */
export const getNotificationHistory = async (params?: {
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
    type?: string;
}): Promise<{
    notifications: NotificationHistory[];
    total: number;
    engagement_stats: {
        sent_count: number;
        opened_count: number;
        engagement_rate: number;
    };
}> => {
    const response = await apiClient.get('/notifications/history', { params });
    return response.data;
};

/**
 * Mark notification as opened/read
 */
export const markNotificationOpened = async (notificationId: string, actionTaken?: string): Promise<{
    success: boolean;
}> => {
    const response = await apiClient.post(`/notifications/${notificationId}/opened`, {
        action_taken: actionTaken,
        opened_at: new Date().toISOString(),
    });
    return response.data;
};

/**
 * Test notification delivery
 */
export const testNotification = async (data: {
    title: string;
    body: string;
    data?: Record<string, any>;
}): Promise<{
    success: boolean;
    message: string;
}> => {
    const response = await apiClient.post('/notifications/test', data);
    return response.data;
};

// Local Notification Helpers

/**
 * Configure notification handler
 */
export const configureNotificationHandler = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
};

/**
 * Schedule local routine reminder
 */
export const scheduleRoutineReminder = async (data: {
    title: string;
    body: string;
    time: string; // HH:MM format
    recurring?: boolean;
}): Promise<string> => {
    const [hours, minutes] = data.time.split(':').map(Number);

    const trigger: Notifications.NotificationTriggerInput = data.recurring
        ? {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR as any,
            hour: hours,
            minute: minutes,
            repeats: true,
        } as any
        : {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR as any,
            hour: hours,
            minute: minutes,
        } as any;

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: data.title,
            body: data.body,
            data: { type: 'routine_reminder' },
        },
        trigger,
    });

    return notificationId;
};

/**
 * Cancel local notification
 */
export const cancelLocalNotification = async (notificationId: string): Promise<void> => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
};

/**
 * Cancel all local notifications
 */
export const cancelAllLocalNotifications = async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Get pending local notifications
 */
export const getPendingLocalNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
    return await Notifications.getAllScheduledNotificationsAsync();
};

// Helper Functions

/**
 * Create routine reminder notifications
 */
export const setupRoutineReminders = async (preferences: NotificationPreferences): Promise<{
    morning_id?: string;
    evening_id?: string;
}> => {
    const results: { morning_id?: string; evening_id?: string } = {};

    if (preferences.routine_reminders && preferences.routine_reminder_times.morning) {
        results.morning_id = await scheduleRoutineReminder({
            title: '🌅 Morning Routine Time!',
            body: 'Start your day with your skincare routine',
            time: preferences.routine_reminder_times.morning,
            recurring: true,
        });
    }

    if (preferences.routine_reminders && preferences.routine_reminder_times.evening) {
        results.evening_id = await scheduleRoutineReminder({
            title: '🌙 Evening Routine Time!',
            body: 'End your day with your skincare routine',
            time: preferences.routine_reminder_times.evening,
            recurring: true,
        });
    }

    return results;
};

/**
 * Check if notifications are in quiet hours
 */
export const isInQuietHours = (preferences: NotificationPreferences): boolean => {
    if (!preferences.quiet_hours.enabled) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = preferences.quiet_hours.start_time.split(':').map(Number);
    const [endHour, endMinute] = preferences.quiet_hours.end_time.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
        // Same day quiet hours (e.g., 22:00 to 08:00 next day)
        return currentTime >= startTime && currentTime <= endTime;
    } else {
        // Quiet hours span midnight (e.g., 22:00 to 08:00 next day)
        return currentTime >= startTime || currentTime <= endTime;
    }
};

/**
 * Get notification permission status
 */
export const getNotificationPermissionStatus = async (): Promise<{
    status: string;
    canAskAgain: boolean;
    ios?: {
        status: string;
        allowsAlert: boolean;
        allowsBadge: boolean;
        allowsSound: boolean;
    };
}> => {
    const permission = await Notifications.getPermissionsAsync();
    return {
        status: permission.status.toString(),
        canAskAgain: permission.canAskAgain,
        ios: permission.ios ? {
            status: permission.ios.status.toString(),
            allowsAlert: permission.ios.allowsAlert || false,
            allowsBadge: permission.ios.allowsBadge || false,
            allowsSound: permission.ios.allowsSound || false,
        } : undefined,
    };
};

/**
 * Format notification time for display
 */
export const formatNotificationTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Generate notification content based on user data
 */
export const generatePersonalizedNotification = (
    type: 'routine_reminder' | 'progress_update' | 'streak_reminder',
    userData: {
        name?: string;
        currentStreak?: number;
        improvingMetrics?: string[];
        nextMilestone?: number;
    }
): { title: string; body: string } => {
    const name = userData.name || 'there';

    switch (type) {
        case 'routine_reminder':
            return {
                title: `✨ Hi ${name}!`,
                body: 'Time for your skincare routine. Your skin will thank you! 💫',
            };

        case 'progress_update':
            const metrics = userData.improvingMetrics?.slice(0, 2).join(' and ') || 'your skin';
            return {
                title: '📈 Progress Update',
                body: `Great news! ${metrics} ${userData.improvingMetrics?.length === 1 ? 'is' : 'are'} improving!`,
            };

        case 'streak_reminder':
            const streak = userData.currentStreak || 0;
            const milestone = userData.nextMilestone || (streak + 1);
            return {
                title: `🔥 ${streak}-Day Streak!`,
                body: `You're ${milestone - streak} days away from your next milestone!`,
            };

        default:
            return {
                title: 'Dymz AI',
                body: 'Check your skincare progress!',
            };
    }
}; 