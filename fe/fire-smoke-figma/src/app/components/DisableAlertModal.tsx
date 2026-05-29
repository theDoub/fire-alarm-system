import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DisableAlertModalProps {
  deviceId: string;
  deviceName: string;
  onClose: () => void;
}

export default function DisableAlertModal({ deviceId, deviceName, onClose }: DisableAlertModalProps) {
  const [duration, setDuration] = useState('15');

  const handleConfirm = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-6">
      <div className="bg-white rounded-t-3xl w-full max-w-md animate-in slide-in-from-bottom">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Disable Alerts</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">Device: <span className="font-bold">{deviceName}</span></p>
            <p className="text-sm text-gray-500">Device ID: {deviceId}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['5', '15', '30', '60'].map((min) => (
                <button
                  key={min}
                  onClick={() => setDuration(min)}
                  className={`py-3 px-4 rounded-xl font-medium text-sm transition ${
                    duration === min
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  {min} {min === '60' ? 'hour' : 'min'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800">
              Alerts from this device will be muted during the selected time. You will not receive any notifications.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-3.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border border-gray-300 rounded-xl font-medium transition-all transform active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all transform active:scale-95"
            >
              Confirm Disable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
