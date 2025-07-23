import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  StatsSplitBanner,
  AvatarQuoteRow,
  IconFeatureCard,
  SectionHeading,
  PrimaryButton,
  Icon,
  IconNames
} from '../design-system';
import { colors, spacing } from '../design-system/tokens';
import { useTranslation } from '../../hooks/useTranslation';

interface SocialProofResultsProps {
  onContinue?: () => void;
}

export const SocialProofResults: React.FC<SocialProofResultsProps> = ({
  onContinue
}) => {
  const { t } = useTranslation();
  
  const features = [
    {
      iconName: IconNames.analytics,
      title: t('onboarding.socialProof.feature1Title'),
      description: t('onboarding.socialProof.feature1Description')
    },
    {
      iconName: IconNames.skincare,
      title: t('onboarding.socialProof.feature2Title'),
      description: t('onboarding.socialProof.feature2Description')
    },
    {
      iconName: IconNames.sparkles,
      title: t('onboarding.socialProof.feature3Title'),
      description: t('onboarding.socialProof.feature3Description')
    },
    {
      iconName: IconNames.shield,
      title: t('onboarding.socialProof.feature4Title'),
      description: t('onboarding.socialProof.feature4Description')
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Icon
          name={IconNames.success}
          size={48}
          color={colors.brandPrimary}
          style={styles.successIcon}
        />
        <SectionHeading style={styles.heading}>
          {t('onboarding.socialProof.heading')}
        </SectionHeading>
      </View>

      <StatsSplitBanner
        stats={[
          { value: "89%", label: t('stats.seeImprovements') },
          { value: "94%", label: t('stats.stickToRoutine') }
        ]}
        style={styles.statsSection}
      />

      <View style={styles.descriptionSection}>
        <Text style={styles.description}>
          {t('onboarding.socialProof.description')}
        </Text>
      </View>

      <View style={styles.featuresGrid}>
        <View style={styles.featuresRow}>
          {features.slice(0, 2).map((feature, index) => (
            <IconFeatureCard
              key={index}
              iconName={feature.iconName}
              title={feature.title}
              description={feature.description}
              style={styles.featureCard}
            />
          ))}
        </View>
        <View style={styles.featuresRow}>
          {features.slice(2, 4).map((feature, index) => (
            <IconFeatureCard
              key={index + 2}
              iconName={feature.iconName}
              title={feature.title}
              description={feature.description}
              style={styles.featureCard}
            />
          ))}
        </View>
      </View>

      <View style={styles.ctaSection}>
        <PrimaryButton
          title={t('buttons.startYourJourney')}
          onPress={onContinue}
        />
        <Text style={styles.disclaimer}>
          {t('onboarding.socialProof.disclaimer')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    marginHorizontal: spacing.l,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  successIcon: {
    marginBottom: spacing.m,
  },
  heading: {
    textAlign: 'center',
  },
  statsSection: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.xl,
  },
  descriptionSection: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.l,
  },
  featuresGrid: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
    gap: spacing.m,
  },
  featureCard: {
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: spacing.l,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.m,
    fontStyle: 'italic',
  },
}); 