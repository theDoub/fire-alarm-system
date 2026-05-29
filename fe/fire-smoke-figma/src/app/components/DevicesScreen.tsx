import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Power, Wifi, WifiOff, MapPin } from 'lucide-react';
import { mockDevices } from './mockData';

export default function DevicesScreen() {
  const [devices, setDevices] = useState(mockDevices);

  const handleToggle = (deviceId: string) => {
    setDevices(devices.map(device =>
      device.id === deviceId
        ? { ...device, powerState: device.powerState === 'on' ? 'off' : 'on' }
        : device
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Devices</h1>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{devices.filter(d => d.status === 'online').length}</p>
            <p className="text-sm text-gray-500">Online</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
            <p className="text-sm text-gray-500">Total Devices</p>
          </div>
        </div>

        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <Link to={`/devices/${device.id}`} className="block mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{device.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{device.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {device.status === 'online' ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 rounded-full">
                          <Wifi className="w-3.5 h-3.5" />
                          Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
                          <WifiOff className="w-3.5 h-3.5" />
                          Offline
                        </span>
                      )}
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        device.powerState === 'on' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {device.powerState === 'on' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Last updated: {device.lastUpdated}</p>
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle(device.id);
                }}
                disabled={device.status === 'offline'}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  device.powerState === 'on'
                    ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-sm'
                    : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700'
                } ${device.status === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Power className="w-4 h-4" />
                {device.powerState === 'on' ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
