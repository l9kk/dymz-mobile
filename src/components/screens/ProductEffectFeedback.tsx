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

interface ProductEffectFeedbackProps {
  onBack?: () => void;
  onOptionSelect?: (effectiveness: 'helped-lot' | 'helped-little' | 'no-effect' | 'made-worse') => void;
  progressValue?: number;
  currentDot?: number;
}

export const ProductEffectFeedback: React.FC<ProductEffectFeedbackProps> = ({
  onBack,
  onOptionSelect,
  progressValue = 85,
  currentDot = 2
}) => {
  const effectOptions = [
    { id: 'helped-lot', label: 'Helped a lot' },
    { id: 'helped-little', label: 'Helped a little' },
    { id: 'no-effect', label: "Didn't do much" },
    { id: 'made-worse', label: 'Made it worse' },
  ];

  const handleOptionPress = (optionId: string) => {
    onOptionSelect?.(optionId as 'helped-lot' | 'helped-little' | 'no-effect' | 'made-worse');
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
          How did the products affect your skin?
        </SectionHeading>
      </View>

      <View style={styles.optionsList}>
        <VerticalOptionList
          options={effectOptions}
          onSelect={handleOptionPress}
        />
      </View>

      <PageDotsIndicator 
        totalDots={3}
        activeDot={currentDot}
      />

      <InfoNote 
        text="Your feedback helps us improve our recommendations and find products that will work better for your unique skin needs."
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