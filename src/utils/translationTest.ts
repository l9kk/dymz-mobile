/**
 * Testing the Backend Content Translation System
 * 
 * This file demonstrates how the translation system works
 * and can be used to test translation functionality.
 */

import {
  translateStepName,
  translateInstructions,
  translateProductName,
  translateRoutineStep,
  translateBackendText
} from './backendContentTranslation';

// Example Russian content that might come from the backend
const testRussianContent = {
  stepNames: [
    'Очищение лица',
    'Увлажнение',
    'Сыворотка с витамином C',
    'Солнцезащитный крем',
    'Тонер',
    'Средство с ретинолом',
    'Ночной восстанавливающий крем',
    'Восстанавливающий комплекс для глаз',
  ],
  instructions: [
    'Нанесите на влажное лицо',
    'массируйте 30 секунд',
    'смойте теплой водой',
    'Нанесите равномерно на лицо и шею',
    'массируйте до полного впитывания',
    'massage на сухую кожу для растворения макияжа и солнцезащитного крема, rinse with water.',
    'Нанесите количество размером с горошину 2-3 раза в неделю, избегайте области глаз.',
    'Нанесите обильно to face and neck как последний шаг в вашем уходе.',
    'Мягко похлопайте вокруг области глаз безымянным пальцем',
  ],
  productNames: [
    'Нежная пенка для умывания',
    'Гидрофильное масло',
    'Увлажняющий крем',
    'Сыворотка с витамином C',
    'Средство с ретинолом',
    'Ночной восстанавливающий крем',
    'Восстанавливающий комплекс для глаз',
  ],
  routineStep: {
    step: 'Очищение лица',
    instructions: 'massage на сухую кожу для растворения макияжа и солнцезащитного крема, rinse with water.',
    product_name: 'Гидрофильное масло',
    order: 1,
    duration_seconds: 60,
  }
};

/**
 * Test function to demonstrate translations
 */
export const testTranslations = () => {
  console.log('🧪 Testing Backend Content Translation System\n');

  // Test step name translations
  console.log('📋 Step Name Translations:');
  testRussianContent.stepNames.forEach(step => {
    const translated = translateStepName(step);
    console.log(`  "${step}" → "${translated}"`);
  });

  // Test instruction translations
  console.log('\n📝 Instruction Translations:');
  testRussianContent.instructions.forEach(instruction => {
    const translated = translateInstructions(instruction);
    console.log(`  "${instruction}" → "${translated}"`);
  });

  // Test product name translations
  console.log('\n🧴 Product Name Translations:');
  testRussianContent.productNames.forEach(product => {
    const translated = translateProductName(product);
    console.log(`  "${product}" → "${translated}"`);
  });

  // Test complete routine step translation
  console.log('\n🔄 Complete Routine Step Translation:');
  const translatedStep = translateRoutineStep(testRussianContent.routineStep);
  console.log('Original step:', testRussianContent.routineStep);
  console.log('Translated step:', translatedStep);

  console.log('\n✅ Translation testing complete!');
};

/**
 * Test specific translation cases
 */
export const testSpecificCases = () => {
  console.log('🔍 Testing Specific Translation Cases\n');

  const testCases = [
    'Очищение лица гелем',
    'Увлажнение кожи кремом',
    'Нанесите сыворотку на чистую кожу',
    'массируйте круговыми движениями до впитывания',
    'Гидрофильное масло для снятия макияжа',
  ];

  testCases.forEach(text => {
    const translated = translateBackendText(text);
    console.log(`"${text}" → "${translated}"`);
  });
};

// Export test functions for easy access
export default {
  testTranslations,
  testSpecificCases,
};
