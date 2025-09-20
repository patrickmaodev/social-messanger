/**
 * Hook for managing social modals
 */

import { useState, useCallback } from 'react';

export interface ModalConfig {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  icon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}

export const useSocialModal = () => {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
    setModalConfig(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (modalConfig?.onConfirm) {
      modalConfig.onConfirm();
    }
    hideModal();
  }, [modalConfig, hideModal]);

  const handleCancel = useCallback(() => {
    if (modalConfig?.onCancel) {
      modalConfig.onCancel();
    }
    hideModal();
  }, [modalConfig, hideModal]);

  return {
    modalConfig,
    isVisible,
    showModal,
    hideModal,
    handleConfirm,
    handleCancel,
  };
};
