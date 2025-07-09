import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface RoutineSummaryCardProps {
  type?: 'am' | 'pm';
  stepCount?: number;
  estimatedTime?: number;
  completedToday?: boolean;
  style?: any;
}

export const RoutineSummaryCard: React.FC<RoutineSummaryCardProps> = ({
  type = 'am',
  stepCount,
  estimatedTime,
  completedToday,
  style
}) => {
  const backgroundColor = type === 'am' ? colors.highlightYellow : colors.highlightLavender;
  
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.content}>
        {/* Steps and time info */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>{stepCount || 0}</Text>
            <Text style={styles.infoLabel}>steps</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>{estimatedTime || 0}</Text>
            <Text style={styles.infoLabel}>min</Text>
          </View>
        </View>
        
        {/* Completion status */}
        {completedToday && (
          <View style={styles.statusRow}>
            <View style={styles.statusIcon}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.statusText}>Completed today</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.m,
    marginVertical: spacing.s,
  },
  content: {
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  infoNumber: {
    fontSize: typography.fontSizes.headingM,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  infoLabel: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: colors.textSecondary,
    marginHorizontal: spacing.l,
    opacity: 0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.m,
    paddingTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
    opacity: 0.3,
  },
  statusIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  checkIcon: {
    color: colors.textOnDark,
    fontSize: 12,
    fontWeight: typography.fontWeights.bold,
  },
  statusText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
}); 