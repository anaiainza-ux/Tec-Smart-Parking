import React, { useState } from 'react';
import { Button } from './Button';

interface SchedulePageProps {
  onComplete: () => void;
}

const TIME_SLOTS = [
  "7:00 AM - 9:00 AM",
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "1:00 PM - 3:00 PM",
  "3:00 PM - 5:00 PM",
  "5:00 PM - 7:00 PM",
  "7:00 PM - 9:00 PM",
  "9:00 PM - 11:00 PM"
];

export const SchedulePage: React.FC<SchedulePageProps> = ({ onComplete }) => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const toggleSlot = (slot: string) => {
    const newSlots = new Set(selectedSlots);
    if (newSlots.has(slot)) {
      newSlots.delete(slot);
    } else {
      newSlots.add(slot);
    }
    setSelectedSlots(newSlots);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Selecciona tus Horarios</h2>
        <p className="text-tec-light-blue mt-2">Optimiza tu experiencia de estacionamiento.</p>
      </div>

      <div className="bg-tec-surface rounded-xl shadow-white-glow p-8 mb-8 border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlots.has(slot);
            return (
              <label 
                key={slot} 
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'border-tec-blue bg-blue-900/40 shadow-[0_0_10px_rgba(0,57,165,0.5)]' 
                    : 'border-white/10 hover:border-tec-light-blue/50 hover:bg-white/5'
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-tec-blue border-tec-blue' : 'border-gray-400'
                }`}>
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`ml-3 font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                  {slot}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button onClick={onComplete} className="w-full shadow-lg shadow-blue-900/50">
          Guardar Horario
        </Button>
        <button 
          onClick={onComplete}
          className="text-gray-500 text-sm hover:text-white transition-colors text-center"
        >
          Omitir por ahora
        </button>
      </div>
    </div>
  );
};