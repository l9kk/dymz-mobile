import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../tokens';
import { useTranslation } from '../../../hooks/useTranslation';

interface LanguageSelectorProps {
  style?: any;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style }) => {
  const { t, changeLanguage, currentLanguage, availableLanguages } = useTranslation();

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      await changeLanguage(languageCode);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>
        {t('settings.language')}
      </Text>
      
      <View style={styles.languageOptions}>
        {availableLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageOption,
              currentLanguage === language.code && styles.selectedOption
            ]}
            onPress={() => handleLanguageChange(language.code)}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <Text style={styles.flagEmoji}>{language.flag}</Text>
              <Text style={[
                styles.languageName,
                currentLanguage === language.code && styles.selectedText
              ]}>
                {language.name}
              </Text>
            </View>
            
            {currentLanguage === language.code && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.headingS,
    fontFamily: typography.fontFamilies.primary,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  languageOptions: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: spacing.m,
  },
  languageName: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium,
  },
  selectedOption: {
    backgroundColor: colors.backgroundPrimary,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: typography.fontWeights.semibold,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
