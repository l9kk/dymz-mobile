/**
 * Supabase Client Configuration
 * Sets up Supabase with Google OAuth and secure token storage
 */

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
// Note: Removed expo-auth-session dependencies - using direct browser approach instead
import { Config } from '../config/env';

// Required for web compatibility
WebBrowser.maybeCompleteAuthSession();

// Custom storage adapter for Expo SecureStore
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        SecureStore.deleteItemAsync(key);
    },
};

// Create Supabase client with secure storage
export const supabase = createClient(
    Config.SUPABASE.URL,
    Config.SUPABASE.ANON_KEY,
    {
        auth: {
            storage: ExpoSecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false, // We'll handle this manually
            flowType: __DEV__ ? 'implicit' : 'pkce', // Use implicit flow in development
        },
        global: {
            headers: {
                'User-Agent': 'DymzAI-Mobile/1.0.0',
            },
        },
    }
);

// Create redirect URI for OAuth - use proper URL for development vs production
const redirectTo = Linking.createURL('/auth');

console.log('Supabase: Redirect URI:', redirectTo);
console.log('Supabase: App Scheme:', Config.APP.SCHEME);
console.log('Supabase: Environment:', __DEV__ ? 'Development' : 'Production');

// Create session from OAuth callback URL
const createSessionFromUrl = async (url: string) => {
    console.log('Supabase: Creating session from URL:', url);

    try {
        // Handle both fragment (#) and query (?) parameter formats
        let urlToParse = url;

        // If URL contains a fragment, extract it
        if (url.includes('#')) {
            const fragment = url.split('#')[1];
            urlToParse = `?${fragment}`;
        }

        console.log('Supabase: Parsing URL:', urlToParse);

        // Simple URL parameter parser to replace expo-auth-session dependency
        const parseUrlParams = (url: string) => {
            const params: { [key: string]: string } = {};
            const urlObj = new URL(url.startsWith('?') ? `https://dummy.com${url}` : url);
            urlObj.searchParams.forEach((value, key) => {
                params[key] = value;
            });
            return params;
        };

        const params = parseUrlParams(urlToParse);
        console.log('Supabase: Parsed params:', Object.keys(params));

        if (params.error) {
            console.error('Supabase: OAuth error in params:', params.error);
            throw new Error(params.error);
        }

        const { access_token, refresh_token, error, error_description } = params;

        // Check for error in params
        if (error) {
            console.error('Supabase: OAuth error in params:', error, error_description);
            throw new Error(error_description || error);
        }

        if (!access_token) {
            console.log('Supabase: No access token found in URL, checking for code...');
            console.log('Supabase: Available params:', params);

            // Sometimes OAuth returns a code instead of access_token
            if (params.code) {
                console.log('Supabase: Found authorization code, but we need access token');
                throw new Error('Authorization code received but access token expected. Check OAuth configuration.');
            }

            throw new Error('No access token found in OAuth callback');
        }

        console.log('Supabase: Setting session with access_token and refresh_token');
        const { data, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        });

        if (sessionError) {
            console.error('Supabase: Error setting session:', sessionError);
            throw sessionError;
        }

        console.log('Supabase: Session created successfully for user:', data.session?.user?.email);
        return data.session;
    } catch (error) {
        console.error('Supabase: Failed to create session from URL:', error);
        throw error;
    }
};

// Auth helper functions
export const authHelpers = {
    /**
     * Sign in with Google OAuth using WebBrowser
     */
    signInWithGoogle: async () => {
        try {
            console.log('=== SUPABASE OAUTH DEBUG START ===');
            console.log('Supabase: Starting Google OAuth with redirect:', redirectTo);
            console.log('Supabase: App Scheme:', Config.APP.SCHEME);
            console.log('Supabase: Supabase URL:', Config.SUPABASE.URL);
            console.log('Supabase: Google Client ID:', Config.GOOGLE_AUTH.CLIENT_ID ? 'Set' : 'Missing');

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                    scopes: 'openid email profile',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                console.error('Supabase: OAuth initiation error:', error);
                throw error;
            }

            if (!data?.url) {
                throw new Error('No OAuth URL returned from Supabase');
            }

            console.log('Supabase: OAuth URL generated successfully');
            console.log('Supabase: Opening OAuth URL in browser...');

            // Use direct browser opening instead of deprecated auth session proxy
            // Set up deep link listener first
            const redirectPromise = new Promise<string>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Authentication session timeout - please try again'));
                }, 300000); // 5 minutes timeout

                const linkingSubscription = Linking.addEventListener('url', (event) => {
                    console.log('Supabase: Deep link received:', event.url);
                    // Handle both development (exp://) and production (custom scheme) URLs
                    const isAuthCallback = event.url.includes('/auth') ||
                        event.url.includes('access_token') ||
                        event.url.startsWith(Config.APP.SCHEME);

                    if (isAuthCallback) {
                        console.log('Supabase: Auth callback detected');
                        clearTimeout(timeout);
                        linkingSubscription?.remove();
                        resolve(event.url);
                    }
                });
            });

            // Open browser without proxy service
            const browserResult = await WebBrowser.openBrowserAsync(data.url);
            console.log('Supabase: Browser opened with result:', browserResult.type);

            if (browserResult.type === 'cancel') {
                console.log('Supabase: User cancelled authentication');
                console.log('=== SUPABASE OAUTH DEBUG END - CANCELLED ===');
                return { data: null, error: 'Authentication cancelled by user' };
            }

            // Wait for the deep link callback
            const callbackUrl = await redirectPromise;
            const result = { type: 'success' as const, url: callbackUrl };
            console.log('Supabase: Browser result type:', result.type);
            console.log('Supabase: Browser result URL:', result.type === 'success' ? result.url : 'N/A');

            if (result.type === 'success') {
                console.log('Supabase: OAuth browser success, processing callback...');

                try {
                    const session = await createSessionFromUrl(result.url);
                    if (session) {
                        console.log('Supabase: Authentication completed successfully');
                        console.log('Supabase: User email:', session.user?.email);
                        console.log('=== SUPABASE OAUTH DEBUG END - SUCCESS ===');
                        return { data: { session }, error: null };
                    } else {
                        throw new Error('Session creation returned null');
                    }
                } catch (sessionError) {
                    console.error('Supabase: Session creation failed:', sessionError);
                    const errorMessage = sessionError instanceof Error ? sessionError.message : 'Session creation failed';
                    console.log('=== SUPABASE OAUTH DEBUG END - SESSION ERROR ===');
                    return { data: null, error: `Session creation failed: ${errorMessage}` };
                }
            } else {
                console.log('Supabase: Unexpected result type:', result);
                console.log('=== SUPABASE OAUTH DEBUG END - UNEXPECTED ===');
                return { data: null, error: `Authentication failed: ${JSON.stringify(result)}` };
            }
        } catch (error) {
            console.error('Supabase: Google sign in exception:', error);
            console.log('=== SUPABASE OAUTH DEBUG END - EXCEPTION ===');
            const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Sign out current user
     */
    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Sign out error:', error);
            return { error };
        }
    },

    /**
     * Get current session
     */
    getSession: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session, error: null };
        } catch (error) {
            console.error('Get session error:', error);
            return { session: null, error };
        }
    },

    /**
     * Get current user
     */
    getCurrentUser: async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            return { user, error: null };
        } catch (error) {
            console.error('Get user error:', error);
            return { user: null, error };
        }
    },

    /**
     * Handle deep link OAuth callback
     */
    handleDeepLink: async (url: string) => {
        try {
            console.log('Supabase: Handling deep link:', url);

            // Check if this is an OAuth callback
            if (url.includes('access_token') || url.includes('error')) {
                const session = await createSessionFromUrl(url);
                return { session, error: null };
            }

            return { session: null, error: null };
        } catch (error) {
            console.error('Supabase: Deep link handling error:', error);
            return { session: null, error };
        }
    },

    /**
     * Sign up with email and password
     */
    signUpWithEmail: async (email: string, password: string, options?: {
        redirectTo?: string;
        data?: object;
    }) => {
        try {
            console.log('Supabase: Starting email signup for:', email);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: options?.redirectTo,
                    data: options?.data,
                },
            });

            if (error) {
                console.error('Supabase: Email signup error:', error);
                throw error;
            }

            console.log('Supabase: Email signup successful');
            return { data, error: null };
        } catch (error) {
            console.error('Supabase: Email signup exception:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign up with email';
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Sign in with email and password
     */
    signInWithEmail: async (email: string, password: string) => {
        try {
            console.log('Supabase: Starting email signin for:', email);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Supabase: Email signin error:', error);
                throw error;
            }

            console.log('Supabase: Email signin successful');
            return { data, error: null };
        } catch (error) {
            console.error('Supabase: Email signin exception:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with email';
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Sign in with magic link (passwordless)
     */
    signInWithMagicLink: async (email: string, options?: { redirectTo?: string }) => {
        try {
            console.log('Supabase: Starting magic link signin for:', email);

            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: options?.redirectTo,
                    shouldCreateUser: true,
                },
            });

            if (error) {
                console.error('Supabase: Magic link error:', error);
                throw error;
            }

            console.log('Supabase: Magic link sent successfully');
            return { data, error: null };
        } catch (error) {
            console.error('Supabase: Magic link exception:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to send magic link';
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Sign in with email OTP
     */
    signInWithOTP: async (email: string, options?: { shouldCreateUser?: boolean }) => {
        try {
            console.log('Supabase: Starting OTP signin for:', email);

            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: options?.shouldCreateUser ?? true,
                },
            });

            if (error) {
                console.error('Supabase: OTP signin error:', error);
                throw error;
            }

            console.log('Supabase: OTP sent successfully');
            return { data, error: null };
        } catch (error) {
            console.error('Supabase: OTP signin exception:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Verify OTP code
     */
    verifyOTP: async (email: string, token: string) => {
        try {
            console.log('Supabase: Verifying OTP for:', email);

            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email',
            });

            if (error) {
                console.error('Supabase: OTP verification error:', error);
                throw error;
            }

            console.log('Supabase: OTP verification successful');
            return { data, error: null };
        } catch (error) {
            console.error('Supabase: OTP verification exception:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Reset password with email
     */
    resetPassword: async (email: string, options?: { redirectTo?: string }) => {
        try {
            console.log('Supabase: Starting password reset for:', email);

            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: options?.redirectTo,
            });

            if (error) {
                console.error('Supabase: Password reset error:', error);
                throw error;
            }

            console.log('Supabase: Password reset email sent successfully');
            return { data, error: null };
        } catch (error) {
            console.error('Supabase: Password reset exception:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Update password (for authenticated users)
     */
    updatePassword: async (password: string) => {
        try {
            console.log('Supabase: Updating password');

            const { data, error } = await supabase.auth.updateUser({
                password,
            });

            if (error) {
                console.error('Supabase: Password update error:', error);
                throw error;
            }

            console.log('Supabase: Password updated successfully');
            return { data, error: null };
        } catch (error) {
            console.error('Supabase: Password update exception:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Resend email confirmation
     */
    resendConfirmation: async (email: string, options?: { redirectTo?: string }) => {
        try {
            console.log('Supabase: Resending confirmation email for:', email);

            const { data, error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: options?.redirectTo,
                },
            });

            if (error) {
                console.error('Supabase: Resend confirmation error:', error);
                throw error;
            }

            console.log('Supabase: Confirmation email resent successfully');
            return { data, error: null };
        } catch (error) {
            console.error('Supabase: Resend confirmation exception:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to resend confirmation email';
            return { data: null, error: errorMessage };
        }
    },
};

// Auth state change listener
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};

export default supabase; 