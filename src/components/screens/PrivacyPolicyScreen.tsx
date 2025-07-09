import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const policySections: PolicySection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: 'At Dymz AI, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our skincare analysis app.'
  },
  {
    id: 'information-collected',
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us, such as:\n\n• Profile information (age, gender, skin type)\n• Photos you upload for skin analysis\n• Skincare routine preferences and history\n• App usage data and interactions\n• Device information and identifiers\n\nWe do not sell your personal data to third parties.'
  },
  {
    id: 'how-we-use-info',
    title: 'How We Use Your Information',
    content: 'We use your information to:\n\n• Provide personalized skin analysis and recommendations\n• Improve our AI algorithms and app functionality\n• Send you relevant skincare tips and reminders (with your consent)\n• Provide customer support\n• Ensure app security and prevent fraud\n• Comply with legal obligations'
  },
  {
    id: 'data-protection',
    title: 'Data Protection & Security',
    content: 'We implement industry-standard security measures to protect your data:\n\n• All photos are encrypted during transmission and storage\n• Personal data is stored on secure, encrypted servers\n• We use secure authentication methods\n• Regular security audits and updates\n• Limited access to data on a need-to-know basis\n\nPhotos uploaded for analysis are automatically deleted after processing unless you choose to save them for progress tracking.'
  },
  {
    id: 'sharing-disclosure',
    title: 'Information Sharing',
    content: 'We do not sell, trade, or rent your personal information. We may share information only in these limited circumstances:\n\n• With your explicit consent\n• To comply with legal requirements\n• To protect our rights and prevent fraud\n• With trusted service providers who help operate our app (under strict confidentiality agreements)\n• In case of business transfers (with prior notice)'
  },
  {
    id: 'your-rights',
    title: 'Your Rights & Choices',
    content: 'You have the right to:\n\n• Access your personal data\n• Correct inaccurate information\n• Delete your account and data\n• Opt-out of marketing communications\n• Data portability (download your data)\n• Withdraw consent at any time\n\nTo exercise these rights, contact us at askhat.ss23@gmail.com or through the app settings.'
  },
  {
    id: 'cookies-tracking',
    title: 'Cookies & Tracking',
    content: 'We use minimal tracking technologies:\n\n• Essential cookies for app functionality\n• Analytics to understand app usage (anonymized)\n• No third-party advertising cookies\n• No cross-app tracking\n\nYou can manage these preferences in your device settings.'
  },
  {
    id: 'children-privacy',
    title: 'Children\'s Privacy',
    content: 'Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.'
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: 'We may update this privacy policy from time to time. We will notify you of any material changes through the app or by email. Your continued use of the app after changes indicates acceptance of the updated policy.'
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: 'If you have questions about this privacy policy or our data practices, please contact us:\n\n• Email: askhat.ss23@gmail.com\n• Support: askhat.ss23@gmail.com\n• Address: [Company Address]\n\nLast updated: July 2025'
  }
];

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({
  onBack
}) => {
  const insets = useSafeAreaInsets();
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [isLoading, setIsLoading] = useState(false);

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
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Contact Privacy Team',
        `Please email us at: ${email}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'To delete your account and all associated data, please contact our support team. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
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