import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Settings() {
  const { user, logOut } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-primary-dark">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-primary-dark mb-6 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary-dark" />
              Account Profile
            </h2>
            
            <div className="flex items-center gap-6 mb-8">
              <img 
                src={user?.photoURL || ''} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-md"
              />
              <div>
                <h3 className="text-2xl font-bold text-primary-dark">{user?.displayName}</h3>
                <p className="text-gray-500 mb-2">{user?.email}</p>
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#1B3B22] to-[#4A7C59] text-[#FCDC04] text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  Platinum Elite
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">User ID</p>
                <p className="font-mono text-sm text-gray-900">{user?.uid}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-primary-dark mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-dark" />
              Notifications
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Vehicle Movement Alerts', desc: 'Get notified when a vehicle leaves a designated geofence.' },
                { title: 'Maintenance Reminders', desc: 'Receive alerts for upcoming scheduled services.' },
                { title: 'Security Breaches', desc: 'Immediate alerts for unauthorized access or tampering.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1B3B22] to-[#0D1C10] rounded-3xl p-8 shadow-lg text-white">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-[#FCDC04]" />
              <h2 className="text-xl font-bold">Subscription</h2>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-1">Current Plan</p>
              <p className="text-2xl font-bold text-[#FCDC04]">Enterprise</p>
              <p className="text-sm text-gray-300 mt-2">Unlimited vehicles, 24/7 priority support, advanced analytics.</p>
            </div>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/20">
              Manage Billing
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-primary-dark" />
              <h2 className="text-xl font-bold text-primary-dark">Security</h2>
            </div>
            <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors mb-3 border border-gray-200">
              Change Password
            </button>
            <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors border border-gray-200">
              Two-Factor Authentication
            </button>
          </div>

          <button 
            onClick={logOut}
            className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
