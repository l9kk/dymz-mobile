import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  SectionHeading, 
  StepTimelineRow, 
  PrimaryButton,
  StatParagraph 
} from '../design-system';
import { colors, spacing } from '../design-system/tokens';
import { useTranslation } from '../../hooks/useTranslation';

interface PlanRoadmapProps {
  onContinue?: () => void;
}

export const PlanRoadmap: React.FC<PlanRoadmapProps> = ({
  onContinue
}) => {
  const { t } = useTranslation();
  const steps = [
    {
      title: t('onboarding.roadmap.understandingYou.title'),
      status: "done" as const
    },
    {
      title: t('onboarding.roadmap.yourMotivations.title'), 
      status: "done" as const
    },
    {
      title: t('onboarding.roadmap.skinAnalysis.title'),
      subtitle: t('onboarding.roadmap.skinAnalysis.subtitle'),
      status: "current" as const
    },
    {
      title: t('onboarding.roadmap.perfectRoutine.title'),
      subtitle: t('onboarding.roadmap.perfectRoutine.subtitle'),
      status: "upcoming" as const
    },
    {
      title: t('onboarding.roadmap.glowUpPlan.title'),
      subtitle: t('onboarding.roadmap.glowUpPlan.subtitle'),
      status: "upcoming" as const
    }
  ];

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
              {t('onboarding.roadmap.planTitle')}
            </SectionHeading>
            
            <View style={styles.timelineContainer}>
              {steps.map((step, index) => (
                <StepTimelineRow
                  key={index}
                  title={step.title}
                  subtitle={step.subtitle}
                  status={step.status}
                />
              ))}
            </View>

            <StatParagraph style={styles.description}>
              {t('onboarding.roadmap.description')}
            </StatParagraph>
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={t('buttons.seeYourAnalysis')}
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
  timelineContainer: {
    marginBottom: spacing['2xl'],
  },
  description: {
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