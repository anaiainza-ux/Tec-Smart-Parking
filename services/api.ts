import { User, ParkingSpot, Reservation, AdminStats } from '../types';

const BASE_URL = 'https://oracleapex.com/ords/a00842796';

// --- FALLBACK DATA (Updated to match new Schema with Levels) ---
const MOCK_USER: User = {
  user_id: 999,
  nombre: "Usuario Demo (Offline)",
  matricula: "A00000000",
  tiene_discapacidad: 0
};

const MOCK_SPOTS: ParkingSpot[] = [
  // LEVEL 1
  { spot_id: 101, level_id: 1, available: 1, spot_number: "101" },
  { spot_id: 102, level_id: 1, available: 0, spot_number: "102" },
  { spot_id: 103, level_id: 1, available: 1, spot_number: "103" },
  { spot_id: 104, level_id: 1, available: 1, spot_number: "104" },
  // LEVEL 2
  { spot_id: 201, level_id: 2, available: 1, spot_number: "201" },
  { spot_id: 202, level_id: 2, available: 0, spot_number: "202" },
  { spot_id: 203, level_id: 2, available: 0, spot_number: "203" },
  { spot_id: 204, level_id: 2, available: 1, spot_number: "204" },
];

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  try {
    const json = await response.json();
    return json.items ? json.items : json;
  } catch (e) {
    throw new Error("Failed to parse JSON response");
  }
};

export const api = {
  login: async (matricula: string, nombre: string, hasDisability: boolean): Promise<User> => {
    try {
      const response = await fetch(`${BASE_URL}/smartparking/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, nombre, tiene_discapacidad: hasDisability ? 1 : 0 }),
      });
      const data = await handleResponse(response);
      const userData = Array.isArray(data) ? data[0] : data;
      if (!userData) throw new Error("No user data returned");
      return {
        user_id: userData.user_id || 1,
        nombre: userData.nombre || nombre,
        matricula: userData.matricula || matricula,
        tiene_discapacidad: userData.tiene_discapacidad !== undefined ? userData.tiene_discapacidad : (hasDisability ? 1 : 0)
      };
    } catch (error) {
      console.warn("API Login Failed. Using Fallback Data.", error);
      return { ...MOCK_USER, nombre, matricula, tiene_discapacidad: hasDisability ? 1 : 0 };
    }
  },

  getSpots: async (disability: boolean): Promise<ParkingSpot[]> => {
    try {
      // NEW ENDPOINT: /spotStatus/consulta
      const response = await fetch(`${BASE_URL}/spotStatus/consulta`);
      const rawSpots = await handleResponse(response);

      if (!Array.isArray(rawSpots) || rawSpots.length === 0) return MOCK_SPOTS;

      const spots: ParkingSpot[] = rawSpots.map((s: any) => ({
        spot_id: s.spot_id,
        level_id: s.level_id || 1, // Default to level 1 if missing
        available: s.available !== undefined ? s.available : 1, // 1 = Available
        date_update: s.date_update,
        // Derived props for UI consistency
        spot_number: `Lugar ${s.spot_id}`,
        is_disability_spot: s.spot_id >= 200 // Logic assumption or derive from DB if column existed
      }));

      // If user has disability, we might want to prioritize those spots, 
      // but the new requirement is Level Filtering. We return all and let Dashboard filter.
      return spots;

    } catch (error) {
      console.warn("API getSpots Failed. Using Fallback Data.", error);
      return MOCK_SPOTS;
    }
  },

  getReservations: async (spotId: number, date: string): Promise<Reservation[]> => {
    try {
      const url = new URL(`${BASE_URL}/smartparking/reservations`);
      url.searchParams.append('spot_id', spotId.toString());
      url.searchParams.append('date', date); 
      const response = await fetch(url.toString());
      const reservations = await handleResponse(response);
      if (!Array.isArray(reservations)) return [];
      return reservations.map((r: any) => ({
        start_time: r.start_time,
        end_time: r.end_time
      }));
    } catch (error) {
      return [];
    }
  },

  createReservation: async (userId: number, spotId: number, startTime: string, endTime: string): Promise<{ status: string, reservation_id: number }> => {
    try {
      const response = await fetch(`${BASE_URL}/smartparking/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, spot_id: spotId, start_time: startTime, end_time: endTime }),
      });
      const result = await handleResponse(response);
      return { status: 'success', reservation_id: result.reservation_id || result.id || 0 };
    } catch (error) {
      return { status: 'success', reservation_id: Math.floor(Math.random() * 10000) };
    }
  },

  saveSchedule: async (userId: number, slots: string[]): Promise<void> => {
    try {
      const requests = slots.map(slot => 
        fetch(`${BASE_URL}/smartparking/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, time_slot: slot })
        })
      );
      await Promise.all(requests);
    } catch (error) {
      console.warn("API saveSchedule Failed.", error);
    }
  },

  getAdminStats: async (): Promise<AdminStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Updated calculation based on new 'available' field (1=Free, 0=Occupied)
    const occupied = MOCK_SPOTS.filter(s => s.available === 0).length;
    
    return {
      temperature: 28.5,
      humidity: 45,
      totalSpots: MOCK_SPOTS.length,
      occupiedSpots: occupied,
      availableSpots: MOCK_SPOTS.length - occupied,
      trafficFlow: [10, 15, 8, 22, 30, 45, 30, 20, 15, 10, 5, 2],
      dailyOccupancy: [50, 60, 55, 70, 85, 40, 30]
    };
  }
};