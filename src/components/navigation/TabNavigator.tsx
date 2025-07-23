import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '../design-system/tokens';

export type TabRoute = 'home' | 'analysis' | 'routine' | 'profile';

interface TabNavigatorProps {
  currentTab: TabRoute;
  onTabChange: (tab: TabRoute) => void;
}

interface TabItem {
  route: TabRoute;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
}

const tabs: TabItem[] = [
  { route: 'home', labelKey: 'navigation.tabs.home', icon: 'home-outline', activeIcon: 'home' },
  { route: 'analysis', labelKey: 'navigation.tabs.analysis', icon: 'analytics-outline', activeIcon: 'analytics' },
  { route: 'routine', labelKey: 'navigation.tabs.routine', icon: 'medical-outline', activeIcon: 'medical' },
  { route: 'profile', labelKey: 'navigation.tabs.profile', icon: 'person-outline', activeIcon: 'person' }
];

export const TabNavigator: React.FC<TabNavigatorProps> = ({
  currentTab,
  onTabChange
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.route;
          const iconName = isActive ? (tab.activeIcon || tab.icon) : tab.icon;
          
          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tab}
              onPress={() => onTabChange(tab.route)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isActive ? colors.ctaBackground : colors.textSecondary}
                style={[
                  styles.tabIcon,
                  isActive && styles.activeTabIcon
                ]}
              />
              <Text style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel
              ]}>
                {t(tab.labelKey)}
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