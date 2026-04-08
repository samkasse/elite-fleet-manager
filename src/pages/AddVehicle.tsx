import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Car, Save, ArrowLeft } from 'lucide-react';

export function AddVehicle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    status: 'in_garage',
    currentDriver: '',
    hasTracker: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const newRef = doc(collection(db, 'vehicles'));
      await setDoc(newRef, {
        ownerId: user.uid,
        ...formData,
        year: Number(formData.year),
        createdAt: new Date().toISOString(),
        fuelLevel: 100,
        batteryLevel: 100,
        mileage: 0,
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding vehicle', error);
      alert('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-dark mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Garage
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-dark/5 rounded-2xl">
            <Car className="w-6 h-6 text-primary-dark" />
          </div>
          <h1 className="text-2xl font-bold text-primary-dark">Add New Vehicle</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vehicle Name (Nickname)</label>
              <input 
                required
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark outline-none transition-all"
                placeholder="e.g. VIP Phantom"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">License Plate</label>
              <input 
                type="text" 
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark outline-none transition-all uppercase"
                placeholder="UG 001 VIP"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Make</label>
              <input 
                required
                type="text" 
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark outline-none transition-all"
                placeholder="e.g. Rolls-Royce"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Model</label>
              <input 
                required
                type="text" 
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark outline-none transition-all"
                placeholder="e.g. Phantom"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <input 
                required
                type="number" 
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark outline-none transition-all bg-white"
              >
                <option value="in_garage">In Garage</option>
                <option value="with_driver">With Driver</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="hasTracker"
                checked={formData.hasTracker}
                onChange={handleChange}
                className="w-5 h-5 rounded text-primary-dark focus:ring-primary-dark"
              />
              <div>
                <p className="font-medium text-gray-900">Active GPS Tracker Installed</p>
                <p className="text-sm text-gray-500">Enable live location tracking for this vehicle</p>
              </div>
            </label>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-primary-dark text-white rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-md disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
