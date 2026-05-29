import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import AlertsScreen from './components/AlertsScreen';
import AlertDetailScreen from './components/AlertDetailScreen';
import DevicesScreen from './components/DevicesScreen';
import DeviceDetailScreen from './components/DeviceDetailScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNav from './components/BottomNav';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {!isAuthenticated ? (
          <LoginScreen onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <div className="pb-20 max-w-md mx-auto">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/alerts" element={<AlertsScreen />} />
              <Route path="/alerts/:id" element={<AlertDetailScreen />} />
              <Route path="/devices" element={<DevicesScreen />} />
              <Route path="/devices/:id" element={<DeviceDetailScreen />} />
              <Route path="/history" element={<HistoryScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNav />
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
