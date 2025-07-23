import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { 
  PrimaryButton,
  SectionHeading
} from '../design-system/atoms';
import { 
  AvatarGroupCount,
  TestimonialCard
} from '../design-system/molecules';
import { SecondaryTextLink } from '../design-system/atoms';
import { colors, spacing } from '../design-system/tokens';
import { getTestimonialAvatars } from '../../utils/imageUrls';

interface RatingPromptProps {
  onRateApp?: () => void;
  onDismiss?: () => void;
}

export const RatingPrompt: React.FC<RatingPromptProps> = ({
  onRateApp,
  onDismiss,
}) => {
  const { t } = useTranslation();
  
  const TESTIMONIAL_DATA = [
    {
      avatarUri: 'https://images.unsplash.com/photo-1553514029-1318c9127859?w=48&h=48&fit=crop&crop=face',
      username: 'Sarah M.',
      rating: 5,
      testimonialText: t('ratingPrompt.testimonials.sarah.text'),
      highlightedPhrases: t('ratingPrompt.testimonials.sarah.highlighted', { returnObjects: true }) as string[]
    },
    {
      avatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face',
      username: 'Mike R.',
      rating: 5,
      testimonialText: t('ratingPrompt.testimonials.mike.text'),
      highlightedPhrases: t('ratingPrompt.testimonials.mike.highlighted', { returnObjects: true }) as string[]
    }
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <SectionHeading>
            {t('ratingPrompt.title')}
          </SectionHeading>
          
          <Text style={styles.bodyText}>
            {t('ratingPrompt.body1')}
          </Text>
          
          <Text style={styles.bodyText}>
            {t('ratingPrompt.body2')}
          </Text>

          <View style={styles.socialProofContainer}>
            <AvatarGroupCount
              avatarUris={getTestimonialAvatars()}
              userCount={t('ratingPrompt.userCount')}
            />
          </View>

          <View style={styles.testimonialsContainer}>
            {TESTIMONIAL_DATA.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                avatarUri={testimonial.avatarUri}
                username={testimonial.username}
                rating={testimonial.rating}
                testimonialText={testimonial.testimonialText}
                highlightedPhrases={testimonial.highlightedPhrases}
              />
            ))}
          </View>

          <View style={styles.buttonsContainer}>
            <PrimaryButton 
              title={t('ratingPrompt.rateButton')}
              onPress={onRateApp}
              style={styles.rateButton}
            />
            
            <SecondaryTextLink
              title={t('ratingPrompt.dismissButton')}
              onPress={onDismiss}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.l,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.m,
    maxWidth: 300,
  },
  socialProofContainer: {
    marginVertical: spacing.xl,
  },
  testimonialsContainer: {
    marginBottom: spacing.xl,
    gap: spacing.m,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.m,
  },
  rateButton: {
    width: '100%',
  },
}); 