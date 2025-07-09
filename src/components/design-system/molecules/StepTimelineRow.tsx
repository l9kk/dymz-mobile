import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface StepTimelineRowProps {
  title: string;
  subtitle?: string;
  status: 'done' | 'current' | 'upcoming';
}

export const StepTimelineRow: React.FC<StepTimelineRowProps> = ({
  title,
  subtitle,
  status
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'done':
        return {
          background: 'rgba(0,0,0,0.06)',
          iconColor: '#6AC47E',
          textColor: colors.textPrimary,
          icon: '✓'
        };
      case 'current':
        return {
          background: colors.ctaBackground,
          iconColor: '#FFFFFF',
          textColor: '#FFFFFF',
          icon: '→'
        };
      case 'upcoming':
        return {
          background: '#FFC833',
          iconColor: '#FFFFFF',
          textColor: '#FFFFFF',
          icon: '⋯'
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <View style={[styles.container, { backgroundColor: statusStyles.background }]}>
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, { color: statusStyles.iconColor }]}>
          {statusStyles.icon}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: statusStyles.textColor }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: statusStyles.textColor }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    borderRadius: 12,
    marginBottom: spacing.s,
  },
  iconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.m,
  },
  title: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.fontWeights.semibold,
    fontFamily: typography.fontFamilies.body,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    lineHeight: 16,
    marginTop: 2,
  },
}); 