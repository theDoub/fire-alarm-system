import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Power, MapPin, Wifi, WifiOff, AlertTriangle, BellOff, Flame, Wind, Thermometer, Volume2, Sun } from 'lucide-react';
import { mockDevices, mockAlerts } from './mockData';
import DisableAlertModal from './DisableAlertModal';

export default function DeviceDetailScreen() {
  const { id } = useParams();
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [device, setDevice] = useState(mockDevices.find(d => d.id === id));

  if (!device) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Device not found</p>
      </div>
    );
  }

  const deviceAlerts = mockAlerts.filter(a => a.deviceId === device.id).slice(0, 3);

  const handleToggle = () => {
    setDevice({ ...device, powerState: device.powerState === 'on' ? 'off' : 'on' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <Link to="/devices" className="inline-flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full mb-6 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            <Flame className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">{device.name}</h1>
          <div className="flex items-center justify-center gap-2 text-blue-100">
            <MapPin className="w-4 h-4" />
            <span>{device.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            {device.status === 'online' ? (
              <>
                <Wifi className="w-6 h-6 text-green-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Online</p>
              </>
            ) : (
              <>
                <WifiOff className="w-6 h-6 text-red-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Offline</p>
              </>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <Power className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-sm font-medium capitalize">{device.powerState}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Sensor Readings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Smoke</p>
                <p className="font-bold text-gray-900">Normal</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Wind className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Gas</p>
                <p className="font-bold text-gray-900">Normal</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Temp</p>
                <p className="font-bold text-gray-900">22°C</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sound</p>
                <p className="font-bold text-gray-900">45 dB</p>
              </div>
            </div>
          </div>
        </div>

        {deviceAlerts.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Alerts</h2>
              <Link to="/alerts" className="text-sm text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {deviceAlerts.map((alert) => (
                <Link
                  key={alert.id}
                  to={`/alerts/${alert.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.level === 'high' ? 'text-red-500' :
                      alert.level === 'medium' ? 'text-orange-500' : 'text-green-500'
                    }`} />
                    <div>
                      <p className={`text-xs font-bold ${
                        alert.level === 'high' ? 'text-red-700' :
                        alert.level === 'medium' ? 'text-orange-700' : 'text-green-700'
                      }`}>
                        {alert.level.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">{alert.timestamp}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h2 className="font-bold text-gray-900 mb-3">Device Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Device ID</span>
              <span className="font-medium text-gray-900">{device.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Last Updated</span>
              <span className="font-medium text-gray-900">{device.lastUpdated}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Alerts Disabled</span>
              <span className="font-medium text-gray-900">{device.alertsDisabled ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleToggle}
            disabled={device.status === 'offline'}
            className={`w-full py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
              device.powerState === 'on'
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white'
                : 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white'
            } ${device.status === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Power className="w-5 h-5" />
            {device.powerState === 'on' ? 'Turn Off Device' : 'Turn On Device'}
          </button>

          <button
            onClick={() => setShowDisableModal(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <BellOff className="w-5 h-5" />
            Temporarily Disable Alerts
          </button>
        </div>
      </div>

      {showDisableModal && (
        <DisableAlertModal
          deviceId={device.id}
          deviceName={device.name}
          onClose={() => setShowDisableModal(false)}
        />
      )}
    </div>
  );
}
