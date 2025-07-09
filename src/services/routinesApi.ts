/**
 * Routines API Service
 * Handles all routine-related API calls including progress tracking
 */

import { ApiService } from './api';

// Routine data types based on backend schema
export interface RoutineStep {
    step: string;
    product_id?: string;
    duration_seconds: number;
    order: number;
    instructions?: string;
    optional: boolean;
}

export interface Routine {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    name: string;
    routine_type: 'morning' | 'evening';
    steps: RoutineStep[];
    is_active: boolean;
    analysis_id?: string;
    estimated_duration_minutes: number;
    notes?: string;
}

export interface CompletedStep {
    step: string;
    completed_at: string;
    duration_seconds?: number;
}

export interface RoutineProgress {
    id: string;
    routine_id: string;
    completed_at: string;
    completed_steps: CompletedStep[];
    total_time_minutes?: number;
    user_notes?: string;
    difficulty_rating?: number;
    adherence_score: number;
}

export interface RoutineCreateRequest {
    name: string;
    routine_type: 'morning' | 'evening';
    steps: RoutineStep[];
    analysis_id?: string;
    notes?: string;
}

export interface RoutineUpdateRequest {
    name?: string;
    steps?: RoutineStep[];
    is_active?: boolean;
    notes?: string;
}

export interface RoutineListResponse {
    routines: Routine[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
}

export interface ProgressCreateRequest {
    routine_id: string;
    completed_steps: CompletedStep[];
    total_time_minutes?: number;
    user_notes?: string;
    difficulty_rating?: number;
}

export interface RoutineRecommendationRequest {
    analysis_id: string;
    routine_type: 'morning' | 'evening';
    budget_range?: 'budget' | 'mid_range' | 'luxury';
    time_preference?: 'quick' | 'normal' | 'thorough';
    preferred_brands?: string[];
    exclude_ingredients?: string[];
}

export interface RoutineRecommendationResponse {
    analysis_id: string;
    recommendations: RecommendedRoutine[];
    criteria_used: Record<string, any>;
    generated_at: string;
}

export interface RecommendedRoutine {
    name: string;
    routine_type: string;
    steps: RoutineStep[];
    estimated_duration_minutes: number;
    recommendation_reason: string;
    confidence_score: number;
    total_estimated_cost?: number;
}

export interface RoutineStatsResponse {
    total_routines: number;
    active_routines: number;
    total_completions: number;
    current_week_completions: number;
    average_completion_rate: number;
    favorite_routine_type?: string | null;
    average_duration_minutes?: number | null;
    most_skipped_step?: string | null;
}

export class RoutinesApiService extends ApiService {
    private readonly endpoints = {
        routines: '/api/v1/routines/',
        active: '/api/v1/routines/active',
        recommendations: '/api/v1/routines/recommendations',
        stats: '/api/v1/routines/stats',
        debug: '/api/v1/routines/debug/database-state',
        byId: (id: string) => `/api/v1/routines/${id}`,
        progress: (id: string) => `/api/v1/routines/${id}/progress`,
    };

    /**
     * List user's routines with optional filtering
     */
    async listRoutines(
        routineType?: 'morning' | 'evening',
        isActive?: boolean,
        page = 1,
        limit = 10
    ): Promise<RoutineListResponse> {
        const params = new URLSearchParams();

        if (routineType) params.append('routine_type', routineType);
        if (isActive !== undefined) params.append('is_active', isActive.toString());

        const skip = (page - 1) * limit;
        params.append('skip', skip.toString());
        params.append('limit', limit.toString());

        const queryString = params.toString();
        const url = queryString ? `${this.endpoints.routines}?${queryString}` : this.endpoints.routines;

        return this.get<RoutineListResponse>(url);
    }

    /**
     * Get active routines
     */
    async getActiveRoutines(): Promise<RoutineListResponse> {
        try {
            const result = await this.get<RoutineListResponse>(this.endpoints.active);
            console.log('✅ Active routines fetched:', {
                count: result.routines?.length || 0,
                routines: result.routines?.map(r => ({
                    id: r.id,
                    name: r.name,
                    type: r.routine_type,
                    steps: r.steps?.length || 0,
                    active: r.is_active
                }))
            });
            return result;
        } catch (error: any) {
            console.error('❌ Failed to fetch active routines:', error);
            throw error;
        }
    }

    /**
     * Create a new routine
     */
    async createRoutine(routine: RoutineCreateRequest): Promise<Routine> {
        try {
            console.log('🚀 Creating routine:', {
                name: routine.name,
                type: routine.routine_type,
                steps: routine.steps?.length || 0,
                analysis_id: routine.analysis_id
            });

            const result = await this.post<Routine>(this.endpoints.routines, routine);

            console.log('✅ Routine created successfully:', {
                id: result.id,
                name: result.name,
                type: result.routine_type,
                active: result.is_active,
                steps: result.steps?.length || 0
            });

            return result;
        } catch (error: any) {
            console.error('❌ Failed to create routine:', error);
            throw error;
        }
    }

    /**
     * Get routine by ID
     */
    async getRoutine(routineId: string): Promise<Routine> {
        return this.get<Routine>(this.endpoints.byId(routineId));
    }

    /**
     * Update routine
     */
    async updateRoutine(routineId: string, update: RoutineUpdateRequest): Promise<Routine> {
        return this.put<Routine>(this.endpoints.byId(routineId), update);
    }

    /**
     * Delete routine
     */
    async deleteRoutine(routineId: string): Promise<void> {
        return this.delete(this.endpoints.byId(routineId));
    }

    /**
     * Get routine progress history
     */
    async getRoutineProgress(
        routineId: string,
        page = 1,
        limit = 10
    ): Promise<{ progress: RoutineProgress[]; total: number }> {
        const params = new URLSearchParams();
        const skip = (page - 1) * limit;
        params.append('skip', skip.toString());
        params.append('limit', limit.toString());

        const url = `${this.endpoints.progress(routineId)}?${params.toString()}`;
        return this.get(url);
    }

    /**
     * Record routine completion
     */
    async recordProgress(progress: ProgressCreateRequest): Promise<RoutineProgress> {
        return this.post<RoutineProgress>(
            this.endpoints.progress(progress.routine_id),
            progress
        );
    }

    /**
     * Get routine recommendations based on skin analysis
     */
    async getRoutineRecommendations(
        request: RoutineRecommendationRequest
    ): Promise<RoutineRecommendationResponse> {
        return this.post(this.endpoints.recommendations, request);
    }

    /**
     * Get routine statistics
     */
    async getRoutineStats(): Promise<RoutineStatsResponse> {
        return this.get<RoutineStatsResponse>(this.endpoints.stats);
    }

    /**
     * Helper: Get morning routines
     */
    async getMorningRoutines(activeOnly = true): Promise<RoutineListResponse> {
        return this.listRoutines('morning', activeOnly);
    }

    /**
     * Helper: Get evening routines
     */
    async getEveningRoutines(activeOnly = true): Promise<RoutineListResponse> {
        return this.listRoutines('evening', activeOnly);
    }

    /**
     * Helper: Activate routine
     */
    async activateRoutine(routineId: string): Promise<Routine> {
        return this.updateRoutine(routineId, { is_active: true });
    }

    /**
     * Helper: Deactivate routine
     */
    async deactivateRoutine(routineId: string): Promise<Routine> {
        return this.updateRoutine(routineId, { is_active: false });
    }

    /**
     * Helper: Quick routine completion (all steps)
     */
    async completeRoutine(
        routineId: string,
        totalTimeMinutes?: number,
        userNotes?: string,
        difficultyRating?: number
    ): Promise<RoutineProgress> {
        // Get routine details to create completed steps for all steps
        const routine = await this.getRoutine(routineId);

        const completedSteps: CompletedStep[] = routine.steps.map(step => ({
            step: step.step,
            completed_at: new Date().toISOString(),
            duration_seconds: step.duration_seconds
        }));

        return this.recordProgress({
            routine_id: routineId,
            completed_steps: completedSteps,
            total_time_minutes: totalTimeMinutes,
            user_notes: userNotes,
            difficulty_rating: difficultyRating
        });
    }

    /**
     * Debug routine database state
     */
    async debugRoutineState(): Promise<any> {
        try {
            const result = await this.get(this.endpoints.debug);
            console.log('🔍 Routine database state:', result);
            return result;
        } catch (error: any) {
            console.error('❌ Failed to get debug state:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const routinesApi = new RoutinesApiService(); 