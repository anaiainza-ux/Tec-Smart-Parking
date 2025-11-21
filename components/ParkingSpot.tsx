import React from 'react';
import { ParkingSpot as SpotType } from '../types';

interface ParkingSpotProps {
  spot: SpotType;
  onClick: (spot: SpotType) => void;
}

export const ParkingSpot: React.FC<ParkingSpotProps> = ({ spot, onClick }) => {
  const isOccupied = spot.is_occupied_now === 1;

  return (
    <div 
      onClick={() => onClick(spot)}
      className={`
        group relative h-44 rounded-xl cursor-pointer transition-all duration-300 
        flex flex-col items-center justify-center border
        hover:-translate-y-1
        ${isOccupied 
          ? 'bg-tec-surface border-tec-orange/50 hover:border-tec-orange' 
          : 'bg-tec-surface border-tec-green/50 hover:border-tec-green'}
        shadow-white-glow hover:shadow-white-glow-strong
      `}
    >
      {/* Glow effect inside based on status */}
      <div 
        className={`absolute inset-0 opacity-5 rounded-xl transition-opacity duration-300 group-hover:opacity-10 ${isOccupied ? 'bg-tec-orange' : 'bg-tec-green'}`} 
      />

      <h3 className="text-4xl font-black text-white z-10 tracking-tighter">{spot.spot_number}</h3>
      
      <div className={`mt-3 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest z-10 border ${
        isOccupied 
          ? 'bg-tec-orange/10 border-tec-orange text-tec-orange shadow-[0_0_10px_rgba(255,140,66,0.2)]' 
          : 'bg-tec-green/10 border-tec-green text-tec-green shadow-[0_0_10px_rgba(0,230,118,0.2)]'
      }`}>
        {isOccupied ? 'Ocupado' : 'Disponible'}
      </div>
      
      {spot.is_disability_spot && (
        <div className="absolute top-3 right-3 text-tec-light-blue opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(151,210,251,0.5)] rounded-full p-1 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </div>
  );
};