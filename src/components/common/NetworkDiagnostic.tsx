import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { BaseScreen } from '@/components/common/BaseScreen';
import { ScreenContent } from '@/components/common/ScreenContent';
import { ContentSection } from '@/components/common/ContentSection';
import { UI_CONSTANTS } from '@/config/constants';
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';

interface NetworkDiagnosticResults {
  backend: string;
  registration: string;
  [key: string]: string; // For dynamic IP tests
}

export const NetworkDiagnostic: React.FC = () => {
  const [results, setResults] = useState<NetworkDiagnosticResults | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = useCallback(async () => {
    setLoading(true);
    const newResults: NetworkDiagnosticResults = {
      backend: 'Testing...',
      registration: 'Testing...',
    };

    // Test 1: Basic backend connectivity (OPTIONS request)
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      newResults.backend = response.ok ? 'Connected' : `Failed (${response.status})`;
    } catch (error: any) {
      newResults.backend = `Error: ${error.message}`;
    }

    // Test 2: Test with axios-like request
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          full_name: 'Diagnostic User',
          password: 'testpass123',
          password_confirm: 'testpass123',
        }),
      });

      if (response.ok) {
        newResults.registration = 'Registration endpoint working';
      } else {
        const errorData = await response.text();
        newResults.registration = `Registration failed: ${response.status} - ${errorData}`;
      }
    } catch (error: any) {
      newResults.registration = `Registration error: ${error.message}`;
    }

    // Test 3: Test with different IP formats
    const testIPs = [
      'localhost:8001',
      '127.0.0.1:8001',
      '192.168.1.66:8001', // Replace with your actual local IP if different
    ];

    for (const ip of testIPs) {
      try {
        const response = await fetch(`http://${ip}/api/v1`, {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        newResults[`ip_${ip}`] = response.ok ? 'Connected' : `Failed (${response.status})`;
      } catch (error: any) {
        newResults[`ip_${ip}`] = `Error: ${error.message}`;
      }
    }

    setResults(newResults);
    setLoading(false);
  }, []);

  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  return (
    <BaseScreen>
      <ScreenContent contentContainerStyle={styles.contentContainer}>
        <ContentSection title="Network Diagnostics">
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={UI_CONSTANTS.COLORS.PRIMARY} />
              <Text style={styles.loadingText}>Running diagnostics...</Text>
            </View>
          ) : (
            <View>
              {results && Object.entries(results).map(([key, value]) => (
                <View key={key} style={styles.resultItem}>
                  <Text style={styles.resultLabel}>{key.replace(/_/g, ' ')}:</Text>
                  <Text style={[styles.resultValue, value.includes('Connected') ? styles.successText : styles.errorText]}>
                    {value}
                  </Text>
                </View>
              ))}
              <TouchableOpacity style={styles.runAgainButton} onPress={runDiagnostics}>
                <Ionicons name="refresh-outline" size={20} color={UI_CONSTANTS.COLORS.WHITE} />
                <Text style={styles.runAgainButtonText}>Run Diagnostics Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </ContentSection>

        <ContentSection title="Troubleshooting Tips">
          <Text style={styles.tip}>- Make sure backend is running on port 8001</Text>
          <Text style={styles.tip}>- Check that your device and computer are on same WiFi</Text>
          <Text style={styles.tip}>- Try restarting the backend containers</Text>
          <Text style={styles.tip}>- Check firewall settings on your computer</Text>
          <Text style={styles.tip}>- Try using localhost instead of IP address</Text>
        </ContentSection>
      </ScreenContent>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: UI_CONSTANTS.SPACING.MD,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: UI_CONSTANTS.SPACING.XXL,
  },
  loadingText: {
    marginTop: UI_CONSTANTS.SPACING.MD,
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONSTANTS.COLORS.BORDER,
  },
  resultLabel: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '500',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
  },
  resultValue: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '500',
  },
  successText: {
    color: UI_CONSTANTS.COLORS.SUCCESS,
  },
  errorText: {
    color: UI_CONSTANTS.COLORS.DANGER,
  },
  runAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    marginTop: UI_CONSTANTS.SPACING.LG,
  },
  runAgainButtonText: {
    color: UI_CONSTANTS.COLORS.WHITE,
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '600',
    marginLeft: UI_CONSTANTS.SPACING.XS,
  },
  tip: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: UI_CONSTANTS.SPACING.XS,
    lineHeight: 20,
  },
});