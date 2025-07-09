import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors, spacing, animations } from '../tokens';

interface PrimaryButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'default' | 'success';
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  variant = 'default',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: animations.scale.press,
        ...animations.spring.responsive,
      }),
      Animated.timing(opacityAnim, {
        toValue: animations.opacity.primary,
        duration: animations.timing.instant,
        easing: animations.easing.sharp,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...animations.spring.gentle,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animations.timing.quick,
        easing: animations.easing.gentle,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled) return;
    
    // Call onPress IMMEDIATELY - no waiting for animations
    onPress?.();
    
    // Visual feedback happens in parallel, doesn't block action
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: animations.scale.tap,
        tension: 250, // Faster response
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 180,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1} // We handle opacity via animation
      style={styles.touchable}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          styles.button,
          variant === 'success' && styles.buttonSuccess,
          disabled && styles.buttonDisabled,
          style, // Apply external style to the visual element
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.text, disabled && styles.textDisabled]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  button: {
    backgroundColor: colors.ctaBackground,
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceNeutral,
  },
  buttonSuccess: {
    backgroundColor: colors.accentPalette[4], // #6AC47E green
  },
  text: {
    color: colors.ctaText,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  textDisabled: {
    color: colors.textSecondary,
  },
}); 