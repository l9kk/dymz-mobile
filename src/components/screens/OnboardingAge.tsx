import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../design-system/atoms/BackButton';
import { LinearProgressStepper } from '../design-system/atoms/LinearProgressStepper';
import { VerticalOptionList } from '../design-system/molecules/VerticalOptionList';
import { InfoNote } from '../design-system/atoms/InfoNote';
import { ForwardFAB } from '../design-system/atoms/ForwardFAB';
import { colors, typography, spacing } from '../design-system/tokens';
import { useTranslation } from '../../hooks/useTranslation';

interface OnboardingAgeProps {
  onBack: () => void;
  onContinue: (ageRange: string) => void;
}

export const OnboardingAge: React.FC<OnboardingAgeProps> = ({
  onBack,
  onContinue
}) => {
  const { t } = useTranslation();
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const ageOptions = [
    { id: '13-18', label: t('onboarding.age.options.13-18') },
    { id: '19-25', label: t('onboarding.age.options.19-25') },
    { id: '26-35', label: t('onboarding.age.options.26-35') },
    { id: '46-55', label: t('onboarding.age.options.46-55') },
    { id: '56+', label: t('onboarding.age.options.56+') },
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
            {t('onboarding.age.title')}
          </Text>
          
          <Text style={styles.subtitle}>
            {t('onboarding.age.subtitle')}
          </Text>
          
          <VerticalOptionList
            options={ageOptions}
            selectedId={selectedAge || undefined}
            onSelect={setSelectedAge}
            style={styles.optionList}
          />
          
          <InfoNote 
            text={t('onboarding.age.infoNote')}
            style={styles.infoNote}
          />
          
          <ForwardFAB
            label={t('common.next')}
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