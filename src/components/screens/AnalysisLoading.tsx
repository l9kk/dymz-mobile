import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LoadingProgressRing, Icon } from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import { useAnalysisWithPolling } from '../../hooks/api/useAnalysis';
import { useTranslation } from '../../hooks/useTranslation';

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
  duration = 10000
}) => {
  const { t } = useTranslation();
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
        analysisError.message || t('analysis.failedToAnalyze')
      );
    }
  }, [analysisError, onError, t]);

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
      if (mockProgress < 10) return t('loading.compressingPhoto');
      if (mockProgress < 30) return t('loading.uploadingPhoto');
      if (mockProgress < 70) return t('loading.analyzingSkin');
      if (mockProgress < 100) return t('loading.almostDone');
      return t('loading.analysisComplete');
    }
    
    if (!analysis) return t('loading.preparingPhoto');
    
    switch (analysis.status) {
      case 'processing':
        return t('loading.aiAnalyzing');
      case 'completed':
        return t('loading.analysisComplete');
      case 'failed':
        return t('loading.analysisFailed');
      default:
        return t('loading.startingAnalysis');
    }
  };

  const progress = getProgressPercentage();
  const statusMessage = getStatusMessage();

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
        
        {/* Analysis info */}
        <Text style={styles.infoText}>
          {progress < 30 
            ? t('camera.optimizationInfo')
            : t('camera.aiExaminationInfo')
          }
        </Text>
        
        {/* Debug info in development */}
        {__DEV__ && analysisId && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              {t('errors.analysisId')}: {analysisId}
            </Text>
            <Text style={styles.debugText}>
              {t('errors.status')}: {analysis?.status || t('errors.loadingStatus')}
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