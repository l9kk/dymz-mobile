/**
 * App Providers
 * Centralized provider wrapper for React Query, Authentication, and other global providers
 */

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient } from '../lib/queryClient';
import { validateEnvironment } from '../config/env';
import { 
  useAuthStore, 
  initializeAuthListener, 
  cleanupAuthListener 
} from '../stores/authStore';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 * Handles auth initialization and state management
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Validate environment variables
    try {
      validateEnvironment();
    } catch (error) {
      console.error('Environment validation failed:', error);
    }

    // Initialize authentication with timeout protection
    const initAuth = async () => {
      try {
        console.log('AuthProvider: Starting authentication initialization...');
        
        // Set up auth listener first
        initializeAuthListener();
        
        // Initialize auth with timeout
        await initialize();
        
        console.log('AuthProvider: Authentication initialization completed');
      } catch (error) {
        console.error('AuthProvider: Failed to initialize authentication:', error);
        
        // Make sure we don't stay in loading state forever
        setTimeout(() => {
          const currentState = useAuthStore.getState();
          if (currentState.isLoading) {
            console.log('AuthProvider: Clearing stuck loading state');
            useAuthStore.setState({ isLoading: false });
          }
        }, 5000);
      }
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      cleanupAuthListener();
    };
  }, [initialize]);

  return <>{children}</>;
};

/**
 * Main App Providers Wrapper
 * Combines all necessary providers for the app
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar style="dark" backgroundColor="#FFF9F3" />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AppProviders; 