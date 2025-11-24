import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { Button } from './Button';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onAdminLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onAdminLogin }) => {
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [hasDisability, setHasDisability] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !matricula) return;

    setLoading(true);
    try {
      const user = await api.login(matricula, nombre, hasDisability);
      onLoginSuccess(user);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-4 relative">
      {/* Main Card with White Glow Shadow */}
      <div className="w-full max-w-md bg-tec-surface rounded-xl shadow-white-glow p-8 border border-white/10 z-10">
        <h1 className="text-4xl font-bold text-white mb-2 text-center tracking-tight">Smart Parking</h1>
        <p className="text-tec-light-blue mb-8 text-center uppercase tracking-widest text-xs font-semibold">Tec de Monterrey</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 bg-[#051024] border border-blue-900 text-white rounded-lg focus:ring-2 focus:ring-tec-light-blue focus:border-transparent outline-none shadow-inner placeholder-gray-600"
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Matrícula</label>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full px-4 py-3 bg-[#051024] border border-blue-900 text-white rounded-lg focus:ring-2 focus:ring-tec-light-blue focus:border-transparent outline-none shadow-inner placeholder-gray-600"
              placeholder="Ej. A00123456"
              required
            />
          </div>

          <div className="flex items-center justify-between bg-blue-900/30 p-4 rounded-lg border border-white/5">
            <span className="text-sm text-tec-light-blue font-medium">
              ¿Requieres lugar para personas con discapacidad?
            </span>
            <button
              type="button"
              onClick={() => setHasDisability(!hasDisability)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-tec-blue focus:ring-offset-2 focus:ring-offset-tec-bg-dark ${
                hasDisability ? 'bg-tec-orange' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  hasDisability ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <Button type="submit" className="w-full shadow-lg shadow-blue-900/50" isLoading={loading}>
            Ingresar
          </Button>
        </form>
      </div>

      <div className="mt-8">
        <button 
          onClick={onAdminLogin}
          className="text-gray-500 text-sm hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
        >
          Acceso Administrativo
        </button>
      </div>
    </div>
  );
};