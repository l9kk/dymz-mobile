import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';
import { Icon } from './Icon';

interface StatPillProps {
  value: string | number;
  label?: string;
  backgroundColor?: string;
  textColor?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  icon?: string; // This will now be an icon name instead of emoji
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
        return { bg: '#6C63FF', text: '#FFFFFF' }; // Modern purple
      case 'accent':
        return { bg: '#FF6B6B', text: '#FFFFFF' }; // Modern coral/red
      case 'primary':
      default:
        return { bg: '#4ECDC4', text: '#FFFFFF' }; // Modern teal
    }
  };

  const { bg, text } = getVariantColors();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.content}>
        {icon && (
          <Icon 
            name={icon} 
            size={22} 
            color={text} 
            style={styles.iconStyle} 
          />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  iconStyle: {
    marginBottom: 6,
  },
  value: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
}); 