/**
 * BaseScreen Component - Provides consistent styling for all screens
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { UI_CONSTANTS } from '@/config/constants';

interface BaseScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  backgroundColor = UI_CONSTANTS.COLORS.LIGHT,
  statusBarStyle = 'dark-content',
  safeAreaEdges = ['top', 'bottom'],
}) => {
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor }]}
      edges={safeAreaEdges}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <View style={[styles.content, { backgroundColor }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
