import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
              {t('resultsLegend.title')}
            </SectionHeading>
            
            <StatParagraph style={styles.description}>
              {t('resultsLegend.description')}
            </StatParagraph>

            <View style={styles.legendContainer}>
              <RingScoreLegend ringSize={84} />
            </View>

            <StatParagraph style={styles.note}>
              {t('resultsLegend.note')}
            </StatParagraph>
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={t('buttons.seeYourResults')}
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