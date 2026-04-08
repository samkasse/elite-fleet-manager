import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Upload, Trash2, Download, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { CarDetailsModal } from '../components/CarDetailsModal';
import { CraneLogo } from '../components/CraneLogo';

export function Dashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteDoc(doc(db, 'vehicles', id));
      setSelectedVehicle(null);
    }
  };

  const handleClearFleet = async () => {
    if (window.confirm('Are you sure you want to delete ALL vehicles? This cannot be undone.')) {
      const batch = writeBatch(db);
      vehicles.forEach(v => {
        batch.delete(doc(db, 'vehicles', v.id));
      });
      await batch.commit();
    }
  };

  const handleLoadDemoFleet = async () => {
    if (!user) return;
    
    const demoVehicles = [
      {
        ownerId: user.uid,
        name: 'Phantom VIII',
        make: 'Rolls-Royce',
        model: 'Phantom',
        year: 2023,
        licensePlate: 'UG 001 VIP',
        status: 'in_garage',
        currentDriver: 'John K.',
        locationLat: 0.3258,
        locationLng: 32.5920,
        locationName: 'Ruparelia Residence, Kololo',
        fuelLevel: 85,
        batteryLevel: 100,
        mileage: 1250,
        hasTracker: true,
        imageUrl: 'https://images.unsplash.com/photo-1631269666723-868128362d85?auto=format&fit=crop&q=80&w=800',
        createdAt: new Date().toISOString()
      },
      {
        ownerId: user.uid,
        name: 'Cullinan Black Badge',
        make: 'Rolls-Royce',
        model: 'Cullinan',
        year: 2024,
        licensePlate: 'UG 002 VIP',
        status: 'with_driver',
        currentDriver: 'David M.',
        locationLat: 0.3186,
        locationLng: 32.5811,
        locationName: 'Kampala Serena Hotel',
        fuelLevel: 45,
        batteryLevel: 100,
        mileage: 3400,
        hasTracker: true,
        imageUrl: 'https://images.unsplash.com/photo-1633505677864-1e0e8544c4b5?auto=format&fit=crop&q=80&w=800',
        createdAt: new Date().toISOString()
      },
      {
        ownerId: user.uid,
        name: 'Bentayga Speed',
        make: 'Bentley',
        model: 'Bentayga',
        year: 2022,
        licensePlate: 'UG 003 VIP',
        status: 'maintenance',
        currentDriver: 'Unassigned',
        locationLat: 0.3300,
        locationLng: 32.6000,
        locationName: 'Speke Motors Service',
        fuelLevel: 15,
        batteryLevel: 90,
        mileage: 15000,
        hasTracker: true,
        imageUrl: 'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?auto=format&fit=crop&q=80&w=800',
        createdAt: new Date().toISOString()
      },
      {
        ownerId: user.uid,
        name: 'Maybach S680',
        make: 'Mercedes-Benz',
        model: 'Maybach S-Class',
        year: 2023,
        licensePlate: 'UG 004 VIP',
        status: 'in_garage',
        currentDriver: 'Peter S.',
        locationLat: 0.3258,
        locationLng: 32.5920,
        locationName: 'Ruparelia Residence, Kololo',
        fuelLevel: 95,
        batteryLevel: 100,
        mileage: 800,
        hasTracker: false,
        imageUrl: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800',
        createdAt: new Date().toISOString()
      },
      {
        ownerId: user.uid,
        name: 'Lexus LX 600 VIP',
        make: 'Lexus',
        model: 'LX 600',
        year: 2024,
        licensePlate: 'UG 005 VIP',
        status: 'with_driver',
        currentDriver: 'Samuel K.',
        locationLat: 0.3136,
        locationLng: 32.5811,
        locationName: 'Entebbe Expressway',
        fuelLevel: 60,
        batteryLevel: 100,
        mileage: 5200,
        hasTracker: true,
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
        createdAt: new Date().toISOString()
      },
      {
        ownerId: user.uid,
        name: 'Rally Spec Impreza',
        make: 'Subaru',
        model: 'Impreza WRX STI',
        year: 2018,
        licensePlate: 'UG RALLY 1',
        status: 'maintenance',
        currentDriver: 'Rajiv R.',
        locationLat: 0.3300,
        locationLng: 32.6000,
        locationName: 'Speke Motors Service',
        fuelLevel: 100,
        batteryLevel: 80,
        mileage: 25000,
        hasTracker: true,
        imageUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800',
        createdAt: new Date().toISOString()
      }
    ];

    const batch = writeBatch(db);
    demoVehicles.forEach(v => {
      const newRef = doc(collection(db, 'vehicles'));
      batch.set(newRef, v);
    });
    await batch.commit();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const batch = writeBatch(db);
        results.data.forEach((row: any) => {
          const newRef = doc(collection(db, 'vehicles'));
          batch.set(newRef, {
            ownerId: user.uid,
            name: row.name || 'Unknown',
            make: row.make || 'Unknown',
            model: row.model || 'Unknown',
            year: parseInt(row.year) || new Date().getFullYear(),
            licensePlate: row.licensePlate || '',
            status: row.status || 'in_garage',
            createdAt: new Date().toISOString(),
            hasTracker: row.hasTracker === 'true' || row.hasTracker === 'TRUE'
          });
        });
        await batch.commit();
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Executive Garage</h1>
          <p className="text-gray-500 mt-1">Manage your luxury fleet and track diagnostics.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 font-medium text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
          
          <button 
            onClick={handleLoadDemoFleet}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Demo Fleet
          </button>

          <button 
            onClick={handleClearFleet}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl shadow-sm hover:bg-red-100 transition-all font-medium text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>

          <Link 
            to="/add-vehicle"
            className="flex items-center gap-2 px-5 py-2 bg-primary-dark text-white rounded-xl shadow-md hover:bg-primary-hover transition-all font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Link>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Car className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-primary-dark mb-2">Your garage is empty</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Add your first vehicle manually, upload a CSV, or load the demo fleet to get started.</p>
          <button 
            onClick={handleLoadDemoFleet}
            className="px-6 py-3 bg-primary-dark text-white rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-md"
          >
            Load Demo Fleet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <div 
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
              className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all cursor-pointer border border-gray-100 group"
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {vehicle.imageUrl ? (
                  <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                    <CraneLogo className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <div className={`w-3 h-3 rounded-full shadow-sm border-2 border-white ${
                    vehicle.status === 'in_garage' ? 'bg-green-500' :
                    vehicle.status === 'with_driver' ? 'bg-blue-500' :
                    vehicle.status === 'maintenance' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} title={vehicle.status} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary-dark">{vehicle.name}</h3>
                    <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                    {vehicle.licensePlate}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Driver</span>
                    <span className="font-medium text-gray-900">{vehicle.currentDriver || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-gray-900 truncate max-w-[150px]">{vehicle.locationName || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVehicle && (
        <CarDetailsModal 
          vehicle={selectedVehicle} 
          onClose={() => setSelectedVehicle(null)} 
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
