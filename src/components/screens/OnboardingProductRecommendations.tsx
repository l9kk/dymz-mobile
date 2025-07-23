import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Icon } from '../design-system/atoms/Icon';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { ProductCard } from '../design-system/molecules/ProductCard';
import { colors, typography, spacing } from '../design-system/tokens';
import { useLatestAnalysis } from '../../hooks/api/useAnalysis';
import { useProductRecommendations } from '../../hooks/api/useProducts';
import { getProductImageUrl } from '../../utils/imageUrls';

interface OnboardingProductRecommendationsProps {
  onContinue: () => void;
  // Add prop to control when to actually fetch data
  shouldFetchData?: boolean;
  // Add prop to pass existing analysis data to avoid unnecessary API calls
  analysisData?: any;
}

export const OnboardingProductRecommendations: React.FC<OnboardingProductRecommendationsProps> = ({
  onContinue,
  shouldFetchData = false, // Default to false - only fetch when explicitly told to
  analysisData = null
}) => {
  const { t } = useTranslation();
  // Only fetch latest analysis if we don't have data passed and we should fetch
  const { data: latestAnalysis } = useLatestAnalysis(shouldFetchData && !analysisData);
  
  // Use passed analysis data or fetched data
  const activeAnalysis = analysisData || latestAnalysis;
  
  // Only fetch product recommendations if:
  // 1. We should fetch data (user has reached this screen)
  // 2. We have a valid analysis with an ID
  // 3. The analysis is completed (not just processing)
  const shouldFetchRecommendations = shouldFetchData && 
                                   !!activeAnalysis?.id && 
                                   activeAnalysis?.status === 'completed';

  // Get product recommendations based on analysis
  const {
    data: recommendations,
    isLoading: isLoadingRecommendations,
    error: recommendationsError
  } = useProductRecommendations(
    {
      analysis_id: activeAnalysis?.id || '',
      max_products: 4, // Show 4 sample products
    },
    shouldFetchRecommendations
  );

  const isLoading = isLoadingRecommendations && !recommendationsError && shouldFetchData;
  const hasRecommendations = recommendations?.recommendations && Array.isArray(recommendations.recommendations) && recommendations.recommendations.length > 0;

  // Debug logging to help track what's happening
  if (__DEV__) {
    console.log('🔍 OnboardingProductRecommendations Debug:', {
      shouldFetchData,
      hasAnalysisData: !!analysisData,
      activeAnalysisId: activeAnalysis?.id,
      activeAnalysisStatus: activeAnalysis?.status,
      shouldFetchRecommendations,
      isLoading,
      hasRecommendations,
      recommendationCount: recommendations?.recommendations?.length || 0,
      error: recommendationsError?.message,
      backendStatus: recommendationsError ? 'Error' : recommendations ? 'Connected' : 'No Data'
    });
  }

  // Show real products if available, otherwise show preview
  const showRealProducts = hasRecommendations && shouldFetchData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main shopping/curation icon */}
        <View style={styles.mainIconContainer}>
          <Icon 
            name="sparkles" 
            size={80} 
            color={colors.accentPalette[2]}
          />
        </View>
        
        {/* Product Preview Section */}
        {showRealProducts ? (
          <View style={styles.productsPreview}>
            <Text style={styles.previewTitle}>{t('onboarding.productRecommendations.previewTitle')}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsRow}
            >
              {recommendations.recommendations.slice(0, 4).map((product: any, index: number) => (
                <View key={product.id || index} style={styles.productPreview}>
                  <Image 
                    source={getProductImageUrl(product)} 
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name || t('onboarding.productRecommendations.defaultProduct')}
                  </Text>
                  <Text style={styles.productBrand} numberOfLines={1}>
                    {product.brand || t('onboarding.productRecommendations.defaultBrand')}
                  </Text>
                  <Text style={styles.productMatch}>
                    {t('onboarding.productRecommendations.matchPercentage', { percentage: Math.round((product.recommendation_score || 0.8) * 100) })}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          // Fallback category preview for when no real data is available
          <View style={styles.iconsGrid}>
            <View style={styles.iconRow}>
              <View style={styles.smallIconContainer}>
                <Icon name="water-outline" size={32} color={colors.accentPalette[0]} />
                <Text style={styles.iconLabel}>{t('onboarding.productRecommendations.categories.serums')}</Text>
              </View>
              <View style={styles.smallIconContainer}>
                <Icon name="sunny-outline" size={32} color={colors.accentPalette[1]} />
                <Text style={styles.iconLabel}>{t('onboarding.productRecommendations.categories.sunscreen')}</Text>
              </View>
            </View>
            <View style={styles.iconRow}>
              <View style={styles.smallIconContainer}>
                <Icon name="moon-outline" size={32} color={colors.accentPalette[3]} />
                <Text style={styles.iconLabel}>{t('onboarding.productRecommendations.categories.nightCare')}</Text>
              </View>
              <View style={styles.smallIconContainer}>
                <Icon name="shield-checkmark-outline" size={32} color={colors.accentPalette[2]} />
                <Text style={styles.iconLabel}>{t('onboarding.productRecommendations.categories.treatments')}</Text>
              </View>
            </View>
          </View>
        )}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>{t('onboarding.productRecommendations.loading')}</Text>
          </View>
        )}

        {recommendationsError && shouldFetchData && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {t('onboarding.productRecommendations.error')}
            </Text>
          </View>
        )}
        
        <Text style={styles.title}>
          {t('onboarding.productRecommendations.title')}
        </Text>
        
        <Text style={styles.subtitle}>
          {showRealProducts 
            ? t('onboarding.productRecommendations.subtitleWithProducts', { count: recommendations.recommendations.length })
            : t('onboarding.productRecommendations.subtitlePreview')
          }
        </Text>
        
        <PrimaryButton 
          title={t('actions.continue')} 
          onPress={onContinue}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    gap: spacing.l,
  },
  mainIconContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 50,
    padding: spacing.l,
    marginBottom: spacing.m,
  },
  productsPreview: {
    width: '100%',
    marginBottom: spacing.l,
  },
  previewTitle: {
    fontSize: typography.fontSizes.headingM,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  productsRow: {
    paddingHorizontal: spacing.m,
    gap: spacing.m,
  },
  productPreview: {
    width: 120,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: spacing.s,
  },
  productPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  productName: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  productBrand: {
    fontSize: typography.fontSizes.small,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  productMatch: {
    fontSize: typography.fontSizes.small,
    fontFamily: typography.fontFamilies.body,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  iconsGrid: {
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  iconRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  smallIconContainer: {
    alignItems: 'center',
    gap: spacing.s,
    minWidth: 80,
  },
  iconLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilies.body,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.l,
  },
  loadingText: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.m,
    borderRadius: 8,
    marginVertical: spacing.m,
  },
  errorText: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    marginTop: spacing.m,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginHorizontal: spacing.m,
  },
  button: {
    marginTop: spacing.l,
    width: '100%',
  },
});