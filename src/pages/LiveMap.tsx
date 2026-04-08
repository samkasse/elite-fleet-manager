import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Navigation, Battery, Fuel } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (status: string) => {
  const color = status === 'in_garage' ? '#22c55e' : 
                status === 'with_driver' ? '#3b82f6' : 
                status === 'maintenance' ? '#ef4444' : '#6b7280';
                
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export function LiveMap() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'vehicles'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehicleData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVehicles(vehicleData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const trackedVehicles = vehicles.filter(v => v.hasTracker && v.locationLat && v.locationLng);
  const untrackedVehicles = vehicles.filter(v => !v.hasTracker);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-t-2 border-r-2 border-[#FCDC04] rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-2 border-b-2 border-l-2 border-[#4A7C59] rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CraneLogo className="w-12 h-12 text-[#1B3B22] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      {/* Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-dark">Active Trackers</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-600">{trackedVehicles.length} Online</span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
            {trackedVehicles.length === 0 ? (
              <p className="text-sm text-gray-500">No active trackers found.</p>
            ) : (
              trackedVehicles.map(v => (
                <div key={v.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-dark/30 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-gray-900">{v.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white rounded-md text-gray-600 border border-gray-200">
                      {v.licensePlate}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {v.locationName || 'Unknown Location'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {untrackedVehicles.length > 0 && (
          <div className="bg-gradient-to-br from-primary-dark to-primary-darker rounded-3xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-highlight-gold" />
              </div>
              <h2 className="text-lg font-bold">Unprotected Assets</h2>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              You have {untrackedVehicles.length} vehicle{untrackedVehicles.length > 1 ? 's' : ''} without active GPS tracking.
            </p>
            <div className="space-y-2 mb-4">
              {untrackedVehicles.slice(0, 3).map(v => (
                <div key={v.id} className="text-xs bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  {v.name} ({v.licensePlate})
                </div>
              ))}
              {untrackedVehicles.length > 3 && (
                <div className="text-xs text-gray-400 px-2">+{untrackedVehicles.length - 3} more</div>
              )}
            </div>
            <button className="w-full py-3 bg-highlight-gold text-primary-darker font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-md">
              Purchase Trackers
            </button>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative z-0 min-h-[400px]">
        <MapContainer 
          center={[0.3476, 32.5825]} // Kampala
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {trackedVehicles.map(v => (
            <Marker 
              key={v.id} 
              position={[v.locationLat, v.locationLng]}
              icon={createCustomIcon(v.status)}
            >
              <Popup className="rounded-xl overflow-hidden">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-lg text-primary-dark mb-1">{v.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{v.licensePlate}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Driver:</span>
                      <span className="font-medium">{v.currentDriver || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium capitalize">{v.status.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="pt-2 mt-2 border-t border-gray-100 flex gap-4">
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{v.fuelLevel || 0}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Battery className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{v.batteryLevel || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
