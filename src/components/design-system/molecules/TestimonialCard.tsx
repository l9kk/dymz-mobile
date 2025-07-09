import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing, radii } from '../tokens';

interface TestimonialCardProps {
  avatarUri: string;
  username: string;
  rating: number;
  testimonialText: string;
  highlightedPhrases?: string[];
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  avatarUri,
  username,
  rating,
  testimonialText,
  highlightedPhrases = [],
}) => {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} style={[
        styles.star,
        { color: index < rating ? '#F5CA31' : colors.textSecondary }
      ]}>
        ★
      </Text>
    ));
  };

  const renderTextWithHighlights = () => {
    let text = testimonialText;
    
    // Replace highlighted phrases with bold formatting
    highlightedPhrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, 'gi');
      text = text.replace(regex, '**$1**');
    });

    // Split by ** to create bold segments
    const segments = text.split('**');
    
    return segments.map((segment, index) => (
      <Text
        key={index}
        style={index % 2 === 1 ? styles.highlightedText : styles.regularText}
      >
        {segment}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.ratingContainer}>
            {renderStars()}
          </View>
        </View>
      </View>
      <Text style={styles.testimonialText}>
        "{renderTextWithHighlights()}"
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300, // Responsive width instead of fixed 480px
    backgroundColor: '#FFF7E8',
    borderRadius: radii.card,
    padding: spacing.l,
    marginHorizontal: spacing.s,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.m,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  testimonialText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  regularText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  highlightedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
}); 