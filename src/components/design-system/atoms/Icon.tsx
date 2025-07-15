import React from 'react';
import { View } from 'react-native';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons, 
  Feather 
} from '@expo/vector-icons';
import { colors } from '../tokens';

// Icon type mapping
const IconSets = {
  ionicons: Ionicons,
  material: MaterialIcons,
  'material-community': MaterialCommunityIcons,
  feather: Feather,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  type?: 'ionicons' | 'material' | 'material-community' | 'feather';
  style?: any;
}

// Icon name mapping from emoji fallback to proper vector icons
const iconMapping: { [key: string]: { name: string; type: keyof typeof IconSets } } = {
  // Navigation
  'home-outline': { name: 'home-outline', type: 'ionicons' },
  'home': { name: 'home', type: 'ionicons' },
  'camera-outline': { name: 'camera-outline', type: 'ionicons' },
  'camera': { name: 'camera', type: 'ionicons' },
  'calendar-outline': { name: 'calendar-outline', type: 'ionicons' },
  'calendar': { name: 'calendar', type: 'ionicons' },
  'person-outline': { name: 'person-outline', type: 'ionicons' },
  'person': { name: 'person', type: 'ionicons' },
  'arrow-back': { name: 'arrow-back', type: 'ionicons' },
  'arrow-forward': { name: 'arrow-forward', type: 'ionicons' },
  'close': { name: 'close', type: 'ionicons' },
  
  // Actions
  'checkmark': { name: 'checkmark', type: 'ionicons' },
  'add': { name: 'add', type: 'ionicons' },
  'remove': { name: 'remove', type: 'ionicons' },
  'create-outline': { name: 'create-outline', type: 'ionicons' },
  'trash-outline': { name: 'trash-outline', type: 'ionicons' },
  'share-outline': { name: 'share-outline', type: 'ionicons' },
  
  // Features
  'notifications-outline': { name: 'notifications-outline', type: 'ionicons' },
  'settings-outline': { name: 'settings-outline', type: 'ionicons' },
  'star': { name: 'star', type: 'ionicons' },
  'star-outline': { name: 'star-outline', type: 'ionicons' },
  'heart-outline': { name: 'heart-outline', type: 'ionicons' },
  'heart': { name: 'heart', type: 'ionicons' },
  
  // Skincare specific
  'water-outline': { name: 'water', type: 'ionicons' },
  'sunny-outline': { name: 'sunny-outline', type: 'ionicons' },
  'moon-outline': { name: 'moon-outline', type: 'ionicons' },
  'sparkles': { name: 'sparkles', type: 'ionicons' },
  'shield-checkmark-outline': { name: 'shield-checkmark-outline', type: 'ionicons' },
  'bottle-outline': { name: 'medical-outline', type: 'ionicons' },
  'routine': { name: 'medical-outline', type: 'ionicons' },
  
  // Social
  'trending-up': { name: 'trending-up', type: 'ionicons' },
  'people-outline': { name: 'people-outline', type: 'ionicons' },
  'videocam-outline': { name: 'videocam-outline', type: 'ionicons' },
  
  // Status
  'checkmark-circle': { name: 'checkmark-circle', type: 'ionicons' },
  'close-circle': { name: 'close-circle', type: 'ionicons' },
  'warning': { name: 'warning', type: 'ionicons' },
  'information-circle': { name: 'information-circle', type: 'ionicons' },
  
  // Progress
  'trophy-outline': { name: 'trophy-outline', type: 'ionicons' },
  'medal-outline': { name: 'medal', type: 'ionicons' },
  'ribbon-outline': { name: 'ribbon', type: 'ionicons' },
  'flash-outline': { name: 'flash-outline', type: 'ionicons' },
  'flame-outline': { name: 'flame-outline', type: 'ionicons' },
  'flame': { name: 'flame', type: 'ionicons' },
  'fire': { name: 'flame', type: 'ionicons' },
  
  // Charts & Analytics
  'analytics-outline': { name: 'analytics-outline', type: 'ionicons' },
  'stats-chart': { name: 'trending-up', type: 'ionicons' },
  'bar-chart-outline': { name: 'bar-chart-outline', type: 'ionicons' },
  
  // Default
  'image': { name: 'image-outline', type: 'ionicons' }
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.textPrimary,
  type,
  style
}) => {
  // Get the icon mapping
  const iconConfig = iconMapping[name];
  
  if (!iconConfig) {
    // Fallback to Ionicons with the original name or a default
    const IconComponent = Ionicons;
    const fallbackName = name.includes('outline') ? 'help-outline' : 'help';
    return (
      <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
        <IconComponent name={fallbackName as any} size={size} color={color} />
      </View>
    );
  }
  
  // Use specified type or default from mapping
  const iconType = type || iconConfig.type;
  const IconComponent = IconSets[iconType];
  
  if (!IconComponent) {
    // Fallback to Ionicons
    return (
      <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
        <Ionicons name="help-outline" size={size} color={color} />
      </View>
    );
  }

  // Try to render the icon with error handling
  try {
    return (
      <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
        <IconComponent name={iconConfig.name as any} size={size} color={color} />
      </View>
    );
  } catch (error) {
    // If the icon name is invalid, fallback to a default icon
    return (
      <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
        <Ionicons name="help-outline" size={size} color={color} />
      </View>
    );
  }
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