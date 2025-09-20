import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { UI_CONSTANTS } from '@/config/constants';

export const ErrorDiagnostic: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Runtime Error Diagnostic</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Info:</Text>
          <Text style={styles.info}>Platform: {Platform?.OS || 'Unknown'}</Text>
          <Text style={styles.info}>Version: {Platform?.Version || 'Unknown'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>React Native Info:</Text>
          <Text style={styles.info}>React Native Version: Check package.json</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Issues:</Text>
          <Text style={styles.tip}>1. Missing Platform import</Text>
          <Text style={styles.tip}>2. React version compatibility</Text>
          <Text style={styles.tip}>3. Metro bundler cache issues</Text>
          <Text style={styles.tip}>4. Missing dependencies</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONSTANTS.COLORS.BACKGROUND_LIGHT,
  },
  content: {
    padding: UI_CONSTANTS.SPACING.LG,
  },
  title: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XL,
    fontWeight: 'bold',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.LG,
    textAlign: 'center',
  },
  section: {
    marginBottom: UI_CONSTANTS.SPACING.LG,
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
    padding: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
  },
  sectionTitle: {
    fontSize: UI_CONSTANTS.FONT_SIZES.LG,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  info: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  tip: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
});
