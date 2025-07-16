/**
 * API Service Layer
 * Handles all HTTP communications with the backend API
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Config, getApiUrl, getNetworkConfig } from '../config/env';
import { supabase } from '../lib/supabase';

// API Response types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
}

// ApiError moved to types/api.ts to avoid duplication
import type { ApiError } from '../types/api';

// Network status tracking
let isOnline = true;
let lastHealthCheck = 0;
const HEALTH_CHECK_CACHE_DURATION = 30000; // 30 seconds

// Create Axios instance
const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: Config.API.BASE_URL,
        timeout: Config.API.TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'DymzAI-Mobile/1.0.0',
        },
    });

    // Request interceptor - Add auth token and network validation
    client.interceptors.request.use(
        async (config) => {
            try {
                // Network configuration check
                const networkConfig = getNetworkConfig();

                // Warn about localhost usage on mobile
                if (networkConfig.isLocalhost && Config.APP.DEBUG) {
                    console.warn('⚠️  API configured for localhost - this will not work on physical devices');
                }

                // Get current session from Supabase
                const { data: { session } } = await supabase.auth.getSession();

                // Check if we have a valid session
                if (session?.access_token && session.expires_at) {
                    const now = Math.floor(Date.now() / 1000);
                    const secondsUntilExpiry = session.expires_at - now;

                    // If token is expired or expiring soon (within 60 seconds), refresh it
                    if (secondsUntilExpiry < 60) {
                        if (Config.APP.DEBUG) {
                            console.log('🔄 Supabase token expiring soon, refreshing...');
                        }

                        try {
                            const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();

                            if (!refreshError && refreshed.session?.access_token) {
                                if (Config.APP.DEBUG) {
                                    console.log('✅ Token refreshed successfully');
                                }
                                config.headers.Authorization = `Bearer ${refreshed.session.access_token}`;
                            } else {
                                if (Config.APP.DEBUG) {
                                    console.warn('⚠️ Token refresh failed (pre-request):', refreshError?.message);
                                }
                                // Use the existing token even if refresh failed
                                config.headers.Authorization = `Bearer ${session.access_token}`;
                            }
                        } catch (refreshError) {
                            console.error('Token refresh exception:', refreshError);
                            // Use the existing token as fallback
                            config.headers.Authorization = `Bearer ${session.access_token}`;
                        }
                    } else {
                        // Token is still valid, use it
                        config.headers.Authorization = `Bearer ${session.access_token}`;
                    }
                }

                // Log request in debug mode
                if (Config.APP.DEBUG) {
                    console.log('🔵 API Request:', {
                        method: config.method?.toUpperCase(),
                        url: config.url,
                        baseURL: config.baseURL,
                        headers: config.headers,
                        data: config.data ? '(data present)' : '(no data)',
                    });
                }

                return config;
            } catch (error) {
                console.error('Request interceptor error:', error);
                return config;
            }
        },
        (error) => {
            console.error('Request interceptor error:', error);
            return Promise.reject(error);
        }
    );

    // Response interceptor - Handle responses and errors
    client.interceptors.response.use(
        (response: AxiosResponse) => {
            // Mark as online if we get a successful response
            isOnline = true;

            // Log successful responses in debug mode
            if (Config.APP.DEBUG) {
                console.log('🟢 API Response:', {
                    status: response.status,
                    url: response.config.url,
                    data: response.data ? '(data received)' : '(no data)',
                });
            }

            return response;
        },
        async (error) => {
            const apiError = createApiError(error);

            // Log errors in debug mode
            if (Config.APP.DEBUG) {
                console.error('🔴 API Error:', {
                    status: apiError.status,
                    url: error.config?.url,
                    message: apiError.message,
                    code: apiError.code,
                    isNetworkError: apiError.isNetworkError,
                    isRetryable: apiError.isRetryable,
                });
            }

            // Handle network errors
            if (apiError.isNetworkError) {
                isOnline = false;

                // Provide helpful development messages
                if (Config.APP.DEBUG) {
                    const networkConfig = getNetworkConfig();
                    if (networkConfig.isLocalhost) {
                        console.error(`
🚨 Network Error - Development Issue Detected:
   The API is configured for localhost (${Config.API.BASE_URL})
   This will not work on mobile devices or simulators.
   
   Solutions:
   1. Set EXPO_PUBLIC_API_BASE_URL to your computer's IP address
   2. Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
   3. Example: EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000
   4. Make sure your backend is running on your computer
                        `);
                    }
                }
            }

            // Handle 401 Unauthorized - refresh token or logout
            if (error.response?.status === 401 && !error.config?._retry) {
                console.log('🔄 401 error - attempting token refresh...');

                try {
                    // Mark this request as retried to prevent infinite loops
                    error.config._retry = true;

                    // Attempt to refresh the session
                    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();

                    if (!refreshError && refreshed.session?.access_token) {
                        console.log('✅ Token refresh successful, retrying request...');

                        // Update the Authorization header with the new token
                        error.config.headers.Authorization = `Bearer ${refreshed.session.access_token}`;

                        // Retry the original request
                        return client(error.config);
                    } else {
                        console.log('❌ Token refresh failed, redirecting to login...');

                        // Clear the session if refresh failed
                        await supabase.auth.signOut();

                        // Reject with a clear error message
                        return Promise.reject(new Error('Authentication failed - please log in again'));
                    }
                } catch (refreshError) {
                    console.error('Token refresh exception:', refreshError);

                    // Clear the session on refresh failure
                    await supabase.auth.signOut();

                    return Promise.reject(new Error('Authentication failed - please log in again'));
                }
            }

            return Promise.reject(apiError);
        }
    );

    return client;
};

// Create API error from axios error
const createApiError = (error: any): ApiError => {
    if (error.response) {
        // Server responded with error status
        return {
            message: error.response.data?.message || error.response.data?.detail || 'Server error',
            status: error.response.status,
            code: error.response.data?.code,
            details: error.response.data,
            isNetworkError: false,
            isRetryable: error.response.status >= 500, // Retry server errors
        };
    } else if (error.request) {
        // Network error - no response received
        const networkConfig = getNetworkConfig();
        let message = 'Network error - please check your connection';

        if (networkConfig.isLocalhost) {
            message = 'Cannot connect to localhost from mobile device. Please configure API_BASE_URL with your computer\'s IP address.';
        } else if (networkConfig.isLocal) {
            message = 'Cannot connect to local development server. Please ensure the backend is running and accessible.';
        }

        return {
            message,
            status: 0,
            code: 'NETWORK_ERROR',
            isNetworkError: true,
            isRetryable: true,
        };
    } else {
        // Other error
        return {
            message: error.message || 'Unknown error',
            status: 0,
            code: 'UNKNOWN_ERROR',
            isNetworkError: false,
            isRetryable: false,
        };
    }
};

// Create API client instance
export const apiClient = createApiClient();

// API Service class with enhanced error handling
export class ApiService {
    private client: AxiosInstance;

    constructor(client: AxiosInstance = apiClient) {
        this.client = client;
    }

    // Network status check
    async isBackendReachable(): Promise<boolean> {
        const now = Date.now();

        // Use cached result if recent
        if (now - lastHealthCheck < HEALTH_CHECK_CACHE_DURATION) {
            return isOnline;
        }

        try {
            const response = await this.client.get(Config.ENDPOINTS.HEALTH, {
                timeout: Config.NETWORK.CONNECTION_TIMEOUT,
            });
            isOnline = response.status === 200;
            lastHealthCheck = now;
            return isOnline;
        } catch (error) {
            isOnline = false;
            lastHealthCheck = now;
            return false;
        }
    }

    // Generic request with retry logic
    private async requestWithRetry<T>(
        requestFn: () => Promise<T>,
        maxRetries = Config.API.RETRY_ATTEMPTS
    ): Promise<T> {
        let lastError: ApiError;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await requestFn();
            } catch (error: any) {
                lastError = error;

                // Don't retry non-retryable errors
                if (!error.isRetryable || attempt === maxRetries - 1) {
                    throw error;
                }

                // Wait before retry
                await new Promise(resolve =>
                    setTimeout(resolve, Config.API.RETRY_DELAY * (attempt + 1))
                );

                if (Config.APP.DEBUG) {
                    console.log(`🔄 Retrying request (attempt ${attempt + 2}/${maxRetries})`);
                }
            }
        }

        throw lastError!;
    }

    // Generic GET request
    async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        return this.requestWithRetry(async () => {
            const response = await this.client.get<T>(endpoint, config);
            return response.data;
        });
    }

    // Generic POST request
    async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.requestWithRetry(async () => {
            const response = await this.client.post<T>(endpoint, data, config);
            return response.data;
        });
    }

    // Generic PUT request
    async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.requestWithRetry(async () => {
            const response = await this.client.put<T>(endpoint, data, config);
            return response.data;
        });
    }

    // Generic DELETE request
    async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        return this.requestWithRetry(async () => {
            const response = await this.client.delete<T>(endpoint, config);
            return response.data;
        });
    }

    // File upload with progress tracking and enhanced error handling
    async uploadFile<T>(
        endpoint: string,
        file: {
            uri: string;
            name: string;
            type: string;
        },
        additionalData?: Record<string, any>,
        onProgress?: (progress: number) => void
    ): Promise<T> {
        console.log('🚀 Starting file upload process...');

        // Check backend reachability before upload
        const isReachable = await this.isBackendReachable();
        if (!isReachable) {
            console.error('🔴 Backend not reachable');
            throw createApiError({
                request: true,
                message: 'Backend is not reachable. Please check your connection and API configuration.'
            });
        }
        console.log('✅ Backend is reachable');

        const formData = new FormData();

        // Add file to form data - React Native compatible format
        // Use simple file type detection based on extension or default to jpeg
        const getFileType = (uri: string, providedType?: string): string => {
            if (providedType) return providedType;

            const extension = uri.toLowerCase().split('.').pop();
            switch (extension) {
                case 'jpg':
                case 'jpeg':
                    return 'image/jpeg';
                case 'png':
                    return 'image/png';
                case 'gif':
                    return 'image/gif';
                case 'webp':
                    return 'image/webp';
                default:
                    return 'image/jpeg'; // Default fallback
            }
        };

        const fileType = getFileType(file.uri, file.type);

        console.log('📁 Preparing file for upload:', {
            uri: file.uri,
            name: file.name,
            originalType: file.type,
            resolvedType: fileType
        });

        // For React Native, don't set Content-Type header manually
        // Format the file object properly for React Native
        formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: fileType,
        } as any);

        // Add additional data if provided
        if (additionalData) {
            console.log('📋 Adding additional data:', additionalData);
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }

        const config: AxiosRequestConfig = {
            timeout: 60000, // Longer timeout for uploads
            headers: {
                'Content-Type': 'multipart/form-data', // override JSON default
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    console.log(`📤 Upload progress: ${progress.toFixed(1)}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
                    onProgress?.(progress);
                } else {
                    console.log(`📤 Upload progress: ${progressEvent.loaded} bytes uploaded (total unknown)`);
                    onProgress?.(0);
                }
            },
        };

        try {
            console.log('🔵 Initiating HTTP request to:', `${this.client.defaults.baseURL}${endpoint}`);

            // Don't use retry for uploads as they might be heavy
            const response = await this.client.post<T>(endpoint, formData, config);

            console.log('✅ File upload successful:', {
                status: response.status,
                statusText: response.statusText,
                dataAvailable: !!response.data,
                responseData: response.data
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ File upload failed with detailed error info:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data,
                requestConfig: {
                    url: error.config?.url,
                    method: error.config?.method,
                    timeout: error.config?.timeout
                },
                isNetworkError: !error.response,
                errorCode: error.code
            });
            throw error;
        }
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return this.get(Config.ENDPOINTS.HEALTH);
    }

    // Test database connection (useful for development)
    async testDatabase(): Promise<any> {
        return this.get(Config.ENDPOINTS.TEST_DB);
    }
}

// Export singleton instance
export const api = new ApiService();

// Export individual methods for convenience
export const { get, post, put, delete: del, uploadFile, healthCheck } = api;

// Note: API services are imported directly from their files to avoid circular dependencies
// Example: import { analysisApi } from './analysisApi';
// This prevents circular imports between api.ts and individual service files

// Re-export common types
export type {
    UUID,
    PaginationParams,
    PaginatedResponse,
    ApiError,
    FileUpload
} from '../types/api'; 