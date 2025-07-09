import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SectionHeading,
  PrimaryButton,
  StatPill
} from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';

const { width: screenWidth } = Dimensions.get('window');

interface MatchSummaryProps {
  onContinue?: () => void;
  productCount?: number;
  matchPercentage?: number;
  morningSteps?: string[];
  eveningSteps?: string[];
}

export const MatchSummary: React.FC<MatchSummaryProps> = ({
  onContinue,
  productCount = 8,
  matchPercentage = 92,
  morningSteps = ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen'],
  eveningSteps = ['Cleanser', 'Treatment', 'Night Cream', 'Eye Cream']
}) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: spacing.l + insets.top }]}>
      <View style={styles.header}>
        <SectionHeading style={styles.title}>
          Based on your choices and analysis, we've found products perfect for you
        </SectionHeading>
      </View>

      <View style={styles.statSection}>
        <StatPill value={productCount} label="products" />
        
        <Text style={styles.matchLine}>
          that are a {matchPercentage}%+ match for you!
        </Text>
      </View>

      <View style={styles.routineSummaries}>
        {/* Enhanced Morning Routine Block */}
        <View style={styles.routineContainer}>
          <View style={styles.routineHeader}>
            <View style={styles.routineIconContainer}>
              <Text style={styles.routineIcon}>☀️</Text>
            </View>
            <Text style={styles.routineTitle}>Morning Routine</Text>
          </View>
          
          <LinearGradient
            colors={['#FFF4E6', '#FFE4B5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.routineCard}
          >
            <View style={styles.routineContent}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{morningSteps.length}</Text>
                  <Text style={styles.statLabel}>steps</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{morningSteps.length * 2}</Text>
                  <Text style={styles.statLabel}>min</Text>
                </View>
              </View>
              
              <View style={styles.stepsPreview}>
                {morningSteps.slice(0, 3).map((step, index) => (
                  <View key={index} style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>
                      {index + 1}. {step}
                    </Text>
                  </View>
                ))}
                {morningSteps.length > 3 && (
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>
                      +{morningSteps.length - 3} more
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Enhanced Evening Routine Block */}
        <View style={styles.routineContainer}>
          <View style={styles.routineHeader}>
            <View style={styles.routineIconContainer}>
              <Text style={styles.routineIcon}>🌙</Text>
            </View>
            <Text style={styles.routineTitle}>Evening Routine</Text>
          </View>
          
          <LinearGradient
            colors={['#F0E6FF', '#E6D5FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.routineCard}
          >
            <View style={styles.routineContent}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{eveningSteps.length}</Text>
                  <Text style={styles.statLabel}>steps</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{eveningSteps.length * 2}</Text>
                  <Text style={styles.statLabel}>min</Text>
                </View>
              </View>
              
              <View style={styles.stepsPreview}>
                {eveningSteps.slice(0, 3).map((step, index) => (
                  <View key={index} style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>
                      {index + 1}. {step}
                    </Text>
                  </View>
                ))}
                {eveningSteps.length > 3 && (
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>
                      +{eveningSteps.length - 3} more
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Reveal your recommendations"
          onPress={onContinue}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    textAlign: 'center',
    lineHeight: 32,
  },
  statSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  matchLine: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.m,
    lineHeight: 24,
  },
  routineSummaries: {
    marginBottom: spacing.xl,
  },
  routineContainer: {
    marginBottom: spacing.l,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  routineIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  routineIcon: {
    fontSize: 18,
  },
  routineTitle: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  routineCard: {
    borderRadius: 16,
    padding: spacing.l,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  routineContent: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: 36,
  },
  statLabel: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderPrimary,
    opacity: 0.3,
  },
  stepsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  stepBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  stepBadgeText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginTop: spacing.l,
  },
}); 