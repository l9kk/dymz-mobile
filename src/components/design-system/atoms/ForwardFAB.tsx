import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface ForwardFABProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

export const ForwardFAB: React.FC<ForwardFABProps> = ({
  label = "Next",
  onPress,
  disabled = false,
  style
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        disabled ? styles.disabled : styles.enabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.label,
        disabled ? styles.disabledText : styles.enabledText
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.icon,
        disabled ? styles.disabledText : styles.enabledText
      ]}>
        →
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: 28,
    alignSelf: 'center',
    marginTop: spacing.l,
    minWidth: 120,
  },
  enabled: {
    backgroundColor: colors.ctaBackground,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  disabled: {
    backgroundColor: colors.surfaceNeutral,
    opacity: 0.6,
  },
  label: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    marginRight: spacing.xs,
  },
  enabledText: {
    color: colors.surfaceNeutral,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 