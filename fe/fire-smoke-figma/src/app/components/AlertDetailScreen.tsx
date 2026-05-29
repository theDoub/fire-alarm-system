import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, AlertTriangle, Eye, BellOff, Info } from 'lucide-react';
import { mockAlerts } from './mockData';
import DisableAlertModal from './DisableAlertModal';

export default function AlertDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDisableModal, setShowDisableModal] = useState(false);

  const alert = mockAlerts.find(a => a.id === id);

  if (!alert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Alert not found</p>
      </div>
    );
  }

  const handleAcknowledge = () => {
    alert.status = 'acknowledged';
    navigate('/alerts');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${
        alert.level === 'high' ? 'bg-gradient-to-br from-red-500 to-red-600' :
        alert.level === 'medium' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
        'bg-gradient-to-br from-green-500 to-green-600'
      } text-white px-6 pt-12 pb-8 rounded-b-3xl`}>
        <Link to="/alerts" className="inline-flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full mb-6 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            alert.level === 'high' ? 'bg-red-400' :
            alert.level === 'medium' ? 'bg-orange-400' : 'bg-green-400'
          }`}>
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3 ${
            alert.level === 'high' ? 'bg-red-900 text-red-100' :
            alert.level === 'medium' ? 'bg-orange-900 text-orange-100' : 'bg-green-900 text-green-100'
          }`}>
            {alert.level.toUpperCase()} ALERT
          </span>
          <h1 className="text-2xl font-bold mb-1">{alert.deviceName}</h1>
          <p className="text-white/90">{alert.timestamp}</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-600" />
            Alert Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Device ID</span>
              <span className="font-medium text-gray-900">{alert.deviceId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Alert Level</span>
              <span className={`font-bold ${
                alert.level === 'high' ? 'text-red-600' :
                alert.level === 'medium' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {alert.level.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-gray-900 capitalize">{alert.status}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Timestamp</span>
              <span className="font-medium text-gray-900">{alert.timestamp}</span>
            </div>
          </div>
        </div>

        {alert.level === 'high' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-red-900 mb-2">Recommended Action</h3>
            <p className="text-sm text-red-800">
              Evacuate the area immediately. Call emergency services if needed. Do not re-enter until the area is declared safe.
            </p>
          </div>
        )}

        {alert.level === 'medium' && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-orange-900 mb-2">Recommended Action</h3>
            <p className="text-sm text-orange-800">
              Check the device location. Ensure proper ventilation. Monitor the situation closely.
            </p>
          </div>
        )}

        {alert.level === 'low' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-green-900 mb-2">Recommended Action</h3>
            <p className="text-sm text-green-800">
              Minor detection. No immediate action required. Continue monitoring.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {alert.status === 'active' && (
            <button
              onClick={handleAcknowledge}
              className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Acknowledge Alert
            </button>
          )}

          <button
            onClick={() => setShowDisableModal(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <BellOff className="w-5 h-5" />
            Temporarily Disable Alerts
          </button>

          <Link
            to={`/devices/${alert.deviceId}`}
            className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border border-gray-300 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            View Device Details
          </Link>
        </div>
      </div>

      {showDisableModal && (
        <DisableAlertModal
          deviceId={alert.deviceId}
          deviceName={alert.deviceName}
          onClose={() => setShowDisableModal(false)}
        />
      )}
    </div>
  );
}
