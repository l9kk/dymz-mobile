/**
 * Environment Configuration
 * Centralized configuration for API endpoints, authentication, and app settings
 */

// Helper to detect if we're in development mode
const isDevelopment = __DEV__;

// Helper to get local network IP for development
const getLocalAPIUrl = () => {
    // In development, try to detect if we're using a local backend
    // This should be set in .env file with your actual local IP
    const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    if (envUrl && envUrl !== 'http://localhost:8000') {
        return envUrl;
    }

    // Fallback URLs for development testing
    const possibleUrls = [
        'http://192.168.1.100:8000', // Common local network
        'http://10.0.0.100:8000',    // Another common range
        'http://172.16.0.100:8000',  // Corporate networks
    ];

    // Return the first available or default to localhost (will fail on mobile)
    return envUrl || possibleUrls[0];
};

export const Config = {
    // API Configuration
    API: {
        BASE_URL: isDevelopment
            ? getLocalAPIUrl()
            : (process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.dymz.app'),
        VERSION: 'v1',
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000, // 1 second
    },

    // Supabase Configuration
    SUPABASE: {
        URL: process.env.EXPO_PUBLIC_SUPABASE_URL!,
        ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    },

    // Google OAuth Configuration
    GOOGLE_AUTH: {
        CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
        WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
    },

    // App Configuration
    APP: {
        SCHEME: process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME || 'dymz',
        DEBUG: process.env.EXPO_PUBLIC_DEBUG === 'true' || isDevelopment,
        ENABLE_MOCK_DATA: process.env.EXPO_PUBLIC_ENABLE_MOCK_DATA === 'true' || false,
        LOG_LEVEL: process.env.EXPO_PUBLIC_LOG_LEVEL || (isDevelopment ? 'debug' : 'error'),
    },

    // Network Configuration
    NETWORK: {
        HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
        CONNECTION_TIMEOUT: 10000, // 10 seconds
        ENABLE_OFFLINE_MODE: true,
    },

    // API Endpoints
    ENDPOINTS: {
        // Health
        HEALTH: '/api/v1/health',
        TEST_DB: '/api/v1/test-db',

        // Authentication
        AUTH_GOOGLE: '/api/v1/auth/google',

        // User Management
        USER_PROFILE: '/api/v1/users/profile',
        USER_ONBOARDING: '/api/v1/users/onboarding',
        USER_DEVICE_TOKEN: '/api/v1/users/device-token',
        USER_CHECK_IN: '/api/v1/users/check-in',
        USER_STATS: '/api/v1/users/stats',

        // Analysis
        ANALYSIS: '/api/v1/analysis',
        ANALYSIS_LATEST: '/api/v1/analysis/latest',
        ANALYSIS_STATUS: (id: string) => `/api/v1/analysis/${id}/status`,

        // Products
        PRODUCTS: '/api/v1/products/',
        PRODUCTS_RECOMMENDATIONS: '/api/v1/products/recommendations',
        PRODUCTS_SEARCH: '/api/v1/products/search',
        PRODUCTS_CATEGORIES: '/api/v1/products/categories',
        PRODUCTS_BRANDS: '/api/v1/products/brands',

        // Routines
        ROUTINES: '/api/v1/routines/',
        ROUTINES_ACTIVE: '/api/v1/routines/active',
        ROUTINES_RECOMMENDATIONS: '/api/v1/routines/recommendations',
        ROUTINES_STATS: '/api/v1/routines/stats',

        // Analytics
        ANALYTICS_OVERVIEW: '/api/v1/analytics/overview',
        ANALYTICS_PROGRESS: '/api/v1/analytics/progress',
        ANALYTICS_BEFORE_AFTER: '/api/v1/analytics/before-after',
        ANALYTICS_SUMMARY: '/api/v1/analytics/summary',

        // Recommendations
        RECOMMENDATIONS_PRODUCTS: '/api/v1/recommendations/products',
        RECOMMENDATIONS_ROUTINES: '/api/v1/recommendations/routines',
        RECOMMENDATIONS_PERSONALIZED: '/api/v1/recommendations/personalized',

        // Gamification
        GAMIFICATION_STREAKS: '/api/v1/gamification/streaks',
        GAMIFICATION_BADGES: '/api/v1/gamification/badges',
        GAMIFICATION_ACHIEVEMENTS: '/api/v1/gamification/achievements',
        GAMIFICATION_STATS: '/api/v1/gamification/stats',

        // Notifications
        NOTIFICATIONS_DEVICE_TOKEN: '/api/v1/notifications/device-token',
        NOTIFICATIONS_PREFERENCES: '/api/v1/notifications/preferences',
        NOTIFICATIONS_TEST: '/api/v1/notifications/test',
    },
} as const;

// Type-safe environment validation
export const validateEnvironment = () => {
    const requiredVars = [
        'EXPO_PUBLIC_SUPABASE_URL',
        'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    ];

    const missing = requiredVars.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file or Expo environment configuration.'
        );

        if (Config.APP.DEBUG) {
            console.warn('Running with incomplete environment configuration');
        }
    }

    // Log current configuration in debug mode
    if (Config.APP.DEBUG) {
        console.log('🔧 Environment Configuration:', {
            apiBaseUrl: Config.API.BASE_URL,
            isDevelopment,
            enableMockData: Config.APP.ENABLE_MOCK_DATA,
            logLevel: Config.APP.LOG_LEVEL,
        });
    }
};

// Helper to get full API URL
export const getApiUrl = (endpoint: string): string => {
    return `${Config.API.BASE_URL}${endpoint}`;
};

// Helper to check if backend is reachable
export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), Config.NETWORK.CONNECTION_TIMEOUT);

        const response = await fetch(getApiUrl(Config.ENDPOINTS.HEALTH), {
            method: 'GET',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.warn('Backend health check failed:', error);
        return false;
    }
};

// Network status helpers
export const getNetworkConfig = () => ({
    isLocalhost: Config.API.BASE_URL.includes('localhost'),
    isLocal: Config.API.BASE_URL.includes('192.168') ||
        Config.API.BASE_URL.includes('10.0') ||
        Config.API.BASE_URL.includes('172.16'),
    isDevelopmentAPI: isDevelopment,
    shouldUseMockData: Config.APP.ENABLE_MOCK_DATA,
}); 