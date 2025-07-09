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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProductIconByCategory } from '../../../utils/imageUrls';

interface RoutineScreenProps {
  onNavigateToProducts?: () => void;
  onNavigateToHistory?: () => void;
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

// Debug components removed - production ready

export const RoutineScreen: React.FC<RoutineScreenProps> = ({
  onNavigateToProducts,
  onNavigateToHistory
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState<'morning' | 'evening'>('morning');
  const [completedSteps, setCompletedSteps] = React.useState<string[]>([]);
  const [showCelebration, setShowCelebration] = React.useState(false);
  
  // Fetch data
  const { data: routines, refetch: refetchRoutines, error: routinesError } = useActiveRoutines();
  const { data: stats, refetch: refetchStats } = useRoutineStats();
  const { data: profile } = useUserProfile();
  const { data: streakData } = useUserStreaks();
  const { isAuthenticated } = useAuthStore();
  const recordProgress = useRecordRoutineProgress();
  const insets = useSafeAreaInsets();
  
  // Daily completion tracking
  const { 
    isRoutineCompletedToday, 
    markRoutineCompleted, 
    bothRoutinesCompletedToday 
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
        total_time_minutes: Math.round(completedStepsData.reduce((total, step) => total + (step.duration_seconds || 60), 0) / 60),
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

  const isLoading = !routines && !stats;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading your routines...</Text>
      </View>
    );
  }

  // Safe data access with proper null checks
  const routinesArray = Array.isArray(routines?.routines) ? routines.routines : [];
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
          <SectionHeading>My Routine</SectionHeading>
          <StatParagraph style={styles.subtitle}>
            Stay consistent with your personalized skincare routine
          </StatParagraph>
        </View>

        {/* Routine Tabs */}
        <View style={styles.tabsContainer}>
          <SegmentedTabBar
            options={['☀️ Morning', '🌙 Evening']}
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
                  ✅ {selectedTab === 'morning' ? 'Morning' : 'Evening'} routine completed today!
                </Text>
                {!isRoutineCompletedToday(selectedTab === 'morning' ? 'evening' : 'morning') && (
                  <Text style={styles.remainingText}>
                    {selectedTab === 'morning' 
                      ? '🌙 Evening routine remaining' 
                      : '☀️ Morning routine remaining'
                    }
                  </Text>
                )}
                {bothRoutinesCompletedToday() && (
                  <Text style={styles.allCompleteText}>
                    🎉 All routines completed today! Great job!
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
              Today's Steps
            </SectionHeading>
            

            {routineSteps.map((step: any, index: number) => {
              const stepIdentifier = `${currentRoutine?.id}-${index}`;
              const isRoutineCompleted = isRoutineCompletedToday(selectedTab);
              
              return (
                <TouchableOpacity
                  key={stepIdentifier}
                  onPress={() => !isRoutineCompleted && handleStepComplete(stepIdentifier)}
                  disabled={isRoutineCompleted}
                  style={isRoutineCompleted ? styles.disabledStep : undefined}
                >
                  <RoutineStepCard
                    stepNumber={step.order || index + 1}
                    title={step.step || `Step ${index + 1}`}
                    description={step.instructions || 'Follow the product instructions carefully'}
                    isCompleted={isRoutineCompleted || completedSteps.includes(stepIdentifier)}
                    productInfo={step.product_id ? {
                      name: `Product ${index + 1}`,
                      brand: 'Recommended'
                    } : undefined}
                    style={styles.stepCard}
                    thumbnailUri={getStepThumbnail(step.step || '')}
                  />
                </TouchableOpacity>
              );
            })}

            {/* Check-in Button */}
            <View style={styles.checkInContainer}>
              <PrimaryButton
                title={isRoutineCompletedToday(selectedTab)
                  ? `✅ ${selectedTab === 'morning' ? 'Morning' : 'Evening'} Routine Complete`
                  : recordProgress.isPending 
                  ? "Recording Progress..." 
                  : completedSteps.length === 0
                  ? `Tap steps above to get started (0/${routineSteps.length})`
                  : completedSteps.length === routineSteps.length
                  ? `Complete ${selectedTab} Routine ✓ (${completedSteps.length}/${routineSteps.length})`
                  : `Complete ${selectedTab} Routine (${completedSteps.length}/${routineSteps.length})`
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
                    💡 Complete all {routineSteps.length} steps to submit your routine
                  </Text>
                </View>
              )}
              
              {/* Error feedback */}
              {recordProgress.error && (
                <View style={styles.errorFeedback}>
                  <Text style={styles.errorFeedbackText}>
                    ⚠️ Unable to record progress. Please try again.
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🧴</Text>
            <Text style={styles.emptyTitle}>No {selectedTab} routine yet</Text>
            <Text style={styles.emptySubtitle}>
              Let's create your personalized routine
            </Text>
            <View style={styles.emptyActions}>
              <PrimaryButton
                title="Build My Routine"
                onPress={onNavigateToProducts}
                style={styles.emptyButton}
              />
            </View>
          </View>
        )}



        {/* Error handling - show user-friendly messages */}
        {routinesError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>⚠️ Unable to load routines</Text>
            <Text style={styles.errorText}>
              Please check your connection and try again
            </Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
      
      {/* Confetti Celebration */}
      <ConfettiCelebration
        visible={showCelebration}
        message={`🎉 ${selectedTab === 'morning' ? 'Morning' : 'Evening'} Routine Complete!`}
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
}); 