import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  BackButton,
  SectionHeading,
  SegmentedTabBar,
  RoutineStepCard,
  PrimaryButton,
  LoadingSpinner
} from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import { getProductImageByIndex } from '../../utils/imageUrls';
import { useRoutines, useRoutineRecommendations, useCreateRoutine } from '../../hooks/api/useRoutines';
import { useLatestAnalysis } from '../../hooks/api/useAnalysis';
import { translateRoutines, translateBackendText, translateStepName, translateInstructions, translateProductName } from '../../utils/backendContentTranslation';
import { RoutineRecommendationResponse, RoutineCreateRequest } from '../../services/routinesApi';
import { useTranslation } from '../../hooks/useTranslation';
import { debugLanguage } from '../../utils/debugLanguage';

interface RoutineStep {
  stepNumber: number;
  productName: string;
  productRole: string;
  instruction: string;
  thumbnailUri: string | any; // Can be string URL or local asset object
  matchPercentage: number;
}

interface CustomRoutineDetailProps {
  onBack?: () => void;
  onRoutinesSaved?: () => void;
  morningRoutine?: RoutineStep[];
  eveningRoutine?: RoutineStep[];
}

export const CustomRoutineDetail: React.FC<CustomRoutineDetailProps> = ({
  onBack,
  onRoutinesSaved,
  morningRoutine,
  eveningRoutine
}) => {
  const { t, currentLanguage } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [routinesSaved, setRoutinesSaved] = useState(false);
  const [debugOutput, setDebugOutput] = useState<string>('');
  const tabOptions = [t('routine.morning'), t('routine.evening')];
  
  // Debug: Log current language
  console.log('🔍 CustomRoutineDetail - Current language:', currentLanguage);
  
  // Create translated default routines
  const defaultMorningRoutine: RoutineStep[] = [
    {
      stepNumber: 1,
      productName: t('routine.products.names.gentleFoamCleanser'),
      productRole: t('routine.products.categories.cleanser'),
      instruction: t('routine.products.instructions.gentleFoamCleanser'),
      thumbnailUri: getProductImageByIndex(0),
      matchPercentage: 95
    },
    {
      stepNumber: 2,
      productName: t('routine.products.names.vitaminCSerum'),
      productRole: t('routine.products.categories.antioxidantSerum'),
      instruction: t('routine.products.instructions.vitaminCSerum'),
      thumbnailUri: getProductImageByIndex(1),
      matchPercentage: 92
    },
    {
      stepNumber: 3,
      productName: t('routine.products.names.dailyMoisturizer'),
      productRole: t('routine.products.categories.moisturizer'),
      instruction: t('routine.products.instructions.dailyMoisturizer'),
      thumbnailUri: getProductImageByIndex(2),
      matchPercentage: 88
    },
    {
      stepNumber: 4,
      productName: t('routine.products.names.mineralSPF30'),
      productRole: t('routine.products.categories.sunscreen'),
      instruction: t('routine.products.instructions.mineralSPF30'),
      thumbnailUri: getProductImageByIndex(3),
      matchPercentage: 90
    }
  ];

  const defaultEveningRoutine: RoutineStep[] = [
    {
      stepNumber: 1,
      productName: t('routine.products.names.oilCleanser'),
      productRole: t('routine.products.categories.cleanser'),
      instruction: t('routine.products.instructions.oilCleanser'),
      thumbnailUri: getProductImageByIndex(4),
      matchPercentage: 93
    },
    {
      stepNumber: 2,
      productName: t('routine.products.names.retinolTreatment'),
      productRole: t('routine.products.categories.treatment'),
      instruction: t('routine.products.instructions.retinolTreatment'),
      thumbnailUri: getProductImageByIndex(5),
      matchPercentage: 96
    },
    {
      stepNumber: 3,
      productName: t('routine.products.names.nightRepairCream'),
      productRole: t('routine.products.categories.nightMoisturizer'),
      instruction: t('routine.products.instructions.nightRepairCream'),
      thumbnailUri: getProductImageByIndex(6),
      matchPercentage: 89
    },
    {
      stepNumber: 4,
      productName: t('routine.products.names.eyeRecoveryComplex'),
      productRole: t('routine.products.categories.eyeCream'),
      instruction: t('routine.products.instructions.eyeRecoveryComplex'),
      thumbnailUri: getProductImageByIndex(7),
      matchPercentage: 87
    }
  ];
  
  // Fetch user's routines and recommendations
  const { data: userRoutines, isLoading: routinesLoading, refetch: refetchRoutines } = useRoutines();
  const { data: analysis } = useLatestAnalysis();
  const { data: recommendations, isLoading: recommendationsLoading } = useRoutineRecommendations(
    analysis?.id ? { 
      analysis_id: analysis.id,
      routine_type: selectedTabIndex === 0 ? 'morning' : 'evening'
    } : { 
      analysis_id: '',
      routine_type: 'morning'
    },
    !!analysis?.id
  ) as { data: RoutineRecommendationResponse | undefined; isLoading: boolean };
  
  const createRoutineMutation = useCreateRoutine();

  // Convert API routine data to component format with translation
  const convertRoutineSteps = (routineSteps: any[] = []): RoutineStep[] => {
    return routineSteps.map((step, index) => {
      // Extract raw data from API
      const rawProductName = step.product?.name || step.product_name || t('routine.unknownProduct');
      const rawProductRole = step.product?.category || step.category || t('routine.product');
      const rawInstruction = step.instructions || step.instruction || t('routine.applyAsDirected');
      
      // Apply translations to the content
      const translatedProductName = translateProductName(rawProductName);
      const translatedProductRole = translateStepName(rawProductRole);
      const translatedInstruction = translateInstructions(rawInstruction);
      
      return {
        stepNumber: step.step_number || index + 1,
        productName: translatedProductName,
        productRole: translatedProductRole,
        instruction: translatedInstruction,
        thumbnailUri: step.product?.image_url || getProductImageByIndex(index),
        matchPercentage: step.match_percentage || Math.floor(Math.random() * 20) + 80 // Fallback with realistic range
      };
    });
  };

  // Get routines from API or fallback to props/defaults with translation
  const getRoutineData = () => {
    // If we have API recommendations, use them (with translation)
    if (recommendations?.recommendations) {
      const morningRoutine = recommendations.recommendations.find((r: any) => r.routine_type === 'morning');
      const eveningRoutine = recommendations.recommendations.find((r: any) => r.routine_type === 'evening');
      
      return {
        morning: morningRoutine ? convertRoutineSteps(morningRoutine.steps) : defaultMorningRoutine,
        evening: eveningRoutine ? convertRoutineSteps(eveningRoutine.steps) : defaultEveningRoutine
      };
    }
    
    // If we have user's existing routines, use them (with translation)
    if (userRoutines?.routines && userRoutines.routines.length > 0) {
      const morningRoutine = userRoutines.routines.find((r: any) => r.routine_type === 'morning');
      const eveningRoutine = userRoutines.routines.find((r: any) => r.routine_type === 'evening');
      
      return {
        morning: morningRoutine ? convertRoutineSteps(morningRoutine.steps) : defaultMorningRoutine,
        evening: eveningRoutine ? convertRoutineSteps(eveningRoutine.steps) : defaultEveningRoutine
      };
    }
    
    // If we have routines passed as props, use them (with translation applied to product names and instructions)
    if (morningRoutine || eveningRoutine) {
      return {
        morning: morningRoutine ? morningRoutine.map(step => ({
          ...step,
          productName: translateProductName(step.productName),
          productRole: translateStepName(step.productRole), 
          instruction: translateInstructions(step.instruction)
        })) : defaultMorningRoutine,
        evening: eveningRoutine ? eveningRoutine.map(step => ({
          ...step,
          productName: translateProductName(step.productName),
          productRole: translateStepName(step.productRole),
          instruction: translateInstructions(step.instruction)
        })) : defaultEveningRoutine
      };
    }
    
    // Always provide default routines to ensure content is shown
    // This fixes the empty morning routine issue
    return {
      morning: defaultMorningRoutine,
      evening: defaultEveningRoutine
    };
  };

  const routineData = getRoutineData();
  const currentRoutine = selectedTabIndex === 0 ? routineData.morning : routineData.evening;

  // Function to save routines
  const handleSaveRoutines = async () => {
    if (!analysis?.id) {
      Alert.alert(t('common.error'), t('routine.noAnalysisFound'));
      return;
    }

    setIsSaving(true);
    
    try {
      console.log('Saving routines for analysis:', analysis.id);
      
      // Prepare routine data for morning routine - aligned with OpenAPI schema
      const morningRoutineData: RoutineCreateRequest = {
        name: t('routine.myMorningRoutine'),
        routine_type: 'morning',
        steps: routineData.morning.map((step, index) => ({
          step: step.productName, // Use product name as step name (max 50 chars per API)
          order: step.stepNumber,
          instructions: step.instruction, // Max 500 chars per API
          duration_seconds: Math.min(Math.max(60, step.stepNumber * 30), 600), // 10-600 seconds per API
          optional: false
        })),
        analysis_id: analysis.id,
        notes: t('routine.aiGeneratedMorningNote') // Max 1000 chars per API
      };

      // Prepare routine data for evening routine - aligned with OpenAPI schema
      const eveningRoutineData: RoutineCreateRequest = {
        name: t('routine.myEveningRoutine'),
        routine_type: 'evening',
        steps: routineData.evening.map((step, index) => ({
          step: step.productName, // Use product name as step name (max 50 chars per API)
          order: step.stepNumber,
          instructions: step.instruction, // Max 500 chars per API
          duration_seconds: Math.min(Math.max(60, step.stepNumber * 30), 600), // 10-600 seconds per API
          optional: false
        })),
        analysis_id: analysis.id,
        notes: t('routine.aiGeneratedEveningNote') // Max 1000 chars per API
      };

      // Save both routines
      const [morningResult, eveningResult] = await Promise.all([
        createRoutineMutation.mutateAsync(morningRoutineData),
        createRoutineMutation.mutateAsync(eveningRoutineData)
      ]);

      console.log('Routines saved successfully:', { morning: morningResult.id, evening: eveningResult.id });
      
      // Refetch routines to update the UI
      await refetchRoutines();
      
      setRoutinesSaved(true);
      
      // Navigate directly to main app without showing popup
      if (onRoutinesSaved) {
        onRoutinesSaved();
      }
    } catch (error) {
      console.error('Failed to save routines:', error);
      Alert.alert(
        t('common.error'), 
        t('routine.failedToSaveRoutines'),
        [{ text: t('common.ok') }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while fetching data
  if (routinesLoading || recommendationsLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>{t('routine.loadingPersonalizedRoutines')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BackButton onPress={onBack} style={styles.backButton} />
      
      {/* Debug: Show current language */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            🔍 Language: {currentLanguage} {currentLanguage === 'ru' ? '🇷🇺' : '🇺🇸'}
          </Text>
          <PrimaryButton
            title="🔍 Show Language Info (Method 4)"
            onPress={async () => {
              // Run the enhanced debug method and capture output
              const info = await debugLanguage.showLanguageInfo();
              const output = `=== LANGUAGE DEBUG INFO ===
📱 Stored preference: ${info.stored}
🌐 Device locale: ${info.deviceLocale}
🔤 Device language: ${info.deviceLanguage}
🏁 Auto-detection: ${info.willAutoDetect ? 'Will run on restart' : 'Bypassed (using stored)'}
🇷🇺 Russian: Device locale starts with "ru"
🇺🇸 English: All other locales (default)
==========================`;
              setDebugOutput(output);
            }}
            style={styles.debugButton}
          />
          <PrimaryButton
            title="🧪 Test Auto-Detection"
            onPress={async () => {
              await debugLanguage.testAutoDetection();
              setDebugOutput(`✅ Cleared stored language preference
🔄 RESTART THE APP NOW to test auto-detection
📱 App will detect your device language on next startup`);
            }}
            style={styles.testButton}
          />
          <PrimaryButton
            title="🗑️ Reset to First Time"
            onPress={async () => {
              await debugLanguage.resetToFirstTime();
              setDebugOutput(`🗑️ Cleared ALL app data - like first install
🔄 RESTART THE APP NOW
📱 App will auto-detect language and run first-time setup`);
            }}
            style={styles.resetButton}
          />
          {debugOutput ? (
            <View style={styles.debugOutputContainer}>
              <Text style={styles.debugOutputText}>{debugOutput}</Text>
            </View>
          ) : null}
        </View>
      )}
      
      <View style={styles.header}>
        <SectionHeading>
          {t('routine.yourCustomRoutines')}
        </SectionHeading>
        
        <Text style={styles.subtitle}>
          {userRoutines?.routines && userRoutines.routines.length > 0 
            ? t('routine.customRoutineDesc')
            : t('routine.aiRoutineDesc')
          }
        </Text>
        
        {/* Show routine source info */}
        {userRoutines?.routines && userRoutines.routines.length > 0 && (
          <Text style={styles.sourceInfo}>
            {t('routine.activePersonalizedRoutines')}
          </Text>
        )}
      </View>

      <SegmentedTabBar
        options={tabOptions}
        selectedIndex={selectedTabIndex}
        onSelectionChange={setSelectedTabIndex}
        style={styles.tabBar}
      />

      <View style={styles.routineList}>
        {currentRoutine.map((step, index) => (
          <RoutineStepCard
            key={`${selectedTabIndex}-${index}`}
            stepNumber={step.stepNumber}
            productName={step.productName}
            productRole={step.productRole}
            instruction={step.instruction}
            thumbnailUri={step.thumbnailUri}
            matchPercentage={step.matchPercentage}
          />
        ))}
      </View>

      {/* Show save button if routines haven't been saved yet and no active routines exist */}
      {!routinesSaved && (
        <PrimaryButton
          title={isSaving ? t('loading.savingRoutines') : t('routine.saveMyRoutines')}
          onPress={handleSaveRoutines}
          disabled={isSaving}
          style={styles.saveButton}
        />
      )}

      {/* Show success message if routines were just saved */}
      {routinesSaved && (
        <View style={styles.successMessage}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successText}>{t('routine.routinesSavedSuccessfully')}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.m,
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.m,
  },
  tabBar: {
    marginBottom: spacing.xl,
  },
  routineList: {
    paddingBottom: spacing.l,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.m,
    textAlign: 'center',
  },
  sourceInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.s,
    fontStyle: 'italic',
  },
  saveButton: {
    marginTop: spacing.l,
    marginBottom: spacing.m,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.m,
    marginBottom: spacing.m,
    padding: spacing.m,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  successEmoji: {
    fontSize: 24,
    marginRight: spacing.s,
  },
  successText: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
  },
  debugContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.s,
    marginBottom: spacing.m,
    borderRadius: 4,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilies.body,
  },
  debugButton: {
    marginTop: spacing.s,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
  },
  testButton: {
    marginTop: spacing.s,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    backgroundColor: '#FF6B35',
  },
  resetButton: {
    marginTop: spacing.s,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    backgroundColor: '#DC3545',
  },
  debugOutputContainer: {
    marginTop: spacing.s,
    padding: spacing.s,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  debugOutputText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});