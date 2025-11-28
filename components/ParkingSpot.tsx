import React from 'react';
import { ParkingSpot as SpotType } from '../types';

interface ParkingSpotProps {
  spot: SpotType;
  onClick: (spot: SpotType) => void;
}

export const ParkingSpot: React.FC<ParkingSpotProps> = ({ spot, onClick }) => {
  // Logic: available === 1 is FREE (Green), available === 0 is OCCUPIED (Orange)
  const isAvailable = spot.available === 1;

  return (
    <div 
      onClick={() => onClick(spot)}
      className={`
        group relative h-48 rounded-2xl cursor-pointer transition-all duration-300 
        flex flex-col items-center justify-center border-2
        hover:-translate-y-2 hover:scale-[1.02]
        ${isAvailable 
          ? 'bg-[#051a10] border-tec-green/30 hover:border-tec-green hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]' 
          : 'bg-[#1a0b05] border-tec-orange/30 hover:border-tec-orange hover:shadow-[0_0_20px_rgba(255,140,66,0.3)]'}
        shadow-lg
      `}
    >
      {/* Dynamic Background Glow */}
      <div 
        className={`absolute inset-0 opacity-0 rounded-2xl transition-opacity duration-500 group-hover:opacity-20 bg-gradient-to-br ${
          isAvailable ? 'from-tec-green to-transparent' : 'from-tec-orange to-transparent'
        }`} 
      />

      {/* Spot Number */}
      <h3 className="text-5xl font-black text-white z-10 tracking-tighter drop-shadow-lg">
        {spot.spot_id}
      </h3>
      
      {/* Status Badge */}
      <div className={`mt-4 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] z-10 border transition-all duration-300 ${
        isAvailable 
          ? 'bg-tec-green/10 border-tec-green text-tec-green shadow-[0_0_10px_rgba(0,230,118,0.2)] group-hover:bg-tec-green group-hover:text-black' 
          : 'bg-tec-orange/10 border-tec-orange text-tec-orange shadow-[0_0_10px_rgba(255,140,66,0.2)] group-hover:bg-tec-orange group-hover:text-white'
      }`}>
        {isAvailable ? 'Disponible' : 'Ocupado'}
      </div>

      {/* Level Indicator (Subtle) */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] text-gray-500 font-mono border border-white/10 px-2 py-0.5 rounded bg-black/40">
            N{spot.level_id}
        </span>
      </div>
      
      {/* Optional: Last Update (Tooltip-like) */}
      {spot.date_update && (
        <div className="absolute bottom-2 text-[8px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Actualizado: {new Date(spot.date_update).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};