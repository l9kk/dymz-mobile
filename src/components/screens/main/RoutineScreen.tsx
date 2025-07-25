import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { 
  SectionHeading,
  StatParagraph,
  PrimaryButton,
  LoadingSpinner,
  RoutineStepCard,
  RoutineSummaryCard,
  ProductCard,
  StatPill,
  SegmentedTabBar,
  ConfettiCelebration
} from '../../design-system';
import { useDailyCompletion } from '../../../hooks/useDailyCompletion';
import { colors, spacing } from '../../design-system/tokens';
import { useActiveRoutines, useRoutineStats, useRecordRoutineProgress } from '../../../hooks/api/useRoutines';
import { useUserProfile, useUserStats, useProfileCompletion } from '../../../hooks/api/useUser';
import { useAuthStore } from '../../../stores/authStore';
import { useUserStreaks } from '../../../hooks/api/useGamification';
import { useTranslation } from '../../../hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProductIconByCategory } from '../../../utils/imageUrls';
import { Ionicons } from '@expo/vector-icons';
import { translateRoutineStep, translateRoutines } from '../../../utils/backendContentTranslation';

interface RoutineScreenProps {
  onNavigateToProducts?: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToEditRoutine?: (routine: any) => void;
}

// Helper function to map step names to product icons
const getStepThumbnail = (stepName: string): any => {
  const lowerStep = stepName.toLowerCase();
  
  if (lowerStep.includes('cleanser') || lowerStep.includes('cleansing') || lowerStep.includes('wash')) {
    return getProductIconByCategory('cleanser');
  } else if (lowerStep.includes('serum') || lowerStep.includes('treatment') || lowerStep.includes('toner')) {
    return getProductIconByCategory('serum');
  } else if (lowerStep.includes('moisturizer') || lowerStep.includes('cream') || lowerStep.includes('lotion')) {
    return getProductIconByCategory('moisturizer');
  } else if (lowerStep.includes('sunscreen') || lowerStep.includes('spf') || lowerStep.includes('sun protection')) {
    return getProductIconByCategory('sunscreen');
  } else if (lowerStep.includes('eye') || lowerStep.includes('mask')) {
    return getProductIconByCategory('treatment');
  } else {
    // Default to serum icon for other treatments
    return getProductIconByCategory('serum');
  }
};


export const RoutineScreen: React.FC<RoutineScreenProps> = ({
  onNavigateToProducts,
  onNavigateToHistory,
  onNavigateToEditRoutine
}) => {
  const { t, currentLanguage } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState<'morning' | 'evening'>('morning');
  const [completedSteps, setCompletedSteps] = React.useState<string[]>([]);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [previousStreak, setPreviousStreak] = React.useState(0);
  
  // Fetch data
  const { data: routines, refetch: refetchRoutines, error: routinesError } = useActiveRoutines();
  const { data: stats, refetch: refetchStats } = useRoutineStats();
  const { data: profile } = useUserProfile();
  const { data: streakData } = useUserStreaks();
  const { isAuthenticated } = useAuthStore();
  const recordProgress = useRecordRoutineProgress();
  const insets = useSafeAreaInsets();
  
  // Track previous streak for animation
  React.useEffect(() => {
    if (streakData?.current_streak !== undefined) {
      setPreviousStreak(streakData.current_streak);
    }
  }, [streakData?.current_streak]);
  
  // Daily completion tracking
  const { 
    isRoutineCompletedToday, 
    markRoutineCompleted, 
    bothRoutinesCompletedToday,
    isLoading: isDailyStatusLoading
  } = useDailyCompletion();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchRoutines(),
        refetchStats()
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    }
    setRefreshing(false);
  };

  const handleStepComplete = (stepIdentifier: string) => {
    if (completedSteps.includes(stepIdentifier)) {
      setCompletedSteps(prev => prev.filter(id => id !== stepIdentifier));
    } else {
      setCompletedSteps(prev => [...prev, stepIdentifier]);
    }
  };

  const handleCheckIn = () => {
    const routinesArray = Array.isArray(routines?.routines) ? routines.routines : [];
    const currentRoutine = routinesArray.find((r: any) => 
      r.routine_type === (selectedTab === 'morning' ? 'morning' : 'evening')
    );
    
    if (!currentRoutine) {
      console.error('No current routine found for', selectedTab);
      return;
    }

    if (completedSteps.length === 0) {
      console.error('No steps completed');
      return;
    }

    try {
      // Create completed steps data - ensure proper schema alignment
      const completedStepsData = routineSteps
        .filter((step: any, index: number) => 
          completedSteps.includes(`${currentRoutine.id}-${index}`)
        )
        .map((step: any) => ({
          step: step.step,
          completed_at: new Date().toISOString(), // ISO datetime string as required by API
          duration_seconds: step.duration_seconds || 60
        }));

      if (completedStepsData.length === 0) {
        console.error('No valid completed steps data');
        return;
      }

      // Submit progress with proper schema
      recordProgress.mutate({
        routine_id: currentRoutine.id,
        completed_steps: completedStepsData,
        total_time_minutes: Math.round(completedStepsData.reduce((total: number, step: any) => total + (step.duration_seconds || 60), 0) / 60),
        user_notes: `Completed ${selectedTab} routine with ${completedStepsData.length} steps!`
      }, {
        onSuccess: async () => {
          // Mark routine as completed for the day
          await markRoutineCompleted(selectedTab);
          
          // Show celebration animation only once
          setTimeout(() => {
            setShowCelebration(true);
          }, 100);
          
          // Reset completed steps on success
          setCompletedSteps([]);
        },
        onError: (error) => {
          console.error('Failed to record progress:', error);
        }
      });
    } catch (error) {
      console.error('Error preparing progress data:', error);
    }
  };

  const handleEditRoutine = () => {
    const routinesArray = Array.isArray(routines?.routines) ? routines.routines : [];
    const currentRoutine = routinesArray.find((r: any) => 
      r.routine_type === (selectedTab === 'morning' ? 'morning' : 'evening')
    );
    
    if (currentRoutine && onNavigateToEditRoutine) {
      onNavigateToEditRoutine({
        ...currentRoutine,
        routineType: selectedTab, // Pass current tab for context
      });
    }
  };

  const isLoading = !routines && !stats || isDailyStatusLoading;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>{t('routine.loading')}</Text>
      </View>
    );
  }

  // Safe data access with proper null checks and translation
  const routinesArray = Array.isArray(routines?.routines) ? translateRoutines(routines.routines) : [];
  const currentRoutine = routinesArray.find((r: any) => 
    r.routine_type === (selectedTab === 'morning' ? 'morning' : 'evening')
  );
  
  const routineSteps = Array.isArray(currentRoutine?.steps) ? currentRoutine.steps : [];
  const completionRate = stats?.average_completion_rate ? stats.average_completion_rate * 100 : 0;
  const currentStreak = streakData?.current_streak || 0;
  const totalCompleted = stats?.total_completions || 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: spacing.xl + insets.bottom + 100 } // Extra padding for tab bar + safe area
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header Section */}
        <View style={[styles.headerSection, { paddingTop: spacing.l + insets.top }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerContent}>
              <SectionHeading>{t('routine.title')}</SectionHeading>
            </View>
            
            {/* Edit Button - only show if user has routines */}
            {routines?.routines && routines.routines.length > 0 && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleEditRoutine}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={20} color={colors.primary} />
                <Text style={styles.editButtonText}>{t('routine.edit')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Routine Tabs */}
        <View style={styles.tabsContainer}>
          <SegmentedTabBar
            options={[t('routine.tabs.morning'), t('routine.tabs.evening')]}
            selectedIndex={selectedTab === 'morning' ? 0 : 1}
            onSelectionChange={(index: number) => {
              const newTab = index === 0 ? 'morning' : 'evening';
              setSelectedTab(newTab);
              setCompletedSteps([]);
            }}
          />
        </View>

        {/* Routine Summary */}
        {currentRoutine && (
          <View style={styles.summaryContainer}>
            <RoutineSummaryCard
              type={selectedTab === 'morning' ? 'am' : 'pm'}
              stepCount={routineSteps.length}
              estimatedTime={routineSteps.length * 2}
              completedToday={isRoutineCompletedToday(selectedTab)}
            />
            
            {/* Completion Status Indicator */}
            {isRoutineCompletedToday(selectedTab) && (
              <View style={styles.completedIndicator}>
                <Text style={styles.completedText}>
                  {t('routine.completedToday', { 
                    type: selectedTab === 'morning' ? t('routine.morningFull') : t('routine.eveningFull') 
                  })}
                </Text>
                {!isRoutineCompletedToday(selectedTab === 'morning' ? 'evening' : 'morning') && (
                  <Text style={styles.remainingText}>
                    {selectedTab === 'morning' 
                      ? t('routine.eveningRemaining')
                      : t('routine.morningRemaining')
                    }
                  </Text>
                )}
                {bothRoutinesCompletedToday() && (
                  <Text style={styles.allCompleteText}>
                    {t('routine.allCompleted')}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Routine Steps */}
        {routineSteps.length > 0 ? (
          <View style={styles.section}>
            <SectionHeading style={styles.sectionTitle}>
              {t('routine.todaysSteps')}
            </SectionHeading>
            

            {routineSteps.map((step: any, index: number) => {
              // Translate the step content from Russian to English if needed
              const translatedStep = translateRoutineStep(step);
              
              const stepIdentifier = `${currentRoutine?.id}-${index}`;
              const isRoutineCompleted = isRoutineCompletedToday(selectedTab);
              const isStepInCompletedArray = completedSteps.includes(stepIdentifier);
              const finalIsCompleted = isRoutineCompleted || isStepInCompletedArray;
              
              console.log('� Translation applied:', {
                stepIdentifier,
                originalStep: step.step,
                translatedStep: translatedStep.step,
                currentLanguage
              });
              
              return (
                <TouchableOpacity
                  key={stepIdentifier}
                  onPress={() => !isRoutineCompleted && handleStepComplete(stepIdentifier)}
                  disabled={isRoutineCompleted}
                  style={isRoutineCompleted ? styles.disabledStep : undefined}
                >
                  <RoutineStepCard
                    stepNumber={translatedStep.order || index + 1}
                    title={translatedStep.step || t('routine.stepFallback', { number: index + 1 })}
                    description={translatedStep.instructions || t('routine.defaultStepInstructions')}
                    isCompleted={finalIsCompleted}
                    productInfo={translatedStep.product_id ? {
                      name: translatedStep.product_name || t('routine.productFallback', { number: index + 1 }),
                      brand: t('routine.recommendedBrand')
                    } : undefined}
                    style={styles.stepCard}
                    thumbnailUri={getStepThumbnail(translatedStep.step || '')}
                  />
                </TouchableOpacity>
              );
            })}

            {/* Check-in Button */}
            <View style={styles.checkInContainer}>
              <PrimaryButton
                title={isRoutineCompletedToday(selectedTab)
                  ? t('routine.routineComplete', { 
                      type: selectedTab === 'morning' ? t('routine.morningFull') : t('routine.eveningFull') 
                    })
                  : recordProgress.isPending 
                  ? t('loading.recordingProgress') 
                  : completedSteps.length === 0
                  ? t('routine.getStarted', { total: routineSteps.length })
                  : completedSteps.length === routineSteps.length
                  ? t('routine.completeWithCheckmark', { 
                      type: selectedTab, 
                      completed: completedSteps.length, 
                      total: routineSteps.length 
                    })
                  : t('routine.completeProgress', { 
                      type: selectedTab, 
                      completed: completedSteps.length, 
                      total: routineSteps.length 
                    })
                }
                onPress={handleCheckIn}
                disabled={
                  isRoutineCompletedToday(selectedTab) || 
                  recordProgress.isPending || 
                  completedSteps.length === 0
                }
                style={isRoutineCompletedToday(selectedTab) ? styles.completedButton : undefined}
              />
              
              {/* Progress hint for incomplete routines */}
              {!isRoutineCompletedToday(selectedTab) && 
               completedSteps.length > 0 && 
               completedSteps.length < routineSteps.length && (
                <View style={styles.progressHint}>
                  <Text style={styles.progressHintText}>
                    {t('routine.progressHint', { total: routineSteps.length })}
                  </Text>
                </View>
              )}
              
              {/* Error feedback */}
              {recordProgress.error && (
                <View style={styles.errorFeedback}>
                  <Text style={styles.errorFeedbackText}>
                    {t('routine.recordProgressError')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🧴</Text>
            <Text style={styles.emptyTitle}>{t('routine.noRoutineYet', { type: selectedTab })}</Text>
            <Text style={styles.emptySubtitle}>
              {t('routine.emptyStateSubtitle')}
            </Text>
            <View style={styles.emptyActions}>
              <PrimaryButton
                title={t('routine.buildMyRoutine')}
                onPress={onNavigateToProducts}
                style={styles.emptyButton}
              />
            </View>
          </View>
        )}



        {/* Error handling - show user-friendly messages */}
        {routinesError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>{t('routine.unableToLoad')}</Text>
            <Text style={styles.errorText}>
              {t('routine.checkConnection')}
            </Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>{t('routine.tryAgain')}</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
      
      {/* Streak Celebration */}
      <ConfettiCelebration
        visible={showCelebration}
        currentStreak={currentStreak || 1}
        previousStreak={previousStreak}
        onComplete={() => setShowCelebration(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.m,
  },
  headerSection: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.l,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.s,
  },
  tabsContainer: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.l,
    marginTop: spacing.l,
    alignItems: 'center',
  },
  summaryContainer: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  completedIndicator: {
    backgroundColor: colors.backgroundSecondary,
    marginTop: spacing.m,
    padding: spacing.m,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 14,
    color: colors.accentGreen,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  remainingText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  allCompleteText: {
    fontSize: 14,
    color: colors.ctaBackground,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  sectionTitle: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  seeAllLink: {
    fontSize: 14,
    color: colors.ctaBackground,
    fontWeight: '600',
  },
  stepCard: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  disabledStep: {
    opacity: 0.6,
  },

  checkInContainer: {
    paddingHorizontal: spacing.l,
    marginTop: spacing.l,
  },
  completedButton: {
    backgroundColor: colors.accentGreen,
    opacity: 0.8,
    borderRadius: 12,
  },
  progressHint: {
    marginTop: spacing.m,
    padding: spacing.m,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHintText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.m,
  },
  successText: {
    fontSize: 16,
    color: colors.accentGreen,
    fontWeight: '600',
    marginLeft: spacing.s,
    textAlign: 'center',
    flex: 1,
  },
  errorFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.m,
    padding: spacing.m,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorFeedbackText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.l,
    marginTop: spacing.l,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.l,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  emptyActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.l,
  },
  emptyButton: {
    minWidth: 200,
  },
  errorContainer: {
    padding: spacing.l,
    backgroundColor: colors.backgroundSecondary,
    marginTop: spacing.l,
    marginHorizontal: spacing.l,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.l,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.ctaBackground,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    color: colors.ctaText,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    marginLeft: spacing.m,
    marginTop: spacing.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
}); 