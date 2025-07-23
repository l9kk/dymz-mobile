import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { CircleAvatarCluster } from '../design-system/molecules/CircleAvatarCluster';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { colors, typography, spacing } from '../design-system/tokens';

interface KnowYouBetterIntroProps {
  onContinue: () => void;
}

export const KnowYouBetterIntro: React.FC<KnowYouBetterIntroProps> = ({
  onContinue
}) => {
  const { t } = useTranslation();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('onboarding.knowYouBetter.title')}
        </Text>
        
        <Text style={styles.subtitle}>
          {t('onboarding.knowYouBetter.subtitle')}
        </Text>
        
        <CircleAvatarCluster 
          caption={t('onboarding.knowYouBetter.caption')}
          style={styles.avatarCluster}
        />
        
        <Text style={styles.bodyCopy}>
          {t('onboarding.knowYouBetter.bodyCopy')}
        </Text>
        
        <PrimaryButton 
          title={t('buttons.letsDoIt')} 
          onPress={onContinue}
          style={styles.button}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    marginBottom: spacing.m,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginBottom: spacing.l,
    paddingHorizontal: spacing.m,
  },
  avatarCluster: {
    marginVertical: spacing.xl,
  },
  bodyCopy: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
  },
  button: {
    width: '100%',
  },
}); 