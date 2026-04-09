import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export interface LoginProps {
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {
      // error is handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full relative">
        {/* Logo Section */}
        <div className="text-center mb-10 relative">
          {onBack && (
            <button 
              onClick={onBack} 
              className="absolute -top-4 -left-4 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition-all flex items-center justify-center z-10"
              title="Volver"
            >
              <ArrowLeft size={22} strokeWidth={2.5} />
            </button>
          )}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 mb-6">
            <span className="text-3xl font-bold">E</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.login.welcome}</h1>
          <p className="text-slate-500 mt-2">{t.login.subtitle}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">{t.login.emailLabel}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  placeholder="name@edukiato.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">{t.login.passwordLabel}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-base hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {t.login.signIn} <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 text-center mb-4 uppercase tracking-wider">Acceso Demo Rápido</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={(e) => { e.preventDefault(); login('julia.ramos.lopez@demo.edu', 'vinculos'); }} 
                className="py-2 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl font-medium text-sm transition-colors border border-purple-200"
              >
                Super Admin
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); login('martina.gimenez.ramos@demo.edu', 'vinculos'); }} 
                className="py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-medium text-sm transition-colors border border-blue-200"
              >
                Admin
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); login('mia.molina.castro@demo.edu', 'vinculos'); }} 
                className="py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium text-sm transition-colors border border-emerald-200"
              >
                Docente
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); login('emma.castro.gimenez@demo.edu', 'vinculos'); }} 
                className="py-2 px-3 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl font-medium text-sm transition-colors border border-amber-200"
              >
                Padre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};