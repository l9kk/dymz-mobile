import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BackButton, PrimaryButton, MotivationImageGrid } from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import { getMotivationImageArray } from '../../utils/imageUrls';

interface MotivationIntroProps {
  onContinue: () => void;
  onBack: () => void;
}

export const MotivationIntro: React.FC<MotivationIntroProps> = ({
  onContinue,
  onBack,
}) => {
  const { t } = useTranslation();
  const motivationImages = (getMotivationImageArray() || []).map(url => ({ uri: url }));
  
  // Debug logging for image URLs
  if (__DEV__) {
    console.log('MotivationIntro: Images loaded', {
      count: motivationImages.length,
      urls: motivationImages.map(img => img.uri)
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BackButton onPress={onBack} style={styles.backButton} />
        
        <View style={styles.headerSection}>
          <Text style={styles.title}>
            {t('onboarding.motivationIntro.title')}
          </Text>
          
          <Text style={styles.subtitle}>
            {t('onboarding.motivationIntro.subtitle')}
          </Text>
        </View>
        
        <View style={styles.centerSection}>
          <View style={styles.imageGrid}>
            <MotivationImageGrid 
              images={motivationImages}
              itemSize={148}
              columnCount={2}
              gap={spacing.m}
              cornerRadius={16}
            />
          </View>
          
          <Text style={styles.bodyCopy}>
            {t('onboarding.motivationIntro.bodyCopy')}
          </Text>
        </View>
        
        <View style={styles.buttonSection}>
          <PrimaryButton
            title={t('buttons.letsDoIt')}
            onPress={onContinue}
            style={styles.continueButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.l,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center' as const,
    marginBottom: spacing.l,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.regular,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    paddingHorizontal: spacing.s,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGrid: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bodyCopy: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    paddingHorizontal: spacing.m,
    maxWidth: 280,
  },
  buttonSection: {
    paddingTop: spacing.l,
  },
  continueButton: {
    width: '100%',
  },
}); 