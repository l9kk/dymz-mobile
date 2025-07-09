import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface TipOverlayBubbleProps {
  message: string;
  arrowPosition?: 'top' | 'bottom' | 'left' | 'right';
  arrowOffset?: number;
  maxWidth?: number;
  onDismiss?: () => void;
}

export const TipOverlayBubble: React.FC<TipOverlayBubbleProps> = ({
  message,
  arrowPosition = 'bottom',
  arrowOffset = 12,
  maxWidth = 340,
  onDismiss
}) => {
  const renderArrow = () => {
    const arrowStyle = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid' as const,
    };

    switch (arrowPosition) {
      case 'top':
        return (
          <View
            style={[
              arrowStyle,
              {
                top: -8,
                left: arrowOffset,
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderBottomWidth: 8,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: colors.surfaceNeutral,
              },
            ]}
          />
        );
      case 'bottom':
        return (
          <View
            style={[
              arrowStyle,
              {
                bottom: -8,
                left: arrowOffset,
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderTopWidth: 8,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: colors.surfaceNeutral,
              },
            ]}
          />
        );
      case 'left':
        return (
          <View
            style={[
              arrowStyle,
              {
                left: -8,
                top: arrowOffset,
                borderTopWidth: 8,
                borderBottomWidth: 8,
                borderRightWidth: 8,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderRightColor: colors.surfaceNeutral,
              },
            ]}
          />
        );
      case 'right':
        return (
          <View
            style={[
              arrowStyle,
              {
                right: -8,
                top: arrowOffset,
                borderTopWidth: 8,
                borderBottomWidth: 8,
                borderLeftWidth: 8,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: colors.surfaceNeutral,
              },
            ]}
          />
        );
    }
  };

  return (
    <View style={[styles.container, { maxWidth }]}>
      <View style={styles.bubble}>
        <Text style={styles.message}>{message}</Text>
        {renderArrow()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  bubble: {
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 12,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  message: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
    lineHeight: 20,
    textAlign: 'center',
  },
}); 