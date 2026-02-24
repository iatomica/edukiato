import React, { useState, useEffect } from 'react';
import { Institution, UserInstitution } from '../types';
import { Search, Plus, Building2, X, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { institutionsApi } from '../services/api';

export const Institutions: React.FC = () => {
    const { user: currentUser, token } = useAuth();
    const [institutions, setInstitutions] = useState<UserInstitution[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    useEffect(() => {
        const fetchInstitutions = async () => {
            if (!token || !isSuperAdmin) return;
            try {
                // Fetch all institutions across the platform
                const data = await institutionsApi.getAll(token);
                setInstitutions(data);
            } catch (error) {
                console.error("Error fetching institutions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isSuperAdmin) {
            fetchInstitutions();
        } else {
            setIsLoading(false);
        }
    }, [isSuperAdmin, token]);

    const handleAddInstitution = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !isSuperAdmin) return;

        const formData = new FormData(e.currentTarget);
        const institutionName = formData.get('name') as string;
        const primaryColor = formData.get('primaryColor') as string;

        try {
            const newInst = await institutionsApi.create({
                institutionName,
                primaryColor,
                secondaryColor: `${primaryColor}99` // simple derivation for mock
            }, token);
            setInstitutions([...institutions, newInst]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error creating institution:", error);
        }
    };

    if (!isSuperAdmin) {
        return (
            <div className="flex h-full items-center justify-center flex-col text-slate-500">
                <Building2 size={48} className="mb-4 opacity-50" />
                <h2 className="text-xl font-bold text-slate-700">Acceso Restringido</h2>
                <p>Solo los Super Administradores pueden ver esta sección.</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="flex h-64 items-center justify-center">Cargando instituciones...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Instituciones</h1>
                    <p className="text-slate-500 mt-1">Administra los tenants (organizaciones) de la plataforma.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center shadow-lg shadow-primary-200"
                >
                    <Plus size={18} className="mr-2" />
                    Nueva Institución
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar institución..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Institución</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Color Principal</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {institutions.map((inst) => (
                                <tr key={inst.institutionId} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {inst.logoUrl ? (
                                                <img src={inst.logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: inst.primaryColor || '#14b8a6' }}>
                                                    {inst.institutionName.charAt(0)}
                                                </div>
                                            )}
                                            <div className="ml-4 font-bold text-slate-900">{inst.institutionName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                                        {inst.institutionSlug}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: inst.primaryColor || '#14b8a6' }}></div>
                                            <span className="font-mono text-xs">{inst.primaryColor || '#14b8a6'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center">
                                <Building2 size={20} className="mr-2 text-primary-600" />
                                Nueva Institución
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddInstitution} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Institución</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none"
                                    placeholder="Ej. Academia de Artes Modernas"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Color Principal (Hex)</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        defaultValue="#14b8a6"
                                        className="h-11 w-11 rounded cursor-pointer border-none p-0 outline-none"
                                    />
                                    <input
                                        type="text"
                                        defaultValue="#14b8a6"
                                        className="flex-1 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                                    Crear Institución
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
