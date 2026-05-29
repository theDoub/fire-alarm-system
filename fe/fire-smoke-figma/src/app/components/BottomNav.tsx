import { Link, useLocation } from 'react-router';
import { Home, Bell, Wifi, Clock, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pb-safe z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-3">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
              isActive('/') && !isActive('/alerts') && !isActive('/devices') && !isActive('/history') && !isActive('/profile')
                ? 'text-red-500'
                : 'text-gray-500 hover:text-gray-700 active:bg-gray-100'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link
            to="/alerts"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
              isActive('/alerts')
                ? 'text-red-500'
                : 'text-gray-500 hover:text-gray-700 active:bg-gray-100'
            }`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs font-medium">Alerts</span>
          </Link>

          <Link
            to="/devices"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
              isActive('/devices')
                ? 'text-red-500'
                : 'text-gray-500 hover:text-gray-700 active:bg-gray-100'
            }`}
          >
            <Wifi className="w-6 h-6" />
            <span className="text-xs font-medium">Devices</span>
          </Link>

          <Link
            to="/history"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
              isActive('/history')
                ? 'text-red-500'
                : 'text-gray-500 hover:text-gray-700 active:bg-gray-100'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
              isActive('/profile')
                ? 'text-red-500'
                : 'text-gray-500 hover:text-gray-700 active:bg-gray-100'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
