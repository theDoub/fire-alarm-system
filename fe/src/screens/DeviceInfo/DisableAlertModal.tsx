import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface DisableAlertModalProps {
  visible: boolean;
  deviceId: string;
  deviceName: string;
  onClose: () => void;
  onConfirm: (durationMinutes: number) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DisableAlertModal({
  visible,
  deviceId,
  deviceName,
  onClose,
  onConfirm,
}: DisableAlertModalProps) {
  const [duration, setDuration] = useState<number>(15);

  const handleConfirm = () => {
    onConfirm(duration);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Drag Handle or Pill accent */}
              <View style={styles.dragHandle} />

              {/* Title & Close */}
              <View style={styles.header}>
                <Text style={styles.title}>Disable Alerts</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                  <Feather name="x" size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Metadata */}
              <View style={styles.metaContainer}>
                <Text style={styles.metaLabel}>
                  Device:{' '}
                  <Text style={styles.metaValue}>{deviceName}</Text>
                </Text>
                <Text style={styles.metaSubLabel}>Device ID: {deviceId}</Text>
              </View>

              {/* Duration Options */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SELECT DURATION</Text>
                <View style={styles.durationGrid}>
                  {[5, 15, 30, 60].map((min) => (
                    <TouchableOpacity
                      key={min}
                      style={[
                        styles.durationBtn,
                        duration === min && styles.durationBtnActive,
                      ]}
                      onPress={() => setDuration(min)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.durationBtnText,
                          duration === min && styles.durationBtnTextActive,
                        ]}
                      >
                        {min} {min === 60 ? 'hour' : 'min'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Warning Box */}
              <View style={styles.warningBox}>
                <Feather name="alert-triangle" size={18} color="#ea580c" style={styles.warningIcon} />
                <Text style={styles.warningText}>
                  Alerts from this device will be muted during the selected time. You will not receive any safety notifications.
                </Text>
              </View>

              {/* Footer Actions */}
              <View style={styles.footerRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
                  <Text style={styles.confirmBtnText}>Confirm Disable</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-ExtraBold',
    color: '#111827',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    padding: 16,
    marginBottom: 20,
  },
  metaLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginBottom: 4,
  },
  metaValue: {
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  metaSubLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#6b7280',
    letterSpacing: 1.2,
    marginBottom: 12,
    paddingLeft: 2,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  durationBtn: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  durationBtnActive: {
    backgroundColor: '#ff9f0a',
    borderColor: '#ff9f0a',
    shadowColor: '#ff9f0a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  durationBtnText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  durationBtnTextActive: {
    color: '#ffffff',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ffedd5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#c2410c',
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#ea580c',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmBtnText: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});
