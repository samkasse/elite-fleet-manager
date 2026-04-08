import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Car, Map, Wrench, Award, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CraneLogo } from './CraneLogo';

export function Layout() {
  const { user, logOut } = useAuth();

  const navItems = [
    { to: '/', icon: Car, label: 'Garage' },
    { to: '/map', icon: Map, label: 'Live Map' },
    { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/rewards', icon: Award, label: 'Rewards' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-offwhite">
      {/* Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <nav className="fixed bottom-0 w-full md:relative md:w-64 bg-white/90 backdrop-blur-xl border-t md:border-t-0 md:border-r border-gray-200 z-50 flex md:flex-col shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-gray-100 bg-[#0D1C10]">
          <CraneLogo className="w-10 h-10 text-[#FCDC04]" />
          <div>
            <h1 className="font-bold text-lg text-white leading-tight tracking-wider">ELITE FLEET</h1>
            <p className="text-[10px] text-[#4A7C59] font-medium tracking-[0.3em] uppercase">Uganda</p>
          </div>
        </div>

        <div className="flex-1 flex md:flex-col justify-around md:justify-start p-2 md:p-4 gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1B3B22] text-[#FCDC04] shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-[#1B3B22]'
                }`
              }
            >
              <item.icon className="w-6 h-6 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {user && (
          <div className="hidden md:block p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4 px-2">
              <img src={user.photoURL || ''} alt="Profile" className="w-10 h-10 rounded-full border-2 border-primary-dark" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-primary-dark truncate">{user.displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
