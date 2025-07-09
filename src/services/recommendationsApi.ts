/**
 * Recommendations API Service
 * Handles all personalized recommendation API calls
 */

import { ApiService } from './api';
import type {
    ProductRecommendationResponse,
    RoutineRecommendationResponse,
    PersonalizedRecommendations,
    RecommendationRequest
} from '../types/api';

export class RecommendationsApiService extends ApiService {
    private readonly endpoints = {
        products: '/api/v1/recommendations/products',
        routines: '/api/v1/recommendations/routines',
        personalized: '/api/v1/recommendations/personalized',
    };

    /**
     * Get general product recommendations for the current user
     */
    async getProductRecommendationsForUser(): Promise<ProductRecommendationResponse> {
        console.log('🛍️ Fetching general product recommendations...');
        try {
            const data = await this.get<ProductRecommendationResponse>(this.endpoints.products);
            console.log('✅ Product recommendations fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch product recommendations:', error);
            throw error;
        }
    }

    /**
     * Get personalized product recommendations based on request criteria
     */
    async getProductRecommendations(request: RecommendationRequest): Promise<ProductRecommendationResponse> {
        console.log('🎯 Fetching personalized product recommendations...', request);
        try {
            const data = await this.post<ProductRecommendationResponse>(this.endpoints.products, request);
            console.log('✅ Personalized product recommendations fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch personalized product recommendations:', error);
            throw error;
        }
    }

    /**
     * Get general routine recommendations for the current user
     */
    async getRoutineRecommendationsForUser(): Promise<RoutineRecommendationResponse> {
        console.log('📋 Fetching general routine recommendations...');
        try {
            const data = await this.get<RoutineRecommendationResponse>(this.endpoints.routines);
            console.log('✅ Routine recommendations fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch routine recommendations:', error);
            throw error;
        }
    }

    /**
     * Get personalized routine recommendations based on request criteria
     */
    async getRoutineRecommendations(request: RecommendationRequest): Promise<RoutineRecommendationResponse> {
        console.log('📝 Fetching personalized routine recommendations...', request);
        try {
            const data = await this.post<RoutineRecommendationResponse>(this.endpoints.routines, request);
            console.log('✅ Personalized routine recommendations fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch personalized routine recommendations:', error);
            throw error;
        }
    }

    /**
     * Get comprehensive personalized recommendations including products and routines
     */
    async getPersonalizedRecommendations(): Promise<PersonalizedRecommendations> {
        console.log('🎨 Fetching comprehensive personalized recommendations...');
        try {
            const data = await this.get<PersonalizedRecommendations>(this.endpoints.personalized);
            console.log('✅ Comprehensive recommendations fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch comprehensive recommendations:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const recommendationsApi = new RecommendationsApiService();

// Re-export types for convenience
export type {
    ProductRecommendationResponse,
    RoutineRecommendationResponse,
    PersonalizedRecommendations,
    RecommendationRequest
}; 