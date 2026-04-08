import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Wrench, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { CraneLogo } from '../components/CraneLogo';

export function Maintenance() {
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

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
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

  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance' || v.mileage > 10000 || v.batteryLevel < 20);
  const healthyVehicles = vehicles.filter(v => !maintenanceVehicles.includes(v));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-primary-dark">Maintenance Hub</h1>
        <p className="text-gray-500 mt-1">Monitor vehicle health and schedule services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Needs Attention</p>
            <p className="text-2xl font-bold text-primary-dark">{maintenanceVehicles.length}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Healthy Vehicles</p>
            <p className="text-2xl font-bold text-primary-dark">{healthyVehicles.length}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Upcoming Services</p>
            <p className="text-2xl font-bold text-primary-dark">2</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary-dark" />
            Action Required
          </h2>
        </div>
        
        {maintenanceVehicles.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-1">All vehicles are healthy</h3>
            <p className="text-gray-500">No maintenance actions are currently required.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {maintenanceVehicles.map(v => (
              <div key={v.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {v.imageUrl ? (
                      <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <CraneLogo className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-dark text-lg">{v.name}</h3>
                    <p className="text-sm text-gray-500">{v.licensePlate} • {v.make} {v.model}</p>
                    <div className="flex gap-2 mt-2">
                      {v.status === 'maintenance' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">In Shop</span>
                      )}
                      {v.mileage > 10000 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">High Mileage ({v.mileage}km)</span>
                      )}
                      {v.batteryLevel < 20 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md">Low Battery ({v.batteryLevel}%)</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="px-5 py-2 bg-primary-dark text-white rounded-xl font-medium text-sm hover:bg-primary-hover transition-colors shadow-sm whitespace-nowrap">
                  Schedule Service
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
