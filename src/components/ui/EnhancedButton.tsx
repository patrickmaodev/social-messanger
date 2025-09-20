/**
 * Enhanced Button Component with modern UI features
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { UI_CONSTANTS, TYPOGRAPHY } from '@/config/constants';

interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  animation?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  animation = true,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
          borderColor: UI_CONSTANTS.COLORS.PRIMARY,
          textColor: UI_CONSTANTS.COLORS.TEXT_ON_PRIMARY,
        };
      case 'secondary':
        return {
          backgroundColor: UI_CONSTANTS.COLORS.SECONDARY,
          borderColor: UI_CONSTANTS.COLORS.SECONDARY,
          textColor: UI_CONSTANTS.COLORS.TEXT_ON_PRIMARY,
        };
      case 'success':
        return {
          backgroundColor: UI_CONSTANTS.COLORS.SUCCESS,
          borderColor: UI_CONSTANTS.COLORS.SUCCESS,
          textColor: UI_CONSTANTS.COLORS.TEXT_ON_SUCCESS,
        };
      case 'danger':
        return {
          backgroundColor: UI_CONSTANTS.COLORS.DANGER,
          borderColor: UI_CONSTANTS.COLORS.DANGER,
          textColor: UI_CONSTANTS.COLORS.TEXT_ON_DANGER,
        };
      case 'warning':
        return {
          backgroundColor: UI_CONSTANTS.COLORS.WARNING,
          borderColor: UI_CONSTANTS.COLORS.WARNING,
          textColor: UI_CONSTANTS.COLORS.TEXT_PRIMARY, // Dark text on yellow
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: UI_CONSTANTS.COLORS.PRIMARY,
          textColor: UI_CONSTANTS.COLORS.PRIMARY,
        };
      default:
        return {
          backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
          borderColor: UI_CONSTANTS.COLORS.PRIMARY,
          textColor: UI_CONSTANTS.COLORS.TEXT_ON_PRIMARY,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: UI_CONSTANTS.SPACING.SM,
          paddingHorizontal: UI_CONSTANTS.SPACING.MD,
          borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
        };
      case 'large':
        return {
          paddingVertical: UI_CONSTANTS.SPACING.LG,
          paddingHorizontal: UI_CONSTANTS.SPACING.XL,
          borderRadius: UI_CONSTANTS.BORDER_RADIUS.XL,
        };
      default:
        return {
          paddingVertical: UI_CONSTANTS.SPACING.MD,
          paddingHorizontal: UI_CONSTANTS.SPACING.LG,
          borderRadius: UI_CONSTANTS.BORDER_RADIUS.XL,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return UI_CONSTANTS.FONT_SIZES.SM;
      case 'large':
        return UI_CONSTANTS.FONT_SIZES.LG;
      default:
        return UI_CONSTANTS.FONT_SIZES.BUTTON;
    }
  };

  const buttonStyles = [
    styles.button,
    getVariantStyles(),
    getSizeStyles(),
    disabled && styles.disabled,
    style,
  ];

  const getTextColor = () => {
    return getVariantStyles().textColor;
  };

  const textStyles = [
    styles.text,
    TYPOGRAPHY.BUTTON,
    { fontSize: getTextSize(), color: getTextColor() },
    textStyle,
  ];

  const ButtonComponent = animation ? Animatable.View : TouchableOpacity;

  return (
    <ButtonComponent
      animation={animation ? 'pulse' : undefined}
      iterationCount={animation ? 1 : undefined}
      style={buttonStyles}
    >
      <TouchableOpacity
        style={[styles.touchable, getSizeStyles()]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator
            color={UI_CONSTANTS.COLORS.WHITE}
            size="small"
          />
        ) : (
          <Text style={textStyles}>{title}</Text>
        )}
      </TouchableOpacity>
    </ButtonComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: UI_CONSTANTS.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
