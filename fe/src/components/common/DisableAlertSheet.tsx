import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { colors, radius } from '@/theme/colors';

interface DisableAlertSheetProps {
  visible: boolean;
  deviceId: string;
  deviceName: string;
  onClose: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

const OPTIONS = [5, 15, 30, 60];
const REASONS = ['Barbecue', 'Emergency training', 'Maintenance', 'Other'];

export function DisableAlertSheet({
  visible,
  deviceId,
  deviceName,
  onClose,
  title = 'Deactivate Sensor',
  description = 'Choose why and how long this sensor should ignore alerts.',
  confirmLabel = 'Confirm Deactivation',
}: DisableAlertSheetProps) {
  const [duration, setDuration] = useState(15);
  const [reason, setReason] = useState(REASONS[0]);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.75}>
            <X size={20} color={colors.slate} />
          </TouchableOpacity>
        </View>

        <View style={styles.deviceBox}>
          <Text style={styles.deviceName}>{deviceName}</Text>
          <Text style={styles.deviceId}>Device ID: {deviceId}</Text>
        </View>

        <Text style={styles.label}>Occasion</Text>
        <View style={styles.reasonWrap}>
          {REASONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.reasonChip, reason === item && styles.reasonChipActive]}
              onPress={() => setReason(item)}
              activeOpacity={0.75}
            >
              <Text style={[styles.reasonText, reason === item && styles.reasonTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Select Duration</Text>
        <View style={styles.optionGrid}>
          {OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, duration === option && styles.optionActive]}
              onPress={() => setDuration(option)}
              activeOpacity={0.75}
            >
              <Text style={[styles.optionText, duration === option && styles.optionTextActive]}>
                {option === 60 ? '1 hour' : `${option} min`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.warning}>
            <AlertTriangle size={20} color={colors.warningDark} />
          <Text style={styles.warningText}>
            Sensor alerts for {reason.toLowerCase()} will be paused only for the selected time. The device remains registered and visible.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.75}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={onClose} activeOpacity={0.75}>
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    bottom: 0,
    left: 0,
    padding: 20,
    position: 'absolute',
    right: 0,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  titleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  deviceBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginBottom: 18,
    padding: 14,
  },
  deviceName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  deviceId: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    color: colors.slate,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reasonWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 18,
  },
  reasonChip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  reasonChipActive: {
    backgroundColor: colors.slateDark,
  },
  reasonText: {
    color: colors.slate,
    fontSize: 12,
    fontWeight: '800',
  },
  reasonTextActive: {
    color: colors.white,
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flexBasis: '47%',
    paddingVertical: 13,
  },
  optionActive: {
    backgroundColor: colors.warning,
  },
  optionText: {
    color: colors.slate,
    fontWeight: '800',
  },
  optionTextActive: {
    color: colors.white,
  },
  warning: {
    alignItems: 'flex-start',
    backgroundColor: colors.warningSoft,
    borderColor: '#fed7aa',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    padding: 14,
  },
  warningText: {
    color: '#9a3412',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14,
  },
  cancelText: {
    color: colors.slate,
    fontWeight: '800',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.warning,
    borderRadius: radius.md,
    flex: 1,
    paddingVertical: 14,
  },
  confirmText: {
    color: colors.white,
    fontWeight: '800',
  },
});
