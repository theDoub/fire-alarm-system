import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { alertService } from '@/api/alertService';
import { useAlertContext } from '@/contexts/AlertContext';
import type { RootStackParamList } from '@/types/navigation';
import type { Alert as AlertModel } from '@/types/alert';
import { Feather } from '@expo/vector-icons';

type Route = RouteProp<RootStackParamList, 'AlertInfo'>;

export function AlertInfoScreen() {
  const route = useRoute<Route>();
  const { alert: routeAlert, severity: routeSeverity, alertId } = route.params ?? {};
  const navigation = useNavigation();
  const { dismissDangerAlert } = useAlertContext();
  const insets = useSafeAreaInsets();
  
  const [alert, setAlert] = useState<AlertModel | null>(routeAlert ?? null);
  const [isLoading, setIsLoading] = useState(!routeAlert && !!alertId);
  const [errorText, setErrorText] = useState<string | null>(null);

  const flashAnim = useRef(new Animated.Value(1)).current;

  // Fetch alert details if not provided in navigation params
  useEffect(() => {
    if (!alert && alertId) {
      (async () => {
        try {
          const data = await alertService.getAlert(alertId);
          setAlert(data);
        } catch (e: any) {
          setErrorText(e?.message ?? 'Failed to load telemetry alert details.');
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [alertId, alert]);

  const rawSeverity = routeSeverity ?? alert?.severity ?? 'LOW';

  const getNormalizedSeverity = (sev: string): 'LOW' | 'MEDIUM' | 'HIGH' => {
    const s = sev.toUpperCase();
    if (s.includes('HIGH') || s.includes('LEVEL_3') || s.includes('LEVEL_3')) return 'HIGH';
    if (s.includes('MEDIUM') || s.includes('LEVEL_2') || s.includes('LEVEL_2')) return 'MEDIUM';
    return 'LOW';
  };

  const severity = getNormalizedSeverity(rawSeverity);

  // Intense pulsing animation ONLY for HIGH / LEVEL 3 alerts
  useEffect(() => {
    if (severity === 'HIGH') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          Animated.timing(flashAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      flashAnim.setValue(1);
    }
    return () => {
      flashAnim.stopAnimation();
    };
  }, [severity]);

  const handleAcknowledge = async () => {
    try {
      const id = alertId ?? alert?.id;
      if (!id) {
        Alert.alert('Error', 'Unable to resolve dynamic Alert ID.');
        return;
      }
      await alertService.acknowledgeAlert(id);
      dismissDangerAlert();
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Acknowledgment Failed', e?.response?.data?.message ?? e?.message ?? 'Network error.');
    }
  };

  // Adaptive Severity Colors and Content Mapping
  let themeColor = '#4caf50';
  let panelBg = '#f3f4f6';
  let cardBg = '#ffffff';
  let headerLabel = 'SYSTEM BASELINE MAINTENANCE';
  let iconName: keyof typeof Feather.glyphMap = 'shield';
  let alertHeadline = 'System Baseline Maintenance';

  if (severity === 'MEDIUM') {
    themeColor = '#ffc107';
    panelBg = '#f3f4f6';
    cardBg = '#ffffff';
    headerLabel = 'ELEVATED THERMAL TELEMETRY';
    iconName = 'alert-triangle';
    alertHeadline = 'Elevated Thermal Telemetry';
  } else if (severity === 'HIGH') {
    themeColor = '#e94560';
    panelBg = '#f3f4f6';
    cardBg = '#ffffff';
    headerLabel = 'CRITICAL EMERGENCY - FLAME DETECTED';
    iconName = 'zap';
    alertHeadline = 'CRITICAL EMERGENCY - FLAME DETECTED';
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Fetching threat matrix detail...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: flashAnim, backgroundColor: panelBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={panelBg} />
      
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Giant Status Icon & Adaptive Title */}
        <View style={[styles.headerSection, { borderColor: themeColor + '33' }]}>
          <View style={[styles.iconCircle, { backgroundColor: themeColor + '14', borderColor: themeColor + '33' }]}>
            <Feather name={iconName} size={48} color={themeColor} />
          </View>
          
          <Text style={[styles.headerLabel, { color: themeColor }]}>{headerLabel}</Text>
          <Text style={styles.headlineText}>{alert?.deviceName ? `Node: ${alert.deviceName}` : alertHeadline}</Text>
        </View>

        {errorText ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorText}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.retryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Detailed Telemetry Report Card */
          <View style={[styles.detailsCard, { backgroundColor: cardBg, borderColor: themeColor + '33' }]}>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>TELEMETRY SNAPSHOT</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Alert Status</Text>
              <Text style={[styles.detailValue, { color: themeColor, fontWeight: '800' }]}>
                {alert?.status ?? 'ACTIVE'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned Node ID</Text>
              <Text style={styles.detailValue} numberOfLines={1}>{route.params?.alertId ?? alert?.id ?? 'Unknown'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Device Type/Model</Text>
              <Text style={styles.detailValue}>{alert?.deviceName ?? 'ESP32 Smart Sensor'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Physical Location</Text>
              <Text style={styles.detailValue}>{alert?.deviceLocation ?? 'Baseline Calibration Zone'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Trigger Timestamp</Text>
              <Text style={styles.detailValue}>
                {alert?.triggeredAt ? new Date(alert.triggeredAt).toLocaleString() : new Date().toLocaleString()}
              </Text>
            </View>

            {/* Sensor Data snapshot if available */}
            {alert?.sensorData && (
              <View style={styles.sensorSnapshotSection}>
                <Text style={[styles.sensorHeader, { color: themeColor }]}>ENVIRONMENT METRICS</Text>
                
                {alert.sensorData.smokeLevel !== undefined && (
                  <View style={styles.sensorRow}>
                    <Text style={styles.sensorLabel}>💨 Smoke Density</Text>
                    <Text style={styles.sensorValue}>{alert.sensorData.smokeLevel} ppm</Text>
                  </View>
                )}

                {alert.sensorData.temperature !== undefined && (
                  <View style={styles.sensorRow}>
                    <Text style={styles.sensorLabel}>🌡️ Core Temperature</Text>
                    <Text style={styles.sensorValue}>{alert.sensorData.temperature} °C</Text>
                  </View>
                )}

                {alert.sensorData.co2Level !== undefined && (
                  <View style={styles.sensorRow}>
                    <Text style={styles.sensorLabel}>💨 Carbon Dioxide</Text>
                    <Text style={styles.sensorValue}>{alert.sensorData.co2Level} ppm</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Action Trigger Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.acknowledgeButton, { backgroundColor: themeColor }]}
            onPress={handleAcknowledge}
            activeOpacity={0.85}
          >
            <Feather name="check" size={20} color="#ffffff" style={styles.actionIcon} />
            <Text style={styles.acknowledgeButtonText}>Acknowledge Threat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={16} color="#8f94a5" style={styles.actionIcon} />
            <Text style={styles.backButtonText}>Return to Log Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 16,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
    width: '100%',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLabel: {
    fontSize: 11,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  headlineText: {
    color: '#111827',
    fontSize: 24,
    fontFamily: 'Inter-ExtraBold',
    textAlign: 'center',
  },
  detailsCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    width: '100%',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb88',
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  detailValue: {
    color: '#111827',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    maxWidth: '60%',
  },
  sensorSnapshotSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7ebcc',
  },
  sensorHeader: {
    fontSize: 11,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sensorLabel: {
    color: '#6b7280',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  sensorValue: {
    color: '#111827',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
  },
  acknowledgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 56,
    width: '100%',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  acknowledgeButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter-ExtraBold',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: '100%',
  },
  backButtonText: {
    color: '#6b7280',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  actionIcon: {
    marginRight: 8,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    borderColor: '#ef4444',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#ef4444',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});
