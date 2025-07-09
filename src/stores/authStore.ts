/**
 * Authentication Store
 * Zustand store for managing authentication state and user session
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Session, User } from '@supabase/supabase-js';
import { supabase, authHelpers, onAuthStateChange } from '../lib/supabase';

// User profile interface based on backend schema
export interface UserProfile {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    display_name?: string;
    timezone: string;
    preferences?: {
        skin_type?: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
        skin_concerns?: string[];
        budget_range?: 'budget' | 'mid_range' | 'luxury';
        routine_time_morning?: string;
        routine_time_evening?: string;
    };
    notification_settings?: {
        notification_enabled: boolean;
        reminders: boolean;
        tips: boolean;
        progress_updates: boolean;
        streak_alerts: boolean;
    };
    game_metrics?: {
        current_streak: number;
        longest_streak: number;
        total_check_ins: number;
        achievements: string[];
        profile_completion_score: number;
    };
    onboarding_completed: boolean;
    last_analysis_date?: string;
    last_check_in_date?: string;
}

// Authentication state interface
export interface AuthState {
    // Auth status
    isLoading: boolean;
    isAuthenticated: boolean;

    // User data
    session: Session | null;
    user: User | null;
    userProfile: UserProfile | null;

    // Error handling
    error: string | null;

    // Actions
    initialize: () => Promise<void>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    clearError: () => void;

    // Email Authentication
    signUpWithEmail: (email: string, password: string, options?: { redirectTo?: string; data?: object }) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
    signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signInWithMagicLink: (email: string, options?: { redirectTo?: string }) => Promise<{ success: boolean; error?: string }>;
    signInWithOTP: (email: string, options?: { shouldCreateUser?: boolean }) => Promise<{ success: boolean; error?: string }>;
    verifyOTP: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
    resetPassword: (email: string, options?: { redirectTo?: string }) => Promise<{ success: boolean; error?: string }>;
    updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
    resendConfirmation: (email: string, options?: { redirectTo?: string }) => Promise<{ success: boolean; error?: string }>;

    // Profile management
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

// Create auth store
export const useAuthStore = create<AuthState>()(
    subscribeWithSelector((set, get) => ({
        // Initial state
        isLoading: true,
        isAuthenticated: false,
        session: null,
        user: null,
        userProfile: null,
        error: null,

        // Initialize authentication
        initialize: async () => {
            try {
                console.log('Auth store: Starting initialization...');
                set({ isLoading: true, error: null });

                // Add timeout to prevent infinite loading
                const initTimeout = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Authentication initialization timeout')), 10000);
                });

                const initPromise = (async () => {
                    // Get initial session
                    const { session, error } = await authHelpers.getSession();

                    if (error) {
                        console.error('Failed to get session:', error);
                        set({
                            isLoading: false,
                            isAuthenticated: false,
                            session: null,
                            user: null,
                            userProfile: null,
                        });
                        return;
                    }

                    if (session?.user) {
                        console.log('Auth store: User session found during initialization');
                        set({
                            isAuthenticated: true,
                            session,
                            user: session.user,
                        });

                        // Try to fetch user profile
                        await get().refreshProfile();
                    } else {
                        console.log('Auth store: No user session found during initialization');
                    }

                    set({ isLoading: false });
                })();

                await Promise.race([initPromise, initTimeout]);

            } catch (error) {
                console.error('Auth initialization error:', error);
                set({
                    isLoading: false,
                    error: 'Failed to initialize authentication',
                    isAuthenticated: false,
                    session: null,
                    user: null,
                    userProfile: null,
                });
            }
        },

        // Sign in with Google
        signInWithGoogle: async () => {
            try {
                console.log('Auth store: Starting Google sign in...');
                set({ isLoading: true, error: null });

                // Add timeout to prevent infinite loading
                const signInTimeout = new Promise<{ success: boolean; error?: string }>((_, reject) => {
                    setTimeout(() => reject(new Error('Google sign in timeout')), 30000);
                });

                const signInPromise = (async (): Promise<{ success: boolean; error?: string }> => {
                    const { data, error } = await authHelpers.signInWithGoogle();

                    if (error) {
                        console.error('Auth store: Google sign in error:', error);
                        const errorMessage = typeof error === 'string' ? error : 'Failed to sign in with Google';
                        set({
                            isLoading: false,
                            error: errorMessage,
                        });
                        return { success: false, error: errorMessage };
                    }

                    console.log('Auth store: Google sign in initiated successfully');
                    // The auth state change listener will handle setting loading to false
                    return { success: true };
                })();

                return await Promise.race([signInPromise, signInTimeout]);
            } catch (error) {
                console.error('Auth store: Google sign in exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Sign out
        signOut: async () => {
            try {
                set({ isLoading: true });

                await authHelpers.signOut();

                set({
                    isLoading: false,
                    isAuthenticated: false,
                    session: null,
                    user: null,
                    userProfile: null,
                    error: null,
                });
            } catch (error) {
                console.error('Sign out error:', error);
                set({
                    isLoading: false,
                    error: 'Failed to sign out',
                });
            }
        },

        // Email Authentication Methods

        // Sign up with email and password
        signUpWithEmail: async (email: string, password: string, options?: { redirectTo?: string; data?: object }) => {
            try {
                console.log('Auth store: Starting email signup...');
                set({ isLoading: true, error: null });

                const { data, error } = await authHelpers.signUpWithEmail(email, password, options);

                if (error) {
                    console.error('Auth store: Email signup error:', error);
                    set({
                        isLoading: false,
                        error: error,
                    });
                    return { success: false, error: error };
                }

                console.log('Auth store: Email signup successful');
                set({ isLoading: false });

                // Check if user needs to verify email
                const needsVerification = !data?.session && data?.user && !data?.user?.email_confirmed_at;

                return {
                    success: true,
                    needsVerification: Boolean(needsVerification)
                };
            } catch (error) {
                console.error('Auth store: Email signup exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to sign up with email';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Sign in with email and password  
        signInWithEmail: async (email: string, password: string) => {
            try {
                console.log('Auth store: Starting email signin...');
                set({ isLoading: true, error: null });

                const { data, error } = await authHelpers.signInWithEmail(email, password);

                if (error) {
                    console.error('Auth store: Email signin error:', error);
                    set({
                        isLoading: false,
                        error: error,
                    });
                    return { success: false, error: error };
                }

                if (data?.session) {
                    console.log('Auth store: Email signin successful');
                    set({
                        isAuthenticated: true,
                        session: data.session,
                        user: data.session.user,
                        userProfile: null, // Clear stale profile data immediately
                        isLoading: false,
                    });

                    // Fetch user profile
                    await get().refreshProfile();
                }

                return { success: true };
            } catch (error) {
                console.error('Auth store: Email signin exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with email';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Sign in with magic link
        signInWithMagicLink: async (email: string, options?: { redirectTo?: string }) => {
            try {
                console.log('Auth store: Starting magic link signin...');
                set({ isLoading: true, error: null });

                const { data, error } = await authHelpers.signInWithMagicLink(email, options);

                if (error) {
                    console.error('Auth store: Magic link error:', error);
                    set({
                        isLoading: false,
                        error: error,
                    });
                    return { success: false, error: error };
                }

                console.log('Auth store: Magic link sent successfully');
                set({ isLoading: false });
                return { success: true };
            } catch (error) {
                console.error('Auth store: Magic link exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to send magic link';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Sign in with OTP
        signInWithOTP: async (email: string, options?: { shouldCreateUser?: boolean }) => {
            try {
                console.log('Auth store: Starting OTP signin...');
                set({ isLoading: true, error: null });

                const { data, error } = await authHelpers.signInWithOTP(email, options);

                if (error) {
                    console.error('Auth store: OTP signin error:', error);
                    set({
                        isLoading: false,
                        error: error,
                    });
                    return { success: false, error: error };
                }

                console.log('Auth store: OTP sent successfully');
                set({ isLoading: false });
                return { success: true };
            } catch (error) {
                console.error('Auth store: OTP signin exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Verify OTP
        verifyOTP: async (email: string, token: string) => {
            try {
                console.log('Auth store: Starting OTP verification...');
                set({ isLoading: true, error: null });

                const { data, error } = await authHelpers.verifyOTP(email, token);

                if (error) {
                    console.error('Auth store: OTP verification error:', error);
                    set({
                        isLoading: false,
                        error: error,
                    });
                    return { success: false, error: error };
                }

                if (data?.session) {
                    console.log('Auth store: OTP verification successful');
                    set({
                        isAuthenticated: true,
                        session: data.session,
                        user: data.session.user,
                        userProfile: null,
                        isLoading: false,
                    });

                    // Fetch user profile
                    await get().refreshProfile();
                }

                return { success: true };
            } catch (error) {
                console.error('Auth store: OTP verification exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Reset password
        resetPassword: async (email: string, options?: { redirectTo?: string }) => {
            try {
                console.log('Auth store: Starting password reset...');
                set({ isLoading: true, error: null });

                const { data, error } = await authHelpers.resetPassword(email, options);

                if (error) {
                    console.error('Auth store: Password reset error:', error);
                    set({
                        isLoading: false,
                        error: error,
                    });
                    return { success: false, error: error };
                }

                console.log('Auth store: Password reset email sent successfully');
                set({ isLoading: false });
                return { success: true };
            } catch (error) {
                console.error('Auth store: Password reset exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Update password
        updatePassword: async (password: string) => {
            try {
                console.log('Auth store: Starting password update...');
                set({ isLoading: true, error: null });

                const { data, error } = await authHelpers.updatePassword(password);

                if (error) {
                    console.error('Auth store: Password update error:', error);
                    set({
                        isLoading: false,
                        error: error,
                    });
                    return { success: false, error: error };
                }

                console.log('Auth store: Password updated successfully');
                set({ isLoading: false });
                return { success: true };
            } catch (error) {
                console.error('Auth store: Password update exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Resend confirmation email
        resendConfirmation: async (email: string, options?: { redirectTo?: string }) => {
            try {
                console.log('Auth store: Starting resend confirmation...');
                set({ isLoading: true, error: null });

                const { data, error } = await authHelpers.resendConfirmation(email, options);

                if (error) {
                    console.error('Auth store: Resend confirmation error:', error);
                    set({
                        isLoading: false,
                        error: error,
                    });
                    return { success: false, error: error };
                }

                console.log('Auth store: Confirmation email resent successfully');
                set({ isLoading: false });
                return { success: true };
            } catch (error) {
                console.error('Auth store: Resend confirmation exception:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to resend confirmation email';
                set({
                    isLoading: false,
                    error: errorMessage,
                });
                return { success: false, error: errorMessage };
            }
        },

        // Clear error
        clearError: () => set({ error: null }),

        // Update user profile
        updateProfile: async (updates: Partial<UserProfile>) => {
            try {
                const currentProfile = get().userProfile;
                if (!currentProfile) return;

                const updatedProfile = { ...currentProfile, ...updates };
                set({ userProfile: updatedProfile });

                // TODO: Send update to backend API
                // await api.put(Config.ENDPOINTS.USER_PROFILE, updates);
            } catch (error) {
                console.error('Failed to update profile:', error);
                set({ error: 'Failed to update profile' });
            }
        },

        // Refresh user profile from backend
        refreshProfile: async () => {
            try {
                const { user } = get();
                if (!user) return;

                console.log('Auth store: Fetching user profile from backend...');

                // Fetch real user profile from Supabase
                const { data: profile, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    // PGRST116 is "not found" - expected for new users
                    console.error('Failed to fetch user profile:', error);
                    return;
                }

                if (profile) {
                    console.log('Auth store: Found existing user profile', {
                        user_id: profile.user_id,
                        onboarding_completed: profile.onboarding_completed,
                        display_name: profile.display_name
                    });

                    // Map Supabase profile to UserProfile interface
                    const userProfile: UserProfile = {
                        id: profile.id,
                        created_at: profile.created_at,
                        updated_at: profile.updated_at,
                        user_id: profile.user_id,
                        display_name: profile.display_name || user.user_metadata?.name || user.email?.split('@')[0],
                        timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                        preferences: {
                            skin_type: profile.skin_type,
                            skin_concerns: profile.skin_concerns || [],
                            budget_range: profile.budget_range,
                            routine_time_morning: profile.routine_time_morning,
                            routine_time_evening: profile.routine_time_evening,
                        },
                        notification_settings: {
                            notification_enabled: profile.notification_enabled ?? true,
                            reminders: profile.notification_preferences?.reminders ?? true,
                            tips: profile.notification_preferences?.tips ?? true,
                            progress_updates: profile.notification_preferences?.progress_updates ?? true,
                            streak_alerts: profile.notification_preferences?.streak_alerts ?? true,
                        },
                        game_metrics: {
                            current_streak: profile.current_streak || 0,
                            longest_streak: profile.longest_streak || 0,
                            total_check_ins: profile.total_check_ins || 0,
                            achievements: profile.achievements || [],
                            profile_completion_score: profile.profile_completion_score || 0,
                        },
                        onboarding_completed: profile.onboarding_completed || false,
                        last_analysis_date: profile.last_analysis_date,
                        last_check_in_date: profile.last_check_in_date,
                    };

                    set({ userProfile });
                } else {
                    console.log('Auth store: No user profile found - new user');

                    // Create minimal profile for new users
                    const newUserProfile: UserProfile = {
                        id: '',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        user_id: user.id,
                        display_name: user.user_metadata?.name || user.email?.split('@')[0] || '',
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        onboarding_completed: false,
                        game_metrics: {
                            current_streak: 0,
                            longest_streak: 0,
                            total_check_ins: 0,
                            achievements: [],
                            profile_completion_score: 0,
                        },
                        notification_settings: {
                            notification_enabled: true,
                            reminders: true,
                            tips: true,
                            progress_updates: true,
                            streak_alerts: true,
                        },
                    };

                    set({ userProfile: newUserProfile });
                }
            } catch (error) {
                console.error('Failed to refresh profile:', error);
            }
        },
    }))
);

// Set up auth state change listener
let authListener: { data: { subscription: any } } | null = null;

export const initializeAuthListener = () => {
    if (authListener) return;

    console.log('Auth store: Initializing auth state listener...');

    authListener = onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        const state = useAuthStore.getState();

        switch (event) {
            case 'SIGNED_IN':
                if (session?.user) {
                    console.log('Auth listener: User signed in successfully');
                    useAuthStore.setState({
                        isAuthenticated: true,
                        session,
                        user: session.user,
                        userProfile: null,
                        isLoading: false,
                        error: null,
                    });

                    // Refresh profile in background
                    try {
                        await useAuthStore.getState().refreshProfile();
                    } catch (error) {
                        console.error('Auth listener: Failed to refresh profile:', error);
                    }
                }
                break;

            case 'SIGNED_OUT':
                console.log('Auth listener: User signed out');
                useAuthStore.setState({
                    isAuthenticated: false,
                    session: null,
                    user: null,
                    userProfile: null,
                    isLoading: false,
                    error: null,
                });
                break;

            case 'TOKEN_REFRESHED':
                if (session) {
                    console.log('Auth listener: Token refreshed');
                    useAuthStore.setState({
                        session,
                        isLoading: false,
                    });
                }
                break;

            case 'INITIAL_SESSION':
                // Handle initial session detection
                if (session?.user) {
                    console.log('Auth listener: Initial session detected');
                    useAuthStore.setState({
                        isAuthenticated: true,
                        session,
                        user: session.user,
                        userProfile: null, // Clear stale profile data immediately
                        isLoading: false,
                        error: null,
                    });
                } else {
                    console.log('Auth listener: No initial session');
                    useAuthStore.setState({
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
                break;

            default:
                console.log('Auth listener: Unknown event:', event);
                // For any other event, make sure we're not stuck in loading
                if (state.isLoading) {
                    useAuthStore.setState({ isLoading: false });
                }
                break;
        }
    });
};

// Cleanup auth listener
export const cleanupAuthListener = () => {
    if (authListener) {
        authListener.data.subscription.unsubscribe();
        authListener = null;
    }
};

// Helper hooks
export const useAuth = () => {
    const {
        isLoading,
        isAuthenticated,
        user,
        userProfile,
        error,
        initialize,
        signInWithGoogle,
        signOut,
        clearError,
    } = useAuthStore();

    return {
        isLoading,
        isAuthenticated,
        user,
        userProfile,
        error,
        initialize,
        signInWithGoogle,
        signOut,
        clearError,
    };
};

export const useUser = () => {
    const { user, userProfile } = useAuthStore();
    return { user, userProfile };
}; 