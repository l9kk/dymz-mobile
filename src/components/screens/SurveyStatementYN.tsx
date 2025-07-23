import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BackButton, StatementCard, SurveyProgressBar, BinaryChoiceRow } from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import { getStatementImageByKey, ImageUrls } from '../../utils/imageUrls';

interface SurveyStatementYNProps {
  onYes: () => void;
  onNo: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  questionTitle: string;
  statementQuote: string;
  statementImageKey: keyof typeof ImageUrls.statements;
}

export const SurveyStatementYN: React.FC<SurveyStatementYNProps> = ({
  onYes,
  onNo,
  onBack,
  currentStep,
  totalSteps,
  questionTitle,
  statementQuote,
  statementImageKey,
}) => {
  const { t } = useTranslation();
  const statementImage = { uri: getStatementImageByKey(statementImageKey) };

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
            imageSource={statementImage}
            quote={statementQuote}
          />
        </View>
        
        <BinaryChoiceRow
          onYesPress={onYes}
          onNoPress={onNo}
          yesText={t('surveyStatement.yes')}
          noText={t('surveyStatement.no')}
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
    marginBottom: spacing.m, // Space before binary choice row
  },
}); 