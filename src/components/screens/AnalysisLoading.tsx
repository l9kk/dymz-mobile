import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LoadingProgressRing, StatParagraph, Icon } from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import { useAnalysisWithPolling } from '../../hooks/api/useAnalysis';

interface AnalysisLoadingProps {
  analysisId?: string;
  onComplete?: (analysisId: string) => void;
  onError?: (error: string) => void;
  duration?: number; // Fallback for mock mode
}

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({
  analysisId,
  onComplete,
  onError,
  duration = 3000 // 3 seconds default for mock mode
}) => {
  const [mockProgress, setMockProgress] = useState(0);
  
  // Use real API polling if analysisId is provided
  const {
    data: analysis,
    error: analysisError,
    isLoading,
  } = useAnalysisWithPolling(analysisId || '', !!analysisId);

  // Mock progress for demo mode (when no analysisId)
  useEffect(() => {
    if (!analysisId) {
      const interval = setInterval(() => {
        setMockProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => onComplete?.('mock-analysis-id'), 500);
            return 100;
          }
          return newProgress;
        });
      }, duration / 100);

      return () => clearInterval(interval);
    }
  }, [analysisId, duration, onComplete]);

  // Handle real API responses
  useEffect(() => {
    if (analysisId && analysis) {
      if (analysis.status === 'completed') {
        onComplete?.(analysis.id);
      } else if (analysis.status === 'failed') {
        onError?.(analysis.error_message || 'Analysis failed');
      }
    }
  }, [analysis, analysisId, onComplete, onError]);

  // Handle API errors
  useEffect(() => {
    if (analysisError) {
      console.error('Analysis error:', analysisError);
      onError?.(
        analysisError.message || 'Failed to analyze your skin. Please try again.'
      );
    }
  }, [analysisError, onError]);

  const getProgressPercentage = () => {
    if (!analysisId) {
      return mockProgress;
    }
    
    if (!analysis) return 0;
    
    switch (analysis.status) {
      case 'processing':
        return 50; // Show 50% while processing
      case 'completed':
        return 100;
      case 'failed':
        return 0;
      default:
        return 25; // Initial upload complete
    }
  };

  const getStatusMessage = () => {
    if (!analysisId) {
      if (mockProgress < 10) return "Compressing your photo...";
      if (mockProgress < 30) return "Uploading your photo...";
      if (mockProgress < 70) return "Analyzing your skin...";
      if (mockProgress < 100) return "Almost done...";
      return "Analysis complete!";
    }
    
    if (!analysis) return "Preparing your photo...";
    
    switch (analysis.status) {
      case 'processing':
        return "AI is analyzing your skin...";
      case 'completed':
        return "Analysis complete!";
      case 'failed':
        return "Analysis failed";
      default:
        return "Starting analysis...";
    }
  };

  // Enhanced status handling for better user experience
  const getDetailedStatusMessage = (progress: number) => {
    if (!analysisId) {
      // Mock mode - show different messages based on progress
      if (progress < 10) return "📷 Optimizing image quality...";
      if (progress < 30) return "📤 Uploading to secure servers...";
      if (progress < 80) return "🤖 AI analyzing your skin...";
      if (progress < 100) return "✨ Finalizing results...";
      return "✅ Analysis complete!";
    }
    
    // Real mode - show actual status
    if (!analysis) return "🔧 Preparing your analysis...";
    
    switch (analysis.status) {
      case 'processing':
        return "🤖 Advanced AI examining your skin metrics...";
      case 'completed':
        return "✅ Your personalized skin analysis is ready!";
      case 'failed':
        return "❌ Analysis encountered an issue";
      default:
        return "🚀 Initializing skin analysis...";
    }
  };

  const progress = getProgressPercentage();
  const statusMessage = getStatusMessage();
  const detailedStatusMessage = getDetailedStatusMessage(progress);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LoadingProgressRing 
          progress={progress}
          size={160}
          ringThickness={12}
          color={colors.ctaBackground}
          backgroundColor="rgba(0,0,0,0.08)"
          indeterminateSpeed={2000}
        >
          <Icon 
            name="sparkles" 
            size={48} 
            color={colors.ctaBackground}
            style={{ opacity: 0.8 }}
          />
        </LoadingProgressRing>
        
        <StatParagraph style={styles.message}>
          {detailedStatusMessage}
        </StatParagraph>
        
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress)}%
          </Text>
        </View>
        
        {/* Analysis info */}
        <Text style={styles.infoText}>
          {progress < 30 
            ? "We optimize your photo for the best analysis quality while keeping your data secure."
            : "Our AI is examining your skin for various concerns including texture, tone, and potential issues."
          }
        </Text>
        
        {/* Debug info in development */}
        {__DEV__ && analysisId && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Analysis ID: {analysisId}
            </Text>
            <Text style={styles.debugText}>
              Status: {analysis?.status || 'Loading...'}
            </Text>
            {analysis?.error_message && (
              <Text style={styles.debugError}>
                Error: {analysis.error_message}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
  },
  message: {
    textAlign: 'center',
    marginTop: spacing.l,
    marginBottom: spacing.l,
    fontSize: typography.fontSizes.body,
        color: colors.textPrimary,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.borderPrimary,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.s,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.ctaBackground,
    borderRadius: 2,
  },
  progressText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  infoText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.caption,
    marginTop: spacing.m,
  },
  debugContainer: {
    marginTop: spacing.l,
    padding: spacing.m,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    width: '100%',
  },
  debugText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.mono || typography.fontFamilies.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  debugError: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.mono || typography.fontFamilies.body,
    color: colors.accentPalette[0], // Red for errors
    marginBottom: spacing.xs,
  },
}); 