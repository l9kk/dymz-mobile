import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { colors } from '../tokens';

interface CapturePreviewProps {
  style?: any;
  onCameraReady?: () => void;
  cameraRef?: any;
}

export const CapturePreview: React.FC<CapturePreviewProps> = ({ 
  style, 
  onCameraReady,
  cameraRef 
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const screenWidth = Dimensions.get('window').width;
  const previewSize = Math.min(screenWidth * 0.8, 300); // Responsive sizing

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={[styles.container, { width: previewSize, height: previewSize }, style]} />;
  }
  
  if (hasPermission === false) {
    Alert.alert('No access to camera');
    return <View style={[styles.container, { width: previewSize, height: previewSize }, style]} />;
  }

  return (
    <View style={[styles.container, { width: previewSize, height: previewSize }, style]}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
        onCameraReady={onCameraReady}
      >
        {/* Face crosshair guide */}
        <View style={styles.crosshair}>
          <View style={styles.crosshairVertical} />
          <View style={styles.crosshairHorizontal} />
          <View style={styles.centerDot} />
        </View>
        
        {/* Grid lines */}
        <View style={styles.gridContainer}>
          {/* Vertical grid lines */}
          <View style={[styles.gridLine, styles.gridVertical, { left: '33%' }]} />
          <View style={[styles.gridLine, styles.gridVertical, { left: '66%' }]} />
          
          {/* Horizontal grid lines */}
          <View style={[styles.gridLine, styles.gridHorizontal, { top: '33%' }]} />
          <View style={[styles.gridLine, styles.gridHorizontal, { top: '66%' }]} />
        </View>
        
        {/* Face guide overlay */}
        <View style={styles.faceGuide}>
          <View style={styles.faceOutline} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.textSecondary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  camera: {
    flex: 1,
  },
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: colors.surfaceNeutral,
    left: 14,
    top: 0,
    opacity: 0.8,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: colors.surfaceNeutral,
    left: 0,
    top: 14,
    opacity: 0.8,
  },
  centerDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceNeutral,
    left: 13,
    top: 13,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: colors.surfaceNeutral,
    opacity: 0.3,
  },
  gridVertical: {
    width: 1,
    height: '100%',
  },
  gridHorizontal: {
    height: 1,
    width: '100%',
  },
  faceGuide: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    bottom: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: '80%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.surfaceNeutral,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
}); 