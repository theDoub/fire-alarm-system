export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  level: 'high' | 'medium' | 'low';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  powerState: 'on' | 'off';
  lastUpdated: string;
  alertsDisabled: boolean;
}

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    deviceId: 'device-1',
    deviceName: 'Kitchen Sensor',
    level: 'high',
    timestamp: '2026-05-11 14:23:45',
    status: 'active',
  },
  {
    id: 'alert-2',
    deviceId: 'device-2',
    deviceName: 'Living Room Sensor',
    level: 'medium',
    timestamp: '2026-05-11 12:15:30',
    status: 'acknowledged',
  },
  {
    id: 'alert-3',
    deviceId: 'device-3',
    deviceName: 'Bedroom Sensor',
    level: 'low',
    timestamp: '2026-05-11 09:45:12',
    status: 'resolved',
  },
  {
    id: 'alert-4',
    deviceId: 'device-1',
    deviceName: 'Kitchen Sensor',
    level: 'medium',
    timestamp: '2026-05-10 18:30:22',
    status: 'resolved',
  },
  {
    id: 'alert-5',
    deviceId: 'device-4',
    deviceName: 'Garage Sensor',
    level: 'low',
    timestamp: '2026-05-10 11:20:15',
    status: 'resolved',
  },
  {
    id: 'alert-6',
    deviceId: 'device-2',
    deviceName: 'Living Room Sensor',
    level: 'high',
    timestamp: '2026-05-09 21:45:33',
    status: 'resolved',
  },
];

export const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'Kitchen Sensor',
    location: 'Kitchen, 1st Floor',
    status: 'online',
    powerState: 'on',
    lastUpdated: '2026-05-11 14:23:45',
    alertsDisabled: false,
  },
  {
    id: 'device-2',
    name: 'Living Room Sensor',
    location: 'Living Room, 1st Floor',
    status: 'online',
    powerState: 'on',
    lastUpdated: '2026-05-11 14:20:12',
    alertsDisabled: false,
  },
  {
    id: 'device-3',
    name: 'Bedroom Sensor',
    location: 'Master Bedroom, 2nd Floor',
    status: 'online',
    powerState: 'on',
    lastUpdated: '2026-05-11 14:15:30',
    alertsDisabled: true,
  },
  {
    id: 'device-4',
    name: 'Garage Sensor',
    location: 'Garage',
    status: 'offline',
    powerState: 'off',
    lastUpdated: '2026-05-10 22:30:00',
    alertsDisabled: false,
  },
  {
    id: 'device-5',
    name: 'Basement Sensor',
    location: 'Basement',
    status: 'online',
    powerState: 'on',
    lastUpdated: '2026-05-11 14:10:05',
    alertsDisabled: false,
  },
];
