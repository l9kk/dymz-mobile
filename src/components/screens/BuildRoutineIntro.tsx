import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  SectionHeading,
  StatParagraph,
  PrimaryButton,
  LoadingSpinner,
  ProductCard
} from '../design-system';
import { colors, spacing } from '../design-system/tokens';
import { useProductRecommendations } from '../../hooks/api/useProducts';
import { useLatestAnalysis, useAnalysisWithPolling } from '../../hooks/api/useAnalysis';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { Config } from '../../config/env';

interface BuildRoutineIntroProps {
  onContinue?: () => void;
}

const BackendErrorDisplay: React.FC<{ error: any; onContinue?: () => void }> = ({ error, onContinue }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>{t('buildRoutine.errors.recommendationsUnavailable')}</Text>
      <Text style={styles.errorMessage}>
        {error?.message?.includes('Analysis must be completed') 
          ? t('buildRoutine.errors.completeAnalysisFirst')
          : t('buildRoutine.errors.unableToConnect')}
      </Text>
      <Text style={styles.errorDetail}>
        {t('buildRoutine.errors.backendStatus')}: {error?.status || t('buildRoutine.errors.unknown')} - {error?.message || t('buildRoutine.errors.connectionFailed')}
      </Text>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={t('buildRoutine.buttons.continueAnyway')}
          onPress={onContinue}
        />
      </View>
    </View>
  );
};

const NoDataDisplay: React.FC<{ onContinue?: () => void }> = ({ onContinue }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>{t('buildRoutine.errors.backendNotResponding')}</Text>
      <Text style={styles.errorMessage}>
        {t('buildRoutine.errors.serviceNotResponding')}
      </Text>
      <Text style={styles.errorDetail}>
        {t('buildRoutine.errors.possibleCauses')}
      </Text>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={t('buildRoutine.buttons.continueWithoutRecommendations')}
          onPress={onContinue}
        />
      </View>
    </View>
  );
};

export const BuildRoutineIntro: React.FC<BuildRoutineIntroProps> = ({
  onContinue
}) => {
  const { t } = useTranslation();
  const { data: analysis } = useLatestAnalysis();
  
  // Use polling for analysis if it's processing
  const { data: pollingAnalysis } = useAnalysisWithPolling(
    analysis?.id || '', 
    !!analysis?.id && analysis?.status === 'processing'
  );
  
  // Use the most up-to-date analysis data
  const currentAnalysis = pollingAnalysis || analysis;
  
  // Only fetch recommendations if analysis is completed
  const analysisId = currentAnalysis?.id || '';
  const isAnalysisCompleted = currentAnalysis?.status === 'completed';
  const shouldFetchRecommendations = !!currentAnalysis?.id && isAnalysisCompleted;
  
  const { 
    data: recommendations, 
    isLoading, 
    error 
  } = useProductRecommendations(
    { analysis_id: analysisId }, 
    shouldFetchRecommendations
  );

  // Convert recommendations to product cards format
  const getProductCards = () => {
    if (!recommendations?.recommendations || !Array.isArray(recommendations.recommendations) || recommendations.recommendations.length === 0) {
      return [];
    }

    return recommendations.recommendations
      .filter((rec: any) => rec?.id) // Filter out invalid entries
      .map((recommendation: any) => ({
        id: recommendation.id,
        name: recommendation.name || t('buildRoutine.unknownProduct'),
        brand: recommendation.brand || t('buildRoutine.unknownBrand'),
        price: recommendation.price || 0,
        imageUri: recommendation.image_url || '',
        rating: recommendation.rating || 0,
        matchPercentage: recommendation.recommendation_score ? Math.round(recommendation.recommendation_score * 100) : 90
      }));
  };

  const productCards = getProductCards();
  const averageMatch = productCards.length > 0
    ? Math.round(productCards.reduce((sum: number, card: any) => sum + card.matchPercentage, 0) / productCards.length)
    : 0;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Connecting to product recommendation service...</Text>
      </View>
    );
  }

  // Show clear backend error states
  if (error) {
    return <BackendErrorDisplay error={error} onContinue={onContinue} />;
  }

  // Show when no analysis exists
  if (!currentAnalysis?.id) {
    return (
      <ErrorBoundary>
        <View style={[styles.container, styles.centerContent]}>
          <SectionHeading style={styles.heading}>
            Ready to Build Your Routine?
          </SectionHeading>
          <StatParagraph style={styles.description}>
            ⚠️ No analysis found - Complete your skin analysis first to get personalized product recommendations.
          </StatParagraph>
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Continue Without Analysis →"
              onPress={onContinue}
            />
          </View>
        </View>
      </ErrorBoundary>
    );
  }

  // Show when analysis is still processing
  if (currentAnalysis?.id && !isAnalysisCompleted) {
    return (
      <ErrorBoundary>
        <View style={[styles.container, styles.centerContent]}>
          <LoadingSpinner size={48} />
          <SectionHeading style={styles.heading}>
            Processing Your Analysis...
          </SectionHeading>
          <StatParagraph style={styles.description}>
            🔄 Your skin analysis is being processed. Product recommendations will be available once analysis is complete.
          </StatParagraph>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              📊 Analysis Status: {currentAnalysis.status || 'unknown'}
            </Text>
            <Text style={styles.statusDetail}>
              ID: {currentAnalysis.id}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Continue Anyway →"
              onPress={onContinue}
            />
          </View>
        </View>
      </ErrorBoundary>
    );
  }

  // Show when no recommendations data (backend issue)
  if (!recommendations || productCards.length === 0) {
    return <NoDataDisplay onContinue={onContinue} />;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SectionHeading>
            Ready to Build Your Routine?
          </SectionHeading>

          <StatParagraph style={styles.description}>
            {`We've found ${productCards.length} products that match your skin ${averageMatch}%+`}
          </StatParagraph>

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Product Preview</Text>
            {productCards.slice(0, 3).map((product: any) => (
              <ProductCard
                key={product.id}
                brand={product.brand}
                productName={product.name}
                priceRange={`$${product.price}`}
                tags={['Recommended']}
                thumbnail={product.imageUri}
                showActions={false}
                style={styles.productCard}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Let's Build It →"
              onPress={onContinue}
            />
          </View>
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    paddingBottom: spacing['2xl'], // Extra padding at bottom for better scroll experience
  },
  heading: {
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  description: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  previewContainer: {
    marginBottom: spacing.xl,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  productCard: {
    marginBottom: spacing.m,
  },
  buttonContainer: {
    marginTop: 'auto',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    backgroundColor: colors.backgroundPrimary,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  errorDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
        fontFamily: 'monospace',
  },
  statusContainer: {
    marginTop: spacing.l,
    padding: spacing.m,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statusDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});  