import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { mockAlerts } from './mockData';

export default function AlertsScreen() {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredAlerts = filter === 'all'
    ? mockAlerts
    : mockAlerts.filter(a => a.level === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/" className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Alerts</h1>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition ${
              filter === 'high'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition ${
              filter === 'medium'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition ${
              filter === 'low'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            Low
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No alerts found</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <Link
              key={alert.id}
              to={`/alerts/${alert.id}`}
              className="block"
            >
              <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 hover:shadow-md active:shadow-lg transition ${
                alert.level === 'high' ? 'border-red-500' :
                alert.level === 'medium' ? 'border-orange-500' : 'border-green-500'
              }`}>
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
                    <p className="text-sm text-gray-500">{alert.timestamp}</p>
                  </div>
                  <AlertTriangle className={`w-6 h-6 ${
                    alert.level === 'high' ? 'text-red-500' :
                    alert.level === 'medium' ? 'text-orange-500' : 'text-green-500'
                  }`} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
