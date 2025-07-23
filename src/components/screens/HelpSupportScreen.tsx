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

interface HelpSupportScreenProps {
  onBack?: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({
  onBack
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: t('support.faq.q1.question'),
      answer: t('support.faq.q1.answer')
    },
    {
      id: '2',
      question: t('support.faq.q2.question'),
      answer: t('support.faq.q2.answer')
    },
    {
      id: '3',
      question: t('support.faq.q3.question'),
      answer: t('support.faq.q3.answer')
    },
    {
      id: '4',
      question: t('support.faq.q4.question'),
      answer: t('support.faq.q4.answer')
    },
    {
      id: '5',
      question: t('support.faq.q5.question'),
      answer: t('support.faq.q5.answer')
    },
    {
      id: '6',
      question: t('support.faq.q6.question'),
      answer: t('support.faq.q6.answer')
    }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleEmailSupport = async () => {
    const email = 'askhat.ss23@gmail.com';
    const subject = t('support.email.subject');
    const body = t('support.email.body');
    
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert(
          t('support.email.notAvailable'),
          t('support.email.sendTo', { email }),
          [{ text: t('support.email.copyEmail'), onPress: () => {/* Copy to clipboard */} }, { text: t('common.ok') }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('support.contactSupport'),
        t('support.email.sendTo', { email }),
        [{ text: t('common.ok') }]
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
        Alert.alert(t('support.cannotOpenLink'), t('support.websiteVisit'));
      }
    } catch (error) {
      Alert.alert(t('support.linkError'), t('support.tryAgainLater'));
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
        <Text style={styles.loadingText}>{t('support.loadingOptions')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: spacing.l + insets.top }]}>
        <BackButton onPress={onBack} />
        <SectionHeading style={styles.title}>{t('support.title')}</SectionHeading>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>{t('support.welcome.title')}</Text>
          <Text style={styles.welcomeText}>
            {t('support.welcome.text')}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.quickActions')}</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleEmailSupport}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📧</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{t('support.actions.emailSupport')}</Text>
              <Text style={styles.actionDescription}>
                {t('support.actions.emailDescription')}
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleWebsiteLink}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🌐</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{t('support.actions.visitWebsite')}</Text>
              <Text style={styles.actionDescription}>
                {t('support.actions.websiteDescription')}
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.faqTitle')}</Text>
          <View style={styles.faqContainer}>
            {faqData.map(renderFAQItem)}
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.appInfo.title')}</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('support.appInfo.version')}</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('support.appInfo.lastUpdated')}</Text>
              <Text style={styles.infoValue}>{t('support.appInfo.updateDate')}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('support.appInfo.supportEmail')}</Text>
              <Text style={styles.infoValue}>askhat.ss23@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.stillNeedHelp')}</Text>
          <Text style={styles.contactText}>
            {t('support.contactDescription')}
          </Text>
          
          <PrimaryButton
            title={t('profile.contactSupportTeam')}
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