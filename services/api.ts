import { User, ParkingSpot, Reservation, AdminStats } from '../types';

const BASE_URL = 'https://oracleapex.com/ords/a00842796/smartparking';

// --- FALLBACK DATA (Matches Project Requirements: 8 Spots Total) ---
const MOCK_USER: User = {
  user_id: 999,
  nombre: "Usuario Demo (Offline)",
  matricula: "A00000000",
  tiene_discapacidad: 0
};

// Config: 6 Normal Spots, 2 Disability Spots. 
// Scenario: Only 2 Normal spots are occupied (102 and 105).
const MOCK_SPOTS: ParkingSpot[] = [
  // Normal Spots (6)
  { spot_id: 101, spot_number: "A-01", is_occupied_now: 0, is_disability_spot: false },
  { spot_id: 102, spot_number: "A-02", is_occupied_now: 1, is_disability_spot: false }, // Occupied
  { spot_id: 103, spot_number: "A-03", is_occupied_now: 0, is_disability_spot: false },
  { spot_id: 104, spot_number: "A-04", is_occupied_now: 0, is_disability_spot: false },
  { spot_id: 105, spot_number: "A-05", is_occupied_now: 1, is_disability_spot: false }, // Occupied
  { spot_id: 106, spot_number: "A-06", is_occupied_now: 0, is_disability_spot: false },
  // Disability Spots (2)
  { spot_id: 201, spot_number: "D-01", is_occupied_now: 0, is_disability_spot: true },
  { spot_id: 202, spot_number: "D-02", is_occupied_now: 0, is_disability_spot: true }, 
];

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const text = await response.text();
      console.warn(`API Error Response: ${response.status}`, text);
    } catch (e) {
      console.warn(`API Error Response: ${response.status}`);
    }
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
      const response = await fetch(`${BASE_URL}/login`, {
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
    const returnMocks = () => {
      if (disability) return MOCK_SPOTS.filter(s => s.is_disability_spot);
      return MOCK_SPOTS.filter(s => !s.is_disability_spot);
    };

    try {
      const response = await fetch(`${BASE_URL}/spots`);
      const rawSpots = await handleResponse(response);

      if (!Array.isArray(rawSpots)) throw new Error("Invalid API response format");
      if (rawSpots.length === 0) return returnMocks();

      const spots: ParkingSpot[] = rawSpots.map((s: any) => ({
        spot_id: s.spot_id,
        spot_number: s.spot_number || `Spot-${s.spot_id}`,
        is_occupied_now: s.is_occupied_now === 1 ? 1 : 0,
        is_disability_spot: s.is_disability === 1 || (typeof s.spot_number === 'string' && s.spot_number.startsWith('D'))
      }));

      const filteredSpots = disability 
        ? spots.filter(s => s.is_disability_spot)
        : spots.filter(s => !s.is_disability_spot);

      if (filteredSpots.length === 0 && spots.length > 0) {
         // return returnMocks(); 
      }
      return filteredSpots;
    } catch (error) {
      console.warn("API getSpots Failed. Using Fallback Data.", error);
      return returnMocks();
    }
  },

  getReservations: async (spotId: number, date: string): Promise<Reservation[]> => {
    try {
      const url = new URL(`${BASE_URL}/reservations`);
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
      const response = await fetch(`${BASE_URL}/reservations`, {
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
        fetch(`${BASE_URL}/schedule`, {
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

  // --- ADMIN API SIMULATION ---
  getAdminStats: async (): Promise<AdminStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // CALCULATE BASED ON MOCK_SPOTS (Simulation of real DB query)
    const total = MOCK_SPOTS.length; // Should be 8
    const occupied = MOCK_SPOTS.filter(s => s.is_occupied_now === 1).length; // Should be 2
    
    // Simulate Temperature (e.g., Monterrey Avg)
    const temp = 28 + Math.random() * 4 - 2; // 26 to 30 degrees
    
    // Simulate Humidity
    const humidity = 40 + Math.random() * 10; // 40% to 50%

    // Simulate Traffic Flow (Last 12 hours)
    const traffic = Array.from({length: 12}, () => Math.floor(Math.random() * 20));

    // Simulate Daily Occupancy (Last 7 days)
    const daily = Array.from({length: 7}, () => Math.floor(Math.random() * 10));

    return {
      temperature: parseFloat(temp.toFixed(1)),
      humidity: Math.round(humidity),
      totalSpots: total,
      occupiedSpots: occupied,
      availableSpots: total - occupied,
      trafficFlow: traffic,
      dailyOccupancy: daily
    };
  }
};