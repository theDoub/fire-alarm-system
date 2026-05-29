import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapPin, Plus, Power, Wifi, WifiOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AddDeviceModal } from '@/components/common/AddDeviceModal';
import { Header } from '@/components/common/Header';
import { Screen } from '@/components/common/Screen';
import { mockDevices } from '@/data/mockData';
import { colors, radius } from '@/theme/colors';
import type { CreateDevicePayload, Device } from '@/types/device';
import type { RootStackParamList } from '@/types/navigation';
import { formatDateTime } from '@/utils/formatters';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function DevicesScreen() {
  const navigation = useNavigation<Nav>();
  const [localDevices, setLocalDevices] = useState<Device[]>(mockDevices);
  const [poweredOffIds, setPoweredOffIds] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const devices = useMemo(
    () => localDevices.map((device) => ({ ...device, powerState: poweredOffIds.includes(device.id) ? 'off' : 'on' })),
    [localDevices, poweredOffIds],
  );
  const onlineCount = devices.filter((device) => device.status === 'ONLINE').length;

  const togglePower = (deviceId: string) => {
    setPoweredOffIds((current) => (
      current.includes(deviceId) ? current.filter((id) => id !== deviceId) : [...current, deviceId]
    ));
  };

  const addDevice = (payload: CreateDevicePayload) => {
    const now = new Date().toISOString();
    setLocalDevices((current) => [
      {
        id: `device-${Date.now()}`,
        name: payload.name,
        location: payload.location,
        macAddress: payload.macAddress,
        status: 'ONLINE',
        isMuted: false,
        lastSeenAt: now,
        createdAt: now,
      },
      ...current,
    ]);
  };

  return (
    <Screen>
      <Header
        title="Devices"
        subtitle="Manage connected ESP32 sensors"
        action={(
          <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)} activeOpacity={0.75}>
            <Plus size={22} color={colors.white} />
          </TouchableOpacity>
        )}
      />
      <View style={styles.summaryRow}>
        <SummaryCard value={onlineCount} label="Online" />
        <SummaryCard value={devices.length} label="Total Devices" />
      </View>

      {devices.map((device) => {
        const online = device.status === 'ONLINE';
        const poweredOn = device.powerState === 'on';
        return (
          <View key={device.id} style={styles.card}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DeviceInfo', { deviceId: device.id })}
              activeOpacity={0.82}
            >
              <View style={styles.cardTop}>
                <View style={styles.deviceCopy}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={styles.locationRow}>
                    <MapPin size={15} color={colors.textMuted} />
                    <Text style={styles.location}>{device.location}</Text>
                  </View>
                  <View style={styles.badgeRow}>
                    <View style={[styles.statusChip, online ? styles.onlineChip : styles.offlineChip]}>
                      {online ? <Wifi size={14} color={colors.successDark} /> : <WifiOff size={14} color={colors.slate} />}
                      <Text style={[styles.statusText, online ? styles.onlineText : styles.offlineText]}>
                        {online ? 'Online' : 'Offline'}
                      </Text>
                    </View>
                    <Text style={[styles.powerBadge, poweredOn ? styles.powerActive : styles.powerInactive]}>
                      {poweredOn ? 'Active' : 'Inactive'}
                    </Text>
                    {device.isMuted ? <Text style={styles.mutedBadge}>Muted</Text> : null}
                  </View>
                </View>
              </View>
              <Text style={styles.updated}>Last updated: {formatDateTime(device.lastSeenAt)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!online}
              style={[
                styles.powerButton,
                poweredOn ? styles.powerButtonOn : styles.powerButtonOff,
                !online && styles.disabledButton,
              ]}
              onPress={() => togglePower(device.id)}
              activeOpacity={0.75}
            >
              <Power size={18} color={poweredOn ? colors.white : colors.slate} />
              <Text style={[styles.powerButtonText, !poweredOn && styles.powerButtonTextOff]}>
                {poweredOn ? 'Turn Off' : 'Turn On'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <AddDeviceModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={addDevice}
      />
    </Screen>
  );
}

function SummaryCard({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flex: 1,
    padding: 17,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: 13,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
  },
  deviceCopy: {
    flex: 1,
  },
  deviceName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },
  location: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  statusChip: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  onlineChip: {
    backgroundColor: colors.successSoft,
  },
  offlineChip: {
    backgroundColor: colors.surfaceMuted,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  onlineText: {
    color: colors.successDark,
  },
  offlineText: {
    color: colors.slate,
  },
  powerBadge: {
    borderRadius: radius.pill,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  powerActive: {
    backgroundColor: colors.infoSoft,
    color: colors.info,
  },
  powerInactive: {
    backgroundColor: colors.surfaceMuted,
    color: colors.slate,
  },
  mutedBadge: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.pill,
    color: colors.warningDark,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  updated: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 12,
  },
  powerButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 13,
  },
  powerButtonOn: {
    backgroundColor: colors.success,
  },
  powerButtonOff: {
    backgroundColor: colors.surfaceMuted,
  },
  disabledButton: {
    opacity: 0.45,
  },
  powerButtonText: {
    color: colors.white,
    fontWeight: '900',
  },
  powerButtonTextOff: {
    color: colors.slate,
  },
});
