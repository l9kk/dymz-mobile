import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BackButton, 
  LinearProgressStepper, 
  EmphasisHeadline,
  InfoNote
} from '../design-system/atoms';
import { VerticalOptionList } from '../design-system/molecules';
import { colors, spacing } from '../design-system/tokens';

interface ConcernDurationProps {
  onBack?: () => void;
  onDurationSelected?: (duration: string) => void;
  selectedConcern?: string;
}

const DURATION_OPTIONS = [
  { id: '4+ years', label: '4+ years' },
  { id: '1-3 years', label: '1-3 years' }, 
  { id: 'A few months or less', label: 'A few months or less' }
];

export const ConcernDuration: React.FC<ConcernDurationProps> = ({
  onBack,
  onDurationSelected,
  selectedConcern,
}) => {
  const handleDurationPress = (durationId: string) => {
    onDurationSelected?.(durationId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
        </View>

        <View style={styles.progressContainer}>
          <LinearProgressStepper 
            currentStep={10}
            totalSteps={12}
          />
        </View>

        <View style={styles.content}>
          <EmphasisHeadline 
            parts={["How long have you had", `${selectedConcern?.toLowerCase() || 'this concern'}?`]}
            accentIndices={[1]}
            style={styles.title}
          />

          <View style={styles.optionsContainer}>
            <VerticalOptionList 
              options={DURATION_OPTIONS}
              onSelect={handleDurationPress}
            />
          </View>

          <InfoNote 
            text="Understanding the duration helps us recommend the right treatment intensity and set realistic timelines for improvement."
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
  scrollContent: {
    flexGrow: 1,
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