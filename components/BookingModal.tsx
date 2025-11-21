import React, { useEffect, useState } from 'react';
import { ParkingSpot, Reservation, User } from '../types';
import { api } from '../services/api';
import { Button } from './Button';

interface BookingModalProps {
  spot: ParkingSpot;
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onReservationComplete: () => void;
}

// Generate slots from 7 AM to 11 PM (2 hour intervals)
const GENERATED_SLOTS = [
  { start: '07:00', end: '09:00', label: '7:00 AM - 9:00 AM' },
  { start: '09:00', end: '11:00', label: '9:00 AM - 11:00 AM' },
  { start: '11:00', end: '13:00', label: '11:00 AM - 1:00 PM' },
  { start: '13:00', end: '15:00', label: '1:00 PM - 3:00 PM' },
  { start: '15:00', end: '17:00', label: '3:00 PM - 5:00 PM' },
  { start: '17:00', end: '19:00', label: '5:00 PM - 7:00 PM' },
  { start: '19:00', end: '21:00', label: '7:00 PM - 9:00 PM' },
  { start: '21:00', end: '23:00', label: '9:00 PM - 11:00 PM' },
];

export const BookingModal: React.FC<BookingModalProps> = ({ 
  spot, 
  user, 
  isOpen, 
  onClose,
  onReservationComplete 
}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingSlot, setProcessingSlot] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && spot) {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      api.getReservations(spot.spot_id, today)
        .then(data => setReservations(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen, spot]);

  const handleReserve = async (start: string, end: string) => {
    setProcessingSlot(start);
    const today = new Date().toISOString().split('T')[0];
    const startTimeFormatted = `${today} ${start}:00`;
    const endTimeFormatted = `${today} ${end}:00`;

    try {
      await api.createReservation(user.user_id, spot.spot_id, startTimeFormatted, endTimeFormatted);
      onReservationComplete();
      onClose();
    } catch (err) {
      console.error("Reservation failed", err);
    } finally {
      setProcessingSlot(null);
    }
  };

  if (!isOpen) return null;

  const isSlotOccupied = (start: string) => {
    return reservations.some(r => r.start_time === start);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Modal Container with White Glow */}
      <div className="bg-tec-surface rounded-2xl shadow-white-glow-strong w-full max-w-lg overflow-hidden animate-[fadeIn_0.2s_ease-out] border border-white/10">
        <div className="bg-gradient-to-r from-tec-blue to-[#002d85] p-6 flex justify-between items-center border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Lugar #{spot.spot_number}</h2>
            <p className="text-xs text-tec-light-blue mt-1">Selecciona un horario disponible</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="flex justify-center py-12">
               <span className="w-8 h-8 border-4 border-tec-light-blue border-t-transparent rounded-full animate-spin"></span>
             </div>
          ) : (
            <div className="space-y-3">
              {GENERATED_SLOTS.map((slot) => {
                const occupied = isSlotOccupied(slot.start);
                return (
                  <div 
                    key={slot.start} 
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      occupied 
                        ? 'bg-black/30 border-white/5 opacity-60' 
                        : 'bg-white/5 border-white/10 hover:border-tec-light-blue hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold ${occupied ? 'text-gray-500' : 'text-gray-200'}`}>{slot.label}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {occupied ? 'Ocupado' : 'Disponible'}
                      </p>
                    </div>

                    {occupied ? (
                       <span className="px-3 py-1 bg-red-900/20 text-red-400 text-xs font-medium rounded border border-red-900/30">
                         Reservado
                       </span>
                    ) : (
                      <Button 
                        variant="primary" 
                        className="px-4 py-2 text-xs shadow-[0_0_10px_rgba(0,57,165,0.4)]"
                        isLoading={processingSlot === slot.start}
                        onClick={() => handleReserve(slot.start, slot.end)}
                      >
                        Reservar
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};