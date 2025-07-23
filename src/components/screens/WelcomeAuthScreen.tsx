import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoMark } from '../design-system/atoms/LogoMark';
import { AuthButton } from '../design-system/atoms/AuthButton';
import { colors, typography, spacing } from '../design-system/tokens';
import { useTranslation } from '../../hooks/useTranslation';

interface WelcomeAuthScreenProps {
  onEmailSignUp: () => void;
  onEmailSignIn: () => void;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onEmailSignUp,
  onEmailSignIn
}) => {
  const { t } = useTranslation();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <LogoMark size="splash" />
          <Text style={styles.logoSubtext}>skin ai</Text>
        </View>
        
        <Text style={styles.heroHeadline}>
          {t('auth.welcomeSubtitle')}
        </Text>
        
        <View style={styles.authSection}>
          <AuthButton
            title={t('buttons.signUp')}
            variant="primary"
            onPress={() => {
              console.log('WelcomeAuthScreen: Sign up pressed');
              onEmailSignUp();
            }}
            style={styles.authButton}
          />
          
          <AuthButton
            title={t('buttons.alreadyHaveAccount')}
            variant="link"
            onPress={() => {
              console.log('WelcomeAuthScreen: Already have account pressed');
              onEmailSignIn();
            }}
            style={styles.authButton}
          />
        </View>
        
        <Text style={styles.legalDisclaimer}>
          {t('auth.legalDisclaimer')}
        </Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoSubtext: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    marginTop: spacing.s,
    letterSpacing: 2,
  },
  heroHeadline: {
    fontSize: typography.fontSizes.displayXL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayXL,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.m,
  },
  authSection: {
    width: '100%',
    gap: spacing.m,
    marginBottom: spacing['2xl'],
  },
  authButton: {
    width: '100%',
  },
  legalDisclaimer: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.caption,
    paddingHorizontal: spacing.l,
  },
}); 