import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton, StatementCard, SurveyProgressBar, BinaryChoiceRow } from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import { getCollageImagesByKey, ImageUrls } from '../../utils/imageUrls';

interface SurveyStatementYN_CollageProps {
  onYes: () => void;
  onNo: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  questionTitle: string;
  statementQuote: string;
  collageImageKey: keyof typeof ImageUrls.collageImages;
}

export const SurveyStatementYN_Collage: React.FC<SurveyStatementYN_CollageProps> = ({
  onYes,
  onNo,
  onBack,
  currentStep,
  totalSteps,
  questionTitle,
  statementQuote,
  collageImageKey,
}) => {
  const collageImages = getCollageImagesByKey(collageImageKey);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={onBack} style={styles.backButton} />
        
        <View style={styles.progressBar}>
          <SurveyProgressBar
            totalSteps={totalSteps}
            currentStep={currentStep}
          />
        </View>
        
        <Text style={styles.questionTitle}>
          {questionTitle}
        </Text>
        
        <View style={styles.statementCard}>
          <StatementCard
            imageUris={collageImages}
            quote={statementQuote}
            layout="collage"
          />
        </View>
        
        <BinaryChoiceRow
          onYesPress={onYes}
          onNoPress={onNo}
          yesText="Yes"
          noText="No"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    paddingBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.l,
  },
  progressBar: {
    marginBottom: spacing.xl,
  },
  questionTitle: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center' as const,
    marginBottom: spacing.l,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
  },
  statementCard: {
    marginBottom: spacing.m,
  },
}); 