import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../tokens';
import { Icon, IconNames } from '../atoms';

interface IconFeatureCardProps {
  iconName?: string;
  icon?: string; // Add icon as alternative prop
  iconType?: 'ionicons' | 'material' | 'material-community' | 'feather';
  iconColor?: string;
  title: string;
  description: string;
  onPress?: () => void;
  style?: any;
}

export const IconFeatureCard: React.FC<IconFeatureCardProps> = ({
  iconName,
  icon,
  iconType = 'ionicons',
  iconColor = colors.brandPrimary,
  title,
  description,
  onPress,
  style
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const displayIcon = icon || iconName;
  
  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        {/* Handle emoji or text icons */}
        {displayIcon && displayIcon.length <= 2 ? (
          <Text style={styles.emojiIcon}>{displayIcon}</Text>
        ) : (
          <Icon
            name={displayIcon || 'help-circle'}
            type={iconType}
            size={32}
            color={iconColor}
          />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.m,
    padding: spacing.l,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emojiIcon: {
    fontSize: 32,
    textAlign: 'center',
  },
}); 