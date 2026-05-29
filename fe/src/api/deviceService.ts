/**
 * api/deviceService.ts
 * Interfaces with DeviceController (/api/devices)
 * Manages ESP32 nodes and Cooking Mode toggle.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';
import { DEVICES } from './endpoints';
import type { Device, CreateDevicePayload, UpdateDevicePayload, CookingModePayload } from '@/types/device';

let mockDevices: Device[] = [
  {
    id: 'dev-high',
    name: 'Kitchen Smoke Detector',
    location: 'First Floor Kitchen',
    macAddress: '00:B0:D0:63:C2:26',
    status: 'ONLINE',
    isMuted: false,
    lastSeenAt: new Date(Date.now() - 60000).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: 'dev-med',
    name: 'Living Room Sensor',
    location: 'Ground Floor Living Room',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    status: 'ONLINE',
    isMuted: true,
    lastSeenAt: new Date(Date.now() - 120000).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: 'dev-low',
    name: 'Bedroom Co2 Monitor',
    location: 'Second Floor Master Bedroom',
    macAddress: '11:22:33:44:55:66',
    status: 'OFFLINE',
    isMuted: false,
    lastSeenAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
];

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      return Promise.resolve(mockDevices);
    }
    const { data } = await client.get<Device[]>(DEVICES.LIST);
    return data;
  },

  async getDevice(id: string): Promise<Device> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      const device = mockDevices.find(d => d.id === id);
      if (device) return Promise.resolve(device);
      throw new Error('Device not found');
    }
    const { data } = await client.get<Device>(DEVICES.DETAIL(id));
    return data;
  },

  async createDevice(payload: CreateDevicePayload): Promise<Device> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      const newDev: Device = {
        id: `dev-${Math.random().toString(36).substr(2, 9)}`,
        name: payload.name,
        location: payload.location,
        macAddress: payload.macAddress,
        status: 'ONLINE',
        isMuted: false,
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      mockDevices.push(newDev);
      return Promise.resolve(newDev);
    }
    const { data } = await client.post<Device>(DEVICES.CREATE, payload);
    return data;
  },

  async updateDevice(id: string, payload: UpdateDevicePayload): Promise<Device> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      const idx = mockDevices.findIndex(d => d.id === id);
      if (idx !== -1) {
        mockDevices[idx] = {
          ...mockDevices[idx],
          name: payload.name ?? mockDevices[idx].name,
          location: payload.location ?? mockDevices[idx].location,
          status: (payload as any).status ?? mockDevices[idx].status,
        };
        return Promise.resolve(mockDevices[idx]);
      }
      throw new Error('Device not found');
    }
    const { data } = await client.put<Device>(DEVICES.UPDATE(id), payload);
    return data;
  },

  async deleteDevice(id: string): Promise<void> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      mockDevices = mockDevices.filter(d => d.id !== id);
      return Promise.resolve();
    }
    await client.delete(DEVICES.DELETE(id));
  },

  /**
   * Toggle Cooking Mode on a specific ESP32 node.
   * PATCH /api/devices/:id/cooking-mode
   * Body: { enabled: boolean }
   */
  async toggleCookingMode(id: string, payload: CookingModePayload): Promise<Device> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      const idx = mockDevices.findIndex(d => d.id === id);
      if (idx !== -1) {
        mockDevices[idx] = {
          ...mockDevices[idx],
          isMuted: payload.enabled,
          muteUntil: payload.enabled ? payload.muteUntil ?? new Date(Date.now() + 3600000).toISOString() : undefined,
        };
        return Promise.resolve(mockDevices[idx]);
      }
      throw new Error('Device not found');
    }
    const { data } = await client.patch<Device>(DEVICES.TOGGLE_COOKING_MODE(id), payload);
    return data;
  },
};
