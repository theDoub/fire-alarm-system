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
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAlerts } from '@/hooks/useAlerts';
import { AlertBadge } from '@/components/common/AlertBadge';
import type { AlertSeverity, Alert } from '@/types/alert';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import Icon from 'react-native-vector-icons/Feather';

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
    icon: 'info',
  },
  MEDIUM: {
    color: '#ffc107',
    bgColor: '#211d14',
    borderColor: '#ffc10755',
    icon: 'alert-triangle',
  },
  HIGH: {
    color: '#e94560',
    bgColor: '#261420',
    borderColor: '#e9456077',
    icon: 'zap',
  },
};

export function AlertsScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState(0);
  const { alerts, isLoading, error, refetch, setFilter } = useAlerts();
  const [refreshing, setRefreshing] = useState(false);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setFilter(TABS[index].severity);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderAlertCard = ({ item }: { item: Alert }) => {
    const matrix = THREAT_MATRIX[item.severity];
    const isHigh = item.severity === 'HIGH';

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: matrix.bgColor,
            borderColor: matrix.color + '44',
          },
          isHigh && styles.cardHighAlert,
        ]}
        onPress={() => navigation.navigate('AlertInfo', { alertId: item.id })}
        activeOpacity={0.85}
      >
        {/* Left Severity Accent Bar */}
        <View style={[styles.severityBar, { backgroundColor: matrix.color }]} />

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={styles.deviceRow}>
              <Icon name={matrix.icon} size={15} color={matrix.color} style={styles.cardHeaderIcon} />
              <Text style={styles.deviceName} numberOfLines={1}>{item.deviceName}</Text>
            </View>
            <AlertBadge severity={item.severity} size="sm" />
          </View>

          <Text style={styles.location} numberOfLines={1}>
            <Icon name="map-pin" size={11} color="#646e82" /> {item.deviceLocation}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.time}>
              <Icon name="clock" size={11} color="#555577" /> {new Date(item.triggeredAt).toLocaleString()}
            </Text>
            <View style={styles.actionLinkRow}>
              <Text style={[styles.actionLinkText, { color: matrix.color }]}>Inspect Threat</Text>
              <Icon name="chevron-right" size={14} color={matrix.color} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Icon name="shield" size={48} color="#4caf50" />
          <Icon name="check" size={20} color="#0f0f1a" style={styles.emptyCheckBadge} />
        </View>
        <Text style={styles.emptyTitle}>Secure Operations</Text>
        <Text style={styles.emptySubtitle}>
          No active fire or environmental hazard alerts detected. All monitoring sensors report normal thresholds.
        </Text>
        <TouchableOpacity style={styles.emptyRefreshBtn} onPress={refetch} activeOpacity={0.8}>
          <Icon name="rotate-cw" size={14} color="#ffffff" style={styles.refreshBtnIcon} />
          <Text style={styles.emptyRefreshText}>Refresh Sensors</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <Icon name="wifi-off" size={40} color="#ff6b6b" />
            <Text style={styles.errorTitle}>Telemetry Sync Broken</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <TouchableOpacity style={styles.errorRetryBtn} onPress={refetch} activeOpacity={0.8}>
              <Text style={styles.errorRetryText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={(item) => item.id}
            renderItem={renderAlertCard}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  tabBarContainer: {
    backgroundColor: '#16162a',
    borderBottomWidth: 1,
    borderBottomColor: '#242445',
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
    backgroundColor: '#1f1f3a',
    borderWidth: 1,
    borderColor: '#242445',
  },
  tabActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  tabText: {
    color: '#8f94a5',
    fontWeight: '700',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#ffffff',
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHighAlert: {
    borderWidth: 1.5,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
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
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
  },
  location: {
    color: '#8f94a5',
    fontSize: 13,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#24244533',
    paddingTop: 10,
  },
  time: {
    color: '#555577',
    fontSize: 11,
    fontWeight: '500',
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loaderText: {
    color: '#8f94a5',
    marginTop: 12,
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  errorSubtitle: {
    color: '#8f94a5',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  errorRetryBtn: {
    backgroundColor: '#1a1a2e',
    borderColor: '#ff6b6b',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  errorRetryText: {
    color: '#ff6b6b',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#12221b',
    borderWidth: 2,
    borderColor: '#4caf5033',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emptyCheckBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4caf50',
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
    fontWeight: '800',
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#8f94a5',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  refreshBtnIcon: {
    marginRight: 6,
  },
  emptyRefreshText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
});
