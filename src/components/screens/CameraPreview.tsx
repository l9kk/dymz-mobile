import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CapturePreview } from '../design-system/organisms/CapturePreview';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { colors, typography, spacing } from '../design-system/tokens';
import { useTranslation } from '../../hooks/useTranslation';

interface CameraPreviewProps {
  onTakePicture: (photoUri?: string) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  onTakePicture
}) => {
  const { t } = useTranslation();
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current || !isCameraReady) {
      Alert.alert(t('camera.notReady'), t('camera.waitForInitialization'));
      return;
    }

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });
      
      console.log('Photo captured:', photo.uri);
      onTakePicture(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert(t('common.error'), t('camera.failedToTakePicture'));
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('camera.permissionTitle')}</Text>
          <PrimaryButton title={t('common.continue')} onPress={requestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>📸💥</Text>
          <Text style={styles.title}>
            {t('camera.takeSelfieTitle')}
          </Text>
        </View>
        
        <CapturePreview 
          style={styles.capturePreview}
          cameraRef={cameraRef}
          onCameraReady={handleCameraReady}
        />
        
        <View style={styles.buttonContainer}>
          {isCapturing && (
            <ActivityIndicator 
              size="large" 
              color={colors.accentPalette[2]} 
              style={styles.loading}
            />
          )}
          <PrimaryButton 
            title={isCapturing ? t('loading.takingPicture') : t('camera.takePicture')}
            onPress={handleTakePicture}
            style={{
              ...styles.button,
              opacity: isCapturing ? 0.6 : 1
            }}
            disabled={!isCameraReady || isCapturing}
          />
          {!isCameraReady && (
            <Text style={styles.loadingText}>{t('camera.initializingCamera')}</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.m,
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    paddingHorizontal: spacing.m,
  },
  capturePreview: {
    marginVertical: spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginTop: spacing.l,
  },
  loading: {
    marginBottom: spacing.m,
  },
  loadingText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    marginTop: spacing.s,
    textAlign: 'center',
  },
}); 