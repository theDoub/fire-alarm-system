import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { colors, radius } from '@/theme/colors';
import type { CreateDevicePayload } from '@/types/device';

interface AddDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateDevicePayload) => void;
}

export function AddDeviceModal({ visible, onClose, onSubmit }: AddDeviceModalProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !location.trim() || !macAddress.trim()) {
      setError('Please complete all fields before adding the device.');
      return;
    }

    onSubmit({
      name: name.trim(),
      location: location.trim(),
      macAddress: macAddress.trim(),
    });
    setName('');
    setLocation('');
    setMacAddress('');
    setError(null);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Add Device</Text>
            <Text style={styles.subtitle}>Register a new ESP32 sensor</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.75}>
            <X size={20} color={colors.slate} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Device Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Kitchen Sensor"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Kitchen, 1st Floor"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>MAC Address</Text>
        <TextInput
          style={styles.input}
          value={macAddress}
          onChangeText={setMacAddress}
          placeholder="24:6F:28:AA:10:06"
          placeholderTextColor="#94a3b8"
          autoCapitalize="characters"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.75}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.submitText}>Add Device</Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  label: {
    color: colors.slate,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    marginBottom: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    color: colors.dangerDark,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
    textAlign: 'center',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 4,
    paddingVertical: 15,
  },
  submitText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
});

