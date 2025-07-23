import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BackButton,
  SectionHeading,
  PrimaryButton,
  LoadingSpinner,
  TagChip,
  SegmentedTabBar,
  StatPill
} from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import {
  useUserProfile,
  useUpdateUserProfile,
  useUserStats,
  useUpdatePreferences
} from '../../hooks/api/useUser';
import { useGamificationStats, useUserStreaks } from '../../hooks/api/useGamification';

interface UserProfileProps {
  onBack?: () => void;
  onSignOut?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  onBack,
  onSignOut
}) => {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<any>({});

  const tabOptions = [t('userProfile.tabs.profile'), t('userProfile.tabs.stats'), t('userProfile.tabs.settings')];

  // API hooks
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: streakData } = useUserStreaks();
  const { data: gameProfile } = useGamificationStats();
  
  const updateProfile = useUpdateUserProfile();
  const updatePreferences = useUpdatePreferences();

  useEffect(() => {
    if (profile && !isEditing) {
      setEditableProfile(profile);
    }
  }, [profile, isEditing]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(editableProfile);
      setIsEditing(false);
      Alert.alert(t('userProfile.alerts.success'), t('userProfile.alerts.profileUpdated'));
    } catch (error) {
      Alert.alert(t('userProfile.alerts.error'), t('userProfile.alerts.updateFailed'));
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      t('userProfile.signOut.title'),
      t('userProfile.signOut.message'),
      [
        { text: t('userProfile.signOut.cancel'), style: 'cancel' },
        { text: t('userProfile.signOut.confirm'), style: 'destructive', onPress: onSignOut }
      ]
    );
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('userProfile.profileInfo.title')}</Text>
        
        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>{t('userProfile.profileInfo.userId')}</Text>
          <Text style={styles.fieldValue}>{profile?.user_id || t('userProfile.profileInfo.notSet')}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>{t('userProfile.profileInfo.displayName')}</Text>
          <Text style={styles.fieldValue}>{profile?.display_name || t('userProfile.profileInfo.notSpecified')}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>{t('userProfile.profileInfo.timezone')}</Text>
          <Text style={styles.fieldValue}>{profile?.timezone || t('userProfile.profileInfo.notSpecified')}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>{t('userProfile.profileInfo.completion')}</Text>
          <Text style={styles.fieldValue}>
            {Math.round((profile?.game_metrics?.profile_completion_score || 0) * 100)}%
          </Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>{t('userProfile.profileInfo.ageRange')}</Text>
          <Text style={styles.fieldValue}>{t('userProfile.profileInfo.notSpecified')}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>{t('userProfile.profileInfo.gender')}</Text>
          <Text style={styles.fieldValue}>{t('userProfile.profileInfo.notSpecified')}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>{t('userProfile.profileInfo.experience')}</Text>
          <Text style={styles.fieldValue}>{profile?.preferences?.skin_type || t('userProfile.profileInfo.notSpecified')}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>{t('userProfile.profileInfo.memberSince')}</Text>
          <Text style={styles.fieldValue}>
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : t('userProfile.profileInfo.unknown')}
          </Text>
        </View>
      </View>

      {/* Streak Progress */}
      {streakData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('userProfile.streak.title')}</Text>
          <View style={styles.streakContainer}>
            <View style={styles.streakStats}>
              <View style={styles.streakStat}>
                <Text style={styles.streakValue}>{streakData.current_streak}</Text>
                <Text style={styles.streakLabel}>{t('userProfile.streak.current')}</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakValue}>{streakData.longest_streak}</Text>
                <Text style={styles.streakLabel}>{t('userProfile.streak.best')}</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakValue}>{streakData.next_milestone}</Text>
                <Text style={styles.streakLabel}>{t('userProfile.streak.nextGoal')}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      {statsLoading ? (
        <LoadingSpinner size={48} />
      ) : stats ? (
        <>
          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('userProfile.journey.title')}</Text>
            <View style={styles.statsGrid}>
              <StatPill
                value={stats.total_analyses || 0}
                label={t('userProfile.journey.skinScans')}
              />
              <StatPill
                value={streakData?.current_streak || 0}
                label={t('userProfile.journey.dayStreak')}
              />
              <StatPill
                value={Math.round((stats.profile_completion_score || 0) * 100)}
                label={t('userProfile.journey.routineAdherence')}
              />
            </View>
          </View>

          {/* Progress Over Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('userProfile.activity.title')}</Text>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>{t('userProfile.activity.lastScan')}</Text>
              <Text style={styles.activityValue}>
                {t('userProfile.activity.never')}
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>{t('userProfile.activity.totalCheckIns')}</Text>
              <Text style={styles.activityValue}>
                {stats.total_check_ins || 0}
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>{t('userProfile.activity.currentStreak')}</Text>
              <Text style={styles.activityValue}>
                {stats.current_streak || 0} {t('userProfile.activity.days')}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>{t('userProfile.noData')}</Text>
      )}
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('userProfile.settings.notifications.title')}</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('userProfile.settings.notifications.routineReminders')}</Text>
          <Text style={styles.settingValue}>{t('userProfile.settings.tapToConfigure')}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('userProfile.settings.notifications.progressUpdates')}</Text>
          <Text style={styles.settingValue}>{t('userProfile.settings.tapToConfigure')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('userProfile.settings.privacy.title')}</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('userProfile.settings.privacy.dataSharing')}</Text>
          <Text style={styles.settingValue}>{t('userProfile.settings.tapToConfigure')}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('userProfile.settings.privacy.anonymousAnalytics')}</Text>
          <Text style={styles.settingValue}>{t('userProfile.settings.tapToConfigure')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <PrimaryButton
          title={t('buttons.signOut')}
          onPress={handleSignOut}
          style={styles.signOutButton}
        />
      </View>
    </View>
  );

  if (profileLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>{t('userProfile.loading')}</Text>
      </View>
    );
  }

  if (profileError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{t('userProfile.error')}</Text>
        <PrimaryButton
          title={t('buttons.tryAgain')}
          onPress={() => {
            // In a real app, this would trigger a refetch or navigate back
            console.log('Retry button pressed - would refetch profile data');
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <SectionHeading>{t('userProfile.title')}</SectionHeading>
      </View>

      <SegmentedTabBar
        options={tabOptions}
        selectedIndex={selectedTabIndex}
        onSelectionChange={setSelectedTabIndex}
        style={styles.tabBar}
      />

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {selectedTabIndex === 0 && renderProfileTab()}
        {selectedTabIndex === 1 && renderStatsTab()}
        {selectedTabIndex === 2 && renderSettingsTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    paddingTop: spacing.xl,
  },
  title: {
    marginLeft: spacing.m,
    flex: 1,
  },
  tabBar: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.headingS,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  levelSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.l,
    marginBottom: spacing.l,
  },
  levelHeader: {
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  levelTitle: {
    fontSize: typography.fontSizes.headingM,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  levelSubtitle: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  profileField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fieldLabel: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
  },
  fieldValue: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium,
  },
  streakContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.l,
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.m,
  },
  streakStat: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: typography.fontSizes.headingM,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  streakLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityLabel: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
  },
  activityValue: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
  },
  settingValue: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium,
  },
  signOutButton: {
    backgroundColor: colors.error || '#FF4444',
    marginTop: spacing.l,
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
  errorText: {
    fontSize: 16,
    color: colors.error || colors.textPrimary,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
}); 