import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../tokens';

interface Stat {
  value: string;
  label: string;
}

interface StatsSplitBannerProps {
  stats: [Stat, Stat];
  style?: ViewStyle;
}

export const StatsSplitBanner: React.FC<StatsSplitBannerProps> = ({ stats, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.statSection}>
        <Text style={styles.statValue}>{stats[0].value}</Text>
        <Text style={styles.statLabel}>{stats[0].label}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.statSection}>
        <Text style={styles.statValue}>{stats[1].value}</Text>
        <Text style={styles.statLabel}>{stats[1].label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140,
    backgroundColor: colors.ctaBackground,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
}); 