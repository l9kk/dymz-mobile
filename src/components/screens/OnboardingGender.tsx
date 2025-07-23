import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../design-system/atoms/BackButton';
import { LinearProgressStepper } from '../design-system/atoms/LinearProgressStepper';
import { SegmentedChoiceTile } from '../design-system/molecules/SegmentedChoiceTile';
import { InfoNote } from '../design-system/atoms/InfoNote';
import { colors, typography, spacing } from '../design-system/tokens';
import { useTranslation } from '../../hooks/useTranslation';

interface OnboardingGenderProps {
  onBack: () => void;
  onContinue: (gender: string) => void;
}

export const OnboardingGender: React.FC<OnboardingGenderProps> = ({
  onBack,
  onContinue
}) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const { t } = useTranslation();

  const genderOptions = [
    { id: 'female', icon: '👩', label: t('onboarding.gender.female') },
    { id: 'male', icon: '👨', label: t('onboarding.gender.male') },
    { id: 'nonbinary', icon: '🧑', label: t('onboarding.gender.other') },
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
            {t('onboarding.gender.title')}
          </Text>
          
          <Text style={styles.subtitle}>
            {t('onboarding.gender.subtitle')}
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
            text={t('onboarding.gender.privacyNote')}
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