import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';

const LANGUAGE_STORAGE_KEY = 'dymz_app_language';

const resources = {
    'en': { translation: en },
    'en-US': { translation: en },
    'ru': { translation: ru },
    'ru-RU': { translation: ru },
};

const initI18n = async () => {
    try {
        // Check for manually saved language preference
        let savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        // If no saved preference, use system language with smart detection
        if (!savedLanguage) {
            const systemLocales = Localization.getLocales();
            const primaryLocale = systemLocales[0]?.languageCode || 'en';
            console.log('🌐 System locale detected:', primaryLocale);

            // Map system locale to supported languages
            if (primaryLocale.startsWith('ru')) {
                savedLanguage = 'ru';
                console.log('🇷🇺 Russian language auto-detected');
            } else {
                savedLanguage = 'en'; // Default fallback
                console.log('🇺🇸 English language set as default');
            }

            // Save the auto-detected language for future use
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, savedLanguage);
        } else {
            console.log('📱 Using saved language preference:', savedLanguage);
        }

        await i18n.use(initReactI18next).init({
            compatibilityJSON: 'v4',
            resources,
            lng: savedLanguage,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false, // React already escapes values
            },
            // Enable debugging in development
            debug: __DEV__,
            // Cache settings
            saveMissing: __DEV__, // Only save missing keys in development
            // Force reload to prevent caching issues
            load: 'languageOnly',
            cleanCode: true,
            // Ensure proper re-rendering when language changes
            react: {
                useSuspense: false,
            },
        });

        console.log('✅ i18n initialized successfully with language:', savedLanguage);
    } catch (error) {
        console.error('❌ Failed to initialize i18n:', error);
        // Fallback to English if something goes wrong
        await i18n.use(initReactI18next).init({
            compatibilityJSON: 'v4',
            resources,
            lng: 'en',
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
            // Force reload to prevent caching issues
            load: 'languageOnly',
            cleanCode: true,
            // Ensure proper re-rendering when language changes
            react: {
                useSuspense: false,
            },
        });
    }
};

// Helper function to change language and persist the choice
export const changeLanguage = async (languageCode: string) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
        await i18n.changeLanguage(languageCode);
        console.log('🔄 Language changed to:', languageCode);
    } catch (error) {
        console.error('❌ Failed to change language:', error);
    }
};

// Helper function to get current language
export const getCurrentLanguage = () => i18n.language;

// Helper function to get available languages
export const getAvailableLanguages = () => [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

// Initialize i18n
initI18n();

export default i18n;
