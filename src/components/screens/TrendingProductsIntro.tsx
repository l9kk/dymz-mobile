import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SectionHeading, PrimaryButton, Icon, IconNames } from '../design-system';
import { SocialVideoTile } from '../design-system/molecules/SocialVideoTile';
import { colors, spacing } from '../design-system/tokens';
import { getSocialVideoImageByKey } from '../../utils/imageUrls';

interface TrendingProductsIntroProps {
  onContinue?: () => void;
}

export const TrendingProductsIntro: React.FC<TrendingProductsIntroProps> = ({
  onContinue
}) => {
  const socialVideos = [
    {
      id: 1,
      title: 'Skincare Routines',
      count: '2.3M videos',
      iconName: IconNames.skincare,
    },
    {
      id: 2,
      title: 'Product Reviews',
      count: '1.8M videos',
      iconName: IconNames.star,
    },
    {
      id: 3,
      title: 'Before & After',
      count: '945K videos',
      iconName: IconNames.camera,
    },
    {
      id: 4,
      title: 'Trending Now',
      count: '3.1M videos',
      iconName: IconNames.trending,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerSection}>
        <Icon
          name={IconNames.trending}
          size={48}
          color={colors.brandPrimary}
          style={styles.headerIcon}
        />
        <SectionHeading style={styles.heading}>
          Do You Buy{'\n'}Trending Products?
        </SectionHeading>
        <Text style={styles.subtitle}>
          Social media influences 78% of skincare purchases
        </Text>
      </View>

      <View style={styles.videoGrid}>
        {socialVideos.map((video) => (
          <SocialVideoTile
            key={video.id}
            title={video.title}
            count={video.count}
            iconName={video.iconName}
            selected={false}
          />
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Discover what's working for people with similar skin concerns
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Yes, I Follow Trends"
          onPress={onContinue}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    width: '100%',
  },
  headerIcon: {
    marginBottom: spacing.m,
  },
  heading: {
    textAlign: 'center',
    marginBottom: spacing.s,
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.m,
    marginBottom: spacing.xl,
    width: '100%',
    paddingHorizontal: spacing.s,
  },
  infoSection: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.l,
    borderRadius: 16,
    marginBottom: spacing.xl,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.l,
  },
}); 