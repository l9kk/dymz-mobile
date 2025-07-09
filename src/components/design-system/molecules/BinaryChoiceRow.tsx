import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { colors, spacing } from '../tokens';

interface BinaryChoiceRowProps {
  onYesPress: () => void;
  onNoPress: () => void;
  yesText?: string;
  noText?: string;
  disabled?: boolean;
}

export const BinaryChoiceRow: React.FC<BinaryChoiceRowProps> = ({
  onYesPress,
  onNoPress,
  yesText = 'Yes',
  noText = 'No',
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={yesText}
          onPress={onYesPress}
          disabled={disabled}
          style={styles.button}
          accessibilityHint="Select yes option"
        />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={noText}
          onPress={onNoPress}
          disabled={disabled}
          style={styles.button}
          accessibilityHint="Select no option"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    marginTop: spacing.l, // 24px top margin as specified
    gap: spacing.m, // spacing between buttons
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    minHeight: 44, // minimum touch height
    width: '100%',
  },
}); 