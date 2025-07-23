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

interface SunExposureLevelProps {
  onBack?: () => void;
  onOptionSelect?: (option: 'low' | 'occasional' | 'high') => void;
  progressValue?: number;
  currentDot?: number;
}

export const SunExposureLevel: React.FC<SunExposureLevelProps> = ({
  onBack,
  onOptionSelect,
  progressValue = 75,
  currentDot = 0
}) => {
  const { t } = useTranslation();
  
  const exposureOptions = [
    { id: 'low', label: t('sunExposure.options.low') },
    { id: 'occasional', label: t('sunExposure.options.occasional') },
    { id: 'high', label: t('sunExposure.options.high') },
  ];

  const handleOptionPress = (optionId: string) => {
    onOptionSelect?.(optionId as 'low' | 'occasional' | 'high');
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
          {t('sunExposure.title')}
        </SectionHeading>
      </View>

      <View style={styles.optionsList}>
        <VerticalOptionList
          options={exposureOptions}
          onSelect={handleOptionPress}
        />
      </View>

      <PageDotsIndicator 
        totalDots={3}
        activeDot={currentDot}
      />

      <InfoNote 
        text={t('sunExposure.infoNote')}
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