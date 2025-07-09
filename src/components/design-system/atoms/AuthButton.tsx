import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { colors, typography, radii } from '../tokens';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'secondaryBlack' | 'google' | 'link';
  icon?: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  subtitle,
  variant = 'primary',
  icon,
  style,
  ...props
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondaryBlack' && styles.secondaryBlack,
    variant === 'google' && styles.google,
    variant === 'link' && styles.link,
    style
  ];

  const textStyle = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondaryBlack' && styles.secondaryBlackText,
    variant === 'google' && styles.googleText,
    variant === 'link' && styles.linkText,
  ];

  return (
    <TouchableOpacity style={buttonStyle} activeOpacity={0.8} {...props}>
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text style={textStyle}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minWidth: 120,
  },
  primary: {
    backgroundColor: colors.ctaBackground,
  },
  secondaryBlack: {
    backgroundColor: '#000000',
  },
  google: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#dadce0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  link: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingVertical: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
  },
  primaryText: {
    color: colors.ctaText,
    fontWeight: typography.fontWeights.semibold,
  },
  secondaryBlackText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeights.semibold,
  },
  googleText: {
    color: '#3c4043',
    fontWeight: typography.fontWeights.semibold,
    fontSize: 14,
  },
  linkText: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.semibold,
  },
  subtitle: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilies.body,
    marginTop: 2,
  },
});