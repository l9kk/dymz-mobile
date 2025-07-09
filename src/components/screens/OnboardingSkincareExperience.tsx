import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { 
  BackButton, 
  LinearProgressStepper, 
  VerticalOptionList,
  InfoNote
} from '../design-system';
import { colors, typography, spacing } from '../design-system/tokens';

interface OnboardingSkincareExperienceProps {
  onBack?: () => void;
  onContinue?: (experience: string) => void;
}

interface ExperienceOption {
  id: string;
  label: string;
}

const experienceOptions: ExperienceOption[] = [
  { id: 'regular', label: 'I have a regular routine' },
  { id: 'occasional', label: 'I use products occasionally' },
  { id: 'beginner', label: 'I\'m new to skincare' },
];

export const OnboardingSkincareExperience: React.FC<OnboardingSkincareExperienceProps> = ({
  onBack,
  onContinue
}) => {
  const [selectedExperience, setSelectedExperience] = useState<string>('');

  const handleExperienceSelect = (experienceId: string) => {
    setSelectedExperience(experienceId);
    // Auto-advance after selection
    setTimeout(() => {
      onContinue?.(experienceId);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton onPress={onBack} />
        
        <LinearProgressStepper 
          currentStep={3} 
          totalSteps={5}
          style={styles.progress}
        />

        <View style={styles.content}>
          <Text style={styles.title}>
            What's your skincare experience?
          </Text>

          <VerticalOptionList
            options={experienceOptions}
            selectedId={selectedExperience}
            onSelect={handleExperienceSelect}
            style={styles.optionList}
          />

          <InfoNote 
            text="This helps us recommend the right level of products for you"
            style={styles.infoNote}
          />
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
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  progress: {
    marginTop: spacing.m,
    marginBottom: spacing.xl,
  },
  content: {
    flex: 1,
    paddingTop: spacing.m,
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    paddingHorizontal: spacing.m,
  },
  optionList: {
    marginBottom: spacing.xl,
  },
  infoNote: {
    alignSelf: 'center',
    marginTop: spacing.l,
  },
}); 