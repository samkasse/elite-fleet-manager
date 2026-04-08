import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LiveMap } from './pages/LiveMap';
import { Maintenance } from './pages/Maintenance';
import { Rewards } from './pages/Rewards';
import { Settings } from './pages/Settings';
import { AddVehicle } from './pages/AddVehicle';
import { CraneLogo } from './components/CraneLogo';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [loadingText, setLoadingText] = React.useState('INITIALIZING SECURE CONNECTION...');

  React.useEffect(() => {
    if (!loading) return;
    const texts = [
      'AUTHENTICATING ELITE CREDENTIALS...',
      'ESTABLISHING SATELLITE LINK...',
      'LOADING FLEET TELEMETRY...',
      'DECRYPTING ASSET LOCATIONS...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i]);
      i = (i + 1) % texts.length;
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D1C10] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-t-2 border-r-2 border-[#FCDC04] rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 border-b-2 border-l-2 border-[#4A7C59] rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CraneLogo className="w-16 h-16 text-[#FCDC04] animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-[0.2em] text-[#FCDC04] mb-4">ELITE FLEET UG</h2>
          <div className="h-1 w-64 bg-[#1B3B22] rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#FCDC04] animate-[pulse_2s_ease-in-out_infinite] w-full origin-left scale-x-0 transition-transform duration-1000" style={{ transform: 'scaleX(1)' }}></div>
          </div>
          <p className="text-xs font-mono text-[#4A7C59] tracking-widest">{loadingText}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}

function LoginScreen() {
  const { signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setErrorMsg('');
    try {
      await signIn();
    } catch (error: any) {
      if (error?.code !== 'auth/cancelled-popup-request' && error?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Failed to sign in. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1C10] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1B3B22]/40 to-transparent pointer-events-none"></div>
      
      <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] max-w-md w-full text-center border border-white/10 relative z-10">
        <div className="w-24 h-24 mx-auto bg-[#1B3B22] rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-[#FCDC04]/30">
          <CraneLogo className="w-14 h-14 text-[#FCDC04]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">ELITE FLEET UG</h1>
        <p className="text-gray-300 mb-8 text-sm leading-relaxed">Premium fleet management for high-net-worth individuals and embassies.</p>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-200 text-sm rounded-xl border border-red-500/30 backdrop-blur-md">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center gap-3 bg-[#FCDC04] text-[#0D1C10] py-4 px-6 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSigningIn ? (
            <div className="w-6 h-6 border-2 border-[#0D1C10]/30 border-t-[#0D1C10] rounded-full animate-spin" />
          ) : (
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 bg-white rounded-full p-0.5" />
          )}
          {isSigningIn ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
        </button>
        
        <p className="mt-6 text-xs text-gray-400 font-mono">AUTHORIZED PERSONNEL ONLY</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="map" element={<LiveMap />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="settings" element={<Settings />} />
            <Route path="add-vehicle" element={<AddVehicle />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
