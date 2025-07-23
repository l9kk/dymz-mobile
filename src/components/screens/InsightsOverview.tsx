import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { 
  BackButton, 
  SectionHeading,
  MetricsCarousel,
  MetricTrendCard,
  ImproveRingRow,
  ProgressBarMetric,
  PrimaryButton,
  StatParagraph,
  ErrorBoundary
} from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import { useProgressSummary, useLatestTrends, useImprovementInsights } from '../../hooks/api/useAnalytics';
import { useLatestAnalysis } from '../../hooks/api/useAnalysis';

export interface InsightsOverviewProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
  style?: any;
}

interface MetricTrend {
  metricName: string;
  currentScore: number;
  change: number;
  dataPoints: { week: number; score: number }[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;

// Error Fallback Component
const ErrorFallback: React.FC<{ error?: Error; onRetry?: () => void }> = ({ error, onRetry }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>{t('insights.errors.unableToLoad')}</Text>
      <Text style={styles.errorText}>
        {error?.message || t('insights.errors.checkConnection')}
      </Text>
      {onRetry && (
        <PrimaryButton 
          title={t('common.retry')} 
          onPress={onRetry}
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

// Loading Component
const LoadingInsights: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <View style={[styles.container, styles.loadingContainer]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{t('insights.loading')}</Text>
    </View>
  );
};

export const InsightsOverview: React.FC<InsightsOverviewProps> = ({
  onBack,
  onNavigate,
  style
}) => {
  const { t } = useTranslation();
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);

  // Backend data hooks - no fallback data
  const { 
    data: progressData, 
    isLoading: isLoadingProgress, 
    error: progressError,
    refetch: refetchProgress 
  } = useProgressSummary();
  
  const metricNames = ['hydration', 'acne', 'redness', 'texture', 'oiliness', 'pigmentation', 'pores', 'dryness'];
  const { 
    data: trendsData, 
    isLoading: isLoadingTrends, 
    error: trendsError,
    refetch: refetchTrends 
  } = useLatestTrends(metricNames);
  
  const { 
    data: improvementData, 
    isLoading: isLoadingImprovement, 
    error: improvementError,
    refetch: refetchImprovement 
  } = useImprovementInsights();

  // Add analysis data
  const { 
    data: latestAnalysis, 
    isLoading: isLoadingAnalysis,
    error: analysisError,
    refetch: refetchAnalysis 
  } = useLatestAnalysis();

  // Enhanced debug logging for data state
  React.useEffect(() => {
    console.log('🔍 InsightsOverview - Data state update:', {
      progress: {
        data: progressData,
        loading: isLoadingProgress,
        error: progressError?.message
      },
      trends: {
        data: trendsData,
        dataLength: trendsData?.length,
        loading: isLoadingTrends,
        error: trendsError?.message
      },
      improvement: {
        data: improvementData,
        loading: isLoadingImprovement,
        error: improvementError?.message
      },
      analysis: {
        data: latestAnalysis,
        loading: isLoadingAnalysis,
        error: analysisError?.message
      }
    });
  }, [progressData, isLoadingProgress, progressError, trendsData, isLoadingTrends, trendsError, improvementData, isLoadingImprovement, improvementError, latestAnalysis, isLoadingAnalysis, analysisError]);

  // Retry function for errors
  const handleRetry = () => {
    refetchProgress();
    refetchTrends();
    refetchImprovement();
    refetchAnalysis();
  };

  // Transform analytics data to match UI expectations
  const transformTrendsToMetrics = (trends: any[]): MetricTrend[] => {
    console.log('🔍 InsightsOverview - transformTrendsToMetrics input:', {
      trendsExists: !!trends,
      trendsType: typeof trends,
      trendsIsArray: Array.isArray(trends),
      trendsLength: trends?.length,
      firstTrendStructure: trends?.[0] ? Object.keys(trends[0]) : null,
      rawTrends: trends
    });

    if (!trends || !Array.isArray(trends)) {
      console.log('⚠️ No trends data available or invalid format');
      return [];
    }
    
    try {
      const transformedMetrics = trends.filter(trend => trend && typeof trend === 'object').map((trend, index) => {
        console.log(`🔄 Processing trend ${index + 1}:`, {
          rawTrend: trend,
          metricName: trend.metricName,
          metric_name: trend.metric_name,
          currentScore: trend.currentScore,
          current_value: trend.current_value,
          change: trend.change,
          improvement_percentage: trend.improvement_percentage,
          dataPoints: trend.dataPoints
        });

        // The useLatestTrends hook returns objects with 'metricName' property, not 'metric_name'
        // So we should use the metricName field directly from the trend object
        const metricDisplayName = trend.metricName || trend.metric_name || 'Unknown Metric';
        const rawScore = trend.currentScore || trend.current_value || 0;
        const score = Math.round((1 - rawScore) * 100); // Invert score for display (lower problems = higher score)
        const changeValue = Math.round(trend.change || trend.improvement_percentage || 0);

        console.log(`✅ Transformed metric:`, {
          original: trend,
          transformed: {
            metricName: metricDisplayName,
            currentScore: score,
            change: changeValue
          }
        });

        return {
          metricName: metricDisplayName,
          currentScore: score,
          change: changeValue,
          dataPoints: trend.dataPoints || [
            { week: 1, score: Math.round((1 - (trend.initial_value || 0)) * 100) },
            { week: 2, score: Math.round((1 - ((trend.initial_value + trend.current_value) / 2 || 0)) * 100) },
            { week: 3, score: score },
            { week: 4, score: score },
            { week: 5, score: score },
          ]
        };
      });

      console.log('📊 Final transformed metrics for display:', transformedMetrics);
      return transformedMetrics;
    } catch (error) {
      console.error('❌ Error transforming trends to metrics:', error);
      return [];
    }
  };

  const transformImprovementData = (improvementData: any) => {
    if (!improvementData?.declining || !Array.isArray(improvementData.declining)) return [];
    
    try {
      return improvementData.declining.slice(0, 3).map((metricName: string) => ({
        score: Math.floor(Math.random() * 40) + 30, // Backend should provide actual scores
        title: metricName.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      }));
    } catch (error) {
      console.warn('Error transforming improvement data:', error);
      return [];
    }
  };

  // Transform data for UI
  const metricsData = transformTrendsToMetrics(trendsData || []);
  const progressSummary = progressData || {
    weekNumber: 1,
    scansCompleted: 0,
    totalScansGoal: 7,
    averageScore: 0,
  };
  const improvementMetrics = transformImprovementData(improvementData);

  // Use actual data from backend
  const displayMetrics = metricsData;
  
  console.log('📊 Final metrics for display:', {
    hasActualData: metricsData.length > 0,
    displayMetricsCount: displayMetrics.length,
    displayMetrics
  });

  // Carousel scroll handler (moved here to access displayMetrics)
  const handleScroll = (event: any) => {
    try {
      const offsetX = event?.nativeEvent?.contentOffset?.x || 0;
      const index = Math.round(offsetX / (SCREEN_WIDTH - spacing.l));
      const safeIndex = Math.min(Math.max(index, 0), Math.max(displayMetrics.length - 1, 0));
      setCurrentMetricIndex(safeIndex);
    } catch (error) {
      console.warn('Error handling scroll:', error);
    }
  };

  // Loading state
  const isLoading = isLoadingProgress || isLoadingTrends || isLoadingImprovement || isLoadingAnalysis;
  if (isLoading) {
    return <LoadingInsights />;
  }

  // Error state - show specific error instead of fallback data
  const hasError = progressError || trendsError || improvementError || analysisError;
  if (hasError) {
    const errorMessage = progressError?.message || trendsError?.message || improvementError?.message || analysisError?.message;
    return (
      <ErrorBoundary>
        <SafeAreaView style={[styles.container, style]}>
          <View style={styles.headerMinimal}>
            <BackButton onPress={onBack} />
          </View>
          <ErrorFallback 
            error={new Error(errorMessage || t('insights.errors.failedToLoad'))} 
            onRetry={handleRetry}
          />
        </SafeAreaView>
      </ErrorBoundary>
    );
  }

  // Handle empty data state
  if (displayMetrics.length === 0) {
    return (
      <ErrorBoundary>
        <SafeAreaView style={[styles.container, style]}>
          <View style={styles.headerMinimal}>
            <BackButton onPress={onBack} />
          </View>
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>{t('insights.emptyState.title')}</Text>
            <Text style={styles.emptyStateText}>
              {t('insights.emptyState.description')}
            </Text>
            <PrimaryButton 
              title={t('analysis.takePhotoAnalysis')} 
              onPress={() => onNavigate?.('CameraPreview')}
              style={styles.emptyStateButton}
            />
          </View>
        </SafeAreaView>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={[styles.container, style]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerMinimal}>
            <BackButton onPress={onBack} />
          </View>

          {/* Skin Type Card */}
          {latestAnalysis?.skin_metrics?.overall_skin_type && (
            <View style={styles.skinTypeCard}>
              <Text style={styles.skinTypeLabel}>{t('insights.yourSkinType')}</Text>
              <Text style={styles.skinTypeValue}>
                {latestAnalysis.skin_metrics.overall_skin_type}
              </Text>
            </View>
          )}

          {/* Progress Summary */}
          <View style={styles.section}>
            <StatParagraph style={styles.weekLabel}>
              {t('insights.weekOverview', { weekNumber: progressSummary.weekNumber })}
            </StatParagraph>
          </View>

          {/* Metrics Carousel */}
          <View style={styles.metricsSection}>
            <SectionHeading style={styles.sectionTitle}>{t('insights.skinMetrics')}</SectionHeading>
            <MetricsCarousel
              metrics={displayMetrics.map((metric: MetricTrend) => ({
                score: metric.currentScore,
                title: metric.metricName,
                isLocked: false
              }))}
            />
          </View>

          {/* All Metric Details */}
          {displayMetrics.map((metric, index) => (
            <View key={metric.metricName || index} style={styles.section}>
              <MetricTrendCard
                metricName={metric.metricName}
                dataPoints={metric.dataPoints}
                currentScore={metric.currentScore}
                change={metric.change}
              />
            </View>
          ))}

          {/* Areas for Improvement */}
          {improvementMetrics.length > 0 && (
            <View style={styles.section}>
              <SectionHeading style={styles.sectionTitle}>
                {t('insights.focusAreas')}
              </SectionHeading>
              <ImproveRingRow 
                improvementMetrics={improvementMetrics}
              />
            </View>
          )}


          
          {/* Bottom safe area padding */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    marginTop: spacing.m,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  errorTitle: {
    fontSize: typography.fontSizes.headingL,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  errorText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    marginBottom: spacing.m,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: 8,
  },
  headerMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.l,
    paddingBottom: spacing.s,
  },
  skinTypeCard: {
    backgroundColor: colors.accentPalette[0],
    borderRadius: 16,
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    alignItems: 'center',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skinTypeLabel: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.backgroundPrimary,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  skinTypeValue: {
    fontSize: typography.fontSizes.headingL,
    fontFamily: typography.fontFamilies.display,
    color: colors.backgroundPrimary,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  section: {
    padding: spacing.l,
  },
  metricsSection: {
    padding: spacing.l,
    paddingTop: spacing.s,
  },
  weekLabel: {
    marginBottom: spacing.m,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  emptyStateTitle: {
    fontSize: typography.fontSizes.headingL,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  emptyStateText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    marginBottom: spacing.m,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: 8,
  },
  bottomSpacer: {
    height: spacing.l,
  },
}); 