/**
 * screens/Alerts/AlertsScreen.tsx
 * Mockup: alerts-page-all / alerts-page-low / alerts-page-medium / alerts-page-high
 * Multi-tier incident center with 4 severity tabs and high fidelity threat indicators.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAlerts } from '@/hooks/useAlerts';
import { AlertBadge } from '@/components/common/AlertBadge';
import type { AlertSeverity, Alert } from '@/types/alert';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: Array<{ label: string; severity?: AlertSeverity }> = [
  { label: 'All Alerts' },
  { label: 'Low', severity: 'LOW' },
  { label: 'Medium', severity: 'MEDIUM' },
  { label: 'High', severity: 'HIGH' },
];

const THREAT_MATRIX = {
  LOW: {
    color: '#4caf50',
    bgColor: '#121c18',
    borderColor: '#4caf5033',
    icon: 'info' as const,
  },
  MEDIUM: {
    color: '#ffc107',
    bgColor: '#211d14',
    borderColor: '#ffc10755',
    icon: 'alert-triangle' as const,
  },
  HIGH: {
    color: '#e94560',
    bgColor: '#261420',
    borderColor: '#e9456077',
    icon: 'zap' as const,
  },
};

export function AlertsScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState(0);
  const { alerts, isLoading, error, refetch, setFilter } = useAlerts();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const MOCK_HISTORICAL_ALERTS: Alert[] = [
    {
      id: 'mock-high',
      deviceId: 'dev-high',
      deviceName: 'Kitchen Smoke Detector',
      deviceLocation: 'First Floor Kitchen',
      severity: 'HIGH',
      status: 'RESOLVED',
      sensorData: { smokeLevel: 92, temperature: 78 },
      triggeredAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 'mock-medium',
      deviceId: 'dev-med',
      deviceName: 'Living Room Sensor',
      deviceLocation: 'Ground Floor Living Room',
      severity: 'MEDIUM',
      status: 'RESOLVED',
      sensorData: { temperature: 54 },
      triggeredAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    },
    {
      id: 'mock-low',
      deviceId: 'dev-low',
      deviceName: 'Bedroom Co2 Monitor',
      deviceLocation: 'Second Floor Master Bedroom',
      severity: 'LOW',
      status: 'RESOLVED',
      sensorData: { co2Level: 420 },
      triggeredAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
    },
  ];

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setFilter(TABS[index].severity);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Determine active vs historical alerts
  const rawAlerts = alerts && alerts.length > 0 ? alerts : MOCK_HISTORICAL_ALERTS;
  
  // Filter based on active tab severity (All, Low, Medium, High)
  const severityFilter = TABS[activeTab].severity;
  const filteredAlerts = severityFilter
    ? rawAlerts.filter(a => a.severity === severityFilter)
    : rawAlerts;

  const activeAlertsCount = alerts ? alerts.filter(a => a.status === 'ACTIVE').length : 0;

  const renderAlertCard = ({ item }: { item: Alert }) => {
    const isHigh = item.severity === 'HIGH';
    const isMedium = item.severity === 'MEDIUM';
    const isLow = item.severity === 'LOW';

    let cardBg = '#16162a';
    let borderColor = '#242445';
    let titleText = item.deviceName;
    let titleColor = '#ffffff';
    let subtextColor = '#8f94a5';
    let iconName: keyof typeof Feather.glyphMap = 'info';
    let iconColor = '#4caf50';
    let timeColor = '#555577';
    let actionColor = '#4caf50';

    if (isLow) {
      cardBg = '#121c18';
      borderColor = '#4caf50';
      titleText = 'System Baseline Maintenance';
      titleColor = '#4caf50';
      iconName = 'info';
      iconColor = '#4caf50';
      actionColor = '#4caf50';
    } else if (isMedium) {
      cardBg = '#211d14';
      borderColor = '#ffc107';
      titleText = 'Elevated Thermal Telemetry';
      titleColor = '#ffc107';
      iconName = 'alert-triangle';
      iconColor = '#ffc107';
      actionColor = '#ffc107';
    } else if (isHigh) {
      cardBg = '#e94560';
      borderColor = '#e94560';
      titleText = 'CRITICAL EMERGENCY - FLAME DETECTED';
      titleColor = '#ffffff';
      subtextColor = '#ffd2d9';
      iconName = 'zap';
      iconColor = '#ffffff';
      timeColor = '#ffe3e7';
      actionColor = '#ffffff';
    }

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: borderColor,
            borderWidth: isHigh ? 0 : 1,
          },
          isHigh && styles.cardHighAlert,
        ]}
        onPress={() => navigation.navigate('AlertInfo', { alertId: item.id })}
        activeOpacity={0.85}
      >
        {/* Left Severity Accent Bar (Only for Low/Medium) */}
        {!isHigh && <View style={[styles.severityBar, { backgroundColor: iconColor }]} />}

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={styles.deviceRow}>
              <Feather name={iconName} size={15} color={iconColor} style={styles.cardHeaderIcon} />
              <Text style={[styles.deviceName, { color: titleColor, fontWeight: '800' }]} numberOfLines={1}>
                {titleText}
              </Text>
            </View>
            <AlertBadge severity={item.severity} size="sm" />
          </View>

          <Text style={[styles.location, { color: subtextColor }]} numberOfLines={1}>
            <Feather name="map-pin" size={11} color={isHigh ? '#ffd2d9' : '#646e82'} /> {item.deviceName} — {item.deviceLocation}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={[styles.time, { color: timeColor }]}>
              <Feather name="clock" size={11} color={isHigh ? '#ffe3e7' : '#555577'} /> {new Date(item.triggeredAt).toLocaleString()}
            </Text>
            <View style={styles.actionLinkRow}>
              <Text style={[styles.actionLinkText, { color: actionColor }]}>Inspect Threat</Text>
              <Feather name="chevron-right" size={14} color={actionColor} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => {
    if (activeAlertsCount === 0) {
      return (
        <View style={styles.headerShieldContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="shield" size={48} color="#4caf50" />
            <Feather name="check" size={20} color="#0f0f1a" style={styles.emptyCheckBadge} />
          </View>
          <Text style={styles.emptyTitle}>Secure Operations</Text>
          <Text style={styles.emptySubtitle}>
            No active fire or environmental hazard alerts detected. All monitoring sensors report normal thresholds.
          </Text>
          <TouchableOpacity style={styles.emptyRefreshBtn} onPress={refetch} activeOpacity={0.8}>
            <Feather name="rotate-cw" size={14} color="#ffffff" style={styles.refreshBtnIcon} />
            <Text style={styles.emptyRefreshText}>Refresh Sensors</Text>
          </TouchableOpacity>
          
          <Text style={styles.timelineHeader}>HISTORICAL INCIDENT LOGS</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      
      {/* Dynamic Multi-Tab Selector */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab.label}
              style={[
                styles.tab,
                activeTab === i && styles.tabActive,
              ]}
              onPress={() => handleTabChange(i)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === i && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main List Container */}
      <View style={styles.mainContent}>
        {isLoading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color="#e94560" size="large" />
            <Text style={styles.loaderText}>Querying threat indicators...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Feather name="wifi-off" size={40} color="#ff6b6b" />
            <Text style={styles.errorTitle}>Telemetry Sync Broken</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <TouchableOpacity style={styles.errorRetryBtn} onPress={refetch} activeOpacity={0.8}>
              <Text style={styles.errorRetryText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredAlerts}
            keyExtractor={(item) => item.id}
            renderItem={renderAlertCard}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderListHeader}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#e94560"
                colors={['#e94560']}
                progressBackgroundColor="#16162a"
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  tabBarContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
  },
  tabBarScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  tabText: {
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  mainContent: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  card: {
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHighAlert: {
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  severityBar: {
    width: 6,
  },
  cardBody: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cardHeaderIcon: {
    marginRight: 6,
  },
  deviceName: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Inter-Bold',
  },
  location: {
    fontSize: 13,
    marginBottom: 12,
    fontFamily: 'Inter-Medium',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb88',
    paddingTop: 10,
  },
  time: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginRight: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loaderText: {
    color: '#6b7280',
    marginTop: 12,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    color: '#111827',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 6,
  },
  errorSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  errorRetryBtn: {
    backgroundColor: '#ffffff',
    borderColor: '#ef4444',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  errorRetryText: {
    color: '#ef4444',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  headerShieldContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineHeader: {
    color: '#ef4444',
    fontSize: 11,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 1.5,
    marginTop: 32,
    alignSelf: 'flex-start',
    paddingLeft: 4,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  emptyCheckBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
    fontFamily: 'Inter-Bold',
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 20,
    fontFamily: 'Inter-ExtraBold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  emptyRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  refreshBtnIcon: {
    marginRight: 6,
  },
  emptyRefreshText: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
});
