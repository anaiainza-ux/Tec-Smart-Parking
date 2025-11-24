import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AdminStats } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-refresh data every 5 seconds to simulate real-time sensors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen text-tec-light-blue">
         <span className="w-10 h-10 border-4 border-tec-blue border-t-transparent rounded-full animate-spin mr-3"></span>
         Cargando sensores...
      </div>
    );
  }

  // Calculate percentages for charts
  const occupancyRate = Math.round((stats.occupiedSpots / stats.totalSpots) * 100);
  const maxTraffic = Math.max(...stats.trafficFlow);

  return (
    <div className="min-h-screen bg-tec-bg-dark pb-12">
      {/* Header */}
      <header className="bg-tec-surface shadow-white-glow border-b border-white/10 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></span>
              Centro de Comando
            </h1>
            <p className="text-xs text-tec-light-blue uppercase tracking-wider">Administrador de Sistema</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:border-tec-orange"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* SENSOR: Temperature */}
        <div className="bg-tec-surface rounded-xl p-6 border border-white/10 shadow-white-glow relative overflow-hidden group hover:border-tec-light-blue/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Temperatura</h3>
          <div className="flex items-end">
            <span className="text-5xl font-black text-white">{stats.temperature}°C</span>
          </div>
          <div className="mt-4 w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000" 
              style={{ width: `${(stats.temperature / 50) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Sensor Interno: Nivel 2</p>
        </div>

        {/* SENSOR: Humidity */}
        <div className="bg-tec-surface rounded-xl p-6 border border-white/10 shadow-white-glow relative overflow-hidden group hover:border-tec-blue/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Humedad</h3>
          <div className="flex items-end">
            <span className="text-5xl font-black text-white">{stats.humidity}%</span>
          </div>
          <div className="mt-4 w-full bg-gray-700 h-2 rounded-full overflow-hidden">
             <div 
              className="h-full bg-gradient-to-r from-tec-light-blue to-blue-600 transition-all duration-1000" 
              style={{ width: `${stats.humidity}%` }}
            ></div>
          </div>
           <p className="text-xs text-gray-500 mt-2">Calidad de aire: Óptima</p>
        </div>

        {/* STATS: Real-time Occupancy */}
        <div className="md:col-span-2 bg-tec-surface rounded-xl p-6 border border-white/10 shadow-white-glow flex items-center justify-between">
            <div>
               <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Ocupación Actual</h3>
               <p className="text-3xl font-bold text-white mb-4">{stats.occupiedSpots} / {stats.totalSpots} <span className="text-base font-normal text-gray-400">Lugares</span></p>
               
               <div className="flex gap-4 text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-tec-green rounded-full shadow-[0_0_5px_#4CAF50]"></div>
                   <span className="text-white font-medium">{stats.availableSpots} Libres</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-tec-orange rounded-full shadow-[0_0_5px_#FF8C42]"></div>
                   <span className="text-white font-medium">{stats.occupiedSpots} Ocupados</span>
                 </div>
               </div>
            </div>

            {/* CSS-only Donut Chart */}
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                 style={{
                   background: `conic-gradient(var(--tec-naranja-acento) 0% ${occupancyRate}%, var(--verde-disponible) ${occupancyRate}% 100%)`
                 }}>
               <div className="w-24 h-24 bg-tec-surface rounded-full flex items-center justify-center">
                 <span className="text-xl font-bold text-white">{occupancyRate}%</span>
               </div>
            </div>
        </div>

        {/* CHART: Traffic Flow */}
        <div className="lg:col-span-3 bg-tec-surface rounded-xl p-6 border border-white/10 shadow-white-glow">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Flujo de Autos (Tiempo Real)</h3>
              <span className="px-3 py-1 bg-blue-900/30 text-tec-light-blue text-xs rounded border border-blue-900">Últimas 12 Horas</span>
           </div>
           
           <div className="h-48 flex items-end justify-between gap-2 px-2">
              {stats.trafficFlow.map((val, idx) => (
                <div key={idx} className="w-full flex flex-col items-center group">
                   <div 
                      className="w-full bg-tec-blue/40 border-t-2 border-tec-light-blue rounded-t-sm hover:bg-tec-blue transition-all duration-300 relative group"
                      style={{ height: `${(val / maxTraffic) * 100}%` }}
                   >
                     {/* Tooltip */}
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/20">
                       {val} autos
                     </div>
                   </div>
                   <span className="text-[10px] text-gray-500 mt-2">{idx * 2}h</span>
                </div>
              ))}
           </div>
        </div>

        {/* INFO: System Status */}
        <div className="bg-gradient-to-br from-blue-900 to-black rounded-xl p-6 border border-white/10 shadow-white-glow flex flex-col justify-center">
            <h3 className="text-white font-bold mb-4">Estado del Sistema</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm">Plumas Acceso</span>
                <span className="text-tec-green text-xs font-bold px-2 py-1 bg-green-900/20 rounded">ONLINE</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-gray-400 text-sm">Base de Datos</span>
                <span className="text-tec-green text-xs font-bold px-2 py-1 bg-green-900/20 rounded">CONNECTED</span>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};