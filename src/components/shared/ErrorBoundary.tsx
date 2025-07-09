import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../design-system/tokens';
import { PrimaryButton } from '../design-system/atoms';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🔴 ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to analytics/crash reporting service if needed
    // Analytics.recordError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError = this.state.error?.message?.includes('Network') || 
                            this.state.error?.message?.includes('fetch') ||
                            this.state.error?.message?.includes('connection');
      
      const isBackendError = this.state.error?.message?.includes('API') ||
                            this.state.error?.message?.includes('server') ||
                            this.state.error?.message?.includes('backend');

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>⚠️</Text>
            </View>
            
            <Text style={styles.title}>
              {isNetworkError ? 'Backend Connection Issue' : 'Something went wrong'}
            </Text>
            
            <Text style={styles.message}>
              {this.props.fallbackMessage || 
               (isNetworkError 
                 ? "Can't connect to backend. This is a temporary issue."
                 : isBackendError
                 ? "Backend service temporarily unavailable. Your data is safe."
                 : "An unexpected error occurred. Please try again.")}
            </Text>

            {(isNetworkError || isBackendError) && (
              <View style={styles.noteContainer}>
                <Text style={styles.note}>
                  ℹ️ Backend errors are expected during development. 
                  The app will work normally once the backend is running.
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <PrimaryButton 
                title="Retry"
                onPress={this.handleRetry}
              />
            </View>

            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText} numberOfLines={3}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    maxWidth: 300,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.l,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.fontSizes.headingL,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  message: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  noteContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.m,
    borderRadius: 8,
    marginBottom: spacing.xl,
  },
  note: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.l,
  },
  debugContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.m,
    borderRadius: 8,
    width: '100%',
  },
  debugTitle: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  debugText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});

// Hook for throwing async errors into React lifecycle
export const useThrowAsyncError = () => {
  const [, setState] = React.useState();
  
  return React.useCallback((error: Error) => {
    setState(() => {
      throw error;
    });
  }, []);
}; 