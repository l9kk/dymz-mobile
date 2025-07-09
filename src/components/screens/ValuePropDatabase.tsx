import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { 
  BackButton, 
  StatParagraph,
  PrimaryButton
} from '../design-system';
import { colors, typography, spacing } from '../design-system/tokens';
import { Ionicons } from '@expo/vector-icons';

interface ValuePropDatabaseProps {
  onBack?: () => void;
  onContinue?: () => void;
}

export const ValuePropDatabase: React.FC<ValuePropDatabaseProps> = ({
  onBack,
  onContinue
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton onPress={onBack} />

        <View style={styles.headerSection}>
          <Text style={styles.headline}>
            15,000+ products{'\n'}analyzed for you
          </Text>

          <Text style={styles.subhead}>
            Our AI understands ingredients so you don't have to
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.iconGrid}>
            <View style={styles.featureItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accentPalette[0] }]}>
                <Ionicons name="flask" size={32} color="white" />
              </View>
              <Text style={styles.featureText}>Science-backed analysis</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accentPalette[1] }]}>
                <Ionicons name="heart" size={32} color="white" />
              </View>
              <Text style={styles.featureText}>Personalized matching</Text>
            </View>
          </View>

          <View style={styles.statsSection}>
            <StatParagraph style={styles.statParagraph}>
              94% of users find their perfect routine within 2 weeks
            </StatParagraph>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            title="Continue"
            onPress={onContinue}
            style={styles.continueButton}
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
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
  },
  headline: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.l,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
  },
  subhead: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.bodyL,
    paddingHorizontal: spacing.m,
  },
  featuresSection: {
    flex: 1,
    paddingVertical: spacing.xl,
  },
  iconGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.l,
  },
  featureItem: {
    alignItems: 'center',
    maxWidth: 120,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  featureText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.caption,
  },
  statsSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.m,
  },
  statParagraph: {
    textAlign: 'center',
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    maxWidth: 300,
  },
  buttonSection: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
  },
  continueButton: {
    width: '100%',
  },
}); 