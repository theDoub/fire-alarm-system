import { Link } from 'react-router';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { mockAlerts } from './mockData';

export default function HistoryScreen() {
  const allAlerts = [...mockAlerts].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Alert History</h1>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {allAlerts.map((alert, index) => (
              <Link
                key={alert.id}
                to={`/alerts/${alert.id}`}
                className="block relative pl-14"
              >
                <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  alert.level === 'high' ? 'bg-red-500' :
                  alert.level === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md active:shadow-lg transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          alert.level === 'high' ? 'bg-red-100 text-red-700' :
                          alert.level === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {alert.level.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          alert.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900">{alert.deviceName}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {allAlerts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No alert history</p>
          </div>
        )}
      </div>
    </div>
  );
}
