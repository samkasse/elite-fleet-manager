import React from 'react';
import { X, MapPin, Battery, Fuel, Calendar, User, Trash2, Car } from 'lucide-react';

interface CarDetailsModalProps {
  vehicle: any;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function CarDetailsModal({ vehicle, onClose, onDelete }: CarDetailsModalProps) {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="relative h-64 bg-gray-100">
          {vehicle.imageUrl ? (
            <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-dark/5">
              <Car className="w-24 h-24 text-primary-dark/20" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-800 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-primary-dark shadow-sm">
              {vehicle.licensePlate}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
              vehicle.status === 'in_garage' ? 'bg-green-100/90 text-green-800' :
              vehicle.status === 'with_driver' ? 'bg-blue-100/90 text-blue-800' :
              vehicle.status === 'maintenance' ? 'bg-red-100/90 text-red-800' :
              'bg-gray-100/90 text-gray-800'
            }`}>
              {vehicle.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark">{vehicle.name}</h2>
              <p className="text-gray-500">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
              title="Delete Vehicle"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <User className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Driver</span>
              </div>
              <p className="font-semibold text-gray-900">{vehicle.currentDriver || 'Unassigned'}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Location</span>
              </div>
              <p className="font-semibold text-gray-900 truncate" title={vehicle.locationName}>
                {vehicle.locationName || 'Unknown'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Last Serviced</span>
              </div>
              <p className="font-semibold text-gray-900">
                {vehicle.lastServiced ? new Date(vehicle.lastServiced).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Fuel className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Fuel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${vehicle.fuelLevel < 20 ? 'bg-red-500' : 'bg-primary-dark'}`}
                    style={{ width: `${vehicle.fuelLevel || 0}%` }}
                  />
                </div>
                <span className="font-semibold text-gray-900 text-sm">{vehicle.fuelLevel || 0}%</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Battery className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Battery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${vehicle.batteryLevel < 20 ? 'bg-red-500' : 'bg-accent-green'}`}
                    style={{ width: `${vehicle.batteryLevel || 0}%` }}
                  />
                </div>
                <span className="font-semibold text-gray-900 text-sm">{vehicle.batteryLevel || 0}%</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Mileage</span>
              </div>
              <p className="font-semibold text-gray-900">{vehicle.mileage?.toLocaleString() || 0} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
