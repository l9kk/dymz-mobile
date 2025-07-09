/**
 * API Types
 * TypeScript interfaces for all API requests and responses
 * Based on OpenAPI specification and backend documentation
 */

// ============================================================================
// Common Types
// ============================================================================

export type UUID = string;

export interface PaginationParams {
    skip?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

export interface User {
    id: UUID;
    email: string;
    email_confirmed_at?: string;
    created_at: string;
    updated_at: string;
    user_metadata?: {
        name?: string;
        avatar_url?: string;
        provider?: string;
    };
}

// ============================================================================
// User Profile Types
// ============================================================================

export interface UserProfile {
    id: UUID;
    created_at: string;
    updated_at: string;
    user_id: UUID;
    display_name?: string;
    timezone: string;
    preferences?: UserPreferences;
    notification_settings?: NotificationSettings;
    game_metrics?: GameMetrics;
    onboarding_completed: boolean;
    last_analysis_date?: string;
    last_check_in_date?: string;
}

export interface UserPreferences {
    skin_type?: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
    skin_concerns?: string[];
    budget_range?: 'budget' | 'mid_range' | 'luxury';
    routine_time_morning?: string; // HH:MM format
    routine_time_evening?: string; // HH:MM format
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
    profile_completion_score: number; // 0.0-1.0
}

export interface OnboardingData {
    display_name?: string;
    timezone?: string;
    preferences: UserPreferences;
    notification_settings: NotificationSettings;
}

// ============================================================================
// Analysis Types
// ============================================================================

export interface Analysis {
    id: UUID;
    created_at: string;
    updated_at: string;
    user_id: UUID;
    image_url: string;
    image_filename: string;
    status: AnalysisStatus;
    error_message?: string;
    skin_metrics?: SkinMetrics;
    processing_duration?: string;
    model_version?: string;
}

export type AnalysisStatus = 'processing' | 'completed' | 'failed';

export interface SkinMetrics {
    overall_skin_type?: string;
    skin_conditions?: string[];
    metrics?: Record<string, MetricScore>;
    recommendations?: string[];
    confidence_score?: number; // 0.0-1.0
    analysis_date?: string;
    regions_analyzed?: string[];
    analysis_notes?: string;
    model_version?: string;
}

export interface MetricScore {
    level: string;
    score: number; // 0.0-1.0
    confidence: number; // 0.0-1.0
}

export interface AnalysisCreateResponse {
    message: string;
    analysis_id: UUID;
    status: AnalysisStatus;
    task_id: string;
}

export interface AnalysisStatusResponse {
    analysis_id: UUID;
    status: AnalysisStatus;
    progress?: number; // 0-100
    estimated_completion?: string;
    error_message?: string;
}

export interface AnalysisListResponse {
    analyses: Analysis[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
    id: UUID;
    created_at: string;
    updated_at: string;
    name: string;
    brand: string;
    category: string;
    description?: string;
    product_url?: string;
    image_url?: string;
    price?: number;
    currency?: string;
    size?: string;
    ingredients?: ProductIngredients;
    rating?: number; // 0.0-5.0
    review_count?: number;
    availability: string;
    source: string;
}

export interface ProductIngredients {
    active_ingredients?: string[];
    full_ingredients?: string[];
    skin_types?: string[];
    concerns?: string[];
}

// Moved to updated section below - this duplicate will be removed

export interface ProductRecommendationResponse {
    analysis_id: UUID;
    recommendations: RecommendedProduct[];
    total_found: number;
    criteria_used: Record<string, any>;
    generated_at: string;
}

export interface ProductRecommendation {
    product: Product;
    match_score: number; // 0.0-1.0
    match_reasons: string[];
    category_rank: number;
    routine_step?: string; // 'morning' | 'evening' | 'both'
}

export interface ProductSearchParams {
    query?: string;
    category?: string;
    brand?: string;
    skin_type?: string;
    concerns?: string[];
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'popularity';
    skip?: number;
    limit?: number;
}

// ============================================================================
// Routine Types
// ============================================================================

export interface Routine {
    id: UUID;
    created_at: string;
    updated_at: string;
    user_id: UUID;
    name: string;
    routine_type: 'morning' | 'evening';
    steps: RoutineStep[];
    is_active: boolean;
    analysis_id?: UUID;
    estimated_duration_minutes: number;
    notes?: string;
}

export interface RoutineStep {
    step: string;
    product_id?: UUID;
    duration_seconds: number;
    order: number;
    instructions?: string;
    optional: boolean;
}

export interface RoutineRecommendationRequest {
    analysis_id: UUID;
    routine_type: 'morning' | 'evening';
    budget_range?: 'budget' | 'mid_range' | 'luxury';
    time_preference?: 'quick' | 'normal' | 'thorough';
    preferred_brands?: string[];
    exclude_ingredients?: string[];
}

export interface RoutineRecommendationResponse {
    analysis_id: UUID;
    recommendations: RecommendedRoutine[];
    criteria_used: Record<string, any>;
    generated_at: string;
}

export interface RoutineCreateRequest {
    name: string;
    routine_type: 'morning' | 'evening';
    steps: RoutineStep[];
    analysis_id?: UUID;
    notes?: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface ProgressMetrics {
    timeframe: string;
    start_date: string;
    end_date: string;
    metrics: {
        skin_improvement_score: number; // 0.0-1.0
        routine_adherence: number; // 0.0-1.0
        consistency_score: number; // 0.0-1.0
        product_satisfaction: number; // 0.0-1.0
    };
    improvements: {
        [metric: string]: {
            current_score: number;
            previous_score: number;
            change_percentage: number;
            trend: 'improving' | 'stable' | 'declining';
        };
    };
    milestones_achieved: string[];
    recommendations: string[];
}

export interface InsightResponse {
    insights: {
        key_improvements: string[];
        areas_for_focus: string[];
        product_effectiveness: {
            most_effective: Product[];
            least_effective: Product[];
        };
        routine_optimization: string[];
        skin_trend_analysis: {
            trend: 'improving' | 'stable' | 'declining';
            factors: string[];
            recommendations: string[];
        };
    };
    generated_at: string;
    period_analyzed: string;
}

// ============================================================================
// Gamification Types
// ============================================================================

export interface StreakResponse {
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string;
    next_milestone: number;
    completed_both_today: boolean;
}

export interface GamificationStats {
    user_id: string;
    total_points: number;
    user_level: number;
    total_analyses: number;
    routines_completed: number;
    days_active: number;
    longest_streak: number;
    rank_percentile: number;
    improvement_score: number;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface NotificationRequest {
    user_ids?: UUID[];
    title: string;
    body: string;
    data?: Record<string, any>;
    scheduled_for?: string;
    notification_type: 'reminder' | 'tip' | 'streak_milestone' | 'progress_update' | 'general';
}

export interface NotificationResponse {
    message: string;
    notifications_sent: number;
    failed_sends: number;
    notification_id?: UUID;
}

// ============================================================================
// Health Check Types
// ============================================================================

export interface HealthResponse {
    status: string;
    timestamp: string;
    version?: string;
    database_status?: string;
    external_services?: Record<string, string>;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: any;
    validation_errors?: ValidationError[];
    isNetworkError?: boolean;
    isRetryable?: boolean;
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

// ============================================================================
// Request Types
// ============================================================================

export interface FileUpload {
    uri: string;
    name: string;
    type: string;
}

export interface AnalysisUploadRequest {
    file: FileUpload;
    analysis_type?: string;
    additional_notes?: string;
}

// ============================================================================
// Analytics Types (New from OpenAPI)
// ============================================================================

export interface ProgressAnalyticsResponse {
    analysis_period_days: number;
    total_analyses: number;
    overall_improvement_percentage: number;
    metric_trends: SkinMetricTrend[];
    first_analysis_date: string;
    latest_analysis_date: string;
}

export interface SkinMetricTrend {
    metric_name: string;
    improvement_percentage: number;
    current_value: number;
    initial_value: number;
    trend_direction: 'improving' | 'declining' | 'stable';
}

export interface BeforeAfterComparison {
    before_analysis_id: string;
    after_analysis_id: string;
    before_image_url?: string;
    after_image_url?: string;
    before_date: string;
    after_date: string;
    days_between: number;
    metric_improvements: Record<string, any>[];
}

export interface ImprovementSummary {
    total_analyses: number;
    journey_start_date: string;
    journey_days: number;
    overall_improvement_score: number;
    improvement_category: string;
    most_recent_analysis_date: string;
}

// ============================================================================
// Notifications Types (New from OpenAPI)  
// ============================================================================

export interface NotificationPreferencesResponse {
    reminders_enabled: boolean;
    tips_enabled: boolean;
    streak_notifications: boolean;
    analysis_notifications: boolean;
    marketing_notifications: boolean;
    device_tokens_registered: number;
}

export interface NotificationPreferencesRequest {
    reminders_enabled?: boolean;
    tips_enabled?: boolean;
    streak_notifications?: boolean;
    analysis_notifications?: boolean;
    marketing_notifications?: boolean;
}

export interface DeviceTokenRequest {
    fcm_token?: string;
    apns_token?: string;
    device_type: string;
    device_id: string;
}

export interface TestNotificationRequest {
    title: string;
    body: string;
    notification_type?: 'routine_reminder' | 'analysis_complete' | 'streak_milestone' | 'product_recommendation' | 'skincare_tip' | 'weekly_summary';
}

// ============================================================================
// Recommendations Types (New from OpenAPI)
// ============================================================================

export interface RecommendationRequest {
    limit?: number;
    max_budget?: number;
    skin_concerns?: string[];
}

export interface PersonalizedRecommendations {
    user_id: string;
    product_recommendations: ProductRecommendationResponse;
    routine_recommendations: RoutineRecommendationResponse;
    primary_skin_concerns: string[];
    generated_at?: string;
}

// ============================================================================
// Updated User Profile Types (Align with OpenAPI)
// ============================================================================

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

// ============================================================================
// Updated Product Types (Enhanced recommendation responses)
// ============================================================================

export interface RecommendedProduct {
    id: UUID;
    created_at: string;
    updated_at: string;
    name: string;
    brand: string;
    category: string;
    description?: string;
    product_url?: string;
    image_url?: string;
    price?: number;
    currency: string;
    size?: string;
    ingredients?: ProductIngredients;
    rating?: number;
    review_count?: number;
    availability: string;
    source: string;
    recommendation_score: number;
    recommendation_reason: string;
    matches_criteria: string[];
}

export interface ProductRecommendationRequest {
    analysis_id: UUID;
    budget_range?: 'budget' | 'mid_range' | 'luxury';
    preferred_brands?: string[];
    exclude_ingredients?: string[];
    routine_step?: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment';
    max_products?: number;
}

// ============================================================================
// Updated Routine Types (Enhanced recommendation responses)
// ============================================================================

export interface RecommendedRoutine {
    name: string;
    routine_type: string;
    steps: RoutineStep[];
    estimated_duration_minutes: number;
    recommendation_reason: string;
    confidence_score: number;
    total_estimated_cost?: number;
} 