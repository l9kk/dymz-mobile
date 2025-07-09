import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface SegmentedTabBarProps {
  options: string[];
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
  style?: any;
}

export const SegmentedTabBar: React.FC<SegmentedTabBarProps> = ({
  options,
  selectedIndex,
  onSelectionChange,
  style
}) => {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const thumbAnim = useRef(new Animated.Value(selectedIndex)).current;
  const segmentWidth = containerWidth / options.length;

  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: selectedIndex,
      duration: 200,
      useNativeDriver: false, // Changed to false to support layout properties
    }).start();
  }, [selectedIndex]);

  const thumbTranslateX = thumbAnim.interpolate({
    inputRange: options.map((_, index) => index),
    outputRange: options.map((_, index) => index * segmentWidth), // Use absolute pixels
  });

  return (
    <View 
      style={[styles.container, style]}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width - 4); // Subtract padding
      }}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: segmentWidth,
            transform: [
              {
                translateX: thumbTranslateX
              }
            ],
          },
        ]}
      />
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={styles.segment}
          onPress={() => onSelectionChange(index)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color: selectedIndex === index 
                  ? colors.textOnDark 
                  : colors.textPrimary,
                fontWeight: selectedIndex === index 
                  ? typography.fontWeights.semibold 
                  : typography.fontWeights.medium
              }
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 24,
    flexDirection: 'row',
    position: 'relative',
    padding: 2,
  },
  thumb: {
    position: 'absolute',
    height: 44,
    backgroundColor: colors.ctaBackground,
    borderRadius: 22,
    top: 2,
    left: 2,
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  segmentText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    textAlign: 'center',
  },
}); 