import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../tokens';

interface NavItem {
  label: string;
  icon: string;
  isActive?: boolean;
}

interface BottomNavBarProps {
  items: NavItem[];
  onItemPress?: (index: number) => void;
  style?: any;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  items,
  onItemPress,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => onItemPress?.(index)}
        >
          <Text style={[
            styles.icon,
            item.isActive ? styles.activeIcon : styles.inactiveIcon
          ]}>
            {item.icon}
          </Text>
          <Text style={[
            styles.label,
            item.isActive ? styles.activeLabel : styles.inactiveLabel
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
      
      {/* Center FAB for camera */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceNeutral,
    paddingTop: spacing.s,
    paddingBottom: spacing.m,
    paddingHorizontal: spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  icon: {
    fontSize: 24,
    marginBottom: 2,
  },
  activeIcon: {
    color: colors.textPrimary,
  },
  inactiveIcon: {
    color: 'rgba(92, 82, 67, 0.4)',
  },
  label: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
  },
  activeLabel: {
    color: colors.textPrimary,
  },
  inactiveLabel: {
    color: 'rgba(92, 82, 67, 0.4)',
  },
  fabContainer: {
    position: 'absolute',
    top: -20,
    left: '50%',
    marginLeft: -25,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.ctaBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
}); 