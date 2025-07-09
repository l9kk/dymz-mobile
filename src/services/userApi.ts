/**
 * User API Service
 * Handles all user management related API calls
 */

import { ApiService } from './api';
import { UserProfile } from '../stores/authStore';

// User API data types based on backend schema
export interface UserPreferences {
    skin_type?: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
    skin_concerns?: string[];
    budget_range?: 'budget' | 'mid_range' | 'luxury';
    routine_time_morning?: string;
    routine_time_evening?: string;
}

export interface NotificationSettings {
    notification_enabled: boolean;
    reminders: boolean;
    tips: boolean;
    progress_updates: boolean;
    streak_alerts: boolean;
}

export interface GameMetrics {
    current_streak: number;
    longest_streak: number;
    total_check_ins: number;
    achievements: string[];
    profile_completion_score: number;
}

export interface OnboardingRequest {
    display_name: string;
    skin_type: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
    skin_concerns: string[];
    budget_range: 'budget' | 'mid_range' | 'luxury';
    routine_time_morning: string; // HH:MM format
    routine_time_evening: string; // HH:MM format
    timezone?: string;
}

export interface UserProfileUpdateRequest {
    display_name?: string;
    timezone?: string;
    preferences?: UserPreferences;
    notification_settings?: NotificationSettings;
}

export interface CheckInRequest {
    analysis_id?: string;
    completed_routine_steps?: string[];
    notes?: string;
}

export interface CheckInResponse {
    streak_updated: boolean;
    new_achievements: string[];
    current_streak: number;
    next_milestone?: number;
}

export interface UserStatsResponse {
    total_analyses: number;
    current_streak: number;
    longest_streak: number;
    total_check_ins: number;
    profile_completion_score: number;
    achievements_count: number;
    days_since_first_analysis?: number;
}

export interface DeviceTokenRequest {
    fcm_token?: string;
    apns_token?: string;
}

export class UserApiService extends ApiService {
    private readonly endpoints = {
        profile: '/api/v1/users/profile',
        onboarding: '/api/v1/users/onboarding',
        deviceToken: '/api/v1/users/device-token',
        checkIn: '/api/v1/users/check-in',
        stats: '/api/v1/users/stats',
    };

    /**
     * Get current user profile
     */
    async getUserProfile(): Promise<UserProfile> {
        return this.get<UserProfile>(this.endpoints.profile);
    }

    /**
     * Update user profile
     */
    async updateUserProfile(updates: UserProfileUpdateRequest): Promise<UserProfile> {
        return this.put<UserProfile>(this.endpoints.profile, updates);
    }

    /**
     * Complete user onboarding
     */
    async completeOnboarding(data: OnboardingRequest): Promise<UserProfile> {
        return this.post<UserProfile>(this.endpoints.onboarding, data);
    }

    /**
     * Delete user profile (soft delete)
     */
    async deleteUserProfile(): Promise<{ message: string }> {
        return this.delete<{ message: string }>(this.endpoints.profile);
    }

    /**
     * Register device token for push notifications
     */
    async registerDeviceToken(token: DeviceTokenRequest): Promise<{ message: string }> {
        return this.post<{ message: string }>(this.endpoints.deviceToken, token);
    }

    /**
     * Record daily check-in (updated for OpenAPI)
     */
    async dailyCheckIn(data: CheckInRequest): Promise<CheckInResponse> {
        console.log('✅ Recording daily check-in...', data);
        try {
            const response = await this.post<CheckInResponse>(this.endpoints.checkIn, data);
            console.log('✅ Check-in recorded successfully:', response);
            return response;
        } catch (error) {
            console.error('❌ Failed to record check-in:', error);
            throw error;
        }
    }

    /**
     * Get user statistics (updated for OpenAPI)
     */
    async getUserStats(): Promise<UserStatsResponse> {
        console.log('📊 Fetching user statistics...');
        try {
            const stats = await this.get<UserStatsResponse>(this.endpoints.stats);
            console.log('✅ User statistics fetched successfully:', stats);
            return stats;
        } catch (error) {
            console.error('❌ Failed to fetch user statistics:', error);
            throw error;
        }
    }

    /**
     * Helper: Update user preferences only
     */
    async updatePreferences(preferences: UserPreferences): Promise<UserProfile> {
        return this.updateUserProfile({ preferences });
    }

    /**
     * Helper: Update notification settings only
     */
    async updateNotificationSettings(notificationSettings: NotificationSettings): Promise<UserProfile> {
        return this.updateUserProfile({ notification_settings: notificationSettings });
    }

    /**
     * Helper: Create onboarding data from app's UserData structure
     */
    createOnboardingRequestFromUserData(userData: any): OnboardingRequest {
        // Map from the app's UserData structure to backend schema

        // Map skincare experience to skin type
        const skinTypeMap: Record<string, 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal'> = {
            'oily': 'oily',
            'dry': 'dry',
            'combination': 'combination',
            'sensitive': 'sensitive',
            'normal': 'normal',
            'beginner': 'normal',
            'intermediate': 'combination',
            'expert': 'combination'
        };

        // Extract skin concerns as an array
        const skinConcerns: string[] = [];
        if (userData.skinConcerns?.selectedConcern) {
            skinConcerns.push(userData.skinConcerns.selectedConcern);
        }

        // Map budget based on user preferences or default
        let budgetRange: 'budget' | 'mid_range' | 'luxury' = 'mid_range';
        if (userData.skincareExperience === 'beginner') {
            budgetRange = 'budget';
        } else if (userData.skincareExperience === 'expert') {
            budgetRange = 'luxury';
        }

        return {
            display_name: userData.displayName || userData.gender || 'User',
            skin_type: skinTypeMap[userData.skincareExperience?.toLowerCase()] || 'normal',
            skin_concerns: skinConcerns,
            budget_range: budgetRange,
            routine_time_morning: '08:00',
            routine_time_evening: '22:00',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        };
    }

    /**
     * Helper: Check if user profile is complete for onboarding
     */
    isProfileComplete(profile: UserProfile): boolean {
        return (
            profile.onboarding_completed &&
            !!profile.display_name &&
            !!profile.preferences?.skin_type &&
            !!profile.preferences?.skin_concerns?.length &&
            !!profile.preferences?.budget_range
        );
    }

    /**
     * Helper: Calculate profile completion percentage
     */
    getProfileCompletionPercentage(profile: UserProfile): number {
        if (!profile) return 0;

        const checks = [
            profile.display_name,
            profile.preferences?.skin_type,
            profile.preferences?.skin_concerns?.length,
            profile.preferences?.budget_range,
            profile.preferences?.routine_time_morning,
            profile.preferences?.routine_time_evening,
            profile.notification_settings?.notification_enabled !== undefined,
        ];

        const completed = checks.filter(Boolean).length;
        return Math.round((completed / checks.length) * 100);
    }
}

// Export singleton instance
export const userApi = new UserApiService(); 