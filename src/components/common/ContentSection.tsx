/**
 * ContentSection Component - Consistent section wrapper for grouped content
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { UI_CONSTANTS } from '@/config/constants';

interface ContentSectionProps {
  children: React.ReactNode;
  title?: string;
  marginBottom?: boolean;
  backgroundColor?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  children,
  title,
  marginBottom = true,
  backgroundColor = UI_CONSTANTS.COLORS.WHITE,
}) => {
  return (
    <View style={[
      styles.section,
      marginBottom && styles.sectionMargin,
      { backgroundColor }
    ]}>
      {title && (
        <Text style={styles.sectionTitle}>{title}</Text>
      )}
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
    marginBottom: UI_CONSTANTS.SPACING.LG,
    shadowColor: UI_CONSTANTS.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionMargin: {
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  sectionTitle: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.MD,
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    paddingTop: UI_CONSTANTS.SPACING.LG,
  },
  sectionContent: {
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    paddingBottom: UI_CONSTANTS.SPACING.LG,
  },
});
