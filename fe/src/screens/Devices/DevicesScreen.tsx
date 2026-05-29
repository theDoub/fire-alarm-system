import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDevices } from '@/hooks/useDevices';
import { deviceService } from '@/api/deviceService';
import type { Device } from '@/types/device';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function DevicesScreen() {
  const navigation = useNavigation<Nav>();
  const { devices, isLoading, refetch } = useDevices();
  const insets = useSafeAreaInsets();
  
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleCookingMode = async (deviceId: string, currentMutedState: boolean) => {
    setTogglingId(deviceId);
    try {
      await deviceService.toggleCookingMode(deviceId, { enabled: !currentMutedState });
      await refetch();
      Alert.alert('Success', 'Node alert status updated successfully.');
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Failed to update alert state.';
      Alert.alert('Action Failed', msg);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteDevice = (deviceId: string, deviceName: string) => {
    Alert.alert(
      'Remove Device',
      `Remove "${deviceName}" from your network? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(deviceId);
            try {
              await deviceService.deleteDevice(deviceId);
              await refetch();
            } catch (e: any) {
              Alert.alert('Error', e?.message ?? 'Failed to remove device.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const renderDeviceCard = ({ item }: { item: Device }) => {
    const isOnline = item.status === 'ONLINE';
    const isToggling = togglingId === item.id;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => navigation.navigate('DeviceInfo', { deviceId: item.id })}
          activeOpacity={0.7}
        >
          <View style={styles.cardLeft}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={12} color="#8f94a5" style={styles.locIcon} />
              <Text style={styles.deviceLocation}>{item.location}</Text>
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.trashBtn}
              onPress={() => handleDeleteDevice(item.id, item.name)}
              disabled={deletingId === item.id}
              activeOpacity={0.7}
            >
              {deletingId === item.id ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <Feather name="trash-2" size={16} color="#ef4444" />
              )}
            </TouchableOpacity>
            <Feather name="chevron-right" size={18} color="#555577" />
          </View>
        </TouchableOpacity>

        {/* Figma Style Badges */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isOnline ? '#4caf501a' : '#5555771a', borderColor: isOnline ? '#4caf5033' : '#55557733' }
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4caf50' : '#8f94a5' }]} />
            <Text style={[styles.badgeText, { color: isOnline ? '#4caf50' : '#8f94a5' }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.isMuted ? '#ffc1071a' : '#2196f31a', borderColor: item.isMuted ? '#ffc10733' : '#2196f333' }
            ]}
          >
            <Text style={[styles.badgeText, { color: item.isMuted ? '#ffc107' : '#2196f3' }]}>
              {item.isMuted ? 'Muted' : 'Active'}
            </Text>
          </View>
        </View>

        {/* Dynamic primary trigger button (Mute / Unmute Cooking Mode) */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            item.isMuted ? styles.toggleBtnActive : styles.toggleBtnInactive,
            !isOnline && styles.btnDisabled
          ]}
          onPress={() => handleToggleCookingMode(item.id, item.isMuted)}
          disabled={!isOnline || isToggling}
          activeOpacity={0.8}
        >
          {isToggling ? (
            <ActivityIndicator color={item.isMuted ? '#121c18' : '#ffffff'} size="small" />
          ) : (
            <>
              <Feather name="bell-off" size={14} color={item.isMuted ? '#4caf50' : '#ffffff'} />
              <Text style={[styles.toggleBtnText, { color: item.isMuted ? '#4caf50' : '#ffffff' }]}>
                {item.isMuted ? 'Acknowledge & Reactivate' : 'Mute Sensor Warnings'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const onlineCount = devices ? devices.filter((d) => d.status === 'ONLINE').length : 0;
  const totalCount = devices ? devices.length : 0;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />

      {/* Header View */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Hardware Nodes</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddDevice')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#e94560', '#c0392b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtnGradient}
          >
            <Feather name="plus" size={14} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.addBtnText}>Add Device</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Figma Grid Count indicators */}
      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{onlineCount}</Text>
          <Text style={styles.statsLabel}>Online Nodes</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{totalCount}</Text>
          <Text style={styles.statsLabel}>Total Nodes</Text>
        </View>
      </View>

      {/* Main Devices FlatList */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff6b6b" />
          <Text style={styles.loaderText}>Syncing hardware telemetry...</Text>
        </View>
      ) : !devices || devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="cpu" size={44} color="#a0aec0" />
          </View>
          <Text style={styles.emptyTitle}>No Connected Hardware</Text>
          <Text style={styles.emptySubtitle}>
            Please boot your smart ESP32 sensor node and verify it is connected to the gateway server.
          </Text>
          <TouchableOpacity style={styles.emptyRefreshBtn} onPress={refetch} activeOpacity={0.8}>
            <Feather name="rotate-cw" size={14} color="#ffffff" style={styles.refreshBtnIcon} />
            <Text style={styles.emptyRefreshText}>Refresh Gateway</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderDeviceCard}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#111827',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  addBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  addBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '48%',
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsNumber: {
    color: '#111827',
    fontSize: 22,
    fontFamily: 'Inter-ExtraBold',
  },
  statsLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLeft: {
    flex: 1,
  },
  deviceName: {
    color: '#111827',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locIcon: {
    marginRight: 4,
  },
  deviceLocation: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 44,
    gap: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  toggleBtnInactive: {
    backgroundColor: '#ef4444',
  },
  toggleBtnText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trashBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fca5a5',
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: '#16162a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242445',
    marginHorizontal: 20,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#242445',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Inter-ExtraBold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#8f94a5',
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
