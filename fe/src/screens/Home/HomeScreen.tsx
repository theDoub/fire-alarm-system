/**
 * screens/Home/HomeScreen.tsx
 * Mockup: home-page.png
 * Shows real-time environment status widget: overall system safety level.
 * Data: useAlerts() for active alert count by severity.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAlerts } from '@/hooks/useAlerts';
import { useAlertContext } from '@/contexts/AlertContext';

export function HomeScreen() {
  const { alerts, isLoading } = useAlerts();
  const { activeAlerts } = useAlertContext();

  const highCount = activeAlerts.filter((a) => a.severity === 'HIGH').length;
  const mediumCount = activeAlerts.filter((a) => a.severity === 'MEDIUM').length;
  const safetyLevel = highCount > 0 ? 3 : mediumCount > 0 ? 2 : 1;

  return (
    <ScrollView style={styles.container}>
      {/* TODO: Implement full UI from home-page.png mockup */}
      {/* Safety level widget: Level 1 = Safe (green), 2 = Warning (amber), 3 = Danger (red) */}
      <Text style={styles.header}>System Status</Text>
      <Text style={[styles.level, safetyLevel === 3 && styles.danger, safetyLevel === 2 && styles.warning]}>
        {safetyLevel === 1 ? '✅ SAFE' : safetyLevel === 2 ? '⚠️ WARNING' : '🔴 DANGER'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 24 },
  header: { color: '#aaa', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
  level: { color: '#4caf50', fontSize: 32, fontWeight: '800' },
  warning: { color: '#ffc107' },
  danger: { color: '#e94560' },
});
