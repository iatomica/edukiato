import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usersApi } from '@/services/api';
import { User, Mail, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export const Settings: React.FC = () => {
    const { user, token, updateUser } = useAuth();
    const { t } = useLanguage();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Sync if user context changes externally
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const hasChanges = user && (name !== user.name || email !== user.email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !token || !hasChanges) return;

        setIsLoading(true);
        setStatus(null);

        try {
            // 1. Call API to update backend
            const updatedUser = await usersApi.update(user.id, { name, email }, token);

            // 2. Sync React Context Local Storage
            updateUser({ name: updatedUser.name, email: updatedUser.email });

            setStatus({ type: 'success', message: 'Perfil actualizado correctamente.' });

            // Clear success message after 3 seconds
            setTimeout(() => setStatus(null), 3000);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Error al actualizar el perfil.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50/50 min-h-0 custom-scrollbar p-6 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        {t.nav?.settings || 'Configuración'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona tu información personal y preferencias de cuenta.
                    </p>
                </div>

                {/* Main Settings Card */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800">Perfil de Usuario</h2>
                        <p className="text-sm text-slate-500">
                            Esta información será visible para otros miembros de la institución.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">

                        {/* Status Alert */}
                        {status && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 animate-fade-in ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
                                }`}>
                                {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-emerald-600" size={20} /> : <AlertCircle className="shrink-0 text-rose-600" size={20} />}
                                <p className="text-sm font-medium pt-0.5">{status.message}</p>
                            </div>
                        )}

                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre Completo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User size={18} className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-800 font-medium"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-800 font-medium"
                                    placeholder="tu@correo.com"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={!hasChanges || isLoading}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${!hasChanges
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md hover:shadow-primary-600/20'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};
