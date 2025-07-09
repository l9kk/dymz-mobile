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

interface HelpSupportScreenProps {
  onBack?: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How accurate is the AI skin analysis?',
    answer: 'Our AI skin analysis uses advanced computer vision algorithms trained on thousands of dermatologist-validated images. While highly accurate, it should be used as a guide and not replace professional dermatological advice.'
  },
  {
    id: '2',
    question: 'How often should I take a new skin analysis?',
    answer: 'We recommend taking a new analysis every 4-6 weeks to track your progress. Your skin changes with seasons, products, and time, so regular analysis helps keep your routine optimized.'
  },
  {
    id: '3',
    question: 'Why am I not seeing results from my routine?',
    answer: 'Skincare results typically take 6-12 weeks to become visible. Ensure you\'re following your routine consistently and using products as directed. If concerns persist, consider consulting a dermatologist.'
  },
  {
    id: '4',
    question: 'Can I use my own products instead of recommendations?',
    answer: 'Absolutely! Our routine builder focuses on ingredients and steps. You can substitute recommended products with similar ones you already own or prefer.'
  },
  {
    id: '5',
    question: 'How do I cancel my account?',
    answer: 'You can delete your account through the Profile > Privacy Policy section, or contact our support team. All your data will be permanently removed within 30 days.'
  },
  {
    id: '6',
    question: 'Is my skin photo data secure?',
    answer: 'Yes, your photos are encrypted and processed securely. We never share personal data with third parties. Photos are automatically deleted after analysis unless you choose to save them for progress tracking.'
  }
];

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({
  onBack
}) => {
  const insets = useSafeAreaInsets();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleEmailSupport = async () => {
    const email = 'askhat.ss23@gmail.com';
    const subject = 'Dymz AI Support Request';
    const body = 'Hi Dymz AI team,\n\nI need help with:\n\n(Please describe your issue or question here)\n\nApp Version: 1.0.0\nDevice: ';
    
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert(
          'Email Not Available',
          `Please send your support request to: ${email}`,
          [{ text: 'Copy Email', onPress: () => {/* Copy to clipboard */} }, { text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Contact Support',
        `Please email us at: ${email}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleWebsiteLink = async () => {
    const websiteUrl = 'https://dymz.vercel.app/';
    try {
      const canOpen = await Linking.canOpenURL(websiteUrl);
      if (canOpen) {
        await Linking.openURL(websiteUrl);
      } else {
        Alert.alert('Cannot Open Link', 'Please visit our website at dymzai.com for more support options.');
      }
    } catch (error) {
      Alert.alert('Link Error', 'Unable to open support website. Please try again later.');
    }
  };

  const renderFAQItem = (item: FAQItem) => (
    <View key={item.id} style={styles.faqItem}>
      <TouchableOpacity 
        style={styles.faqQuestion}
        onPress={() => toggleFAQ(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <Text style={styles.faqToggle}>
          {expandedFAQ === item.id ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      
      {expandedFAQ === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading support options...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: spacing.l + insets.top }]}>
        <BackButton onPress={onBack} />
        <SectionHeading style={styles.title}>Help & Support</SectionHeading>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>👋 How can we help you?</Text>
          <Text style={styles.welcomeText}>
            Find answers to common questions or get in touch with our support team.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleEmailSupport}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📧</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Email Support</Text>
              <Text style={styles.actionDescription}>
                Get personalized help from our support team
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleWebsiteLink}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🌐</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Visit Support Website</Text>
              <Text style={styles.actionDescription}>
                Browse our complete help center and tutorials
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqData.map(renderFAQItem)}
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>July 2025</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Support Email</Text>
              <Text style={styles.infoValue}>askhat.ss23@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Still Need Help?</Text>
          <Text style={styles.contactText}>
            Can't find what you're looking for? Our support team is here to help!
          </Text>
          
          <PrimaryButton
            title="Contact Support Team"
            onPress={handleEmailSupport}
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
  welcomeSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: spacing.l,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: typography.fontSizes.headingM,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
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
  faqContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.l,
  },
  faqQuestionText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.m,
    lineHeight: 22,
  },
  faqToggle: {
    fontSize: 24,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    width: 24,
    textAlign: 'center',
  },
  faqAnswer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.l,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.l,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
  },
  infoLabel: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
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