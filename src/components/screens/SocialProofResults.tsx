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

interface SocialProofResultsProps {
  onContinue?: () => void;
}

export const SocialProofResults: React.FC<SocialProofResultsProps> = ({
  onContinue
}) => {
  const features = [
    {
      iconName: IconNames.analytics,
      title: 'Track Progress',
      description: 'Visual skin improvement tracking'
    },
    {
      iconName: IconNames.skincare,
      title: 'Smart Routines',
      description: 'Personalized daily skincare'
    },
    {
      iconName: IconNames.sparkles,
      title: 'AI Analysis',
      description: 'Advanced skin analysis technology'
    },
    {
      iconName: IconNames.shield,
      title: 'Expert Guidance',
      description: 'Dermatologist-backed recommendations'
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
          Join 12,000+ Users Getting Clear Skin
        </SectionHeading>
      </View>

      <StatsSplitBanner
        stats={[
          { value: "89%", label: "See improvements in 4 weeks" },
          { value: "94%", label: "Stick to their routine" }
        ]}
        style={styles.statsSection}
      />

      <View style={styles.descriptionSection}>
        <Text style={styles.description}>
          Join thousands who've transformed their skin with our AI-powered skincare platform. 
          Get personalized routines, track your progress, and achieve the clear, healthy skin you deserve.
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
          title="Start Your Journey"
          onPress={onContinue}
        />
        <Text style={styles.disclaimer}>
          Results based on user surveys. Individual results may vary.
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