import React, { useEffect, useState } from 'react';
import { User, ParkingSpot as SpotType } from '../types';
import { api } from '../services/api';
import { ParkingSpot } from './ParkingSpot';
import { BookingModal } from './BookingModal';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [spots, setSpots] = useState<SpotType[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<SpotType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSpots = async () => {
    try {
      const data = await api.getSpots(user.tiene_discapacidad === 1);
      setSpots(data);
    } catch (error) {
      console.error("Failed to fetch spots", error);
    }
  };

  useEffect(() => {
    fetchSpots();
    const interval = setInterval(fetchSpots, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.tiene_discapacidad]);

  const handleSpotClick = (spot: SpotType) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  };

  const handleReservationComplete = () => {
    fetchSpots(); // Immediate refresh
  };

  return (
    <div className="min-h-screen pb-12 bg-tec-bg-dark">
      {/* Header */}
      <header className="bg-tec-surface shadow-white-glow sticky top-0 z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Smart Parking</h1>
            <p className="text-xs text-tec-light-blue uppercase tracking-wider">Hola, {user.nombre}</p>
          </div>
          <div className="flex items-center gap-4">
            {user.tiene_discapacidad === 1 && (
              <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 border border-tec-blue text-tec-light-blue text-xs font-bold shadow-[0_0_10px_rgba(0,57,165,0.4)]">
                <span className="mr-1">♿</span> Zona Accesible
              </span>
            )}
            <button 
              onClick={onLogout}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between bg-tec-surface p-4 rounded-lg border border-white/5 shadow-md">
          <h2 className="text-xl font-bold text-white">Estado Actual</h2>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-tec-green mr-2 shadow-[0_0_8px_#00E676]"></span>
              <span className="text-gray-300">Libre</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-tec-orange mr-2 shadow-[0_0_8px_#FF8C42]"></span>
              <span className="text-gray-300">Ocupado</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {spots.map((spot) => (
            <ParkingSpot 
              key={spot.spot_id} 
              spot={spot} 
              onClick={handleSpotClick} 
            />
          ))}
        </div>

        {spots.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                <p>Cargando información del sistema...</p>
            </div>
        )}
      </main>

      {/* Reservation Modal */}
      {selectedSpot && (
        <BookingModal 
          isOpen={isModalOpen}
          spot={selectedSpot}
          user={user}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSpot(null);
          }}
          onReservationComplete={handleReservationComplete}
        />
      )}
    </div>
  );
};