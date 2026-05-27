/**
 * hooks/useDevices.ts
 * CRUD operations + Cooking Mode toggle for ESP32 device list.
 */
import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '@/api/deviceService';
import type { Device, CreateDevicePayload, UpdateDevicePayload, CookingModePayload } from '@/types/device';

interface UseDevicesResult {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createDevice: (payload: CreateDevicePayload) => Promise<void>;
  updateDevice: (id: string, payload: UpdateDevicePayload) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  toggleCookingMode: (id: string, payload: CookingModePayload) => Promise<void>;
}

export function useDevices(): UseDevicesResult {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDevices(await deviceService.getDevices());
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load devices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createDevice = async (payload: CreateDevicePayload) => {
    await deviceService.createDevice(payload);
    fetch();
  };

  const updateDevice = async (id: string, payload: UpdateDevicePayload) => {
    const updated = await deviceService.updateDevice(id, payload);
    setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  const deleteDevice = async (id: string) => {
    await deviceService.deleteDevice(id);
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleCookingMode = async (id: string, payload: CookingModePayload) => {
    const updated = await deviceService.toggleCookingMode(id, payload);
    setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  return { devices, isLoading, error, refetch: fetch, createDevice, updateDevice, deleteDevice, toggleCookingMode };
}
