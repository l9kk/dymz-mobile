import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  SectionHeading,
  StatParagraph,
  PrimaryButton,
  LoadingSpinner,
  WeeklyProgressCard,
  StatPill,
  SuccessBadge,
  CircleAvatarCluster,
  IconFeatureCard,
  LatestResultsCard
} from '../../design-system';
import { colors, spacing } from '../../design-system/tokens';
import { useGamificationDashboard, useStreakProgress } from '../../../hooks/api/useGamification';
import { useAnalyticsDashboard } from '../../../hooks/api/useAnalytics';
import { useUserProfile } from '../../../hooks/api/useUser';
import { useDailyCheckIn } from '../../../hooks/api/useUser';
import { useAuth } from '../../../stores/authStore';
import { ErrorBoundary, useThrowAsyncError } from '../../shared/ErrorBoundary';
import { useLatestAnalysis } from '../../../hooks/api/useAnalysis';
import { 
  isAnalysisAvailable, 
  getAnalysisAvailabilityStatus, 
  formatTimeUntilMidnight 
} from '../../../utils/analysisTimer';

interface HomeScreenProps {
  onNavigateToAnalysis?: () => void;
  onNavigateToRoutine?: () => void;
  onNavigateToProfile?: () => void;
}

const BackendErrorDisplay: React.FC<{ error: any; onRetry: () => void }> = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>⚠️ Backend Connection Issue</Text>
    <Text style={styles.errorMessage}>
      {error?.message || 'Unable to connect to the backend server'}
    </Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

const DataMissingDisplay: React.FC<{ dataType: string }> = ({ dataType }) => (
  <View style={styles.missingDataContainer}>
    <Text style={styles.missingDataText}>
      🔌 No {dataType} data - Backend not responding
    </Text>
  </View>
);

const NotAuthenticatedDisplay: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => (
  <View style={styles.notAuthContainer}>
    <Text style={styles.notAuthTitle}>🔐 Authentication Required</Text>
    <Text style={styles.notAuthMessage}>
      Please sign in to view your personalized dashboard
    </Text>
    <PrimaryButton 
      title="Sign In" 
      onPress={onSignIn}
      style={styles.signInButton}
    />
  </View>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToAnalysis,
  onNavigateToRoutine,
  onNavigateToProfile
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [timeUntilNext, setTimeUntilNext] = React.useState<string>('');
  const throwAsyncError = useThrowAsyncError();
  const insets = useSafeAreaInsets();
  
  // Get authentication status
  const { isAuthenticated, isLoading: authLoading, signInWithGoogle } = useAuth();
  
  // Only fetch data if authenticated
  const { data: profile } = useUserProfile(isAuthenticated);
  const gamification = useGamificationDashboard();
  const analytics = useAnalyticsDashboard();
  const streakHelpers = useStreakProgress();
  const checkIn = useDailyCheckIn();
  const { data: latestAnalysis, refetch: refetchLatestAnalysis } = useLatestAnalysis(isAuthenticated);

  // Calculate proper bottom padding (tab bar height + safe area + extra space)
  const TAB_BAR_HEIGHT = 80; // Approximate tab bar height
  const bottomPadding = insets.bottom + TAB_BAR_HEIGHT + spacing.l;

  // Extract metrics from analysis
  const getMetricsFromAnalysis = (): any[] => {
    if (!latestAnalysis?.skin_metrics?.metrics) {
      return [];
    }

    const metrics = latestAnalysis.skin_metrics.metrics;
    
    return Object.entries(metrics).map(([key, value]) => {
      let score = 0;
      
      if (typeof value === 'number') {
        score = Math.round((1 - value) * 100);
      } else if (typeof value === 'object' && value !== null) {
        const val = value as any;
        score = Math.round((1 - (val.score || val.value || val.level || 0)) * 100);
      }

      return {
        title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        score: Math.max(0, Math.min(100, score)),
        isLocked: false
      };
    }).filter(metric => metric.score < 100); // Only show metrics with meaningful data
  };

  const metrics = getMetricsFromAnalysis();

  // Calculate time until next analysis using daily reset logic
  React.useEffect(() => {
    const updateCountdown = () => {
      if (!latestAnalysis || latestAnalysis.status !== 'completed') {
        setTimeUntilNext('Ready now!');
        return;
      }

      const availabilityStatus = getAnalysisAvailabilityStatus(latestAnalysis.created_at);
      
      if (availabilityStatus.isAvailable) {
        setTimeUntilNext('Ready now!');
        return;
      }

      setTimeUntilNext(formatTimeUntilMidnight());
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60 * 1000); // Update every minute
    return () => clearInterval(timer);
  }, [latestAnalysis]);

  const handleRefresh = async () => {
    if (!isAuthenticated) {
      console.log('Cannot refresh - user not authenticated');
      return;
    }
    
    setRefreshing(true);
    try {
      await Promise.allSettled([
        gamification.refetch(),
        analytics.refetch(),
        refetchLatestAnalysis()
      ]);
    } catch (error) {
      console.log('Refresh error:', error);
      if (error instanceof Error) {
        throwAsyncError(error);
      }
    }
    setRefreshing(false);
  };

  const handleDailyCheckIn = () => {
    if (!isAuthenticated) {
      console.log('Cannot check in - user not authenticated');
      return;
    }
    
    checkIn.mutate({
      completed_routine_steps: ['morning_cleanse', 'moisturizer', 'sunscreen'],
      notes: 'Feeling great today!'
    });
  };

  const handleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      console.log('✅ Sign in successful');
    } else {
      console.error('❌ Sign in failed:', result.error);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  // Show sign in screen if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <NotAuthenticatedDisplay onSignIn={handleSignIn} />
      </View>
    );
  }

  const isLoading = gamification.isLoading || analytics.isLoading;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  // Show backend errors clearly
  if (gamification.error) {
    return <BackendErrorDisplay error={gamification.error} onRetry={handleRefresh} />;
  }

  if (analytics.error) {
    return <BackendErrorDisplay error={analytics.error} onRetry={handleRefresh} />;
  }

  // Extract data with clear null checks - no fallbacks
  const stats = gamification.stats;
  const streakData = gamification.streaks;
  const overview = analytics.overview;
  const improvementInsights = analytics.improvementInsights;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ErrorBoundary>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Welcome back!
            </Text>
          </View>

          {/* Latest Analysis Result Card */}
          {latestAnalysis && latestAnalysis.status === 'completed' && latestAnalysis.image_url && (
            <View style={styles.section}>
              <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
              >
                <LatestResultsCard 
                  imageUrl={latestAnalysis.image_url} 
                  metrics={metrics} 
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statsContainer}>
            {streakData && stats ? (
              <>
                  <View style={[styles.statPillWrapper, styles.firstStatPill]}>
                <StatPill
                  value={streakData.current_streak || 0}
                  label="Day Streak"
                  variant="primary"
                  icon="🔥"
                />
                  </View>
                  <View style={[styles.statPillWrapper, styles.lastStatPill]}>
                <StatPill
                  value={`${Math.round((stats.improvement_score || 0) * 100)}%`}
                  label="Improvement"
                  variant="accent"
                  icon="📈"
                />
                  </View>
              </>
            ) : (
              <DataMissingDisplay dataType="stats" />
            )}
            </View>
          </View>

          {/* Daily Check-in */}
          {!checkIn.isSuccess && (
            <TouchableOpacity 
              style={styles.checkInCard}
              onPress={handleDailyCheckIn}
              disabled={checkIn.isPending}
            >
              <View style={styles.checkInContent}>
                <Text style={styles.checkInTitle}>Complete Daily Check-in</Text>
                <Text style={styles.checkInSubtitle}>
                  Track your progress and earn rewards
                </Text>
              </View>
              <Text style={styles.checkInButton}>→</Text>
            </TouchableOpacity>
          )}

          {/* Weekly Progress */}
          <View style={styles.section}>
            <SectionHeading style={styles.sectionTitle}>
              Your Progress
            </SectionHeading>
            {overview ? (
              <WeeklyProgressCard
                weekNumber={new Date().getWeek()}
                scansCompleted={Math.min(overview.total_analyses || 0, 7)}
                totalScansGoal={7}
                improvingMetrics={Array.isArray(improvementInsights?.improving) ? improvementInsights.improving.length : 0}
                totalMetrics={8}
                currentStreak={streakData?.current_streak || 0}
                onViewDetails={onNavigateToAnalysis}
              />
            ) : (
              <DataMissingDisplay dataType="progress" />
            )}
          </View>

          {/* Streak Motivation */}
          {streakData ? (
            <View style={styles.section}>
              <SectionHeading style={styles.sectionTitle}>
                Your Streak Journey
              </SectionHeading>
              <View style={styles.streakCard}>
                <View style={styles.streakHeader}>
                  <Text style={styles.streakTitle}>
                    {streakData.current_streak > 0 
                      ? `${streakData.current_streak} Day Streak! 🔥`
                      : "Ready to Start Your Journey? ✨"
                    }
                  </Text>
                </View>
                <Text style={styles.streakMotivation}>
                  {streakData.current_streak > 0 
                    ? `Amazing! You're ${streakData.next_milestone - streakData.current_streak} days away from your ${streakData.next_milestone}-day milestone!`
                    : "Start your skincare journey today and build healthy habits!"
                  }
                </Text>
                {streakData.longest_streak > 0 && (
                  <Text style={styles.streakRecord}>
                    Personal Best: {streakData.longest_streak} days 🏆
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <SectionHeading style={styles.sectionTitle}>
                Your Streak Journey
              </SectionHeading>
              <DataMissingDisplay dataType="streak data" />
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <SectionHeading style={styles.sectionTitle}>
              Quick Actions
            </SectionHeading>
            <View style={styles.actionsContainer}>
              <View style={styles.actionsRow}>
                <View style={[styles.actionCardWrapper, styles.firstActionCard]}>
              <IconFeatureCard
                iconName="📸"
                title="Take Analysis"
                description="Track your skin progress"
                onPress={onNavigateToAnalysis}
                style={styles.actionCard}
              />
                </View>
                <View style={[styles.actionCardWrapper, styles.lastActionCard]}>
              <IconFeatureCard
                iconName="🧴"
                title="Check Routine"
                description="View today's steps"
                onPress={onNavigateToRoutine}
                style={styles.actionCard}
              />
                </View>
              </View>
              <View style={[styles.actionsRow, styles.lastActionsRow]}>
                <View style={[styles.actionCardWrapper, styles.firstActionCard]}>
              <IconFeatureCard
                iconName="🔥"
                title="Streak Progress"
                description={streakData ? `${streakData.current_streak} day streak` : 'Backend offline'}
                onPress={onNavigateToProfile}
                style={styles.actionCard}
              />
                </View>
                <View style={[styles.actionCardWrapper, styles.lastActionCard]}>
              <IconFeatureCard
                iconName="📊"
                title="Analytics"
                description="View insights"
                onPress={onNavigateToAnalysis}
                style={styles.actionCard}
              />
            </View>
          </View>
            </View>
          </View>
        </ScrollView>

        {/* Full Analysis Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Full Analysis Results</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {latestAnalysis?.image_url && (
                <LatestResultsCard 
                  imageUrl={latestAnalysis.image_url} 
                  metrics={metrics} 
                />
              )}
              
              <View style={styles.modalInfoSection}>
                <Text style={styles.modalInfoTitle}>Analysis Date</Text>
                <Text style={styles.modalInfoText}>
                  {latestAnalysis && new Date(latestAnalysis.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>

              <View style={styles.modalInfoSection}>
                <Text style={styles.modalInfoTitle}>Metrics Analyzed</Text>
                <Text style={styles.modalInfoText}>
                  {metrics.length} skin health indicators
                </Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ErrorBoundary>
    </SafeAreaView>
  );
};

// Add the getWeek extension to Date
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function() {
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
  const pastDaysOfYear = (this.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // paddingBottom is now calculated dynamically based on safe area and tab bar height
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.m,
    textAlign: 'center',
  },
  welcomeSection: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl + spacing.xl,
    paddingBottom: spacing.m,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  statsSection: {
    marginBottom: spacing.l,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
  },
  statPillWrapper: {
    flex: 1,
  },
  firstStatPill: {
    marginRight: spacing.s,
  },
  lastStatPill: {
    marginLeft: spacing.s,
  },
  checkInCard: {
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    padding: spacing.l,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkInContent: {
    flex: 1,
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  checkInSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkInButton: {
    fontSize: 24,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  streakCard: {
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.l,
    padding: spacing.l,
    borderRadius: 12,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  streakMotivation: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.s,
  },
  streakRecord: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  actionsContainer: {
    paddingHorizontal: spacing.l,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  lastActionsRow: {
    marginBottom: 0,
  },
  actionCardWrapper: {
    flex: 1,
  },
  firstActionCard: {
    marginRight: spacing.s,
  },
  lastActionCard: {
    marginLeft: spacing.s,
  },
  actionCard: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    backgroundColor: colors.backgroundPrimary,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  missingDataContainer: {
    padding: spacing.m,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginHorizontal: spacing.l,
    alignItems: 'center',
  },
  missingDataText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  notAuthTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  notAuthMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.s,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  modalContent: {
    flex: 1,
  },
  modalInfoSection: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  modalInfoText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
}); 