import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { TagChip } from '../atoms/TagChip';
import { colors, typography, spacing, radii, elevation } from '../tokens';
import { getProductImageByIndex } from '../../../utils/imageUrls';

interface ProductCardProps {
  thumbnail?: string;
  brand: string;
  productName: string;
  priceRange: string;
  tags: string[];
  onAddToRoutine?: () => void;
  onPurchase?: () => void;
  showActions?: boolean;
  style?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  thumbnail,
  brand,
  productName,
  priceRange,
  tags,
  onAddToRoutine,
  onPurchase,
  showActions = true,
  style
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Use provided thumbnail or fallback to a default based on product name hash
  const imageSource = thumbnail ? { uri: thumbnail } : getProductImageByIndex(productName.length);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.mainContent}>
        <View style={styles.thumbnail}>
          <Image 
            source={imageSource}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.contentColumn}>
          <Text style={styles.brand}>{brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
          <Text style={styles.priceRange}>{priceRange}</Text>
          
          <View style={styles.tagRow}>
            {tags.slice(0, 2).map((tag, index) => (
              <TagChip key={index} label={tag} style={styles.tag} />
            ))}
          </View>
          
          {showActions && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={onAddToRoutine}>
                <Text style={styles.secondaryButtonText}>Add to Routine</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ghostButton} onPress={onPurchase}>
                <Text style={styles.ghostButtonText}>Purchase</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.expandIcon}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.chevron}>{isExpanded ? '⌄' : '⌄'}</Text>
        </TouchableOpacity>
      </View>
      
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedText}>
            Additional product details would appear here...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceNeutralTint,
    borderRadius: radii.card,
    padding: spacing.m,
    marginVertical: spacing.s,
    ...elevation.card,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 60,
    height: 60,
    backgroundColor: colors.accentPalette[1],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  thumbnailImage: {
    width: '100%' as any,
    height: '100%' as any,
    borderRadius: 8,
  },
  contentColumn: {
    flex: 1,
    paddingRight: spacing.s,
  },
  brand: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilies.body,
    marginBottom: 2,
  },
  productName: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginBottom: spacing.xs,
  },
  priceRange: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.s,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.s,
  },
  tag: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  secondaryButtonText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
  },
  ghostButton: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderWidth: 1,
    borderColor: colors.ctaBackground,
  },
  ghostButtonText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.fontWeights.semibold,
    color: colors.ctaBackground,
    fontFamily: typography.fontFamilies.body,
  },
  expandIcon: {
    padding: spacing.xs,
  },
  chevron: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  expandedContent: {
    marginTop: spacing.m,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
    opacity: 0.3,
  },
  expandedText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilies.body,
  },
}); 