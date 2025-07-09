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

      <View style={styles.testimonialsSection}>
        <AvatarQuoteRow
          avatarUri=""
          author="Sarah M."
          quote="My acne has reduced by 70% in just one month!"
          style={styles.testimonial}
        />
        
        <AvatarQuoteRow
          avatarUri=""
          author="Jessica L."
          quote="Finally found products that actually work for my sensitive skin"
          style={styles.testimonial}
        />
        
        <AvatarQuoteRow
          avatarUri=""
          author="Maria K."
          quote="The progress tracking keeps me motivated every day"
          style={styles.testimonial}
        />
      </View>

      <View style={styles.featuresRow}>
        {features.map((feature, index) => (
          <IconFeatureCard
            key={index}
            iconName={feature.iconName}
            title={feature.title}
            description={feature.description}
            style={styles.featureCard}
          />
        ))}
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
  testimonialsSection: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
  },
  testimonial: {
    marginBottom: spacing.m,
  },
  featuresRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
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