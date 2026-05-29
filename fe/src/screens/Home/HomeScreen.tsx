import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useAlerts } from '@/hooks/useAlerts';
import { useDevices } from '@/hooks/useDevices';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { alerts, isLoading: isAlertsLoading, refetch: refetchAlerts } = useAlerts();
  const { devices, isLoading: isDevicesLoading, refetch: refetchDevices } = useDevices();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetchAlerts();
      refetchDevices();
    }, [refetchAlerts, refetchDevices])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchAlerts(), refetchDevices()]);
    setRefreshing(false);
  };

  // Grid Statistics calculations
  const activeAlerts = alerts ? alerts.filter((a) => a.status === 'ACTIVE') : [];
  const highAlerts = activeAlerts.filter((a) => a.severity === 'HIGH');
  const onlineDevices = devices ? devices.filter((d) => d.status === 'ONLINE') : [];
  const mutedDevicesCount = devices ? devices.filter((d) => d.isMuted).length : 0;
  
  const safetyColor = highAlerts.length > 0 ? '#e94560' : '#4caf50';

  const latestAlert = activeAlerts.length > 0 ? activeAlerts[0] : null;

  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Figma Design System Header Gradient */}
        <LinearGradient
          colors={['#ef4444', '#ea580c']}
          style={[styles.headerGradient, { paddingTop: insets.top > 0 ? insets.top + 16 : 32 }]}
        >
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeLeft}>
              <Text style={styles.welcomeSub}>Welcome back,</Text>
              <Text style={styles.welcomeTitle}>{user?.fullName ?? user?.name ?? 'Secure Operator'}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsBadge}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' } as any)}
              activeOpacity={0.8}
            >
              <Feather name="settings" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Figma Style Blurred Translucent Safety Status Card */}
          <View style={styles.safetyCardTranslucent}>
            <View style={[styles.safetyIconCircleTranslucent, { backgroundColor: highAlerts.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(76, 175, 80, 0.2)' }]}>
              <Feather
                name={highAlerts.length > 0 ? 'alert-triangle' : 'shield'}
                size={22}
                color={highAlerts.length > 0 ? '#ffd2d9' : '#ffffff'}
              />
            </View>
            <View style={styles.safetyInfo}>
              <Text style={styles.safetyLabelTranslucent}>SAFETY STATUS</Text>
              <Text style={styles.safetyValueTranslucent}>
                {highAlerts.length > 0 ? 'Alert Active' : 'All Clear'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content Underneath Header Gradient (Overlaying -mt-6 style) */}
        <View style={styles.bodyContent}>
          {/* Dynamic Three-Grid Counts Indicator */}
          <View style={styles.gridContainer}>
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Alerts' } as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: '#fee2e2' }]}>
                <Feather name="alert-triangle" size={18} color="#ef4444" />
              </View>
              <Text style={styles.gridCount}>{activeAlerts.length}</Text>
              <Text style={styles.gridLabel}>Active Alerts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Devices' } as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: '#dcfce7' }]}>
                <Feather name="wifi" size={18} color="#22c55e" />
              </View>
              <Text style={styles.gridCount}>{onlineDevices.length}</Text>
              <Text style={styles.gridLabel}>Online</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Devices' } as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: '#ffedd5' }]}>
                <Feather name="bell-off" size={18} color="#ea580c" />
              </View>
              <Text style={styles.gridCount}>{mutedDevicesCount}</Text>
              <Text style={styles.gridLabel}>Disabled</Text>
            </TouchableOpacity>
          </View>

          {/* Latest Active Alert Incident Feed */}
          {latestAlert && (
            <View style={styles.latestAlertSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>LATEST INCIDENT</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Alerts' } as any)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllBtn}>View All</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.incidentCard,
                  { borderLeftColor: latestAlert.severity === 'HIGH' ? '#ef4444' : latestAlert.severity === 'MEDIUM' ? '#ea580c' : '#22c55e' }
                ]}
                onPress={() => navigation.navigate('AlertInfo', { alertId: latestAlert.id, alert: latestAlert })}
                activeOpacity={0.85}
              >
                <View style={styles.incidentBody}>
                  <View style={styles.incidentMeta}>
                    <Text style={styles.incidentTitle} numberOfLines={1}>{latestAlert.deviceName}</Text>
                    <Text style={styles.incidentLocation} numberOfLines={1}>
                      <Feather name="map-pin" size={11} color="#646e82" /> {latestAlert.deviceLocation}
                    </Text>
                  </View>
                  <Feather
                    name="alert-triangle"
                    size={20}
                    color={latestAlert.severity === 'HIGH' ? '#ef4444' : latestAlert.severity === 'MEDIUM' ? '#ea580c' : '#22c55e'}
                    style={styles.incidentIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Operations Nav Links */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Alerts' } as any)}
              activeOpacity={0.8}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIconCircle, { backgroundColor: '#fee2e2' }]}>
                  <Feather name="bell" size={18} color="#ef4444" />
                </View>
                <Text style={styles.actionText}>View All Active Alerts</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Devices' } as any)}
              activeOpacity={0.8}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIconCircle, { backgroundColor: '#dbeafe' }]}>
                  <Feather name="cpu" size={18} color="#3b82f6" />
                </View>
                <Text style={styles.actionText}>Manage Hardware Nodes</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  welcomeLeft: {
    flex: 1,
  },
  welcomeSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'Inter-ExtraBold',
  },
  settingsBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyCardTranslucent: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyIconCircleTranslucent: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  safetyInfo: {
    flex: 1,
  },
  safetyLabelTranslucent: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  safetyValueTranslucent: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter-ExtraBold',
  },
  bodyContent: {
    paddingHorizontal: 20,
    marginTop: -24,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  gridCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '31%',
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridCount: {
    color: '#111827',
    fontSize: 22,
    fontFamily: 'Inter-ExtraBold',
  },
  gridLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  latestAlertSection: {
    marginBottom: 28,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ef4444',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1.5,
    marginBottom: 0,
    paddingLeft: 2,
  },
  viewAllBtn: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  incidentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  incidentBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incidentMeta: {
    flex: 1,
    marginRight: 12,
  },
  incidentTitle: {
    color: '#111827',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  incidentLocation: {
    color: '#6b7280',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  incidentIcon: {
    marginLeft: 4,
  },
  actionsSection: {
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionText: {
    color: '#111827',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
});
