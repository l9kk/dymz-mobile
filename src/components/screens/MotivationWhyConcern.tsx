import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const MOTIVATION_OPTIONS = [
  { id: 'insecurity', label: 'It makes me feel insecure about my appearance' },
  { id: 'health', label: 'I want healthier, more balanced skin' },
  { id: 'confidence', label: 'I want confidence without makeup' },
  { id: 'discomfort', label: 'It causes physical discomfort or irritation' },
  { id: 'event', label: 'I have an upcoming important event' },
  { id: 'aging', label: 'I want to prevent future skin aging' }
];

export const MotivationWhyConcern: React.FC<MotivationWhyConcernProps> = ({
  onBack,
  onMotivationSelected,
  selectedConcern,
}) => {
  const [selectedMotivation, setSelectedMotivation] = useState<string>();

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
            parts={["Why do you want to improve", `your ${selectedConcern?.toLowerCase() || 'skin concern'}?`]}
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
            text="Understanding your motivation helps us prioritize the right ingredients and create a routine that matches your goals and timeline."
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