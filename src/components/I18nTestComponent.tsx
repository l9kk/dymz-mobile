import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { PrimaryButton } from '../components/design-system/atoms/PrimaryButton';
import { colors, spacing, typography } from '../components/design-system/tokens';

/**
 * Simple test component to validate i18n implementation
 * This can be temporarily imported in App.tsx to test translations
 */
export const I18nTestComponent: React.FC = () => {
  const { t, changeLanguage, currentLanguage, availableLanguages } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>i18n Test Component</Text>
      
      <Text style={styles.currentLang}>
        Current Language: {currentLanguage}
      </Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Translations:</Text>
        <Text>Continue: {t('common.continue')}</Text>
        <Text>Back: {t('common.back')}</Text>
        <Text>Loading: {t('common.loading')}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Onboarding Translations:</Text>
        <Text>Gender Title: {t('onboarding.gender.title')}</Text>
        <Text>Gender Subtitle: {t('onboarding.gender.subtitle')}</Text>
        <Text>Male: {t('onboarding.gender.male')}</Text>
        <Text>Female: {t('onboarding.gender.female')}</Text>
      </View>
      
      <View style={styles.buttonSection}>
        <Text style={styles.sectionTitle}>Test Language Switch:</Text>
        {availableLanguages.map((lang) => (
          <PrimaryButton
            key={lang.code}
            title={`${lang.flag} ${lang.name}`}
            onPress={() => changeLanguage(lang.code)}
            style={styles.langButton}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.l,
    backgroundColor: colors.backgroundPrimary,
  },
  title: {
    fontSize: typography.fontSizes.headingL,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  currentLang: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.l,
    padding: spacing.m,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.bodyL,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  buttonSection: {
    marginTop: spacing.l,
  },
  langButton: {
    marginBottom: spacing.s,
  },
  activeLangButton: {
    backgroundColor: colors.primary,
  },
});
