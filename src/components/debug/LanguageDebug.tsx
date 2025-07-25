import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { colors, spacing } from '../design-system/tokens';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageDebug: React.FC = () => {
  const { t, currentLanguage, changeLanguage, availableLanguages } = useTranslation();
  const [storedLanguage, setStoredLanguage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkStoredLanguage = async () => {
      const stored = await AsyncStorage.getItem('dymz_app_language');
      setStoredLanguage(stored);
    };
    checkStoredLanguage();
  }, [currentLanguage]);

  const handleLanguageChange = async (lang: string) => {
    console.log('🔧 Debug: Changing language to:', lang);
    await changeLanguage(lang);
    // Re-check stored language after change
    const stored = await AsyncStorage.getItem('dymz_app_language');
    setStoredLanguage(stored);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Language Debug Panel</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Current Language: <Text style={styles.value}>{currentLanguage}</Text></Text>
        <Text style={styles.label}>Stored Language: <Text style={styles.value}>{storedLanguage || 'None'}</Text></Text>
        <Text style={styles.label}>Sample Translation (routine.title): </Text>
        <Text style={styles.value}>"{t('routine.title')}"</Text>
      </View>

      <View style={styles.buttonSection}>
        {availableLanguages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.button,
              currentLanguage === lang.code && styles.activeButton
            ]}
            onPress={() => handleLanguageChange(lang.code)}
          >
            <Text style={[
              styles.buttonText,
              currentLanguage === lang.code && styles.activeButtonText
            ]}>
              {lang.flag} {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    margin: spacing.m,
    padding: spacing.l,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.ctaBackground,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  infoSection: {
    marginBottom: spacing.l,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: colors.backgroundPrimary,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeButton: {
    backgroundColor: colors.ctaBackground,
    borderColor: colors.ctaBackground,
  },
  buttonText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  activeButtonText: {
    color: colors.ctaText,
    fontWeight: '600',
  },
});
