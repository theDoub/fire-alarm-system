import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertTriangle, Bell, BellOff, ChevronRight, Settings, Shield, Wifi } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/common/Screen';
import { mockAlerts, mockDevices, mockUser } from '@/data/mockData';
import { colors, radius } from '@/theme/colors';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';
import { formatDateTime, severityColor, severitySoftColor } from '@/utils/formatters';

type TabNav = BottomTabNavigationProp<MainTabParamList>;
type RootNav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const tabNavigation = useNavigation<TabNav>();
  const rootNavigation = useNavigation<RootNav>();
  const activeAlerts = mockAlerts.filter((alert) => alert.status === 'ACTIVE');
  const highAlerts = activeAlerts.filter((alert) => alert.severity === 'HIGH');
  const onlineDevices = mockDevices.filter((device) => device.status === 'ONLINE');
  const mutedDevices = mockDevices.filter((device) => device.isMuted);
  const latestAlert = activeAlerts[0];

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.kicker}>Welcome back,</Text>
            <Text style={styles.userName}>{mockUser.name}</Text>
          </View>
          <TouchableOpacity style={styles.heroIconButton} onPress={() => tabNavigation.navigate('Profile')} activeOpacity={0.75}>
            <Settings size={21} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <Shield size={34} color={highAlerts.length ? '#fecaca' : '#bbf7d0'} />
          <View style={styles.statusCopy}>
            <Text style={styles.statusLabel}>Safety Status</Text>
            <Text style={styles.statusTitle}>{highAlerts.length ? 'Alert Active' : 'All Clear'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard icon={<AlertTriangle size={21} color={colors.danger} />} value={activeAlerts.length} label="Active Alerts" tone={colors.dangerSoft} />
        <StatCard icon={<Wifi size={21} color={colors.successDark} />} value={onlineDevices.length} label="Online" tone={colors.successSoft} />
        <StatCard icon={<BellOff size={21} color={colors.warningDark} />} value={mutedDevices.length} label="Muted" tone={colors.warningSoft} />
      </View>

      {latestAlert ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Alert</Text>
            <TouchableOpacity onPress={() => tabNavigation.navigate('Alerts')} activeOpacity={0.75}>
              <Text style={styles.link}>View All</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.alertCard, { borderLeftColor: severityColor(latestAlert.severity) }]}
            onPress={() => rootNavigation.navigate('AlertInfo', { alertId: latestAlert.id })}
            activeOpacity={0.82}
          >
            <View style={styles.alertHeader}>
              <View>
                <Text style={[styles.badge, { backgroundColor: severitySoftColor(latestAlert.severity), color: severityColor(latestAlert.severity) }]}>
                  {latestAlert.severity}
                </Text>
                <Text style={styles.cardTitle}>{latestAlert.deviceName}</Text>
                <Text style={styles.meta}>{formatDateTime(latestAlert.triggeredAt)}</Text>
              </View>
              <AlertTriangle size={26} color={severityColor(latestAlert.severity)} />
            </View>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ActionRow
          icon={<Bell size={21} color={colors.danger} />}
          tone={colors.dangerSoft}
          label="View All Alerts"
          onPress={() => tabNavigation.navigate('Alerts')}
        />
        <ActionRow
          icon={<Wifi size={21} color={colors.info} />}
          tone={colors.infoSoft}
          label="Manage Devices"
          onPress={() => tabNavigation.navigate('Devices')}
        />
      </View>
    </Screen>
  );
}

function StatCard({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: tone }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionRow({ icon, tone, label, onPress }: { icon: React.ReactNode; tone: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.78}>
      <View style={styles.actionLeft}>
        <View style={[styles.actionIcon, { backgroundColor: tone }]}>{icon}</View>
        <Text style={styles.actionLabel}>{label}</Text>
      </View>
      <ChevronRight size={20} color="#94a3b8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 0,
    paddingBottom: 112,
  },
  hero: {
    backgroundColor: colors.danger,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 34,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  kicker: {
    color: '#fee2e2',
    fontSize: 14,
  },
  userName: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 2,
  },
  heroIconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 18,
  },
  statusCopy: {
    flex: 1,
  },
  statusLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  statusTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -22,
    paddingHorizontal: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    elevation: 2,
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 15,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  statIcon: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    marginBottom: 8,
    width: 40,
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  link: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
  alertCard: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderRadius: radius.lg,
    elevation: 1,
    padding: 16,
  },
  alertHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 8,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  actionRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 14,
  },
  actionLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  actionIcon: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  actionLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
});

