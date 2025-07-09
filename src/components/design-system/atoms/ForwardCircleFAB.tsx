import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { colors, elevation } from '../tokens';

interface ForwardCircleFABProps {
  onPress?: () => void;
  visible?: boolean;
}

export const ForwardCircleFAB: React.FC<ForwardCircleFABProps> = ({
  onPress,
  visible = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  // Simple fade in/out animation
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, opacityAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    console.log('🚀 ForwardCircleFAB - handlePress called, visible:', visible, 'onPress:', !!onPress);
    
    if (!visible || !onPress) {
      console.log('❌ ForwardCircleFAB - Press blocked, visible:', visible, 'onPress:', !!onPress);
      return;
    }
    
    console.log('✅ ForwardCircleFAB - Calling onPress immediately');
    onPress();
  };

  if (!visible) {
    return null; // Don't render at all when not visible
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.ctaBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.card,
  },
  chevron: {
    fontSize: 24,
    color: colors.ctaText,
    fontWeight: 'bold',
    marginLeft: 2, // Visual center adjustment
  },
}); 