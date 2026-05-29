import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Feather } from '@expo/vector-icons';

export function ProfileScreen() {
  const { user, logout, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Modal active states
  const [activeModal, setActiveModal] = useState<'notifications' | 'security' | 'preferences' | null>(null);

  // 1. Notifications State
  const [smokeAlerts, setSmokeAlerts] = useState(true);
  const [disconnectWarnings, setDisconnectWarnings] = useState(true);
  const [baselineLogs, setBaselineLogs] = useState(false);

  // 2. Security (App Authority / Permissions) State
  const [cameraPermission, setCameraPermission] = useState(true);
  const [networkPermission, setNetworkPermission] = useState(true);
  const [notificationsPermission, setNotificationsPermission] = useState(true);
  const [storagePermission, setStoragePermission] = useState(false);

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

  const displayName = user?.fullName ?? user?.name ?? 'Secure User';

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1e2d" />
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff6b6b"
            colors={['#ff6b6b']}
            progressBackgroundColor="#16162a"
          />
        }
      >
        {/* Figma Header Card with User Info */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{user?.email ?? 'operator@gmail.com'}</Text>
        </View>

        {/* Figma Style Details Section - Account Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>ACCOUNT INFORMATION</Text>
          
          <View style={styles.infoCell}>
            <View style={styles.cellIconContainer}>
              <Feather name="mail" size={18} color="#a0aec0" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Email</Text>
              <Text style={styles.cellValue}>{user?.email ?? 'Not Available'}</Text>
            </View>
          </View>

          <View style={[styles.infoCell, styles.infoCellLast]}>
            <View style={styles.cellIconContainer}>
              <Feather name="phone" size={18} color="#a0aec0" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Phone</Text>
              <Text style={styles.cellValue}>+84 901234567</Text>
            </View>
          </View>
        </View>

        {/* Figma Style Details Section - Settings */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>SETTINGS</Text>

          <TouchableOpacity
            style={styles.settingActionRow}
            onPress={() => setActiveModal('notifications')}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              <View style={[styles.cellIconContainer, { backgroundColor: '#f3f4f6' }]}>
                <Feather name="bell" size={18} color="#ef4444" />
              </View>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#a0aec0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingActionRow}
            onPress={() => setActiveModal('security')}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              <View style={[styles.cellIconContainer, { backgroundColor: '#f3f4f6' }]}>
                <Feather name="shield" size={18} color="#ef4444" />
              </View>
              <Text style={styles.settingLabel}>Security</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#a0aec0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingActionRow, styles.settingRowLast]}
            onPress={() => setActiveModal('preferences')}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              <View style={[styles.cellIconContainer, { backgroundColor: '#f3f4f6' }]}>
                <Feather name="settings" size={18} color="#ef4444" />
              </View>
              <Text style={styles.settingLabel}>Preferences</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#a0aec0" />
          </TouchableOpacity>
        </View>

        {/* Figma Styled Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={18} color="#ef4444" style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.figmaVersionText}>Smart Fire Alert v1.0.0</Text>
      </ScrollView>

      {/* ── MODAL 1: NOTIFICATIONS ───────────────────────────────────────── */}
      <Modal
        visible={activeModal === 'notifications'}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={[styles.modalSafeContainer, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
          {/* Modal Header */}
          <View style={styles.modalHeaderBar}>
            <TouchableOpacity style={styles.modalBackBtn} onPress={() => setActiveModal(null)} activeOpacity={0.7}>
              <Feather name="chevron-left" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Notification Settings</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Configure how and when you receive smart fire alert push notifications on your device.
            </Text>

            <View style={styles.modalCardContainer}>
              {/* Smoke Alerts Option */}
              <View style={styles.switchOptionRow}>
                <View style={styles.switchOptionLeft}>
                  <Text style={styles.switchOptionTitle}>Real-time Smoke Alerts</Text>
                  <Text style={styles.switchOptionDesc}>
                    Receive instant notifications when smoke density exceeds threshold levels.
                  </Text>
                </View>
                <Switch
                  value={smokeAlerts}
                  onValueChange={setSmokeAlerts}
                  trackColor={{ true: '#22c55e', false: '#d1d5db' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Hardware Disconnect Warnings */}
              <View style={styles.switchOptionRow}>
                <View style={styles.switchOptionLeft}>
                  <Text style={styles.switchOptionTitle}>Hardware Disconnect Warnings</Text>
                  <Text style={styles.switchOptionDesc}>
                    Get notified immediately when an ESP32 hardware node falls offline.
                  </Text>
                </View>
                <Switch
                  value={disconnectWarnings}
                  onValueChange={setDisconnectWarnings}
                  trackColor={{ true: '#22c55e', false: '#d1d5db' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* System Baseline Logs */}
              <View style={[styles.switchOptionRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <View style={styles.switchOptionLeft}>
                  <Text style={styles.switchOptionTitle}>System Baseline Logs</Text>
                  <Text style={styles.switchOptionDesc}>
                    Receive daily baseline calibration and maintenance check reports.
                  </Text>
                </View>
                <Switch
                  value={baselineLogs}
                  onValueChange={setBaselineLogs}
                  trackColor={{ true: '#22c55e', false: '#d1d5db' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ── MODAL 2: SECURITY (PERMISSIONS DASHBOARD) ─────────────────────── */}
      <Modal
        visible={activeModal === 'security'}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={[styles.modalSafeContainer, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
          <View style={styles.modalHeaderBar}>
            <TouchableOpacity style={styles.modalBackBtn} onPress={() => setActiveModal(null)} activeOpacity={0.7}>
              <Feather name="chevron-left" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Security & Permissions</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Manage critical mobile system permissions required for MQTT communication and ESP32 gateway synchronisation.
            </Text>

            <View style={styles.modalCardContainer}>
              {/* Camera Access */}
              <View style={styles.switchOptionRow}>
                <View style={styles.switchOptionLeft}>
                  <View style={styles.permissionTitleRow}>
                    <Text style={styles.switchOptionTitle}>Camera Access</Text>
                    <View style={[styles.statusBadgeSim, cameraPermission ? styles.badgeAllowed : styles.badgeDenied]}>
                      <Text style={[styles.badgeTextSim, cameraPermission ? styles.textAllowed : styles.textDenied]}>
                        {cameraPermission ? 'Allowed' : 'Denied'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.switchOptionDesc}>
                    Required for scanning ESP32 hardware node QR codes during setup.
                  </Text>
                </View>
                <Switch
                  value={cameraPermission}
                  onValueChange={setCameraPermission}
                  trackColor={{ true: '#22c55e', false: '#d1d5db' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Local Network */}
              <View style={styles.switchOptionRow}>
                <View style={styles.switchOptionLeft}>
                  <View style={styles.permissionTitleRow}>
                    <Text style={styles.switchOptionTitle}>Local Network Discovery</Text>
                    <View style={[styles.statusBadgeSim, networkPermission ? styles.badgeAllowed : styles.badgeDenied]}>
                      <Text style={[styles.badgeTextSim, networkPermission ? styles.textAllowed : styles.textDenied]}>
                        {networkPermission ? 'Allowed' : 'Denied'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.switchOptionDesc}>
                    Enables connection to local MQTT gateways and gateway sync.
                  </Text>
                </View>
                <Switch
                  value={networkPermission}
                  onValueChange={setNetworkPermission}
                  trackColor={{ true: '#22c55e', false: '#d1d5db' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Notification Center */}
              <View style={styles.switchOptionRow}>
                <View style={styles.switchOptionLeft}>
                  <View style={styles.permissionTitleRow}>
                    <Text style={styles.switchOptionTitle}>Notification Center</Text>
                    <View style={[styles.statusBadgeSim, notificationsPermission ? styles.badgeAllowed : styles.badgeDenied]}>
                      <Text style={[styles.badgeTextSim, notificationsPermission ? styles.textAllowed : styles.textDenied]}>
                        {notificationsPermission ? 'Allowed' : 'Denied'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.switchOptionDesc}>
                    Used to send critical fire and smoke warnings to your device.
                  </Text>
                </View>
                <Switch
                  value={notificationsPermission}
                  onValueChange={setNotificationsPermission}
                  trackColor={{ true: '#22c55e', false: '#d1d5db' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Storage Access */}
              <View style={[styles.switchOptionRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <View style={styles.switchOptionLeft}>
                  <View style={styles.permissionTitleRow}>
                    <Text style={styles.switchOptionTitle}>Storage/Folder Access</Text>
                    <View style={[styles.statusBadgeSim, storagePermission ? styles.badgeAllowed : styles.badgeDenied]}>
                      <Text style={[styles.badgeTextSim, storagePermission ? styles.textAllowed : styles.textDenied]}>
                        {storagePermission ? 'Allowed' : 'Denied'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.switchOptionDesc}>
                    Required to export historical alert logs and telemetry data.
                  </Text>
                </View>
                <Switch
                  value={storagePermission}
                  onValueChange={setStoragePermission}
                  trackColor={{ true: '#22c55e', false: '#d1d5db' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ── MODAL 3: PREFERENCES & COMPLIANCE ─────────────────────────────── */}
      <Modal
        visible={activeModal === 'preferences'}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={[styles.modalSafeContainer, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
          <View style={styles.modalHeaderBar}>
            <TouchableOpacity style={styles.modalBackBtn} onPress={() => setActiveModal(null)} activeOpacity={0.7}>
              <Feather name="chevron-left" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Preferences & Standards</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Vietnamese government legal compliance and smart hardware monitoring dependency guidelines.
            </Text>

            {/* Compliance Docs Box */}
            <View style={styles.complianceDocCard}>
              {/* Badge TCVN */}
              <View style={styles.tcvnBadge}>
                <Text style={styles.tcvnBadgeText}>GOVERNMENT STANDARD</Text>
              </View>
              
              <Text style={styles.tcvnTitle}>
                TCVN 3890:2023 - Phòng cháy chữa cháy - Phương tiện, hệ thống báo cháy cho nhà và công trình
              </Text>

              <View style={styles.docDivider} />

              {/* Regulatory Sections */}
              <View style={styles.docSection}>
                <Text style={styles.docSectionHeader}>1. PHẠM VI BẮT BUỘC TRANG BỊ</Text>
                <Text style={styles.docBodyText}>
                  Quy chuẩn quốc gia bắt buộc lắp đặt hệ thống báo cháy tự động đối với các công trình công cộng, cơ sở kinh doanh dịch vụ, chung cư cao tầng từ 5 tầng trở lên hoặc có tổng khối tích từ 5.000 m³ trở lên. Thiết bị cảm biến nhiệt, khói và lửa phải được bố trí phủ kín diện tích mặt sàn.
                </Text>
              </View>

              <View style={styles.docSection}>
                <Text style={styles.docSectionHeader}>2. TẦN SUẤT ĐỒNG BỘ (SYNC INTERVALS)</Text>
                <Text style={styles.docBodyText}>
                  Để đảm bảo độ tin cậy và ngăn ngừa rủi ro mất kết nối gateway, tần suất truyền phát và đồng bộ hóa trạng thái phần cứng (telemetry logs) từ thiết bị đầu cuối ESP32 lên hệ thống máy chủ Cloud phải hoạt động liên tục với chu kỳ định kỳ tối đa 30 giây/lần.
                </Text>
              </View>

              <View style={[styles.docSection, { marginBottom: 0 }]}>
                <Text style={styles.docSectionHeader}>3. TIÊU CHUẨN ĐỘ TRỄ TRUYỀN PHÁT (LATENCY LIMIT)</Text>
                <Text style={styles.docBodyText}>
                  Độ trễ truyền phát tín hiệu cảnh báo khẩn cấp từ thời điểm cảm biến phát hiện khói/lửa vượt ngưỡng kích hoạt đến lúc truyền thông tin cảnh báo lên máy chủ trung tâm và ứng dụng của vận hành viên không được phép vượt quá 10 giây (tiêu chuẩn độ trễ vàng quốc gia).
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#fca5a5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#ef4444',
    fontSize: 32,
    fontFamily: 'Inter-ExtraBold',
  },
  userName: {
    color: '#111827',
    fontSize: 22,
    fontFamily: 'Inter-ExtraBold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    color: '#ef4444',
    fontSize: 10,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 1.5,
    marginBottom: 16,
    paddingLeft: 2,
  },
  infoCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb88',
  },
  infoCellLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  cellIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cellContent: {
    flex: 1,
  },
  cellLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  cellValue: {
    color: '#111827',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  settingActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb88',
  },
  settingRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: '#111827',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    width: '100%',
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  figmaVersionText: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },

  // ── MODAL UI SPECIFIC STYLES ───────────────────────────────────────────
  modalSafeContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  modalHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  modalBackBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    color: '#111827',
    fontSize: 17,
    fontFamily: 'Inter-ExtraBold',
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  modalCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  switchOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 16,
  },
  switchOptionLeft: {
    flex: 1,
  },
  switchOptionTitle: {
    color: '#111827',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  switchOptionDesc: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    lineHeight: 16,
  },

  // Sim Permission Dashboard Specifics
  permissionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusBadgeSim: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeAllowed: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  badgeDenied: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  badgeTextSim: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  textAllowed: {
    color: '#15803d',
  },
  textDenied: {
    color: '#b91c1c',
  },

  // Compliance Document Style Specifics
  complianceDocCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tcvnBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 12,
  },
  tcvnBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter-ExtraBold',
    color: '#d97706',
    letterSpacing: 0.5,
  },
  tcvnTitle: {
    color: '#111827',
    fontSize: 17,
    fontFamily: 'Inter-ExtraBold',
    lineHeight: 24,
    marginBottom: 16,
  },
  docDivider: {
    height: 1.5,
    backgroundColor: '#f3f4f6',
    width: '100%',
    marginBottom: 16,
  },
  docSection: {
    marginBottom: 16,
  },
  docSectionHeader: {
    color: '#ef4444',
    fontSize: 11,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  docBodyText: {
    color: '#374151',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    lineHeight: 20,
    textAlign: 'justify',
  },
});
