/**
 * api/deviceService.ts
 * Interfaces with DeviceController (/api/devices)
 * Manages ESP32 nodes and Cooking Mode toggle.
 */
import client from './client';
import { DEVICES } from './endpoints';
import type { Device, CreateDevicePayload, UpdateDevicePayload, CookingModePayload } from '@/types/device';

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    const { data } = await client.get<Device[]>(DEVICES.LIST);
    return data;
  },

  async getDevice(id: string): Promise<Device> {
    const { data } = await client.get<Device>(DEVICES.DETAIL(id));
    return data;
  },

  async createDevice(payload: CreateDevicePayload): Promise<Device> {
    const { data } = await client.post<Device>(DEVICES.CREATE, payload);
    return data;
  },

  async updateDevice(id: string, payload: UpdateDevicePayload): Promise<Device> {
    const { data } = await client.put<Device>(DEVICES.UPDATE(id), payload);
    return data;
  },

  async deleteDevice(id: string): Promise<void> {
    await client.delete(DEVICES.DELETE(id));
  },

  /**
   * Toggle Cooking Mode on a specific ESP32 node.
   * PATCH /api/devices/:id/cooking-mode
   * Body: { enabled: boolean }
   */
  async toggleCookingMode(id: string, payload: CookingModePayload): Promise<Device> {
    const { data } = await client.patch<Device>(DEVICES.TOGGLE_COOKING_MODE(id), payload);
    return data;
  },
};
