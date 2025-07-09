import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../tokens';

interface AvatarQuoteRowProps {
  quote: string;
  author: string;
  avatarUri?: string;
  showRating?: boolean;
  rating?: number;
  style?: ViewStyle;
}

export const AvatarQuoteRow: React.FC<AvatarQuoteRowProps> = ({ 
  quote, 
  author, 
  avatarUri,
  showRating = false,
  rating = 5,
  style
}) => {
  const safeQuote = quote || '';
  const safeAuthor = author || 'Anonymous';
  
  const renderStars = () => {
    if (!showRating) return null;
    
    return (
      <View style={styles.ratingContainer}>
        {Array.from({ length: rating }, (_, index) => (
          <Text key={index} style={styles.star}>⭐</Text>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{safeAuthor.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <Text style={styles.quote}>"{safeQuote}"</Text>
        <View style={styles.authorRow}>
          <Text style={styles.author}>{safeAuthor}</Text>
          {renderStars()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.s,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.m,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.ctaBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    maxWidth: 220,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    marginLeft: 2,
  },
}); 