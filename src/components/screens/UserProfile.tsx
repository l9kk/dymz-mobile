import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
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
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<any>({});

  const tabOptions = ['Profile', 'Stats', 'Settings'];

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
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: onSignOut }
      ]
    );
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>User ID</Text>
          <Text style={styles.fieldValue}>{profile?.user_id || 'Not set'}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Display Name</Text>
          <Text style={styles.fieldValue}>{profile?.display_name || 'Not specified'}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Timezone</Text>
          <Text style={styles.fieldValue}>{profile?.timezone || 'Not specified'}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Profile Completion</Text>
          <Text style={styles.fieldValue}>
            {Math.round((profile?.game_metrics?.profile_completion_score || 0) * 100)}%
          </Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Age Range</Text>
          <Text style={styles.fieldValue}>{'Not specified'}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <Text style={styles.fieldValue}>{'Not specified'}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Skincare Experience</Text>
          <Text style={styles.fieldValue}>{profile?.preferences?.skin_type || 'Not specified'}</Text>
        </View>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Member Since</Text>
          <Text style={styles.fieldValue}>
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
      </View>

      {/* Streak Progress */}
      {streakData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Streak Progress</Text>
          <View style={styles.streakContainer}>
            <View style={styles.streakStats}>
              <View style={styles.streakStat}>
                <Text style={styles.streakValue}>{streakData.current_streak}</Text>
                <Text style={styles.streakLabel}>Current Streak</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakValue}>{streakData.longest_streak}</Text>
                <Text style={styles.streakLabel}>Best Streak</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakValue}>{streakData.next_milestone}</Text>
                <Text style={styles.streakLabel}>Next Goal</Text>
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
            <Text style={styles.sectionTitle}>Your Journey</Text>
            <View style={styles.statsGrid}>
              <StatPill
                value={stats.total_analyses || 0}
                label="Skin Scans"
              />
              <StatPill
                value={streakData?.current_streak || 0}
                label="Day Streak"
              />
              <StatPill
                value={Math.round((stats.profile_completion_score || 0) * 100)}
                label="% Routine Adherence"
              />
            </View>
          </View>

          {/* Progress Over Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>Last Skin Scan</Text>
              <Text style={styles.activityValue}>
                {'Never'}
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>Total Check-ins</Text>
              <Text style={styles.activityValue}>
                {stats.total_check_ins || 0}
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>Current Streak</Text>
              <Text style={styles.activityValue}>
                {stats.current_streak || 0} days
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No stats available yet</Text>
      )}
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Routine Reminders</Text>
          <Text style={styles.settingValue}>Tap to configure</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Progress Updates</Text>
          <Text style={styles.settingValue}>Tap to configure</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Data Sharing</Text>
          <Text style={styles.settingValue}>Tap to configure</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Anonymous Analytics</Text>
          <Text style={styles.settingValue}>Tap to configure</Text>
        </View>
      </View>

      <View style={styles.section}>
        <PrimaryButton
          title="Sign Out"
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
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (profileError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Unable to load profile</Text>
        <PrimaryButton
          title="Try Again"
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
        <SectionHeading>Profile</SectionHeading>
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