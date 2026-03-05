import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

export const ForcePasswordChange: React.FC = () => {
    const { user, completePasswordChange } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!password || !confirmPassword) {
            setError('Por favor, completa ambos campos.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password === 'vinculos') {
            setError('Debes elegir una contraseña distinta a "vinculos".');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        try {
            await completePasswordChange(password);
            // Si funciona, el AuthContext nos quita la bandera y nos manda al dashboard.
        } catch (err: any) {
            setError(err.message || 'Error al actualizar contraseña');
            setIsLoading(false); // Only toggle false if it errors, since success re-renders App.tsx
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 xl:p-32 relative z-10 bg-white shadow-2xl md:shadow-none min-h-screen">
                <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
                    <div className="flex items-center space-x-3 group cursor-pointer transition-transform hover:scale-105">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 ring-4 ring-primary-50">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-800 group-hover:text-primary-600 transition-colors">
                            Vínculos
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto mt-16 md:mt-0 animate-fade-in">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <UserAvatar name={user.name} role={user.role} className="w-16 h-16 border-4 border-white shadow-md ring-1 ring-slate-200" />
                        <div>
                            <p className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-0.5">Hola,</p>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">{user.name}</h2>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Lock className="text-primary-600" /> Configura tu clave
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Por tu seguridad, solicitamos que cambies la contraseña por defecto en tu primer ingreso.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start text-rose-700 animate-shake">
                            <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Nueva Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all outline-none font-medium placeholder:font-normal placeholder:text-slate-400"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Repite tu Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ShieldCheck size={18} className="text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all outline-none font-medium placeholder:font-normal placeholder:text-slate-400"
                                    placeholder="Repite tu contraseña"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-lg shadow-slate-900/20 group hover:-translate-y-0.5 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Comenzar <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side - Branding/Decoration */}
            <div className="hidden md:flex w-1/2 bg-slate-900 p-12 lg:p-24 xl:p-32 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-0 right-0 p-32 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 right-0 p-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 mt-auto">
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                        Tu espacio <br className="hidden lg:block" /><span className="text-primary-400">seguro y privado</span>.
                    </h2>
                    <p className="text-lg lg:text-xl text-slate-400 font-medium max-w-lg mb-8 leading-relaxed">
                        Configura tu clave personal para acceder al ecosistema educativo y estar siempre conectado.
                    </p>
                </div>
            </div>
        </div>
    );
};
