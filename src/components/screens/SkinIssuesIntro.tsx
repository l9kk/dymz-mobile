import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BackButton, 
  PrimaryButton, 
  EmphasisHeadline 
} from '../design-system/atoms';
import { SquareImageGrid } from '../design-system/molecules';
import { colors, spacing } from '../design-system/tokens';
import { getSkinIssueImages } from '../../utils/imageUrls';

interface SkinIssuesIntroProps {
  onBack?: () => void;
  onContinue?: () => void;
}

export const SkinIssuesIntro: React.FC<SkinIssuesIntroProps> = ({
  onBack,
  onContinue,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
        </View>

        <View style={styles.content}>
          <EmphasisHeadline 
            parts={["Finally, let's look at your", "skin issues!"]}
            accentIndices={[1]}
            style={styles.title}
          />
          
          <Text style={styles.subtitle}>
            Understanding your specific skin concerns helps us create the most 
            accurate analysis and personalized recommendations for your routine.
          </Text>

          <View style={styles.imageContainer}>
            <SquareImageGrid imageUris={getSkinIssueImages()} />
          </View>

          <Text style={styles.statement}>
            Our AI analyzes 8 key metrics across thousands of data points 
            to give you the most comprehensive skin assessment.
          </Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="Let's do it!"
              onPress={onContinue}
            />
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
  },
  title: {
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statement: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: spacing.l,
  },
}); 