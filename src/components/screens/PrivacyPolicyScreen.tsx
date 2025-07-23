import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  BackButton,
  SectionHeading,
  PrimaryButton,
  LoadingSpinner
} from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';

interface PrivacyPolicyScreenProps {
  onBack?: () => void;
}

interface PolicySection {
  id: string;
  title: string;
  content: string;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({
  onBack
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const policySections: PolicySection[] = [
    {
      id: 'overview',
      title: t('privacy.sections.overview.title'),
      content: t('privacy.sections.overview.content')
    },
    {
      id: 'information-collected',
      title: t('privacy.sections.informationCollected.title'),
      content: t('privacy.sections.informationCollected.content')
    },
    {
      id: 'how-we-use-info',
      title: t('privacy.sections.howWeUse.title'),
      content: t('privacy.sections.howWeUse.content')
    },
    {
      id: 'data-protection',
      title: t('privacy.sections.dataProtection.title'),
      content: t('privacy.sections.dataProtection.content')
    },
    {
      id: 'sharing-disclosure',
      title: t('privacy.sections.sharing.title'),
      content: t('privacy.sections.sharing.content')
    },
    {
      id: 'your-rights',
      title: t('privacy.sections.yourRights.title'),
      content: t('privacy.sections.yourRights.content')
    },
    {
      id: 'cookies-tracking',
      title: t('privacy.sections.cookies.title'),
      content: t('privacy.sections.cookies.content')
    },
    {
      id: 'children-privacy',
      title: t('privacy.sections.children.title'),
      content: t('privacy.sections.children.content')
    },
    {
      id: 'changes',
      title: t('privacy.sections.changes.title'),
      content: t('privacy.sections.changes.content')
    },
    {
      id: 'contact',
      title: t('privacy.sections.contact.title'),
      content: t('privacy.sections.contact.content')
    }
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleContactPrivacy = async () => {
    const email = 'askhat.ss23@gmail.com';
    const subject = 'Privacy Policy Question';
    const body = 'Hi Dymz AI team,\n\nI have a question about your privacy policy:\n\n(Please describe your question or concern here)\n\n';
    
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert(
          'Contact Privacy Team',
          `Please email your privacy questions to: ${email}`,
          [{ text: t('common.ok') }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Contact Privacy Team',
        `Please email us at: ${email}`,
        [{ text: t('common.ok') }]
      );
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'To delete your account and all associated data, please contact our support team. This action cannot be undone.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: 'Contact Support', 
          style: 'destructive', 
          onPress: () => handleContactPrivacy()
        }
      ]
    );
  };

  const renderPolicySection = (section: PolicySection) => (
    <View key={section.id} style={styles.policySection}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection(section.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionToggle}>
          {expandedSection === section.id ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      
      {expandedSection === section.id && (
        <View style={styles.sectionContent}>
          <Text style={styles.sectionText}>{section.content}</Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading privacy policy...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: spacing.l + insets.top }]}>
        <BackButton onPress={onBack} />
        <SectionHeading style={styles.title}>Privacy Policy</SectionHeading>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>🔒 Your Privacy Matters</Text>
          <Text style={styles.introText}>
            We're committed to protecting your personal information and being transparent about how we use your data.
          </Text>
          <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>Last updated: July 2025</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleContactPrivacy}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📧</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Contact Privacy Team</Text>
              <Text style={styles.actionDescription}>
                Questions about your data or privacy
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleDeleteAccount}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🗑️</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Delete My Account</Text>
              <Text style={styles.actionDescription}>
                Remove all your data permanently
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Policy Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionGroupTitle}>Privacy Policy Details</Text>
          <View style={styles.policyContainer}>
            {policySections.map(renderPolicySection)}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📋 Summary</Text>
            <Text style={styles.summaryText}>
              • We protect your data with industry-standard security{'\n'}
              • We don't sell your personal information{'\n'}
              • You control your data and can delete it anytime{'\n'}
              • Photos are automatically deleted after analysis{'\n'}
              • Contact us anytime with privacy questions
            </Text>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.contactTitle}>Questions About Your Privacy?</Text>
          <Text style={styles.contactText}>
            Our privacy team is here to help with any questions or concerns.
          </Text>
          
          <PrimaryButton
            title="Contact Privacy Team"
            onPress={handleContactPrivacy}
            style={styles.contactButton}
          />
        </View>
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
    paddingBottom: spacing.m,
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
  introSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: spacing.l,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: typography.fontSizes.headingM,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  introText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.m,
  },
  lastUpdated: {
    backgroundColor: colors.backgroundPrimary,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  lastUpdatedText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.xl,
  },
  quickActionsTitle: {
    fontSize: typography.fontSizes.headingS,
    fontFamily: typography.fontFamilies.primary,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.l,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.l,
    marginBottom: spacing.m,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionArrow: {
    fontSize: 18,
    color: colors.textSecondary,
    marginLeft: spacing.m,
  },
  sectionGroupTitle: {
    fontSize: typography.fontSizes.headingS,
    fontFamily: typography.fontFamilies.primary,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.l,
  },
  policyContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  policySection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.m,
  },
  sectionToggle: {
    fontSize: 24,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    width: 24,
    textAlign: 'center',
  },
  sectionContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.l,
    paddingTop: 0,
  },
  sectionText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.l,
  },
  summaryTitle: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  summaryText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  contactTitle: {
    fontSize: typography.fontSizes.headingS,
    fontFamily: typography.fontFamilies.primary,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  contactText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.l,
  },
  contactButton: {
    marginTop: spacing.m,
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
}); 