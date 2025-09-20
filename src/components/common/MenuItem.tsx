/**
 * MenuItem Component - Consistent menu item styling
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_CONSTANTS } from '@/config/constants';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  iconColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  iconColor = UI_CONSTANTS.COLORS.PRIMARY,
  titleColor = UI_CONSTANTS.COLORS.DARK,
  subtitleColor = UI_CONSTANTS.COLORS.TEXT_SECONDARY,
  disabled = false,
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    if (variant === 'danger') {
      return {
        iconColor: UI_CONSTANTS.COLORS.DANGER,
        titleColor: UI_CONSTANTS.COLORS.DANGER,
      };
    }
    return { iconColor, titleColor };
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      style={[styles.menuItem, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={24}
            color={variantStyles.iconColor}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: variantStyles.titleColor }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: subtitleColor }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONSTANTS.COLORS.BORDER,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: UI_CONSTANTS.SPACING.MD,
  },
  title: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
