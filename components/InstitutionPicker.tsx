import React from 'react';
import { UserInstitution } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, ChevronRight, LogOut } from 'lucide-react';

export const InstitutionPicker: React.FC = () => {
    const { user, selectInstitution, logout } = useAuth();
    const { t } = useLanguage();
    const institutions = user?.institutions || [];

    // If only one institution, auto-select it
    React.useEffect(() => {
        if (institutions.length === 1) {
            selectInstitution(institutions[0]);
        }
    }, [institutions, selectInstitution]);

    // While auto-selecting, show loading
    if (institutions.length <= 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
            </div>
        );
    }

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
                        {t.institutionPicker?.subtitle || `Hola ${user?.name}, ¿en cuál institución deseas trabajar?`}
                    </p>
                </div>

                {/* Institution Cards */}
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
                                    {inst.role === 'ADMIN' ? '🛡️ Administrador' :
                                        inst.role === 'TEACHER' ? '📚 Docente' :
                                            inst.role === 'STUDENT' ? '🎓 Estudiante' : inst.role}
                                </p>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                        </button>
                    ))}
                </div>

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
