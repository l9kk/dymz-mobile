import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';
import { Illustration } from '../atoms/Illustration';

interface InsightsHeaderProps {
  weekNumber?: number;
  style?: any;
}

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  weekNumber = 1,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>Insights</Text>
        <View style={styles.weekBadge}>
          <Text style={styles.weekText}>Week {weekNumber}</Text>
        </View>
      </View>
      
      <View style={styles.illustrationContainer}>
        <Illustration 
          width={180}
          height={120}
          backgroundColor={colors.accentPalette[1]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
  },
  leftContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  weekBadge: {
    backgroundColor: colors.ctaBackground,
    borderRadius: 16,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.bold,
    color: colors.textOnDark,
  },
  illustrationContainer: {
    width: 180,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 