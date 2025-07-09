import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, typography, radii } from '../tokens';

interface SegmentedChoiceTileProps {
  icon: string; // Emoji or icon
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: any;
  animationDelay?: number;
}

export const SegmentedChoiceTile: React.FC<SegmentedChoiceTileProps> = ({
  icon,
  label,
  isSelected,
  onPress,
  style,
  animationDelay = 0
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const selectionAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, animationDelay);

    return () => clearTimeout(timeout);
  }, []);

  // Selection animation
  useEffect(() => {
    Animated.timing(selectionAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const borderColor = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', colors.ctaBackground],
  });

  const backgroundColor = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0.04)', 'rgba(92, 82, 67, 0.12)'],
  });

  const shadowOpacity = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: Animated.multiply(scaleAnim, pressAnim) }
          ],
          opacity: opacityAnim,
        },
        style
      ]}
    >
      <TouchableOpacity 
        style={[styles.container]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.background,
            {
              backgroundColor,
              borderColor,
              shadowOpacity,
            }
          ]}
        >
          <Animated.Text
            style={[
              styles.icon,
              {
                transform: [
                  {
                    scale: selectionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    })
                  }
                ]
              }
            ]}
          >
            {icon}
          </Animated.Text>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            {label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 96,
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: radii.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: colors.ctaBackground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
  },
  label: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
  },
}); 