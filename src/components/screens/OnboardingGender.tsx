import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../design-system/atoms/BackButton';
import { LinearProgressStepper } from '../design-system/atoms/LinearProgressStepper';
import { SegmentedChoiceTile } from '../design-system/molecules/SegmentedChoiceTile';
import { InfoNote } from '../design-system/atoms/InfoNote';
import { colors, typography, spacing } from '../design-system/tokens';

interface OnboardingGenderProps {
  onBack: () => void;
  onContinue: (gender: string) => void;
}

export const OnboardingGender: React.FC<OnboardingGenderProps> = ({
  onBack,
  onContinue
}) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const genderOptions = [
    { id: 'female', icon: '👩', label: 'Female' },
    { id: 'male', icon: '👨', label: 'Male' },
    { id: 'nonbinary', icon: '🧑', label: 'Non-binary' },
  ];

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    // Auto-advance after selection
    setTimeout(() => {
      onContinue(gender);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <BackButton onPress={onBack} />
          
          <LinearProgressStepper 
            currentStep={1} 
            totalSteps={3}
            style={styles.progressStepper}
          />
          
          <Text style={styles.title}>
            What's your gender?
          </Text>
          
          <Text style={styles.subtitle}>
            This helps us recommend products that work best for your skin type and concerns.
          </Text>
          
          <View style={styles.choicesContainer}>
            {genderOptions.map((option, index) => (
              <SegmentedChoiceTile
                key={option.id}
                icon={option.icon}
                label={option.label}
                isSelected={selectedGender === option.id}
                onPress={() => handleGenderSelect(option.id)}
                style={styles.choiceTile}
                animationDelay={index * 150}
              />
            ))}
          </View>
          
          <InfoNote 
            text="Your data is private and secure. We use this information only to personalize your skincare recommendations."
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  progressStepper: {
    marginTop: spacing.m,
    marginBottom: spacing.l,
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginBottom: spacing.xl,
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: spacing.xl,
  },
  choiceTile: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoNote: {
    marginTop: spacing.l,
  },
}); 