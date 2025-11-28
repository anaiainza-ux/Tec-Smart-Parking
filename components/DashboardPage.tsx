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
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Modal State
  const [selectedSpot, setSelectedSpot] = useState<SpotType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check disability status
  const isDisabilityUser = user.tiene_discapacidad === 1;

  // 1. Fetch Logic
  const fetchSpots = async () => {
    try {
      const data = await api.getSpots(isDisabilityUser);
      setSpots(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch spots", error);
      setLoading(false);
    }
  };

  // 2. Real-time Polling & Initial Load
  useEffect(() => {
    fetchSpots();
    // Refresh every 5 seconds (Real-time requirement)
    const intervalId = setInterval(fetchSpots, 5000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Filter by Level (FORCED LAYOUT: 4 per level)
  const availableLevels = [1, 2];
  
  // Sort spots by ID to ensure consistent ordering (e.g. 1, 2, 3, 4, 5...)
  const sortedSpots = [...spots].sort((a, b) => a.spot_id - b.spot_id);

  // Split logic: First 4 go to Level 1, Next 4 go to Level 2
  // If disability user, logic ensures they only see Level 1 content effectively because we lock the tab
  const filteredSpots = selectedLevel === 1 
    ? sortedSpots.slice(0, 4) 
    : sortedSpots.slice(4, 8);

  const handleSpotClick = (spot: SpotType) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-12 bg-tec-bg-dark">
      {/* Header */}
      <header className="bg-tec-surface shadow-white-glow sticky top-0 z-30 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tec-green animate-pulse"></span>
              Smart Parking Live
            </h1>
            <p className="text-xs text-tec-light-blue uppercase tracking-wider">
              Hola, {user.nombre} {isDisabilityUser && '(Acceso Preferencial)'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Level Selector */}
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
              {availableLevels.map(level => {
                // HIDE Level 2 if user has disability
                if (isDisabilityUser && level !== 1) return null;

                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      selectedLevel === level 
                        ? 'bg-tec-blue text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isDisabilityUser ? 'Zona Accesible (N1)' : `Nivel ${level}`}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={onLogout}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors ml-2"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Legend */}
        <div className="mb-6 flex items-center justify-between bg-tec-surface/50 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
          <span className="text-sm font-medium text-gray-300">
            {isDisabilityUser ? 'Mostrando Planta Baja' : `Nivel ${selectedLevel}`}
          </span>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-tec-green mr-2 shadow-[0_0_8px_#00E676]"></span>
              <span className="text-tec-green">Disponible</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-tec-orange mr-2 shadow-[0_0_8px_#FF8C42]"></span>
              <span className="text-tec-orange">Ocupado</span>
            </div>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <div className="w-12 h-12 border-4 border-tec-blue border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-tec-light-blue animate-pulse">Sincronizando sensores...</p>
           </div>
        ) : (
          <>
            {filteredSpots.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-[fadeIn_0.5s_ease-out]">
                {filteredSpots.map((spot) => (
                  <ParkingSpot 
                    key={spot.spot_id} 
                    spot={spot} 
                    onClick={handleSpotClick} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-tec-surface rounded-xl border border-white/5 border-dashed">
                  <p className="text-gray-500">No hay lugares registrados en este rango.</p>
              </div>
            )}
          </>
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
          onReservationComplete={() => fetchSpots()}
        />
      )}
    </div>
  );
};