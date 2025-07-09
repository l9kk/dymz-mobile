import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../tokens';

// For now using a simple fallback implementation until vector icons are properly configured
interface IconProps {
  name: string;
  size?: number;
  color?: string;
  type?: 'ionicons' | 'material' | 'material-community' | 'feather';
  style?: any;
}

const iconMap: { [key: string]: string } = {
  // Navigation
  'home-outline': '🏠',
  'home': '🏠',
  'camera-outline': '📷',
  'camera': '📷',
  'calendar-outline': '📅',
  'calendar': '📅',
  'person-outline': '👤',
  'person': '👤',
  'arrow-back': '←',
  'arrow-forward': '→',
  'close': '✕',
  
  // Actions
  'checkmark': '✓',
  'add': '+',
  'remove': '-',
  'create-outline': '✏️',
  'trash-outline': '🗑️',
  'share-outline': '📤',
  
  // Features
  'notifications-outline': '🔔',
  'settings-outline': '⚙️',
  'star': '⭐',
  'star-outline': '☆',
  'heart-outline': '♡',
  'heart': '❤️',
  
  // Skincare specific
  'water-outline': '💧',
  'sunny-outline': '☀️',
  'moon-outline': '🌙',
  'sparkles': '✨',
  'shield-checkmark-outline': '🛡️',
  
  // Social
  'trending-up': '📈',
  'people-outline': '👥',
  'videocam-outline': '📹',
  
  // Status
  'checkmark-circle': '✅',
  'close-circle': '❌',
  'warning': '⚠️',
  'information-circle': 'ℹ️',
  
  // Progress
  'trophy-outline': '🏆',
  'medal-outline': '🏅',
  'ribbon-outline': '🎗️',
  'flash-outline': '⚡',
  
  // Charts
  'analytics-outline': '📊',
  'stats-chart': '📈',
  'bar-chart-outline': '📊',
  
  // Default
  'image': '🖼️'
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.textPrimary,
  type = 'ionicons',
  style
}) => {
  const emoji = iconMap[name] || '●';
  
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <Text style={{ fontSize: size * 0.8, color, textAlign: 'center' }}>{emoji}</Text>
    </View>
  );
};

// Common icon mappings for easy reference
export const IconNames = {
  // Navigation
  home: 'home-outline',
  homeActive: 'home',
  analysis: 'camera-outline',
  analysisActive: 'camera',
  routine: 'calendar-outline',
  routineActive: 'calendar',
  profile: 'person-outline',
  profileActive: 'person',
  back: 'arrow-back',
  forward: 'arrow-forward',
  close: 'close',
  
  // Actions
  camera: 'camera',
  photo: 'image',
  check: 'checkmark',
  add: 'add',
  remove: 'remove',
  edit: 'create-outline',
  delete: 'trash-outline',
  share: 'share-outline',
  
  // Features
  notification: 'notifications-outline',
  settings: 'settings-outline',
  star: 'star',
  starOutline: 'star-outline',
  heart: 'heart-outline',
  heartFilled: 'heart',
  
  // Skincare specific
  skincare: 'water-outline',
  sun: 'sunny-outline',
  moon: 'moon-outline',
  sparkles: 'sparkles',
  shield: 'shield-checkmark-outline',
  
  // Social
  trending: 'trending-up',
  people: 'people-outline',
  video: 'videocam-outline',
  
  // Status
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
  
  // Progress
  trophy: 'trophy-outline',
  medal: 'medal-outline',
  ribbon: 'ribbon-outline',
  flash: 'flash-outline',
  
  // Charts
  analytics: 'analytics-outline',
  statsChart: 'stats-chart',
  barChart: 'bar-chart-outline',
}; 