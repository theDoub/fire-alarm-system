import type { Alert, AlertHistoryEntry } from '@/types/alert';
import type { Device } from '@/types/device';
import type { UserProfile } from '@/types/auth';

export const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Van A',
  email: 'vanang@gmail.com',
  role: 'ADMIN',
  createdAt: '2026-05-11T08:00:00.000Z',
};

export const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'Kitchen Sensor',
    location: 'Kitchen, 1st Floor',
    macAddress: '24:6F:28:AA:10:01',
    status: 'ONLINE',
    isMuted: false,
    lastSeenAt: '2026-05-11T14:23:45.000Z',
    createdAt: '2026-04-01T09:30:00.000Z',
  },
  {
    id: 'device-2',
    name: 'Living Room Sensor',
    location: 'Living Room, 1st Floor',
    macAddress: '24:6F:28:AA:10:02',
    status: 'ONLINE',
    isMuted: false,
    lastSeenAt: '2026-05-11T14:20:12.000Z',
    createdAt: '2026-04-01T09:45:00.000Z',
  },
  {
    id: 'device-3',
    name: 'Bedroom Sensor',
    location: 'Master Bedroom, 2nd Floor',
    macAddress: '24:6F:28:AA:10:03',
    status: 'ONLINE',
    isMuted: true,
    muteUntil: '2026-05-11T15:15:30.000Z',
    lastSeenAt: '2026-05-11T14:15:30.000Z',
    createdAt: '2026-04-02T10:15:00.000Z',
  },
  {
    id: 'device-4',
    name: 'Garage Sensor',
    location: 'Garage',
    macAddress: '24:6F:28:AA:10:04',
    status: 'OFFLINE',
    isMuted: false,
    lastSeenAt: '2026-05-10T22:30:00.000Z',
    createdAt: '2026-04-03T11:00:00.000Z',
  },
  {
    id: 'device-5',
    name: 'Basement Sensor',
    location: 'Basement',
    macAddress: '24:6F:28:AA:10:05',
    status: 'ONLINE',
    isMuted: false,
    lastSeenAt: '2026-05-11T14:10:05.000Z',
    createdAt: '2026-04-04T08:00:00.000Z',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    deviceId: 'device-1',
    deviceName: 'Kitchen Sensor',
    deviceLocation: 'Kitchen, 1st Floor',
    severity: 'HIGH',
    status: 'ACTIVE',
    sensorData: { smokeLevel: 88, temperature: 68, co2Level: 920 },
    triggeredAt: '2026-05-11T14:23:45.000Z',
  },
  {
    id: 'alert-2',
    deviceId: 'device-2',
    deviceName: 'Living Room Sensor',
    deviceLocation: 'Living Room, 1st Floor',
    severity: 'MEDIUM',
    status: 'ACKNOWLEDGED',
    sensorData: { smokeLevel: 46, temperature: 39, co2Level: 610 },
    triggeredAt: '2026-05-11T12:15:30.000Z',
    acknowledgedAt: '2026-05-11T12:18:00.000Z',
  },
  {
    id: 'alert-3',
    deviceId: 'device-3',
    deviceName: 'Bedroom Sensor',
    deviceLocation: 'Master Bedroom, 2nd Floor',
    severity: 'LOW',
    status: 'RESOLVED',
    sensorData: { smokeLevel: 24, temperature: 31, co2Level: 430 },
    triggeredAt: '2026-05-11T09:45:12.000Z',
    resolvedAt: '2026-05-11T09:55:00.000Z',
  },
  {
    id: 'alert-4',
    deviceId: 'device-1',
    deviceName: 'Kitchen Sensor',
    deviceLocation: 'Kitchen, 1st Floor',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    sensorData: { smokeLevel: 52, temperature: 42, co2Level: 700 },
    triggeredAt: '2026-05-10T18:30:22.000Z',
    resolvedAt: '2026-05-10T18:48:00.000Z',
  },
  {
    id: 'alert-5',
    deviceId: 'device-4',
    deviceName: 'Garage Sensor',
    deviceLocation: 'Garage',
    severity: 'LOW',
    status: 'RESOLVED',
    sensorData: { smokeLevel: 18, temperature: 29, co2Level: 410 },
    triggeredAt: '2026-05-10T11:20:15.000Z',
    resolvedAt: '2026-05-10T11:35:00.000Z',
  },
  {
    id: 'alert-6',
    deviceId: 'device-2',
    deviceName: 'Living Room Sensor',
    deviceLocation: 'Living Room, 1st Floor',
    severity: 'HIGH',
    status: 'RESOLVED',
    sensorData: { smokeLevel: 79, temperature: 63, co2Level: 850 },
    triggeredAt: '2026-05-09T21:45:33.000Z',
    resolvedAt: '2026-05-09T22:02:00.000Z',
  },
];

export const mockHistory: AlertHistoryEntry[] = mockAlerts
  .flatMap((alert) => [
    {
      id: `${alert.id}-triggered`,
      alertId: alert.id,
      deviceId: alert.deviceId,
      deviceName: alert.deviceName,
      severity: alert.severity,
      eventType: 'TRIGGERED' as const,
      sensorData: alert.sensorData,
      createdAt: alert.triggeredAt,
    },
    ...(alert.acknowledgedAt
      ? [{
          id: `${alert.id}-acknowledged`,
          alertId: alert.id,
          deviceId: alert.deviceId,
          deviceName: alert.deviceName,
          severity: alert.severity,
          eventType: 'ACKNOWLEDGED' as const,
          sensorData: alert.sensorData,
          createdAt: alert.acknowledgedAt,
        }]
      : []),
    ...(alert.resolvedAt
      ? [{
          id: `${alert.id}-resolved`,
          alertId: alert.id,
          deviceId: alert.deviceId,
          deviceName: alert.deviceName,
          severity: alert.severity,
          eventType: 'RESOLVED' as const,
          sensorData: alert.sensorData,
          createdAt: alert.resolvedAt,
        }]
      : []),
  ])
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

