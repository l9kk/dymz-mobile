import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PillTag } from '../atoms/PillTag';

interface PillTagWrapGridProps {
  options: string[];
  selectedOption?: string;
  onOptionPress?: (option: string) => void;
}

export const PillTagWrapGrid: React.FC<PillTagWrapGridProps> = ({
  options,
  selectedOption,
  onOptionPress,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <PillTag
          key={option}
          title={option}
          isSelected={selectedOption === option}
          onPress={() => onOptionPress?.(option)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 340,
    alignSelf: 'center',
  },
}); 