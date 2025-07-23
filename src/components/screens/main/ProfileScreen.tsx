import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Alert } from 'react-native';
import { 
  SectionHeading,
  StatParagraph,
  PrimaryButton,
  LoadingSpinner,
  StatPill,
  SuccessBadge,
  IconFeatureCard,
  AvatarGroupCount,
  StarRatingBadge,
  LanguageSelector
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
import { useTranslation } from '../../../hooks/useTranslation';

interface ProfileScreenProps {
  onNavigateToEdit?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToPrivacy?: () => void;
  onSignOut?: () => void;
  onDeleteAccount?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateToEdit,
  onNavigateToHelp,
  onNavigateToPrivacy,
  onSignOut,
  onDeleteAccount
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const { t } = useTranslation();
  
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

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccount'),
      t('profile.deleteConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: "cancel"
        },
        {
          text: t('common.delete'),
          style: "destructive",
          onPress: () => {
            if (onDeleteAccount) {
              onDeleteAccount();
            }
          }
        }
      ]
    );
  };

  const isLoading = !profile || !userStats || !gamificationStats;

  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>{t('userProfile.loading')}</Text>
      </View>
    );
  }

  const memberSince = profile.created_at 
    ? new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : t('profile.memberSince.recently');

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
              {t('profile.completion', { percentage: profileCompletion.completionPercentage })}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <StatPill
          value={userStats.total_analyses || 0}
          label={t('profile.analyses')}
          variant="primary"
        />
      </View>

      {/* Streak Progress */}
      <View style={styles.section}>
        <SectionHeading style={styles.sectionTitle}>
          {t('profile.streakProgress.title')}
        </SectionHeading>

        {streakData ? (
          <View style={styles.streakProgressCard}>
            <View style={styles.streakHeader}>
              <Text style={styles.streakTitle}>
                {streakData.current_streak > 0 
                  ? t('profile.streakProgress.dayStreak', { count: streakData.current_streak })
                  : t('profile.readyToStart')
                }
              </Text>
            </View>
            
            {/* Milestone Badges */}
            <View style={styles.milestonesContainer}>
              <Text style={styles.milestonesTitle}>{t('profile.milestones')}</Text>
              <View style={styles.milestonesGrid}>
                {[
                  { days: 1, emoji: '🎉', labelKey: 'profile.streakProgress.milestones.firstDay' },
                  { days: 3, emoji: '✨', labelKey: 'profile.streakProgress.milestones.building' },
                  { days: 7, emoji: '🔥', labelKey: 'profile.streakProgress.milestones.onFire' },
                  { days: 14, emoji: '⭐', labelKey: 'profile.streakProgress.milestones.amazing' },
                  { days: 21, emoji: '💎', labelKey: 'profile.streakProgress.milestones.incredible' },
                  { days: 30, emoji: '🏆', labelKey: 'profile.streakProgress.milestones.legendary' },
                ].map((milestone, index) => {
                  const isEarned = streakData.current_streak >= milestone.days;
                  const prevMilestone = index > 0 ? [1, 3, 7, 14, 21, 30][index - 1] : 0;
                  const isNext = !isEarned && streakData.current_streak >= prevMilestone;
                  
                  return (
                    <View key={milestone.days} style={styles.milestoneItem}>
                      <View style={[
                        styles.milestoneBadge,
                        isEarned && styles.milestoneBadgeEarned,
                        isNext && styles.milestoneBadgeNext
                      ]}>
                        <Text style={[
                          styles.milestoneEmoji,
                          !isEarned && styles.milestoneEmojiGrayed
                        ]}>
                          {milestone.emoji}
                        </Text>
                        {isEarned && (
                          <View style={styles.earnedCheckmark}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.milestoneLabel,
                        isEarned && styles.milestoneLabelEarned
                      ]}>
                        {t(milestone.labelKey)}
                      </Text>
                      <Text style={[
                        styles.milestoneDays,
                        isEarned && styles.milestoneDaysEarned
                      ]}>
                        {t('profile.streakProgress.daysCount', { count: milestone.days })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Current Stats */}
            <View style={styles.streakStats}>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streakData.current_streak}</Text>
                <Text style={styles.streakStatLabel}>{t('profile.streakStats.current')}</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streakData.longest_streak}</Text>
                <Text style={styles.streakStatLabel}>{t('profile.streakStats.best')}</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streakData.next_milestone}</Text>
                <Text style={styles.streakStatLabel}>{t('profile.streakStats.nextGoal')}</Text>
              </View>
            </View>

            {/* Progress Bar */}
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
                  {t('profile.streakProgress.daysToMilestone', { 
                    days: streakData.next_milestone - streakData.current_streak 
                  })}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.streakProgressCard}>
            <Text style={styles.noDataText}>
              {t('profile.streakProgress.dataUnavailable')}
            </Text>
          </View>
        )}
      </View>

      {/* Settings Menu */}
      <View style={styles.section}>
        <SectionHeading style={styles.sectionTitle}>
          {t('profile.settings')}
        </SectionHeading>

        {/* Language Selector */}
        <LanguageSelector style={styles.languageSelectorContainer} />

        <TouchableOpacity style={styles.menuItem} onPress={onNavigateToHelp}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>{t('profile.support')}</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={onNavigateToPrivacy}>
          <Text style={styles.menuIcon}>📄</Text>
          <Text style={styles.menuText}>{t('profile.privacy')}</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountIcon}>🗑️</Text>
          <Text style={styles.deleteAccountText}>{t('profile.deleteAccount')}</Text>
          <Text style={styles.deleteAccountArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>{t('profile.appVersion')}</Text>
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
    justifyContent: 'center',
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
  
  // Milestone styles
  milestonesContainer: {
    marginBottom: spacing.l,
  },
  milestonesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
    gap: spacing.s,
  },
  milestoneItem: {
    alignItems: 'center',
    width: '28%',
    marginBottom: spacing.m,
  },
  milestoneBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  milestoneBadgeEarned: {
    backgroundColor: colors.successBackground,
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  milestoneBadgeNext: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderColor: colors.accentPalette[3],
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  milestoneEmoji: {
    fontSize: 28,
  },
  milestoneEmojiGrayed: {
    opacity: 0.3,
  },
  earnedCheckmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.successBackground,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '700',
  },
  milestoneLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  milestoneLabelEarned: {
    color: colors.textPrimary,
  },
  milestoneDays: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
  milestoneDaysEarned: {
    color: colors.success,
    opacity: 1,
  },
  
  // Delete Account styles
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    marginHorizontal: spacing.l,
    marginBottom: spacing.s,
    borderRadius: 12,
  },
  deleteAccountIcon: {
    fontSize: 20,
    marginRight: spacing.m,
  },
  deleteAccountText: {
    flex: 1,
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '600',
  },
  deleteAccountArrow: {
    fontSize: 18,
    color: '#E74C3C',
  },
  languageSelectorContainer: {
    marginBottom: spacing.l,
    paddingHorizontal: spacing.l,
  },
});