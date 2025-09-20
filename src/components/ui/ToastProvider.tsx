/**
 * Toast Provider Component for global notifications
 */

import React from 'react';
import Toast from 'react-native-toast-message';
import { UI_CONSTANTS } from '@/config/constants';

export const ToastProvider: React.FC = () => {
  return (
    <Toast
      config={{
        success: (props) => (
          <Toast.BaseToast
            {...props}
            style={{
              borderLeftColor: UI_CONSTANTS.COLORS.SUCCESS,
              backgroundColor: UI_CONSTANTS.COLORS.SUCCESS_BACKGROUND,
              borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
              borderLeftWidth: 4,
            }}
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            text1Style={{
              fontSize: UI_CONSTANTS.FONT_SIZES.MD,
              fontWeight: '500',
              color: UI_CONSTANTS.COLORS.SUCCESS_TEXT,
            }}
            text2Style={{
              fontSize: UI_CONSTANTS.FONT_SIZES.SM,
              color: UI_CONSTANTS.COLORS.SUCCESS_TEXT,
            }}
          />
        ),
        error: (props) => (
          <Toast.ErrorToast
            {...props}
            style={{
              borderLeftColor: UI_CONSTANTS.COLORS.DANGER,
              backgroundColor: UI_CONSTANTS.COLORS.ERROR_BACKGROUND,
              borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
              borderLeftWidth: 4,
            }}
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            text1Style={{
              fontSize: UI_CONSTANTS.FONT_SIZES.MD,
              fontWeight: '500',
              color: UI_CONSTANTS.COLORS.ERROR_TEXT,
            }}
            text2Style={{
              fontSize: UI_CONSTANTS.FONT_SIZES.SM,
              color: UI_CONSTANTS.COLORS.ERROR_TEXT,
            }}
          />
        ),
        info: (props) => (
          <Toast.BaseToast
            {...props}
            style={{
              borderLeftColor: UI_CONSTANTS.COLORS.PRIMARY,
              backgroundColor: UI_CONSTANTS.COLORS.WHITE,
              borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
              borderLeftWidth: 4,
            }}
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            text1Style={{
              fontSize: UI_CONSTANTS.FONT_SIZES.MD,
              fontWeight: '500',
              color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
            }}
            text2Style={{
              fontSize: UI_CONSTANTS.FONT_SIZES.SM,
              color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
            }}
          />
        ),
        warning: (props) => (
          <Toast.BaseToast
            {...props}
            style={{
              borderLeftColor: UI_CONSTANTS.COLORS.WARNING,
              backgroundColor: UI_CONSTANTS.COLORS.WARNING_BACKGROUND,
              borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
              borderLeftWidth: 4,
            }}
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            text1Style={{
              fontSize: UI_CONSTANTS.FONT_SIZES.MD,
              fontWeight: '500',
              color: UI_CONSTANTS.COLORS.WARNING_TEXT,
            }}
            text2Style={{
              fontSize: UI_CONSTANTS.FONT_SIZES.SM,
              color: UI_CONSTANTS.COLORS.WARNING_TEXT,
            }}
          />
        ),
      }}
    />
  );
};
