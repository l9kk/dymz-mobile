import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
  const effectOptions = [
    { id: 'helped-lot', label: t('productEffectFeedback.options.helpedLot') },
    { id: 'helped-little', label: t('productEffectFeedback.options.helpedLittle') },
    { id: 'no-effect', label: t('productEffectFeedback.options.noEffect') },
    { id: 'made-worse', label: t('productEffectFeedback.options.madeWorse') },
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
          {t('productEffectFeedback.title')}
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
        text={t('productEffectFeedback.infoNote')}
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