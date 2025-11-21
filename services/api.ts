import { User, ParkingSpot, Reservation } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  login: async (matricula: string, nombre: string, hasDisability: boolean): Promise<User> => {
    await delay(800);
    // Mock response
    return {
      user_id: 1,
      nombre: nombre || 'Usuario Tec',
      matricula: matricula,
      tiene_discapacidad: hasDisability ? 1 : 0,
    };
  },

  getSpots: async (disability: boolean): Promise<ParkingSpot[]> => {
    // Simulate API call: GET /spots?disability={true|false}
    // In a real scenario, the backend filters. Here we return a mock list.
    // For demonstration, we'll randomize occupancy slightly to show the live update feature.
    
    const randomOccupancy = () => Math.random() > 0.5 ? 1 : 0;

    const spots: ParkingSpot[] = [
      // Regular spots
      { spot_id: 1, spot_number: 'A1', is_occupied_now: randomOccupancy(), is_disability_spot: false },
      { spot_id: 2, spot_number: 'A2', is_occupied_now: randomOccupancy(), is_disability_spot: false },
      { spot_id: 3, spot_number: 'A3', is_occupied_now: 0, is_disability_spot: false },
      { spot_id: 4, spot_number: 'B1', is_occupied_now: 1, is_disability_spot: false },
      { spot_id: 5, spot_number: 'B2', is_occupied_now: 0, is_disability_spot: false },
      { spot_id: 6, spot_number: 'B3', is_occupied_now: randomOccupancy(), is_disability_spot: false },
      // Disability spots
      { spot_id: 7, spot_number: 'D1', is_occupied_now: 0, is_disability_spot: true },
      { spot_id: 8, spot_number: 'D2', is_occupied_now: 1, is_disability_spot: true },
    ];

    if (disability) {
      return spots.filter(s => s.is_disability_spot);
    }
    return spots.filter(s => !s.is_disability_spot);
  },

  getReservations: async (spotId: number, date: string): Promise<Reservation[]> => {
    await delay(500);
    // Mocking reservations for specific spots to demonstrate the UI
    // Returns occupied slots for the day
    if (spotId % 2 === 0) {
      return [
        { start_time: '09:00', end_time: '11:00' },
        { start_time: '13:00', end_time: '15:00' },
      ];
    }
    return [
        { start_time: '07:00', end_time: '09:00' }
    ];
  },

  createReservation: async (userId: number, spotId: number, startTime: string, endTime: string): Promise<{ status: string, reservation_id: number }> => {
    await delay(1000);
    return { status: 'success', reservation_id: Math.floor(Math.random() * 1000) };
  }
};
