import { Link } from 'react-router';
import { Shield, AlertTriangle, Wifi, BellOff, Bell, Settings, ChevronRight } from 'lucide-react';
import { mockAlerts, mockDevices } from './mockData';

export default function HomeScreen() {
  const activeAlerts = mockAlerts.filter(a => a.status === 'active');
  const highAlerts = activeAlerts.filter(a => a.level === 'high');
  const onlineDevices = mockDevices.filter(d => d.status === 'online');
  const disabledAlerts = mockDevices.filter(d => d.alertsDisabled).length;

  const latestAlert = activeAlerts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-red-100 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold">Van A</h1>
          </div>
          <Link to="/profile" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 active:bg-white/40 transition">
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <Shield className={`w-8 h-8 ${highAlerts.length > 0 ? 'text-red-200' : 'text-green-300'}`} />
            <div>
              <p className="text-sm text-white/80">Safety Status</p>
              <p className="text-xl font-bold">
                {highAlerts.length > 0 ? 'Alert Active' : 'All Clear'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mb-2 mx-auto">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-center text-gray-900">{activeAlerts.length}</p>
            <p className="text-xs text-gray-500 text-center mt-1">Active Alerts</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2 mx-auto">
              <Wifi className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-center text-gray-900">{onlineDevices.length}</p>
            <p className="text-xs text-gray-500 text-center mt-1">Online</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mb-2 mx-auto">
              <BellOff className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-center text-gray-900">{disabledAlerts}</p>
            <p className="text-xs text-gray-500 text-center mt-1">Disabled</p>
          </div>
        </div>

        {latestAlert && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">Latest Alert</h2>
              <Link to="/alerts" className="text-sm text-red-500 hover:text-red-600 transition">
                View All
              </Link>
            </div>
            <Link to={`/alerts/${latestAlert.id}`} className="block">
              <div className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${
                latestAlert.level === 'high' ? 'border-red-500' :
                latestAlert.level === 'medium' ? 'border-orange-500' : 'border-green-500'
              } hover:shadow-md active:shadow-lg transition`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        latestAlert.level === 'high' ? 'bg-red-100 text-red-700' :
                        latestAlert.level === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {latestAlert.level.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{latestAlert.deviceName}</h3>
                    <p className="text-sm text-gray-500">{latestAlert.timestamp}</p>
                  </div>
                  <AlertTriangle className={`w-6 h-6 ${
                    latestAlert.level === 'high' ? 'text-red-500' :
                    latestAlert.level === 'medium' ? 'text-orange-500' : 'text-green-500'
                  }`} />
                </div>
              </div>
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/alerts"
              className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md active:shadow-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-medium text-gray-900">View All Alerts</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>

            <Link
              to="/devices"
              className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md active:shadow-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">Manage Devices</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
