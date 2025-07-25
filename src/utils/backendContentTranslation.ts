/**
 * Backend Content Translation Utility
 * 
 * This utility translates Russian content from backend responses to English
 * when the user has English selected as their language preference.
 * 
 * The backend currently returns content in Russian, so we need a frontend
 * translation layer to convert it to the user's preferred language.
 */

import { getCurrentLanguage } from '../i18n';

// Russian to English translation mappings for skincare content
const ROUTINE_STEP_TRANSLATIONS: Record<string, string> = {
  // Cleansing steps
  'Очищение лица': 'Face Cleansing',
  'Умывание': 'Face Washing',
  'Очищение': 'Cleansing',
  'Очищающий гель': 'Cleansing Gel',
  'Пенка для умывания': 'Cleansing Foam',
  'Мицеллярная вода': 'Micellar Water',
  'Гидрофильное масло': 'Cleansing Oil',
  'Молочко для умывания': 'Cleansing Milk',

  // Moisturizing steps
  'Увлажнение': 'Moisturizing',
  'Увлажняющий крем': 'Moisturizing Cream',
  'Дневной крем': 'Day Cream',
  'Ночной крем': 'Night Cream',
  'Легкий увлажняющий крем': 'Light Moisturizer',
  'Питательный крем': 'Nourishing Cream',
  'Ночной восстанавливающий крем': 'Night Repair Cream',

  // Serum and treatment steps
  'Сыворотка': 'Serum',
  'Сыворотка с витамином C': 'Vitamin C Serum',
  'Гиалуроновая сыворотка': 'Hyaluronic Serum',
  'Антивозрастная сыворотка': 'Anti-aging Serum',
  'Сыворотка с ретинолом': 'Retinol Serum',
  'Сыворотка с ниацинамидом': 'Niacinamide Serum',
  'Средство с ретинолом': 'Retinol Treatment',
  'Восстанавливающий комплекс для глаз': 'Eye Recovery Complex',

  // Sun protection
  'Солнцезащитный крем': 'Sunscreen',
  'SPF защита': 'SPF Protection',
  'Санскрин': 'Sunscreen',
  'Защита от солнца': 'Sun Protection',

  // Treatments
  'Тонер': 'Toner',
  'Тоник': 'Toner',
  'Эссенция': 'Essence',
  'Маска для лица': 'Face Mask',
  'Скраб': 'Scrub',
  'Пилинг': 'Peeling',
  'Патчи для глаз': 'Eye Patches',
  'Крем для глаз': 'Eye Cream',

  // General steps
  'Нанесение': 'Application',
  'Массаж': 'Massage',
  'Смывание': 'Rinsing',
  'Подготовка кожи': 'Skin Preparation',
};

const INSTRUCTION_TRANSLATIONS: Record<string, string> = {
  // Application instructions
  'Нанесите на влажное лицо': 'Apply to damp face',
  'Нанесите на сухую кожу': 'Apply to dry skin',
  'Нанесите на очищенную кожу': 'Apply to clean skin',
  'Нанесите равномерно': 'Apply evenly',
  'Нанесите тонким слоем': 'Apply a thin layer',
  'Нанесите массирующими движениями': 'Apply with massaging motions',

  // Massage instructions
  'массируйте': 'massage',
  'мягко массируйте': 'gently massage',
  'массируйте круговыми движениями': 'massage in circular motions',
  'массируйте до полного впитывания': 'massage until fully absorbed',
  'массируйте 30 секунд': 'massage for 30 seconds',
  'массируйте 1 минуту': 'massage for 1 minute',
  'massage на сухую кожу для растворения макияжа и солнцезащитного крема': 'massage onto dry skin to dissolve makeup and sunscreen',
  'на сухую кожу для растворения макияжа и солнцезащитного крема': 'onto dry skin to dissolve makeup and sunscreen',
  'для растворения макияжа и солнцезащитного крема': 'to dissolve makeup and sunscreen',

  // Common Russian words in mixed content
  'мягко': 'gently',
  'чистое лицо': 'clean face',
  'до впитывания': 'until absorbed',
  'солнце': 'sun',
  'Нанесите 2-3 капли': 'Apply 2-3 drops',
  'Повторно наносите каждые 2 часа': 'Reapply every 2 hours',
  'за 15 минут до выхода': '15 minutes before going outside',
  'каждые 2 часа': 'every 2 hours',

  // Rinsing instructions
  'смойте теплой водой': 'rinse with warm water',
  'смойте прохладной водой': 'rinse with cool water',
  'смойте водой': 'rinse with water',
  'тщательно смойте': 'rinse thoroughly',
  'аккуратно смойте': 'gently rinse off',

  // Timing instructions
  'оставьте на 10 минут': 'leave for 10 minutes',
  'оставьте на 15 минут': 'leave for 15 minutes',
  'оставьте на 20 минут': 'leave for 20 minutes',
  'подождите полного высыхания': 'wait for complete drying',
  'дайте впитаться': 'allow to absorb',
  '2-3 раза в неделю': '2-3 times per week',
  'избегайте области глаз': 'avoid the eye area',
  'Нанесите количество размером с горошину': 'Apply a pea-sized amount',
  'Нанесите обильно': 'Apply generously',

  // Application areas
  'на лицо и шею': 'to face and neck',
  'вокруг глаз': 'around the eyes',
  'на Т-зону': 'to T-zone',
  'на проблемные участки': 'to problem areas',
  'избегая области вокруг глаз': 'avoiding the eye area',
  'вокруг области глаз': 'around the eye area',
  'безымянным пальцем': 'with your ring finger',
  'мягко похлопайте': 'gently pat',
  'как последний шаг в вашем уходе': 'as the last step in your routine',

  // General instructions
  'используйте утром': 'use in the morning',
  'используйте вечером': 'use in the evening',
  'используйте ежедневно': 'use daily',
  'используйте 2-3 раза в неделю': 'use 2-3 times per week',
  'для достижения лучших результатов': 'for best results',
};

const PRODUCT_NAME_TRANSLATIONS: Record<string, string> = {
  'Нежная пенка для умывания': 'Gentle Cleansing Foam',
  'Гидрофильное масло': 'Cleansing Oil',
  'Увлажняющий крем': 'Moisturizing Cream',
  'Солнцезащитный крем': 'Sunscreen',
  'Сыворотка с витамином C': 'Vitamin C Serum',
  'Гиалуроновая сыворотка': 'Hyaluronic Serum',
  'Ночной восстанавливающий крем': 'Night Repair Cream',
  'Крем для области вокруг глаз': 'Eye Cream',
  'Очищающий гель': 'Cleansing Gel',
  'Тонизирующий лосьон': 'Toning Lotion',
  'Средство с ретинолом': 'Retinol Treatment',
  'Восстанавливающий комплекс для глаз': 'Eye Recovery Complex',
  'Ежедневный увлажняющий крем': 'Daily Moisturizing Cream',
  'Минеральный SPF 30': 'Mineral SPF 30',
};

/**
 * Translates Russian routine step names to English
 */
export const translateStepName = (stepName: string): string => {
  const currentLang = getCurrentLanguage();

  // Return original text if current language is Russian or not English
  if (currentLang === 'ru' || currentLang !== 'en') {
    return stepName;
  }

  // Check for direct translation match
  if (ROUTINE_STEP_TRANSLATIONS[stepName]) {
    return ROUTINE_STEP_TRANSLATIONS[stepName];
  }

  // Check for partial matches (for complex step names)
  let translatedStep = stepName;
  Object.entries(ROUTINE_STEP_TRANSLATIONS).forEach(([russian, english]) => {
    if (stepName.includes(russian)) {
      translatedStep = translatedStep.replace(russian, english);
    }
  });

  return translatedStep;
};

/**
 * Translates Russian instructions to English
 */
export const translateInstructions = (instructions: string): string => {
  const currentLang = getCurrentLanguage();

  // Return original text if current language is Russian or not English
  if (currentLang === 'ru' || currentLang !== 'en') {
    return instructions;
  }

  let translatedInstructions = instructions;

  // Apply translations in order of length (longest first to avoid partial replacements)
  const sortedTranslations = Object.entries(INSTRUCTION_TRANSLATIONS)
    .sort(([a], [b]) => b.length - a.length);

  sortedTranslations.forEach(([russian, english]) => {
    // Use case-insensitive global replacement
    const regex = new RegExp(russian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    translatedInstructions = translatedInstructions.replace(regex, english);
  });

  // Handle specific mixed content patterns found in the screenshot
  translatedInstructions = translatedInstructions
    // Fix mixed English/Russian patterns
    .replace(/massage на сухую кожу/gi, 'massage onto dry skin')
    .replace(/Нанесите обильно to face and neck/gi, 'Apply generously to face and neck')
    .replace(/как последний шаг в вашем уходе/gi, 'as the last step in your routine')
    .replace(/Мягко похлопайте вокруг области глаз/gi, 'Gently pat around the eye area')
    .replace(/Нанесите 2-3 капли to чистое лицо/gi, 'Apply 2-3 drops to clean face')
    .replace(/gently pat до впитывания/gi, 'gently pat until absorbed')
    .replace(/Apply generously за 15 минут до выхода to солнце/gi, 'Apply generously 15 minutes before going outside in the sun')
    // Clean up any remaining Russian prepositions mixed with English
    .replace(/\s+на\s+/gi, ' to ')
    .replace(/\s+в\s+/gi, ' in ')
    .replace(/\s+с\s+/gi, ' with ')
    .replace(/\s+до\s+/gi, ' until ')
    .replace(/\s+за\s+/gi, ' ')
    // Fix any double spaces
    .replace(/\s+/g, ' ')
    .trim();

  return translatedInstructions;
};

/**
 * Translates Russian product names to English
 */
export const translateProductName = (productName: string): string => {
  const currentLang = getCurrentLanguage();

  // Return original text if current language is Russian or not English
  if (currentLang === 'ru' || currentLang !== 'en') {
    return productName;
  }

  // Check for direct translation match
  if (PRODUCT_NAME_TRANSLATIONS[productName]) {
    return PRODUCT_NAME_TRANSLATIONS[productName];
  }

  // Check for partial matches
  let translatedName = productName;
  Object.entries(PRODUCT_NAME_TRANSLATIONS).forEach(([russian, english]) => {
    if (productName.includes(russian)) {
      translatedName = translatedName.replace(russian, english);
    }
  });

  return translatedName;
};

/**
 * Translates a complete routine step object
 */
export const translateRoutineStep = (step: any) => {
  if (!step) return step;

  return {
    ...step,
    step: step.step ? translateStepName(step.step) : step.step,
    instructions: step.instructions ? translateInstructions(step.instructions) : step.instructions,
    product_name: step.product_name ? translateProductName(step.product_name) : step.product_name,
  };
};

/**
 * Translates an array of routine steps
 */
export const translateRoutineSteps = (steps: any[]): any[] => {
  if (!Array.isArray(steps)) return steps;

  return steps.map(translateRoutineStep);
};

/**
 * Translates a complete routine object
 */
export const translateRoutine = (routine: any) => {
  if (!routine) return routine;

  return {
    ...routine,
    name: routine.name ? translateStepName(routine.name) : routine.name,
    description: routine.description ? translateInstructions(routine.description) : routine.description,
    steps: routine.steps ? translateRoutineSteps(routine.steps) : routine.steps,
  };
};

/**
 * Translates an array of routines
 */
export const translateRoutines = (routines: any[]): any[] => {
  if (!Array.isArray(routines)) return routines;

  return routines.map(translateRoutine);
};

/**
 * Generic text translation function for any Russian text
 */
export const translateBackendText = (text: string): string => {
  if (!text || typeof text !== 'string') return text;

  const currentLang = getCurrentLanguage();

  // Return original text if current language is Russian or not English
  if (currentLang === 'ru' || currentLang !== 'en') {
    return text;
  }

  // Try step name translation first
  let translated = translateStepName(text);

  // If no step name translation, try instruction translation
  if (translated === text) {
    translated = translateInstructions(text);
  }

  // If no instruction translation, try product name translation
  if (translated === text) {
    translated = translateProductName(text);
  }

  return translated;
};

// Export all translation functions
export default {
  translateStepName,
  translateInstructions,
  translateProductName,
  translateRoutineStep,
  translateRoutineSteps,
  translateRoutine,
  translateRoutines,
  translateBackendText,
};
