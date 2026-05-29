/**
 * screens/Profile/ProfileScreen.tsx
 * Mockup: profile-info-page.png
 * Premium UI/UX User Profile screen with dynamic pull-to-refresh telemetry.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Icon from 'react-native-vector-icons/Feather';

export function ProfileScreen() {
  const { user, logout, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Failed to update profile telemetry.';
      Alert.alert('Telemetry Update Failed', msg);
    } finally {
      setRefreshing(false);
    }
  }, [refreshProfile]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end your active security session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  // Compute initials for the avatar badge
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isSystemAdmin = user?.role?.toUpperCase() === 'ADMIN';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e94560"
            colors={['#e94560']}
            progressBackgroundColor="#16162a"
          />
        }
      >
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatarContainer,
              isSystemAdmin ? styles.avatarAdminBorder : styles.avatarUserBorder,
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>

          <Text style={styles.userName}>{user?.name ?? 'Secure User'}</Text>
          <View
            style={[
              styles.roleBadge,
              isSystemAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser,
            ]}
          >
            <Icon
              name={isSystemAdmin ? 'shield' : 'user'}
              size={12}
              color={isSystemAdmin ? '#ffc107' : '#4caf50'}
              style={styles.roleBadgeIcon}
            />
            <Text
              style={[
                styles.roleBadgeText,
                isSystemAdmin ? styles.roleBadgeTextAdmin : styles.roleBadgeTextUser,
              ]}
            >
              {user?.role ?? 'USER'}
            </Text>
          </View>
        </View>

        {/* Structured Profile Metadata List */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>ACCOUNT TELEMETRY</Text>

          {/* Full Name Cell */}
          <View style={styles.infoCell}>
            <View style={styles.cellIconContainer}>
              <Icon name="user" size={18} color="#e94560" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Full Name</Text>
              <Text style={styles.cellValue}>{user?.name ?? 'Not Available'}</Text>
            </View>
          </View>

          {/* Email Cell */}
          <View style={styles.infoCell}>
            <View style={styles.cellIconContainer}>
              <Icon name="mail" size={18} color="#e94560" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Registered Email</Text>
              <Text style={styles.cellValue}>{user?.email ?? 'Not Available'}</Text>
            </View>
          </View>

          {/* Security Role Cell */}
          <View style={styles.infoCell}>
            <View style={styles.cellIconContainer}>
              <Icon name="shield" size={18} color="#e94560" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Security Privilege</Text>
              <Text style={styles.cellValue}>{user?.role ?? 'Standard Operator'}</Text>
            </View>
          </View>

          {/* System Health / Status Cell */}
          <View style={[styles.infoCell, styles.infoCellLast]}>
            <View style={styles.cellIconContainer}>
              <Icon name="activity" size={18} color="#4caf50" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Connection Status</Text>
              <View style={styles.statusValueRow}>
                <Text style={styles.statusTextActive}>ACTIVE SESSION</Text>
                <View style={styles.statusPulseDot} />
              </View>
            </View>
          </View>
        </View>

        {/* Branded Action Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Icon name="log-out" size={18} color="#e94560" style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>End Active Session</Text>
        </TouchableOpacity>

        {/* Sync Indicator Info */}
        <Text style={styles.pullToRefreshInfo}>
          <Icon name="arrow-down" size={10} color="#555577" /> Pull down to fetch fresh account data
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#16162a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242445',
    width: '100%',
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1a1a36',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  avatarAdminBorder: {
    borderColor: '#ffc107',
  },
  avatarUserBorder: {
    borderColor: '#e94560',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleBadgeAdmin: {
    backgroundColor: '#ffc10714',
    borderColor: '#ffc10733',
  },
  roleBadgeUser: {
    backgroundColor: '#4caf5014',
    borderColor: '#4caf5033',
  },
  roleBadgeIcon: {
    marginRight: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  roleBadgeTextAdmin: {
    color: '#ffc107',
  },
  roleBadgeTextUser: {
    color: '#4caf50',
  },
  infoSection: {
    backgroundColor: '#16162a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242445',
    width: '100%',
    padding: 20,
    marginBottom: 28,
  },
  sectionHeader: {
    color: '#e94560',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 16,
    paddingLeft: 4,
  },
  infoCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#242445',
  },
  infoCellLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  cellIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1f1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cellContent: {
    flex: 1,
  },
  cellLabel: {
    color: '#8f94a5',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  cellValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  statusValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextActive: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
    marginLeft: 8,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e94560',
    width: '100%',
    paddingVertical: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#e94560',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  pullToRefreshInfo: {
    color: '#555577',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
});
