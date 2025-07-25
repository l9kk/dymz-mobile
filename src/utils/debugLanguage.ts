import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeLanguage } from '../i18n';
import * as Localization from 'expo-localization';

const LANGUAGE_STORAGE_KEY = 'dymz_app_language';

/**
 * Debug utilities for testing language detection
 */
export const debugLanguage = {
  /**
   * Clear stored language preference to test first-launch detection
   */
  clearStoredLanguage: async () => {
    try {
      await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
      console.log('✅ Cleared stored language preference');
      console.log('🔄 Restart the app to test first-launch language detection');
    } catch (error) {
      console.error('❌ Failed to clear language preference:', error);
    }
  },

  /**
   * Check what language is currently stored
   */
  getStoredLanguage: async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      console.log('📱 Stored language preference:', stored || 'None (will auto-detect)');
      return stored;
    } catch (error) {
      console.error('❌ Failed to get stored language:', error);
      return null;
    }
  },

  /**
   * Manually set language for testing
   */
  setLanguage: async (languageCode: 'en' | 'ru') => {
    try {
      await changeLanguage(languageCode);
      console.log(`🔄 Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('❌ Failed to change language:', error);
    }
  },

  /**
   * Show current language detection info
   */
  showLanguageInfo: async () => {
    const stored = await debugLanguage.getStoredLanguage();
    const deviceLocales = Localization.getLocales();
    const primaryLocale = deviceLocales[0];

    console.log('=== LANGUAGE DEBUG INFO ===');
    console.log('📱 Stored preference:', stored || 'None');
    console.log('🌐 Device primary locale:', primaryLocale?.languageTag || 'Unknown');
    console.log('🔤 Device language code:', primaryLocale?.languageCode || 'Unknown');
    console.log('🏁 Auto-detection will run on next app start if no stored preference');
    console.log('🇷🇺 Russian: Device locale starts with "ru"');
    console.log('🇺🇸 English: All other locales (default)');
    console.log('==========================');

    // Return data for UI display
    return {
      stored: stored || 'None',
      deviceLocale: primaryLocale?.languageTag || 'Unknown',
      deviceLanguage: primaryLocale?.languageCode || 'Unknown',
      willAutoDetect: !stored
    };
  },

  /**
   * Test auto-detection by clearing stored preference
   */
  testAutoDetection: async () => {
    try {
      await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
      console.log('✅ Cleared stored language preference');
      console.log('🔄 RESTART THE APP NOW to test auto-detection');
      console.log('📱 App will detect your device language on next startup');
    } catch (error) {
      console.error('❌ Failed to clear language preference:', error);
    }
  },

  /**
   * Reset app to first-time state (clear all stored data)
   */
  resetToFirstTime: async () => {
    try {
      await AsyncStorage.clear();
      console.log('🗑️ Cleared ALL app data - app will behave like first install');
      console.log('🔄 RESTART THE APP NOW');
      console.log('📱 App will auto-detect language and run first-time setup');
    } catch (error) {
      console.error('❌ Failed to clear app data:', error);
    }
  }
};

// Make it available globally in development
if (__DEV__) {
  (global as any).debugLanguage = debugLanguage;
}
