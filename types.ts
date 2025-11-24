export interface User {
  user_id: number;
  nombre: string;
  matricula?: string;
  tiene_discapacidad: number; // 0 or 1
}

export interface ParkingSpot {
  spot_id: number;
  spot_number: string;
  is_occupied_now: number; // 0 or 1
  is_disability_spot: boolean; // Helper property for frontend filtering
}

export interface Reservation {
  start_time: string; // Format: "HH:mm" or ISO
  end_time: string;
}

export interface AdminStats {
  temperature: number;
  humidity: number;
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  trafficFlow: number[]; // Array of numbers representing cars per hour
  dailyOccupancy: number[]; // Array for bar chart
}

export enum ViewState {
  LOGIN = 'LOGIN',
  SCHEDULE = 'SCHEDULE',
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN',
}