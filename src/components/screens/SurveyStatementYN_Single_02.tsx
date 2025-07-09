import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  StatementCard,
  SurveyProgressBar,
  BinaryChoiceRow,
  BackButton,
  spacing,
  colors,
  typography,
} from '../design-system';
import { ImageUrls } from '../../utils/imageUrls';

interface SurveyStatementYN_Single_02Props {
  onYes: () => void;
  onNo: () => void;
  onBack: () => void;
}

export const SurveyStatementYN_Single_02: React.FC<SurveyStatementYN_Single_02Props> = ({
  onYes,
  onNo,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />
      
      <View style={styles.content}>
        <SurveyProgressBar currentStep={8} totalSteps={10} />
        
        <Text style={styles.questionTitle}>
          Do you relate to this?
        </Text>
        
        <StatementCard
          layout="single"
          imageSource={{ uri: ImageUrls.statements.skincare_frustration_2 }}
          quote="I'll never achieve my dream skin because I don't know where to start"
        />
        
        <BinaryChoiceRow
          onYesPress={onYes}
          onNoPress={onNo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    justifyContent: 'space-between',
  },
  questionTitle: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.l,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
  },
}); 