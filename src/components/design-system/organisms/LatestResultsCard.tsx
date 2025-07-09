import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import { MetricsCarousel } from '../molecules';
import { colors, spacing } from '../tokens';

interface MetricItem {
  title: string;
  score: number; // 0-100
  isLocked?: boolean;
}

interface LatestResultsCardProps {
  imageUrl: string;
  metrics: MetricItem[];
}

export const LatestResultsCard: React.FC<LatestResultsCardProps> = ({ imageUrl, metrics }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* Hero image */}
      <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Metrics */}
      {metrics.length > 0 && (
        <View style={styles.metricsContainer}>
          <MetricsCarousel metrics={metrics} ringSize={80} />
        </View>
      )}

      {/* Fullscreen modal */}
      <Modal visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <TouchableOpacity style={styles.modalCloseArea} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeText}>Close ×</Text>
          </TouchableOpacity>
          <Image source={{ uri: imageUrl }} style={styles.modalImage} resizeMode="contain" />
          {metrics.length > 0 && (
            <View style={styles.modalMetrics}>
              <MetricsCarousel metrics={metrics} ringSize={70} />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceNeutral,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4, // 4:5 ratio (0.75)
  },
  metricsContainer: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  modalCloseArea: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.l,
  },
  closeText: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  modalImage: {
    width: '100%',
    flex: 1,
  },
  modalMetrics: {
    paddingVertical: spacing.l,
  },
}); 