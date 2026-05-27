/**
 * screens/AlertInfo/AlertInfoScreen.tsx
 * Mockup: alert-info-page.png
 * Full-screen HIGH severity flashing Danger modal.
 * Presented as a modal overlay from RootNavigator.
 * API: GET /api/alerts/:id | POST /api/alerts/:id/acknowledge
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { alertService } from '@/api/alertService';
import { useAlertContext } from '@/contexts/AlertContext';
import type { RootStackParamList } from '@/types/navigation';

type Route = RouteProp<RootStackParamList, 'AlertInfo'>;

export function AlertInfoScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const { dismissDangerAlert } = useAlertContext();
  const flashAnim = useRef(new Animated.Value(1)).current;

  // Pulsing red flash animation for HIGH alerts
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const handleAcknowledge = async () => {
    await alertService.acknowledgeAlert(params.alertId);
    dismissDangerAlert();
    navigation.goBack();
  };

  return (
    <Animated.View style={[styles.container, { opacity: flashAnim }]}>
      {/* TODO: Implement full UI from alert-info-page.png mockup */}
      <Text style={styles.dangerText}>🔴 DANGER</Text>
      <Text style={styles.subtitle}>Fire alarm triggered!</Text>
      <Text style={styles.id}>Alert ID: {params.alertId}</Text>
      <TouchableOpacity style={styles.button} onPress={handleAcknowledge}>
        <Text style={styles.buttonText}>Acknowledge</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0000', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dangerText: { color: '#e94560', fontSize: 48, fontWeight: '900', marginBottom: 16 },
  subtitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 8 },
  id: { color: '#888', fontSize: 12, marginBottom: 40 },
  button: { backgroundColor: '#e94560', borderRadius: 14, paddingHorizontal: 40, paddingVertical: 16 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
