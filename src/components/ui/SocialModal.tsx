/**
 * Social Modal Component - A friendly, social app-style modal
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_CONSTANTS } from '@/config/constants';

interface SocialModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const SocialModal: React.FC<SocialModalProps> = ({
  visible,
  title,
  message,
  type = 'info',
  showCancel = true,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  icon,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: UI_CONSTANTS.COLORS.SUCCESS,
          iconName: icon || 'checkmark-circle',
        };
      case 'warning':
        return {
          iconColor: UI_CONSTANTS.COLORS.WARNING,
          iconName: icon || 'warning',
        };
      case 'error':
        return {
          iconColor: UI_CONSTANTS.COLORS.DANGER,
          iconName: icon || 'alert-circle',
        };
      default:
        return {
          iconColor: UI_CONSTANTS.COLORS.INFO,
          iconName: icon || 'information-circle',
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={typeStyles.iconName}
                  size={48}
                  color={typeStyles.iconColor}
                />
              </View>
              
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              
              <View style={styles.buttonContainer}>
                {showCancel && (
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.LG,
  },
  modalContainer: {
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.XL,
    padding: UI_CONSTANTS.SPACING.XL,
    alignItems: 'center',
    maxWidth: width * 0.9,
    width: '100%',
    shadowColor: UI_CONSTANTS.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  iconContainer: {
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  title: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XL,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    textAlign: 'center',
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  message: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: UI_CONSTANTS.SPACING.XL,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: UI_CONSTANTS.SPACING.MD,
  },
  button: {
    flex: 1,
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.XL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    borderWidth: 1,
    borderColor: UI_CONSTANTS.COLORS.BORDER,
  },
  confirmButton: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
  },
  cancelButtonText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '500',
    color: UI_CONSTANTS.COLORS.DARK,
  },
  confirmButtonText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '500',
    color: UI_CONSTANTS.COLORS.WHITE,
  },
});
