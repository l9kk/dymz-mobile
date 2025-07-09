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

interface PlanRoadmapProps {
  onContinue?: () => void;
}

export const PlanRoadmap: React.FC<PlanRoadmapProps> = ({
  onContinue
}) => {
  const steps = [
    {
      title: "Understanding you",
      status: "done" as const
    },
    {
      title: "Your motivations", 
      status: "done" as const
    },
    {
      title: "Your skin analysis",
      subtitle: "next, we'll show you detailed insights",
      status: "current" as const
    },
    {
      title: "Your perfect routine",
      subtitle: "then, we'll build personalized recommendations",
      status: "upcoming" as const
    },
    {
      title: "Your glow up plan",
      subtitle: "finally, your complete transformation roadmap",
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
              Your Personalized Plan
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
              We're about to reveal your complete skin analysis with personalized insights and recommendations tailored just for you.
            </StatParagraph>
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="See your analysis →"
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