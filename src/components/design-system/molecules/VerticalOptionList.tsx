import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { colors, typography, spacing, radii } from '../tokens';

interface Option {
  id: string;
  label: string;
}

interface VerticalOptionListProps {
  options: Option[];
  selectedId?: string;
  onSelect: (id: string) => void;
  style?: any;
  staggerDelay?: number;
}

interface OptionItemProps {
  option: Option;
  isSelected: boolean;
  onSelect: (id: string) => void;
  animationDelay: number;
}

const OptionItem: React.FC<OptionItemProps> = ({ option, isSelected, onSelect, animationDelay }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const selectionAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

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
      toValue: 0.97,
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
    outputRange: [colors.surfaceNeutral, 'rgba(92, 82, 67, 0.12)'],
  });

  const shadowOpacity = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1],
  });

  return (
    <Animated.View
      style={[
        styles.optionContainer,
        {
          transform: [
            { scale: Animated.multiply(scaleAnim, pressAnim) }
          ],
          opacity: opacityAnim,
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => onSelect(option.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.option,
            {
              backgroundColor,
              borderColor,
              shadowOpacity,
            }
          ]}
        >
          <Text style={[
            styles.optionText,
            { color: colors.textPrimary }
          ]}>
            {option.label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const VerticalOptionList: React.FC<VerticalOptionListProps> = ({
  options,
  selectedId,
  onSelect,
  style,
  staggerDelay = 100
}) => {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <OptionItem
          key={option.id}
          option={option}
          isSelected={selectedId === option.id}
          onSelect={onSelect}
          animationDelay={index * staggerDelay}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  optionContainer: {
    marginBottom: spacing.s,
  },
  option: {
    height: 56,
    borderRadius: radii.pill,
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
  optionText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
  },
}); 