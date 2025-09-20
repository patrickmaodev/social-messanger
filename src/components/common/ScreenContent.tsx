/**
 * ScreenContent Component - Consistent content wrapper for screens
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import { UI_CONSTANTS } from '@/config/constants';

interface ScreenContentProps extends ScrollViewProps {
  children: React.ReactNode;
  padding?: boolean;
  backgroundColor?: string;
  scrollable?: boolean;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({
  children,
  padding = true,
  backgroundColor = UI_CONSTANTS.COLORS.LIGHT,
  scrollable = true,
  ...scrollProps
}) => {
  const contentStyle = [
    styles.content,
    padding && styles.padded,
    { backgroundColor },
  ];

  if (scrollable) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...scrollProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={contentStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  padded: {
    padding: UI_CONSTANTS.SPACING.LG,
  },
});
