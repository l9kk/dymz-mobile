/**
 * Gamification API Service
 * Handles streaks and gamification statistics only
 */

import { ApiService } from './api';
import type { StreakResponse, GamificationStats } from '../types/api';

export class GamificationApiService extends ApiService {
    private readonly baseUrl = '/api/v1/gamification';

    /**
     * Get user streaks
     */
    async getUserStreaks(): Promise<StreakResponse> {
        console.log('🎯 Fetching user streaks...');
        try {
            const data = await this.get<StreakResponse>(`${this.baseUrl}/streaks`);
            console.log('✅ User streaks fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch user streaks:', error);
            throw error;
        }
    }

    /**
     * Get gamification statistics
     */
    async getGamificationStats(): Promise<GamificationStats> {
        console.log('📊 Fetching gamification stats...');
        try {
            const data = await this.get<GamificationStats>(`${this.baseUrl}/stats`);
            console.log('✅ Gamification stats fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch gamification stats:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const gamificationApi = new GamificationApiService();

// Re-export types for convenience
export type { StreakResponse, GamificationStats }; 