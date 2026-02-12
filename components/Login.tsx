import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Loader2, User, GraduationCap, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const { t } = useLanguage();

  // Quick access buttons — use AuthContext login which goes through the API layer
  const handleQuickLogin = async (emailHint: string) => {
    try {
      await login(emailHint, 'demo');
    } catch {
      // error is handled by AuthContext
    }
  };

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
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-xl shadow-primary-200 mb-6">
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

          {/* MVP Quick Access Buttons */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@edukiato.edu')}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all group disabled:opacity-50"
            >
              <Shield size={20} className="text-slate-400 group-hover:text-primary-600 mb-1" />
              <span className="text-xs font-semibold text-slate-600 group-hover:text-primary-700">{t.login.admin}</span>
            </button>
            <button
              onClick={() => handleQuickLogin('elena@edukiato.edu')}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all group disabled:opacity-50"
            >
              <User size={20} className="text-slate-400 group-hover:text-primary-600 mb-1" />
              <span className="text-xs font-semibold text-slate-600 group-hover:text-primary-700">{t.login.teacher}</span>
            </button>
            <button
              onClick={() => handleQuickLogin('sofia@student.com')}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all group disabled:opacity-50"
            >
              <GraduationCap size={20} className="text-slate-400 group-hover:text-primary-600 mb-1" />
              <span className="text-xs font-semibold text-slate-600 group-hover:text-primary-700">{t.login.student}</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">{t.login.orEmail}</span>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
};