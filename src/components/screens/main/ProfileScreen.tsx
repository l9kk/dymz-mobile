import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { 
  SectionHeading,
  StatParagraph,
  PrimaryButton,
  LoadingSpinner,
  StatPill,
  SuccessBadge,
  IconFeatureCard,
  AvatarGroupCount,
  StarRatingBadge
} from '../../design-system';
import { colors, spacing } from '../../design-system/tokens';
import { 
  useUserProfile, 
  useUserStats,
  useProfileCompletion 
} from '../../../hooks/api/useUser';
import { 
  useGamificationStats,
  useUserStreaks 
} from '../../../hooks/api/useGamification';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileScreenProps {
  onNavigateToEdit?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToPrivacy?: () => void;
  onSignOut?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateToEdit,
  onNavigateToHelp,
  onNavigateToPrivacy,
  onSignOut
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Fetch data
  const { data: profile, refetch: refetchProfile } = useUserProfile();
  const { data: userStats, refetch: refetchStats } = useUserStats();
  const profileCompletion = useProfileCompletion();
  const { data: gamificationStats, refetch: refetchGamification } = useGamificationStats();
  const { data: streakData, refetch: refetchStreaks } = useUserStreaks();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchProfile(),
      refetchStats(),
      refetchGamification(),
      refetchStreaks()
    ]);
    setRefreshing(false);
  };

  const isLoading = !profile || !userStats || !gamificationStats;

  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  const memberSince = profile.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Recently';

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: spacing.xl + insets.bottom + 100 } // Extra padding for tab bar + safe area
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Text style={styles.displayName}>
          {/* Display name text removed */}
        </Text>

        {/* Profile Completion */}
        {profileCompletion.completionPercentage < 100 && (
          <TouchableOpacity 
            style={styles.completionCard}
            onPress={onNavigateToEdit}
          >
            <View style={styles.completionBar}>
              <View 
                style={[
                  styles.completionFill,
                  { width: `${profileCompletion.completionPercentage}%` }
                ]}
              />
            </View>
            <Text style={styles.completionText}>
              Profile {profileCompletion.completionPercentage}% complete
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <StatPill
          value={userStats.total_analyses || 0}
          label="Analyses"
          variant="primary"
        />
        <StatPill
          value={streakData?.current_streak || 0}
          label="Day Streak"
          variant="secondary"
          icon="🔥"
        />
      </View>

      {/* Streak Progress */}
      <View style={styles.section}>
        <SectionHeading style={styles.sectionTitle}>
          Streak Progress
        </SectionHeading>

        {streakData ? (
          <View style={styles.streakProgressCard}>
            <View style={styles.streakHeader}>
              <Text style={styles.streakTitle}>
                {streakData.current_streak > 0 
                  ? `${streakData.current_streak} Day Streak!`
                  : "Ready to Start?"
                }
              </Text>
            </View>
            
            <View style={styles.streakStats}>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streakData.current_streak}</Text>
                <Text style={styles.streakStatLabel}>Current</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streakData.longest_streak}</Text>
                <Text style={styles.streakStatLabel}>Best</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streakData.next_milestone}</Text>
                <Text style={styles.streakStatLabel}>Next Goal</Text>
              </View>
            </View>

            {streakData.current_streak > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min((streakData.current_streak / streakData.next_milestone) * 100, 100)}%` 
                      }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {streakData.next_milestone - streakData.current_streak} days to next milestone
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.streakProgressCard}>
            <Text style={styles.noDataText}>
              🔌 Streak data unavailable - Backend offline
            </Text>
          </View>
        )}
      </View>

      {/* Settings Menu */}
      <View style={styles.section}>
        <SectionHeading style={styles.sectionTitle}>
          Settings
        </SectionHeading>

        <TouchableOpacity style={styles.menuItem} onPress={onNavigateToHelp}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={onNavigateToPrivacy}>
          <Text style={styles.menuIcon}>📄</Text>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Dymz AI v1.0.0</Text>
        <StarRatingBadge />
      </View>
    </ScrollView>
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
  },
  avatarContainer: {
    marginBottom: spacing.m,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.ctaBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.ctaText,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  memberSince: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  completionCard: {
    marginTop: spacing.m,
    paddingHorizontal: spacing.xl,
    width: '80%',
  },
  completionBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  completionFill: {
    height: '100%',
    backgroundColor: colors.accentYellow,
    borderRadius: 3,
  },
  completionText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
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
  streakProgressCard: {
    backgroundColor: colors.surfaceNeutral,
    marginHorizontal: spacing.l,
    padding: spacing.l,
    borderRadius: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.l,
  },
  streakStat: {
    alignItems: 'center',
  },
  streakStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  streakStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  progressContainer: {
    marginTop: spacing.m,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.s,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentYellow,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    backgroundColor: colors.surfaceNeutral,
    marginHorizontal: spacing.l,
    marginBottom: spacing.s,
    borderRadius: 12,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.m,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  menuArrow: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  signOutContainer: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
  },
  signOutButton: {
    paddingVertical: spacing.m,
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: spacing.m,
  },
  appVersion: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
}); 