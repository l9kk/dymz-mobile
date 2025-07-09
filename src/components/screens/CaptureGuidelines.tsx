import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmojiBulletList } from '../design-system/molecules/EmojiBulletList';
import { ExampleImageGrid } from '../design-system/molecules/ExampleImageGrid';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { colors, typography, spacing } from '../design-system/tokens';

interface CaptureGuidelinesProps {
  onContinue: () => void;
}

export const CaptureGuidelines: React.FC<CaptureGuidelinesProps> = ({
  onContinue
}) => {
  // Selfie guidelines with emojis
  const guidelines = [
    { emoji: '💡', text: 'Use natural lighting - avoid harsh shadows' },
    { emoji: '📱', text: 'Hold phone at arm\'s length for best results' },
    { emoji: '👀', text: 'Look directly at the camera with a neutral expression' },
    { emoji: '🚫', text: 'Remove makeup, glasses, and hair from face' },
    { emoji: '📏', text: 'Keep your face centered in the frame' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Follow these tips for the best skin analysis
          </Text>
          
          <EmojiBulletList 
            items={guidelines}
            style={styles.guidelinesList}
          />
          
          <ExampleImageGrid 
            type="good" 
            style={styles.exampleGrid}
          />
          
          <ExampleImageGrid 
            type="bad" 
            style={styles.exampleGrid}
          />
          
          <PrimaryButton 
            title="Continue" 
            onPress={onContinue}
            style={styles.button}
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    marginBottom: spacing.l,
  },
  guidelinesList: {
    marginBottom: spacing.l,
  },
  exampleGrid: {
    marginBottom: spacing.m,
  },
  button: {
    marginTop: spacing.l,
    width: '100%',
  },
}); 