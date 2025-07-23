import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MetricsCarousel, 
  PrimaryButton,
  LoadingSpinner
} from '../design-system';
import { colors, spacing } from '../design-system/tokens';
import { useLatestAnalysis } from '../../hooks/api/useAnalysis';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';
import { boostMetrics, boostMetricsWithPersistence, testMetricBoosting } from '../../utils/metricBoosting';
import { useTranslation } from '../../hooks/useTranslation';

interface FirstAnalysisViewProps {
  onBuildRoutine?: () => void;
  photoUri?: string;
  analysisData?: any;
  shouldFetchData?: boolean;
}

export const FirstAnalysisView: React.FC<FirstAnalysisViewProps> = ({
  onBuildRoutine,
  photoUri,
  analysisData,
  shouldFetchData = true
}) => {
  const { t } = useTranslation();
  console.log('🎯 FirstAnalysisView component rendered with props:', {
    hasOnBuildRoutine: !!onBuildRoutine,
    hasPhotoUri: !!photoUri,
    hasAnalysisData: !!analysisData,
    shouldFetchData,
    analysisDataId: analysisData?.id,
    analysisDataStatus: analysisData?.status
  });

  const { isAuthenticated } = useAuthStore();

  // Always call the hook - React hooks must be called in the same order every render
  const { data: fetchedAnalysis, isLoading: fetchLoading, error: fetchError, refetch } = useLatestAnalysis();
  
  // Conditionally use the results based on shouldFetchData and authentication
  const analysis = analysisData || (shouldFetchData && isAuthenticated ? fetchedAnalysis : null);
  const isLoading = shouldFetchData && !analysisData && isAuthenticated ? fetchLoading : false;
  const error = shouldFetchData && !analysisData && isAuthenticated ? fetchError : null;

  // Poll for updates if analysis is processing
  useEffect(() => {
    if (analysis?.status === 'processing' && shouldFetchData && isAuthenticated) {
      const interval = setInterval(() => {
        console.log('Polling for analysis updates...');
        refetch();
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [analysis?.status, shouldFetchData, isAuthenticated, refetch]);

  // Map analysis results to metrics format
  const getMetricsFromAnalysis = async () => {
    console.log('🔍 FirstAnalysisView - Checking analysis data availability:', {
      hasAnalysisDataProp: !!analysisData,
      hasFetchedAnalysis: !!analysis,
      shouldFetchData,
      isAuthenticated,
      isLoading,
      error: !!error
    });
    
    // First priority: Use analysisData prop if available (from onboarding flow)
    const dataToUse = analysisData || analysis;
    const dataSource = analysisData ? 'prop (onboarding)' : analysis ? 'fetched (backend)' : 'none';
    console.log(`📊 Using analysis data from: ${dataSource}`);
    
    if (!dataToUse) {
      console.log('⚠️ No analysis data available for FirstAnalysisView:', {
        analysisDataProp: !!analysisData,
        fetchedAnalysis: !!analysis,
        photoUriExists: !!photoUri,
        currentScreen: 'first-analysis-view'
      });
      return [];
    }

    console.log('📊 Analysis data structure detailed breakdown:', {
      id: dataToUse.id,
      status: dataToUse.status,
      hasPhotoUri: !!photoUri,
      photoUri: photoUri,
      hasSkinMetrics: !!dataToUse.skin_metrics,
      skinMetricsKeys: dataToUse.skin_metrics ? Object.keys(dataToUse.skin_metrics) : [],
      metricsKeys: dataToUse.skin_metrics?.metrics ? Object.keys(dataToUse.skin_metrics.metrics) : [],
      errorMessage: dataToUse.error_message,
      createdAt: dataToUse.created_at,
      imageUrl: dataToUse.image_url
    });

    // Log the actual skin metrics structure separately to see the values
    if (dataToUse.skin_metrics) {
      console.log('📊 Raw skin metrics structure:', JSON.stringify(dataToUse.skin_metrics, null, 2));
    }

    // Check if analysis is still processing
    if (dataToUse.status === 'processing') {
      console.log('🔄 Analysis is still processing - returning empty metrics');
      return [];
    }

    // Check if analysis failed (including backend AI failures)
    if (dataToUse.status === 'failed') {
      console.error('❌ Analysis failed with error:', {
        errorMessage: dataToUse.error_message,
        analysisId: dataToUse.id,
        isBackendAIFailure: dataToUse.error_message?.includes('fallback') || 
                           dataToUse.error_message?.includes('invalid data') ||
                           dataToUse.error_message?.includes('Gemini')
      });
      return [];
    }

    // Only process metrics if analysis is completed
    if (dataToUse.status === 'completed' && dataToUse.skin_metrics?.metrics) {
      const metrics = dataToUse.skin_metrics.metrics;
      
      // Log individual metric structure for debugging
      console.log('✅ Individual metrics structure:', JSON.stringify(metrics, null, 2));
      
      // Log scores for debugging but don't flag valid data as suspicious
      const scores = Object.values(metrics).map(metric => {
        if (typeof metric === 'object' && metric !== null) {
          return (metric as any).score || 0;
        }
        return 0;
      });
      
      // Note: Removed suspicious pattern detection since backend is working correctly
      
      const processedMetrics = [
        { 
          score: Math.round((1 - (metrics.hydration?.score || 0)) * 100), 
          title: t('skinMetrics.hydration'),
          isLocked: false 
        },
        { 
          score: Math.round((1 - (metrics.texture?.score || 0)) * 100), 
          title: t('skinMetrics.texture'),
          isLocked: false 
        },
        { 
          score: Math.round((1 - (metrics.acne?.score || 0)) * 100), 
          title: t('skinMetrics.acne'),
          isLocked: false 
        },
        { 
          score: Math.round((1 - (metrics.oiliness?.score || 0)) * 100), 
          title: t('skinMetrics.oiliness'),
          isLocked: false 
        },
        { 
          score: Math.round((1 - (metrics.pigmentation?.score || 0)) * 100), 
          title: t('skinMetrics.pigmentation'),
          isLocked: false 
        },
        { 
          score: Math.round((1 - (metrics.pores?.score || 0)) * 100), 
          title: t('skinMetrics.pores'),
          isLocked: !metrics.pores 
        },
        { 
          score: Math.round((1 - (metrics.redness?.score || 0)) * 100), 
          title: t('skinMetrics.redness'),
          isLocked: !metrics.redness 
        },
        { 
          score: Math.round((1 - (metrics.dryness?.score || 0)) * 100), 
          title: t('skinMetrics.dryness'),
          isLocked: !metrics.dryness 
        }
      ].filter(metric => metric.score < 100 || !metric.isLocked); // Only show metrics with meaningful data
      
      // Apply metric boosting with persistence - this ensures consistent results per analysis
      const boostedMetrics = await boostMetricsWithPersistence(processedMetrics, dataToUse.id);
      
      // Test the boosting logic (development only)
      testMetricBoosting();
      
      console.log('📊 Processed metrics for display:', boostedMetrics);
      return boostedMetrics;
    }

    console.log('⚠️ No skin metrics available from backend - Status:', dataToUse.status);
    return [];
  };

  const [metrics, setMetrics] = React.useState<any[]>([]);

  // Load metrics when component mounts or analysis changes
  React.useEffect(() => {
    const loadMetrics = async () => {
      const processedMetrics = await getMetricsFromAnalysis();
      setMetrics(processedMetrics);
    };

    loadMetrics();
  }, [analysisData, analysis, photoUri]);

  // Show authentication required state if not authenticated
  if (shouldFetchData && !isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Authentication Required</Text>
        <Text style={styles.debugText}>
          Please sign in to view your analysis results
        </Text>
        <PrimaryButton
          title={t('auth.signIn')}
          onPress={() => {
            console.log('Navigate to sign in - user needs to authenticate');
            // In a real app, this would navigate to sign in screen
          }}
          style={styles.retryButton}
        />
      </SafeAreaView>
    );
  }

  // Show processing state if analysis is still being processed
  if (shouldFetchData && !isLoading && (analysis?.status === 'processing' || (!analysis && isLoading))) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Analyzing your skin...</Text>
        <Text style={styles.debugText}>
          This may take a few moments
        </Text>
      </SafeAreaView>
    );
  }

  // Show error state if analysis failed
  if ((analysisData && analysisData.status === 'failed') || (shouldFetchData && !isLoading && analysis?.status === 'failed')) {
    const errorData = analysisData || analysis;
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Analysis Failed</Text>
        <Text style={styles.debugText}>
          {errorData?.error_message || 'Unable to analyze your photo'}
        </Text>
        <PrimaryButton
          title={t('common.tryAgain')}
          onPress={() => {
            console.log('Retry analysis - navigate back to camera');
            // In a real app, this would navigate back to camera
          }}
          style={styles.retryButton}
        />
      </SafeAreaView>
    );
  }

  // Show no data state if backend didn't return analysis (only when fetching)
  if (shouldFetchData && !analysisData && !isLoading && !error && (!analysis || analysis.status !== 'completed' || !analysis.skin_metrics?.metrics || Object.keys(analysis.skin_metrics.metrics || {}).length === 0)) {
    // Check if this is a backend AI failure
    const isBackendAIFailure = analysis?.error_message?.includes('fallback') || 
                              analysis?.error_message?.includes('invalid data') ||
                              analysis?.error_message?.includes('Gemini') ||
                              analysis?.status === 'failed';
    
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          {isBackendAIFailure ? 
            '🚨 AI Analysis Failed' : 
            'No analysis data received from backend'
          }
        </Text>
        <Text style={styles.debugText}>
          {isBackendAIFailure ? 
            'The backend AI processing (Gemini API) failed and returned fallback data. This means your analysis.py file needs to be fixed.' :
            `Backend Status: ${analysis?.skin_metrics ? 'Skin metrics exist but no individual metrics found' : 'No skin metrics in response'}`
          }
        </Text>
        {isBackendAIFailure && (
          <Text style={[styles.debugText, { marginTop: spacing.m, color: colors.accent }]}>
            Error: {analysis?.error_message}
          </Text>
        )}
        <PrimaryButton
          title={isBackendAIFailure ? t('analysis.reportIssue') : t('common.tryAgain')}
          onPress={() => {
            if (isBackendAIFailure) {
              console.error('🚨 CRITICAL: Backend AI processing failed. Gemini API integration is broken.');
              console.error('Error details:', {
                analysisId: analysis?.id,
                errorMessage: analysis?.error_message,
                status: analysis?.status,
                skinMetrics: analysis?.skin_metrics
              });
              // In a real app, this could open a support ticket or error reporting
              Alert.alert(
                'AI Processing Error',
                'Your analysis.py backend is not properly processing images with Gemini API. Please check your backend logs and fix the integration.',
                [{ text: t('common.ok') }]
              );
            } else {
              console.log('Retry analysis - check backend connection');
              // In a real app, this would trigger a refetch or navigate back
            }
          }}
          style={styles.retryButton}
        />
      </SafeAreaView>
    );
  }

  // Show loading state while fetching analysis
  if (shouldFetchData && isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading your skin analysis...</Text>
      </SafeAreaView>
    );
  }

  // Show error state if analysis failed to load
  if (shouldFetchData && error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{t('analysis.unableToLoad')}</Text>
        <PrimaryButton
          title={t('buttons.tryAgain')}
          onPress={() => {
            // In a real app, this would trigger a refetch or navigate back
            console.log('Retry button pressed - would refetch analysis data');
          }}
          style={styles.retryButton}
        />
      </SafeAreaView>
    );
  }

  // Use analysis photo if available, fallback to provided photoUri
  const analysisPhotoUri = (analysisData || analysis)?.image_url || photoUri;

  // Keep photo in 4:5 ratio (width : height)
  const { width: screenWidth } = Dimensions.get('window');
  const photoHeight = Math.round(screenWidth * 1.25); // 4:5 ratio => height = width * 5/4

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* User photo */}
        {analysisPhotoUri ? (
          <Image
            source={{ uri: analysisPhotoUri }}
            style={[styles.photo, { height: photoHeight }]}
          />
        ) : (
          <View
            style={[styles.photoPlaceholder, { height: photoHeight }]}
          />
        )}

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          <MetricsCarousel metrics={metrics} ringSize={70} />
        </View>
      </View>

      {/* Action button - always visible at bottom */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={t('buttons.buildYourRoutine')}
          variant="success"
          onPress={onBuildRoutine}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.m,
  },
  photo: {
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
    marginTop: spacing.xl, // Reduced from spacing.2xl (48px) to spacing.xl (32px)
  },
  photoPlaceholder: {
    width: '100%',
    backgroundColor: 'rgba(92,82,67,0.3)',
    borderRadius: 12,
    marginTop: spacing.xl, // Reduced from spacing.2xl (48px) to spacing.xl (32px)
  },
  metricsContainer: {
    marginTop: spacing.l, // Reduced from spacing.xl (32px) to spacing.l (24px)
    alignItems: 'center',
    minHeight: 120, // Reduced from 140 to 120 since rings are now smaller (70px instead of 84px)
    paddingBottom: spacing.l, // Add bottom padding to ensure text labels are visible
  },
  buttonContainer: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l, // Added vertical padding for better button accessibility
    backgroundColor: colors.backgroundPrimary, // Ensure button background is visible
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.m,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
  debugText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.l,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});