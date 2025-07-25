import { useTranslation as useI18nTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages } from '../i18n';

/**
 * Custom hook for translations with additional functionality
 * Provides easy access to translation function and language management
 */
export const useTranslation = () => {
    const { t, i18n } = useI18nTranslation();

    /**
     * Change the app language and persist the choice
     * @param languageCode - Language code (e.g., 'en', 'ru')
     */
    const handleChangeLanguage = async (languageCode: string) => {
        try {
            await changeLanguage(languageCode);
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    };

    /**
     * Get the current language code (reactive)
     */
    const currentLanguage = i18n.language;

    /**
     * Get available languages with their metadata
     */
    const availableLanguages = getAvailableLanguages();

    /**
     * Check if a specific language is currently active
     */
    const isLanguageActive = (languageCode: string) => {
        return currentLanguage === languageCode;
    };

    return {
        t,
        changeLanguage: handleChangeLanguage,
        currentLanguage,
        availableLanguages,
        isLanguageActive,
        // Expose the i18n instance for advanced usage
        i18n,
    };
};

export default useTranslation;
