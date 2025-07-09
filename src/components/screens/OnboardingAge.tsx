import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../design-system/atoms/BackButton';
import { LinearProgressStepper } from '../design-system/atoms/LinearProgressStepper';
import { VerticalOptionList } from '../design-system/molecules/VerticalOptionList';
import { InfoNote } from '../design-system/atoms/InfoNote';
import { ForwardFAB } from '../design-system/atoms/ForwardFAB';
import { colors, typography, spacing } from '../design-system/tokens';

interface OnboardingAgeProps {
  onBack: () => void;
  onContinue: (ageRange: string) => void;
}

export const OnboardingAge: React.FC<OnboardingAgeProps> = ({
  onBack,
  onContinue
}) => {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const ageOptions = [
    { id: '13-18', label: '13-18 years old' },
    { id: '19-25', label: '19-25 years old' },
    { id: '26-35', label: '26-35 years old' },
    { id: '46-55', label: '46-55 years old' },
    { id: '56+', label: '56+ years old' },
  ];

  const handleContinue = () => {
    if (selectedAge) {
      onContinue(selectedAge);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <BackButton onPress={onBack} />
          
          <LinearProgressStepper 
            currentStep={2} 
            totalSteps={3}
            style={styles.progressStepper}
          />
          
          <Text style={styles.title}>
            What's your age range?
          </Text>
          
          <Text style={styles.subtitle}>
            Different age groups have unique skin needs. Teens might focus on acne, while mature skin needs anti-aging care.
          </Text>
          
          <VerticalOptionList
            options={ageOptions}
            selectedId={selectedAge || undefined}
            onSelect={setSelectedAge}
            style={styles.optionList}
          />
          
          <InfoNote 
            text="Age-specific recommendations help us suggest products with the right active ingredients for your skin's current needs."
            style={styles.infoNote}
          />
          
          <ForwardFAB
            label="Next"
            onPress={handleContinue}
            disabled={!selectedAge}
            style={styles.fab}
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
    paddingBottom: spacing.xl,
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
  optionList: {
    marginBottom: spacing.l,
  },
  infoNote: {
    marginBottom: spacing.l,
  },
  fab: {
    marginTop: spacing.l,
  },
}); 