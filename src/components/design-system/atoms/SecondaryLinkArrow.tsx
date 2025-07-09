import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../tokens';

interface SecondaryLinkArrowProps {
  title: string;
  onPress?: () => void;
}

export const SecondaryLinkArrow: React.FC<SecondaryLinkArrowProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.arrow}> →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 44, // Touch target
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  arrow: {
    fontSize: 16,
    color: colors.textPrimary,
  },
}); 