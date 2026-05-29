import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AlertTriangle, BellOff, Flame, MapPin, Power, Thermometer, Volume2, Wifi, WifiOff, Wind } from 'lucide-react-native';
import { DisableAlertSheet } from '@/components/common/DisableAlertSheet';
import { Header } from '@/components/common/Header';
import { Screen } from '@/components/common/Screen';
import { mockAlerts, mockDevices } from '@/data/mockData';
import { colors, radius } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation';
import { formatDateTime, severityColor } from '@/utils/formatters';

type Route = RouteProp<RootStackParamList, 'DeviceInfo'>;

export function DeviceInfoScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const sourceDevice = mockDevices.find((item) => item.id === params.deviceId);
  const [poweredOn, setPoweredOn] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(false);
  const deviceAlerts = useMemo(
    () => mockAlerts.filter((alert) => alert.deviceId === params.deviceId).slice(0, 3),
    [params.deviceId],
  );

  if (!sourceDevice) {
    return (
      <Screen>
        <Header title="Device not found" onBack={() => navigation.goBack()} />
      </Screen>
    );
  }

  const online = sourceDevice.status === 'ONLINE';

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Header title="" onBack={() => navigation.goBack()} />
        <View style={styles.heroCenter}>
          <View style={styles.heroIcon}>
            <Flame size={48} color={colors.white} />
          </View>
          <Text style={styles.heroTitle}>{sourceDevice.name}</Text>
          <View style={styles.heroLocation}>
            <MapPin size={15} color="#dbeafe" />
            <Text style={styles.heroSubtitle}>{sourceDevice.location}</Text>
          </View>
        </View>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            {online ? <Wifi size={25} color="#bbf7d0" /> : <WifiOff size={25} color="#fecaca" />}
            <Text style={styles.heroStatText}>{online ? 'Online' : 'Offline'}</Text>
          </View>
          <View style={styles.heroStat}>
            <Power size={25} color={colors.white} />
            <Text style={styles.heroStatText}>{poweredOn ? 'On' : 'Off'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sensor Readings</Text>
          <View style={styles.readingGrid}>
            <Reading icon={<Flame size={20} color={colors.warningDark} />} label="Smoke" value="Normal" tone={colors.warningSoft} />
            <Reading icon={<Wind size={20} color={colors.info} />} label="Gas" value="Normal" tone={colors.infoSoft} />
            <Reading icon={<Thermometer size={20} color={colors.danger} />} label="Temp" value="22 C" tone={colors.dangerSoft} />
            <Reading icon={<Volume2 size={20} color="#7c3aed" />} label="Sound" value="45 dB" tone="#ede9fe" />
          </View>
        </View>

        {deviceAlerts.length ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Alerts</Text>
            {deviceAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertRow}>
                <AlertTriangle size={20} color={severityColor(alert.severity)} />
                <View style={styles.alertCopy}>
                  <Text style={[styles.alertSeverity, { color: severityColor(alert.severity) }]}>{alert.severity}</Text>
                  <Text style={styles.alertTime}>{formatDateTime(alert.triggeredAt)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Information</Text>
          <DetailRow label="Device ID" value={sourceDevice.id} />
          <DetailRow label="MAC Address" value={sourceDevice.macAddress} />
          <DetailRow label="Last Updated" value={formatDateTime(sourceDevice.lastSeenAt)} />
          <DetailRow label="Alerts Disabled" value={sourceDevice.isMuted ? 'Yes' : 'No'} last />
        </View>

        <TouchableOpacity
          disabled={!online}
          style={[styles.powerButton, poweredOn ? styles.powerButtonOn : styles.powerButtonOff, !online && styles.disabledButton]}
          onPress={() => setPoweredOn((current) => !current)}
          activeOpacity={0.75}
        >
          <Power size={20} color={colors.white} />
          <Text style={styles.buttonText}>{poweredOn ? 'Turn Off Device' : 'Turn On Device'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.warningButton} onPress={() => setSheetVisible(true)} activeOpacity={0.75}>
          <BellOff size={20} color={colors.white} />
          <Text style={styles.buttonText}>Deactivate Sensor Temporarily</Text>
        </TouchableOpacity>
      </View>

      <DisableAlertSheet
        visible={sheetVisible}
        deviceId={sourceDevice.id}
        deviceName={sourceDevice.name}
        title="Deactivate Sensor"
        description="Pause this sensor for special occasions such as barbecue, emergency training, or maintenance."
        confirmLabel="Confirm Deactivation"
        onClose={() => setSheetVisible(false)}
      />
    </Screen>
  );
}

function Reading({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <View style={styles.reading}>
      <View style={[styles.readingIcon, { backgroundColor: tone }]}>{icon}</View>
      <View>
        <Text style={styles.readingLabel}>{label}</Text>
        <Text style={styles.readingValue}>{value}</Text>
      </View>
    </View>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 0,
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: colors.info,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  heroCenter: {
    alignItems: 'center',
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    height: 84,
    justifyContent: 'center',
    marginBottom: 14,
    width: 84,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
  },
  heroLocation: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },
  heroSubtitle: {
    color: '#dbeafe',
    fontSize: 14,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  heroStat: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    padding: 14,
  },
  heroStatText: {
    color: colors.white,
    fontWeight: '900',
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
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 13,
  },
  readingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reading: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flexBasis: '48%',
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  readingIcon: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  readingLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  readingValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  alertRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 9,
    padding: 12,
  },
  alertCopy: {
    flex: 1,
  },
  alertSeverity: {
    fontSize: 12,
    fontWeight: '900',
  },
  alertTime: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  detailRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingVertical: 10,
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
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  powerButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    marginBottom: 10,
    paddingVertical: 15,
  },
  powerButtonOn: {
    backgroundColor: colors.danger,
  },
  powerButtonOff: {
    backgroundColor: colors.success,
  },
  disabledButton: {
    opacity: 0.45,
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
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
});
