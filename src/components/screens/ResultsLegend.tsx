import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  SectionHeading, 
  RingScoreLegend, 
  PrimaryButton,
  StatParagraph 
} from '../design-system';
import { colors, spacing } from '../design-system/tokens';

interface ResultsLegendProps {
  onContinue?: () => void;
}

export const ResultsLegend: React.FC<ResultsLegendProps> = ({
  onContinue
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <SectionHeading style={styles.heading}>
              Understanding Your Scores
            </SectionHeading>
            
            <StatParagraph style={styles.description}>
              Each circular score represents different aspects of your skin health. Here's how to read them:
            </StatParagraph>

            <View style={styles.legendContainer}>
              <RingScoreLegend ringSize={84} />
            </View>

            <StatParagraph style={styles.note}>
              Higher scores indicate better skin health in that area. Don't worry about lower scores—we'll help you improve them with personalized recommendations.
            </StatParagraph>
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="See your results"
          onPress={onContinue}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80, // Extra large padding to center content lower
    paddingBottom: spacing.m, // Minimal bottom padding to prevent phantom lines
  },
  content: {
    paddingHorizontal: spacing.l,
  },
  heading: {
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  description: {
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: spacing['2xl'],
  },
  legendContainer: {
    marginBottom: spacing['2xl'],
    alignItems: 'center',
  },
  note: {
    textAlign: 'center',
    alignSelf: 'center',
    lineHeight: 20, // Reduced line height to prevent overflow
    overflow: 'hidden',
  },
  buttonContainer: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    backgroundColor: colors.backgroundPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
}); 