import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { institutionsApi } from '@/services/api';
import { UserInstitution } from '@/types';
import { Building2, ChevronRight, LogOut, Plus } from 'lucide-react';
import React, { useState } from 'react';

export const InstitutionPicker: React.FC = () => {
    const { user, selectInstitution, logout, token } = useAuth();
    const { t } = useLanguage();
    // Allow mutating local institutions list so we can append newly created ones
    const [institutions, setInstitutions] = useState<UserInstitution[]>(user?.institutions || []);
    const [isCreating, setIsCreating] = useState(false);
    const [newInstName, setNewInstName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBootstrapping, setIsBootstrapping] = useState(false);

    React.useEffect(() => {
        if (!token || institutions.length > 0 || isCreating) return;

        let cancelled = false;
        setIsBootstrapping(true);

        institutionsApi.getAll(token)
            .then((fetched) => {
                if (cancelled) return;
                setInstitutions(fetched || []);
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error('Failed to fetch institutions:', error);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsBootstrapping(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token, institutions.length, isCreating]);

    // If only one institution and not creating, auto-select it
    React.useEffect(() => {
        if (institutions.length === 1 && !isCreating && !isBootstrapping) {
            selectInstitution(institutions[0]);
        }
    }, [institutions, selectInstitution, isCreating, isBootstrapping]);

    // While loading institutions from API or auto-selecting one institution
    if ((isBootstrapping || (institutions.length === 1 && !isCreating)) && !isCreating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
            </div>
        );
    }

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newInstName.trim() || !token) return;

        setIsLoading(true);
        try {
            const newInst = await institutionsApi.create({ institutionName: newInstName.trim() }, token);
            setInstitutions([...institutions, newInst]);
            setIsCreating(false);
            selectInstitution(newInst);
        } catch (error) {
            console.error("Failed to create institution:", error);
            // Could add an error toast here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-4">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
                        <Building2 className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        {t.institutionPicker?.title || 'Selecciona tu institución'}
                    </h1>
                    <p className="text-slate-500">
                        {isCreating ? 'Ingresa el nombre de tu nueva organización' : (t.institutionPicker?.subtitle || `Hola ${user?.name}, ¿en cuál institución deseas trabajar?`)}
                    </p>
                </div>

                {isCreating ? (
                    <form onSubmit={handleCreateSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Institución</label>
                            <input
                                type="text"
                                required
                                autoFocus
                                value={newInstName}
                                onChange={(e) => setNewInstName(e.target.value)}
                                placeholder="Ej: Academia Bauhaus"
                                className="w-full border-slate-200 rounded-xl p-3 text-sm focus:ring-primary-500"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !newInstName.trim()}
                                className="px-5 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50 flex items-center"
                            >
                                {isLoading ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                                ) : (
                                    <Plus size={16} className="mr-2" />
                                )}
                                Crear Institución
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        {institutions.length === 0 && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
                                No hay instituciones asignadas para este usuario. Podés crear una nueva para continuar.
                            </div>
                        )}
                        <div className="space-y-3">
                            {institutions.map((inst) => (
                                <button
                                    key={inst.institutionId}
                                    onClick={() => selectInstitution(inst)}
                                    className="w-full bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-50 transition-all duration-200 group text-left"
                                >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                        {inst.logoUrl ? (
                                            <img src={inst.logoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 size={20} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 truncate group-hover:text-primary-700 transition-colors">
                                            {inst.institutionName}
                                        </p>
                                        <p className="text-sm text-slate-400 capitalize">
                                            {inst.role === 'ADMIN_INSTITUCION' || inst.role === 'SUPER_ADMIN' ? '🛡️ Administrador' :
                                                inst.role === 'DOCENTE' ? '📚 Docente' :
                                                    inst.role === 'ESTUDIANTE' ? '🎓 Estudiante' : inst.role}
                                        </p>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all font-medium"
                        >
                            <Plus size={20} className="mr-2" />
                            Crear Nueva Institución
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center">
                    <button
                        onClick={logout}
                        className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-2 mx-auto transition-colors"
                    >
                        <LogOut size={14} />
                        {t.nav.logOut}
                    </button>
                </div>
            </div>
        </div>
    );
};
