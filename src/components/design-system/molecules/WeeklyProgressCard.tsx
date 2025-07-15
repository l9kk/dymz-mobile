import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../tokens';
import { Icon } from '../atoms/Icon';

interface ProgressSubRow {
  icon: string;
  text: string;
}

interface WeeklyProgressCardProps {
  weekNumber?: number;
  scansCompleted: number;
  totalScansGoal: number;
  averageScore?: number;
  improvingMetrics?: number;
  totalMetrics?: number;
  currentStreak?: number;
  onViewDetails?: () => void;
  subRows?: ProgressSubRow[];
  style?: any;
}

export const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({
  weekNumber,
  scansCompleted,
  totalScansGoal,
  averageScore,
  improvingMetrics,
  totalMetrics,
  currentStreak,
  onViewDetails,
  subRows,
  style
}) => {
  const defaultSubRows = [
    { icon: 'star', text: 'Keep going strong!' }, 
    ...(averageScore ? [{ icon: 'analytics-outline', text: `Average skin score: ${averageScore}` }] : []),
    ...(improvingMetrics && totalMetrics ? [{ icon: 'trending-up', text: `${improvingMetrics}/${totalMetrics} metrics improving` }] : []),
    ...(currentStreak ? [{ icon: 'flame', text: `${currentStreak} day streak` }] : [])
  ];

  const displaySubRows = subRows || defaultSubRows;
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Text style={styles.headline}>This week you scanned</Text>
        <Text style={styles.stat}>
          {scansCompleted}/{totalScansGoal} Times
        </Text>
        
        <View style={styles.subRowsContainer}>
          {displaySubRows.map((row, index) => (
            <View key={index} style={styles.subRow}>
              <Icon name={row.icon} size={16} color={colors.textSecondary} style={styles.subRowIcon} />
              <Text style={styles.subRowText}>{row.text}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.iconContainer}>
        <View style={styles.progressIconBackground}>
          <Ionicons 
            name="stats-chart" 
            size={32}
            color={colors.accentPalette[2]}
          />
        </View>
        <View style={styles.streakIconBackground}>
          <Ionicons 
            name="trending-up" 
            size={20}
            color={colors.primary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 12,
    padding: spacing.l,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: spacing.l,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    marginRight: spacing.l,
    justifyContent: 'flex-start',
  },
  headline: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  stat: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    color: colors.accentPalette[2],
    marginBottom: spacing.m,
    lineHeight: typography.fontSizes.displayL * 1.1,
  },
  subRowsContainer: {
    marginTop: spacing.xs,
    flex: 1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
    flexWrap: 'wrap',
  },
  subRowIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
    marginRight: spacing.s,
    marginTop: 1, // Slight adjustment for better alignment
  },
  subRowText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    flex: 1,
    flexWrap: 'wrap',
    lineHeight: 18,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 75,
    position: 'relative',
  },
  progressIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakIconBackground: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceNeutral,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundPrimary,
  },
}); 