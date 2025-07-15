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
        <SectionHeading style={styles.heading}>
          Do You Buy{'\n'}Trending Products?
        </SectionHeading>
        <Text style={styles.subtitle}>
          Social media influences 78% of skincare purchases
        </Text>
      </View>

      <View style={styles.videoGrid}>
        <View style={styles.gridRow}>
          <SocialVideoTile
            key={socialVideos[0].id}
            title={socialVideos[0].title}
            count={socialVideos[0].count}
            iconName={socialVideos[0].iconName}
            selected={false}
          />
          <SocialVideoTile
            key={socialVideos[1].id}
            title={socialVideos[1].title}
            count={socialVideos[1].count}
            iconName={socialVideos[1].iconName}
            selected={false}
          />
        </View>
        <View style={styles.gridRow}>
          <SocialVideoTile
            key={socialVideos[2].id}
            title={socialVideos[2].title}
            count={socialVideos[2].count}
            iconName={socialVideos[2].iconName}
            selected={false}
          />
          <SocialVideoTile
            key={socialVideos[3].id}
            title={socialVideos[3].title}
            count={socialVideos[3].count}
            iconName={socialVideos[3].iconName}
            selected={false}
          />
        </View>
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
    paddingHorizontal: spacing.m,
    paddingTop: 80, // Extra padding for dynamic island compatibility
    paddingBottom: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    width: '100%',
  },
  headerIcon: {
    marginBottom: spacing.l,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 50,
    padding: spacing.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    textAlign: 'center',
    marginBottom: spacing.m,
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
    lineHeight: 22,
  },
  videoGrid: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    width: '100%',
    paddingHorizontal: spacing.s,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.m,
    gap: spacing.m,
  },
  infoSection: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.xl,
    borderRadius: 20,
    marginBottom: spacing.xl,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.m,
  },
}); 