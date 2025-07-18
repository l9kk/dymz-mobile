import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import {
  BackButton,
  SectionHeading,
  PrimaryButton,
  LoadingSpinner,
  TagChip
} from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useSendTestNotification
} from '../../hooks/api/useNotifications';

interface NotificationSettingsProps {
  onBack?: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onBack
}) => {
  const [localPreferences, setLocalPreferences] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  // API hooks
  const { 
    data: preferences, 
    isLoading: preferencesLoading, 
    error: preferencesError 
  } = useNotificationPreferences();
  
  const updatePreferences = useUpdateNotificationPreferences();
  const sendTestNotification = useSendTestNotification();

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleTogglePreference = (key: string, value: boolean) => {
    const keys = key.split('.');
    if (keys.length === 2) {
      setLocalPreferences((prev: any) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setLocalPreferences((prev: any) => ({
        ...prev,
        [key]: value
      }));
    }
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      await updatePreferences.mutateAsync(localPreferences);
      setHasChanges(false);
      Alert.alert('Success', 'Notification preferences updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences. Please try again.');
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification.mutateAsync({
        title: 'Test Notification',
        body: 'This is a test notification from Dymz AI!',
        notification_type: 'skincare_tip'
      });
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const renderPreferenceToggle = (
    title: string,
    description: string,
    key: string,
    value: boolean
  ) => (
    <View style={styles.preferenceItem}>
      <View style={styles.preferenceContent}>
        <Text style={styles.preferenceTitle}>{title}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={(newValue) => handleTogglePreference(key, newValue)}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );

  if (preferencesLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading notification settings...</Text>
      </View>
    );
  }

  if (preferencesError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Unable to load notification settings</Text>
        <PrimaryButton
          title="Try Again"
          onPress={() => {
            console.log('Retry button pressed - would refetch notification preferences');
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <SectionHeading>Notifications</SectionHeading>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Notification Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Status</Text>
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>
              {preferences?.reminders_enabled ? '🔔 Notifications Enabled' : '🔕 Notifications Disabled'}
            </Text>
            <Text style={styles.statusDescription}>
              {preferences?.reminders_enabled 
                ? 'You\'re receiving personalized skincare reminders and updates.'
                : 'Enable notifications to get personalized skincare reminders and progress updates.'
              }
            </Text>
            {!preferences?.reminders_enabled && (
              <Text style={styles.statusDescription}>
                Enable notifications in your device settings to receive updates.
              </Text>
            )}
          </View>
        </View>

        {/* Routine Reminders */}
        {preferences?.reminders_enabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Routine Reminders</Text>
            
            {renderPreferenceToggle(
              'Daily Reminders',
              'Reminder to complete your skincare routine',
              'reminders_enabled',
              localPreferences?.reminders_enabled || false
            )}
          </View>
        )}

        {/* Progress & Analysis */}
        {preferences?.reminders_enabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress & Analysis</Text>
            
            {renderPreferenceToggle(
              'Analysis Notifications',
              'Notification when your skin analysis is ready',
              'analysis_notifications',
              localPreferences?.analysis_notifications || false
            )}

            {renderPreferenceToggle(
              'Streak Notifications',
              'Notification when you reach streak milestones',
              'streak_notifications',
              localPreferences?.streak_notifications || false
            )}
          </View>
        )}

        {/* Product & Tips */}
        {preferences?.reminders_enabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product & Tips</Text>
            
            {renderPreferenceToggle(
              'Tips Notifications',
              'Receive helpful skincare tips and advice',
              'tips_enabled',
              localPreferences?.tips_enabled || false
            )}

            {renderPreferenceToggle(
              'Marketing Notifications',
              'Receive updates about new features and products',
              'marketing_notifications',
              localPreferences?.marketing_notifications || false
            )}
          </View>
        )}

        {/* Device Information */}
        {preferences?.reminders_enabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Device Information</Text>
            <Text style={styles.deviceInfo}>
              Registered devices: {preferences?.device_tokens_registered || 0}
            </Text>
          </View>
        )}

        {/* Notification history section removed - not supported by current API */}

        {/* Test Notification */}
        {preferences?.reminders_enabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Notifications</Text>
            <Text style={styles.testDescription}>
              Send a test notification to make sure everything is working correctly.
            </Text>
            <PrimaryButton
              title={sendTestNotification.isPending ? "Sending..." : "Send Test Notification"}
              onPress={handleTestNotification}
              disabled={sendTestNotification.isPending}
              style={styles.testButton}
            />
          </View>
        )}

        {/* Save Changes */}
        {hasChanges && (
          <View style={styles.saveSection}>
            <PrimaryButton
              title={updatePreferences.isPending ? "Saving..." : "Save Changes"}
              onPress={handleSaveChanges}
              disabled={updatePreferences.isPending}
              style={styles.saveButton}
            />
          </View>
        )}
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
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
  statusCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.l,
  },
  statusTitle: {
    fontSize: typography.fontSizes.bodyL,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  statusDescription: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.m,
  },
  enableButton: {
    marginTop: spacing.m,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  preferenceContent: {
    flex: 1,
    marginRight: spacing.m,
  },
  preferenceTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  preferenceDescription: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  timeSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginTop: spacing.s,
  },
  timeLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  timeValue: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
  },
  quietHoursInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.m,
  },
  quietHoursText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  historyContainer: {
    gap: spacing.m,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: spacing.m,
  },
  historyContent: {
    flex: 1,
    marginRight: spacing.m,
  },
  historyTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  historyBody: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  historyTime: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  historyStatus: {
    justifyContent: 'center',
  },
  testDescription: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.m,
  },
  testButton: {
    backgroundColor: colors.secondary || colors.primary,
  },
  saveSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.success || colors.primary,
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
  deviceInfo: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.m,
  },
}); 