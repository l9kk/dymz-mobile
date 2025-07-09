import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface StatPillProps {
  value: string | number;
  label?: string;
  backgroundColor?: string;
  textColor?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  icon?: string;
}

export const StatPill: React.FC<StatPillProps> = ({
  value,
  label,
  backgroundColor,
  textColor,
  variant = 'primary',
  icon
}) => {
  // Set colors based on variant if backgroundColor not provided
  const getVariantColors = () => {
    if (backgroundColor && textColor) {
      return { bg: backgroundColor, text: textColor };
    }
    
    switch (variant) {
      case 'secondary':
        return { bg: colors.secondary, text: colors.textOnDark };
      case 'accent':
        return { bg: colors.accent, text: colors.textPrimary };
      case 'primary':
      default:
        return { bg: colors.highlightYellow, text: colors.textPrimary };
    }
  };

  const { bg, text } = getVariantColors();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {icon && (
        <Text style={[styles.icon, { color: text }]}>{icon}</Text>
      )}
      <Text style={[styles.value, { color: text }]}>
        {value}
      </Text>
      {label && (
        <Text style={[styles.label, { color: text }]}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingHorizontal: spacing.xl,
    borderRadius: 40, // pill shape
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 120,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  value: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
  },
  label: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
    marginTop: 2,
  },
}); 