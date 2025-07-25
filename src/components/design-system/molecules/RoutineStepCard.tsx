import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { colors, typography, spacing } from '../tokens';

interface RoutineStepCardProps {
  stepNumber: number;
  productName?: string;
  title?: string; // Add title as alternative to productName
  productRole?: string;
  description?: string; // Add description as alternative to instruction
  instruction?: string;
  thumbnailUri?: string | any; // Can be string URL or local asset object
  matchPercentage?: number;
  isCompleted?: boolean; // Add support for completion state
  productInfo?: {
    name: string;
    brand: string;
  };
  style?: any;
}

export const RoutineStepCard: React.FC<RoutineStepCardProps> = ({
  stepNumber,
  productName,
  title,
  productRole,
  description,
  instruction,
  thumbnailUri,
  matchPercentage,
  isCompleted = false,
  productInfo,
  style
}) => {
  const { t } = useTranslation();
  
  return (
    <View style={[
      styles.container, 
      isCompleted && styles.completedContainer,
      style
    ]}>
      {/* Product Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {thumbnailUri ? (
          <Image 
            source={typeof thumbnailUri === 'string' ? { uri: thumbnailUri } : thumbnailUri} 
            style={[
              styles.thumbnail,
              isCompleted && styles.completedThumbnail
            ]}
            resizeMode="cover"
          />
        ) : (
          <View style={[
            styles.thumbnail, 
            styles.placeholderThumbnail,
            isCompleted && styles.completedThumbnail
          ]}>
            <Text style={styles.placeholderText}>📦</Text>
          </View>
        )}
        
        {/* Step Number Badge */}
        <View style={styles.stepNumberBadge}>
          <Text style={styles.stepNumber}>{stepNumber}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[
          styles.productName,
          isCompleted && styles.completedText
        ]}>
          {productName || title || productInfo?.name || 'Product'}
        </Text>
        <Text style={[
          styles.productRole,
          isCompleted && styles.completedSecondaryText
        ]}>
          {productRole || productInfo?.brand || t('routine.product')}
        </Text>
        <Text style={[
          styles.instruction,
          isCompleted && styles.completedSecondaryText
        ]}>
          {instruction || description || 'Apply as directed'}
        </Text>
      </View>

      {/* Completion Status Icon */}
      <View style={styles.statusContainer}>
        {isCompleted ? (
          <View style={styles.completedIcon}>
            <Text style={styles.completedIconText}>✓</Text>
          </View>
        ) : (
          <View style={styles.incompleteIcon}>
            <View style={styles.incompleteCircle} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 12,
    padding: spacing.m,
    marginVertical: spacing.s,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  completedContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.accentGreen,
    opacity: 0.9,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: spacing.m,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  completedThumbnail: {
    opacity: 0.7,
  },
  stepNumberBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ctaBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceNeutral,
  },
  stepNumber: {
    color: colors.textOnDark,
    fontSize: 12,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.bold,
  },
  content: {
    flex: 1,
    marginRight: spacing.s,
  },
  productName: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  productRole: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  completedSecondaryText: {
    color: colors.textSecondary,
  },
  instruction: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.s,
  },
  completedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIconText: {
    color: colors.textOnDark,
    fontSize: 14,
    fontWeight: typography.fontWeights.bold,
  },
  incompleteIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incompleteCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  placeholderThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
}); 