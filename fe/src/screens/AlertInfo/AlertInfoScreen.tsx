import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AlertTriangle, BellOff, Eye, Info } from 'lucide-react-native';
import { DisableAlertSheet } from '@/components/common/DisableAlertSheet';
import { Header } from '@/components/common/Header';
import { Screen } from '@/components/common/Screen';
import { mockAlerts } from '@/data/mockData';
import { colors, radius } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation';
import { formatDateTime, severityColor, severitySoftColor, statusLabel } from '@/utils/formatters';

type Route = RouteProp<RootStackParamList, 'AlertInfo'>;

export function AlertInfoScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const [sheetVisible, setSheetVisible] = useState(false);
  const alert = mockAlerts.find((item) => item.id === params.alertId);

  if (!alert) {
    return (
      <Screen>
        <Header title="Alert not found" onBack={() => navigation.goBack()} />
      </Screen>
    );
  }

  const color = severityColor(alert.severity);

  return (
    <Screen contentStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: color }]}>
        <Header title="" onBack={() => navigation.goBack()} />
        <View style={styles.heroCenter}>
          <View style={styles.alertIcon}>
            <AlertTriangle size={48} color={colors.white} />
          </View>
          <Text style={[styles.levelBadge, { backgroundColor: severitySoftColor(alert.severity), color }]}>
            {alert.severity} ALERT
          </Text>
          <Text style={styles.heroTitle}>{alert.deviceName}</Text>
          <Text style={styles.heroSubtitle}>{formatDateTime(alert.triggeredAt)}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Info size={20} color={colors.slate} />
            <Text style={styles.cardTitle}>Alert Details</Text>
          </View>
          <DetailRow label="Device ID" value={alert.deviceId} />
          <DetailRow label="Alert Level" value={alert.severity} valueColor={color} />
          <DetailRow label="Status" value={statusLabel(alert.status)} />
          <DetailRow label="Smoke" value={`${alert.sensorData.smokeLevel ?? 0}%`} />
          <DetailRow label="Temperature" value={`${alert.sensorData.temperature ?? 0} C`} />
          <DetailRow label="CO2" value={`${alert.sensorData.co2Level ?? 0} ppm`} last />
        </View>

        <View style={[styles.recommendation, { backgroundColor: severitySoftColor(alert.severity), borderColor: color }]}>
          <Text style={[styles.recommendationTitle, { color }]}>Recommended Action</Text>
          <Text style={styles.recommendationText}>
            {alert.severity === 'HIGH'
              ? 'Evacuate the area immediately. Call emergency services if needed. Do not re-enter until the area is declared safe.'
              : alert.severity === 'MEDIUM'
                ? 'Check the device location, improve ventilation, and monitor the situation closely.'
                : 'Minor detection. No immediate action required, but keep monitoring this sensor.'}
          </Text>
        </View>

        {alert.status === 'ACTIVE' ? (
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <Eye size={20} color={colors.white} />
            <Text style={styles.primaryButtonText}>Acknowledge Alert</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.warningButton} onPress={() => setSheetVisible(true)} activeOpacity={0.75}>
          <BellOff size={20} color={colors.white} />
          <Text style={styles.primaryButtonText}>Temporarily Disable Alerts</Text>
        </TouchableOpacity>
      </View>

      <DisableAlertSheet
        visible={sheetVisible}
        deviceId={alert.deviceId}
        deviceName={alert.deviceName}
        title="Temporarily Disable Alerts"
        description="Mute this device only for a planned occasion. Active alert details remain visible."
        confirmLabel="Confirm Disable"
        onClose={() => setSheetVisible(false)}
      />
    </Screen>
  );
}

function DetailRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 0,
    paddingBottom: 40,
  },
  hero: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroCenter: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  alertIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: radius.pill,
    height: 84,
    justifyContent: 'center',
    marginBottom: 14,
    width: 84,
  },
  levelBadge: {
    borderRadius: radius.pill,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 10,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    marginTop: 5,
  },
  body: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: 16,
    padding: 16,
  },
  cardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  detailRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  recommendation: {
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: 16,
    padding: 15,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },
  recommendationText: {
    color: colors.slate,
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.slateDark,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    marginBottom: 10,
    paddingVertical: 15,
  },
  warningButton: {
    alignItems: 'center',
    backgroundColor: colors.warning,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
});
