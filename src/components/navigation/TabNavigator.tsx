import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../design-system/tokens';

export type TabRoute = 'home' | 'analysis' | 'routine' | 'profile';

interface TabNavigatorProps {
  currentTab: TabRoute;
  onTabChange: (tab: TabRoute) => void;
}

interface TabItem {
  route: TabRoute;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { route: 'home', label: 'Home', icon: '🏠' },
  { route: 'analysis', label: 'Analysis', icon: '📸' },
  { route: 'routine', label: 'Routine', icon: '🧴' },
  { route: 'profile', label: 'Profile', icon: '👤' }
];

export const TabNavigator: React.FC<TabNavigatorProps> = ({
  currentTab,
  onTabChange
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.route;
          
          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tab}
              onPress={() => onTabChange(tab.route)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabIcon,
                isActive && styles.activeTabIcon
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceNeutral,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: spacing.s,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  activeTabIcon: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: colors.ctaBackground,
    fontWeight: '600',
  },
}); 