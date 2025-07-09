import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  BackButton,
  LinearProgressStepper,
  SectionHeading,
  VerticalOptionList,
  PageDotsIndicator,
  InfoNote
} from '../design-system';
import { colors, spacing } from '../design-system/tokens';

interface ProductUsageYesNoProps {
  onBack?: () => void;
  onOptionSelect?: (hasTriedProducts: boolean) => void;
  progressValue?: number;
  currentDot?: number;
}

export const ProductUsageYesNo: React.FC<ProductUsageYesNoProps> = ({
  onBack,
  onOptionSelect,
  progressValue = 80,
  currentDot = 1
}) => {
  const usageOptions = [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
  ];

  const handleOptionPress = (optionId: string) => {
    const hasTriedProducts = optionId === 'yes';
    onOptionSelect?.(hasTriedProducts);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BackButton onPress={onBack} />
      
      <LinearProgressStepper 
        currentStep={progressValue}
        totalSteps={100}
        style={styles.progressBar}
      />

      <View style={styles.header}>
        <SectionHeading>
          Have you tried products to fix your skin concern?
        </SectionHeading>
      </View>

      <View style={styles.optionsList}>
        <VerticalOptionList
          options={usageOptions}
          onSelect={handleOptionPress}
        />
      </View>

      <PageDotsIndicator 
        totalDots={3}
        activeDot={currentDot}
      />

      <InfoNote 
        text="Your experience with previous products helps us understand what works best for your skin and what to avoid."
        style={styles.infoNote}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    paddingBottom: spacing.xl,
  },
  progressBar: {
    marginVertical: spacing.m,
  },
  header: {
    marginVertical: spacing.xl,
  },
  title: {
    textAlign: 'left',
  },
  optionsList: {
    marginBottom: spacing.xl,
  },
  infoNote: {
    marginTop: spacing.m,
  },
}); 