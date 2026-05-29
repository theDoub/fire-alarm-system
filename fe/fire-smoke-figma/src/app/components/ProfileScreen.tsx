import { Link } from 'react-router';
import { ArrowLeft, User, Bell, Shield, Settings, LogOut, ChevronRight, Mail, Phone } from 'lucide-react';

export default function ProfileScreen() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <Link to="/" className="inline-flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full mb-6 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Van A</h1>
          <p className="text-gray-300">vanang@gmail.com</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <h2 className="font-bold text-gray-900 px-5 pt-5 pb-3">Account Information</h2>
          <div className="divide-y divide-gray-100">
            <div className="px-5 py-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">vanang@gmail.com</p>
              </div>
            </div>
            <div className="px-5 py-4 flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <h2 className="font-bold text-gray-900 px-5 pt-5 pb-3">Settings</h2>
          <div className="divide-y divide-gray-100">
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Security</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Preferences</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <button className="w-full bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        <p className="text-center text-sm text-gray-500 mt-8">
          Smart Fire Alert v1.0.0
        </p>
      </div>
    </div>
  );
}
