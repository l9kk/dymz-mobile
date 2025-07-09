import React from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { colors, spacing, typography } from '../tokens';

interface SystemPromptOverlayProps {
  visible: boolean;
  title: string;
  body: string;
  onAllow: () => void;
  onDontAllow: () => void;
  allowText?: string;
  dontAllowText?: string;
  pointerCue?: string;
}

export const SystemPromptOverlay: React.FC<SystemPromptOverlayProps> = ({
  visible,
  title,
  body,
  onAllow,
  onDontAllow,
  allowText = 'Allow',
  dontAllowText = "Don't Allow",
  pointerCue = '👆',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.dialogContainer}>
          <View style={styles.dialog}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title={allowText}
                onPress={onAllow}
                style={styles.singleButton}
              />
              {pointerCue && (
                <Text style={styles.pointerCue}>{pointerCue}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // 55% opacity as specified
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  dialogContainer: {
    alignItems: 'center',
  },
  pointerCue: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: spacing.xs,
    transform: [{ rotate: '180deg' }],
  },
  dialog: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 14, // iOS style corner radius
    padding: spacing.l,
    width: 280, // Standard iOS dialog width
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.s,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.l,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.s,
    width: '100%',
  },
  button: {
    flex: 1,
    minHeight: 44,
  },
  singleButton: {
    width: '100%',
    minHeight: 44,
  },
}); 