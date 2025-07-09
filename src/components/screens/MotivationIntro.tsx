import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
            Next, let's find out what's driving you!
          </Text>
          
          <Text style={styles.subtitle}>
            Research shows that understanding your motivation is crucial to making real changes.
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
            We'll help you stay motivated and consistent so you don't fall off track!
          </Text>
        </View>
        
        <View style={styles.buttonSection}>
          <PrimaryButton
            title="Let's do it!"
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