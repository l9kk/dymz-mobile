import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { 
  BackButton, 
  LinearProgressStepper, 
  EmphasisHeadline,
  InfoNote
} from '../design-system/atoms';
import { VerticalOptionList } from '../design-system/molecules';
import { ForwardCircleFAB } from '../design-system/atoms';
import { colors, spacing } from '../design-system/tokens';

interface MotivationWhyConcernProps {
  onBack?: () => void;
  onMotivationSelected?: (motivation: string) => void;
  selectedConcern?: string;
}

export const MotivationWhyConcern: React.FC<MotivationWhyConcernProps> = ({
  onBack,
  onMotivationSelected,
  selectedConcern,
}) => {
  const { t } = useTranslation();
  const [selectedMotivation, setSelectedMotivation] = useState<string>();

  const MOTIVATION_OPTIONS = [
    { id: 'insecurity', label: t('motivationWhyConcern.options.insecurity') },
    { id: 'health', label: t('motivationWhyConcern.options.health') },
    { id: 'confidence', label: t('motivationWhyConcern.options.confidence') },
    { id: 'discomfort', label: t('motivationWhyConcern.options.discomfort') },
    { id: 'event', label: t('motivationWhyConcern.options.event') },
    { id: 'aging', label: t('motivationWhyConcern.options.aging') }
  ];

  const handleMotivationPress = (motivationId: string) => {
    setSelectedMotivation(motivationId);
  };

  const handleNext = () => {
    if (selectedMotivation) {
      onMotivationSelected?.(selectedMotivation);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
        </View>

        <View style={styles.progressContainer}>
          <LinearProgressStepper 
            currentStep={11}
            totalSteps={12}
          />
        </View>

        <View style={styles.content}>
          <EmphasisHeadline 
            parts={[t('motivationWhyConcern.titlePart1'), t('motivationWhyConcern.titlePart2', { concern: selectedConcern?.toLowerCase() || t('motivationWhyConcern.defaultConcern') })]}
            accentIndices={[1]}
            style={styles.title}
          />

          <View style={styles.optionsContainer}>
            <VerticalOptionList 
              options={MOTIVATION_OPTIONS}
              selectedId={selectedMotivation}
              onSelect={handleMotivationPress}
            />
          </View>

          <InfoNote 
            text={t('motivationWhyConcern.infoNote')}
            style={styles.infoNote}
          />
        </View>
      </ScrollView>
      
      <ForwardCircleFAB
        visible={!!selectedMotivation}
        onPress={handleNext}
      />
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
    paddingBottom: 100, // Space for FAB
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  progressContainer: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
  },
  title: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: spacing.xl,
  },
  infoNote: {
    marginTop: 'auto',
    marginBottom: spacing.l,
  },
}); 