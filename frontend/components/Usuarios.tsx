import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Search, Plus, UserPlus, X, Mail, Shield, Users as UsersIcon, GraduationCap, Edit, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import { usersApi } from '../services/api';

export const Usuarios: React.FC = () => {
    const { user: currentUser, currentInstitution, token } = useAuth();
    const { state, dispatch } = useAppState();
    const [users, setUsers] = useState<User[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddNinoModalOpen, setIsAddNinoModalOpen] = useState(false);

    // User Edit State
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'INSTITUCIONAL' | 'PADRES' | 'ALUMNOS'>('INSTITUCIONAL');
    const [addRole, setAddRole] = useState<UserRole>('DOCENTE');

    // Nino specific states
    const [isSavingNino, setIsSavingNino] = useState(false);
    const [createdNinoConfirmation, setCreatedNinoConfirmation] = useState<Nino | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token || !currentInstitution) return;
            try {
                const data = await usersApi.getAll(currentInstitution.id, token);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [currentInstitution, token]);

    const handleAddNino = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const gender = formData.get('gender') as 'MASCULINO' | 'FEMENINO';
        const birthDate = formData.get('birthDate') as string;
        const allergiesStr = formData.get('allergies') as string;
        const allergies = allergiesStr ? allergiesStr.split(',').map(s => s.trim()).filter(Boolean) : [];
        const parentIds = Array.from(formData.getAll('parentIds')) as string[];
        const aulaId = formData.get('aulaId') as string;

        if (parentIds.length === 0) {
            alert('Debe seleccionar al menos un familiar o tutor responsable.');
            return;
        }
        if (parentIds.length > 5) {
            alert('Puede vincular un máximo de 5 familiares directos por alumno.');
            return;
        }

        setIsSavingNino(true);

        const newNino: Nino = {
            id: `nino_${Date.now()}`,
            institutionId: currentInstitution?.id || 'inst_1',
            name,
            gender,
            birthDate,
            allergies,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            aulaId,
            parentIds,
            attendanceRate: 100
        };

        // Simulate network API delay
        setTimeout(() => {
            dispatch({ type: 'ADD_NINO', payload: newNino });
            setIsSavingNino(false);
            setCreatedNinoConfirmation(newNino);
        }, 1200);
    };

    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !currentInstitution) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as UserRole;

        try {
            const newUser = await usersApi.create(
                { name, email, role },
                currentInstitution.id,
                token
            );
            setUsers([...users, newUser]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !currentInstitution || !editUser) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as UserRole;
        const avatar = formData.get('avatar') as string;

        try {
            const updatedUser = await usersApi.update(
                editUser.id,
                { name, email, role, avatar },
                token
            );
            setUsers(users.map(u => u.id === editUser.id ? updatedUser : u));
            setIsEditModalOpen(false);
            setEditUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleResetPassword = async () => {
        if (!token || !editUser) return;
        if (window.confirm(`¿Estás seguro que deseas enviar un enlace de recuperación de contraseña a ${editUser.email}?`)) {
            try {
                const res = await usersApi.resetPassword(editUser.id, token);
                alert(res.message);
            } catch (error) {
                console.error("Error resetting password", error);
                alert("Ocurrió un error al restablecer la contraseña.");
            }
        }
    };

    if (isLoading) {
        return <div className="flex h-64 items-center justify-center">Cargando directorio...</div>;
    }

    // Filtros según Tab
    const filteredUsers = users.filter(u => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        if (!matchesSearch) return false;

        if (activeTab === 'INSTITUCIONAL') {
            return ['SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE', 'ESPECIALES'].includes(u.role);
        }
        if (activeTab === 'PADRES') {
            return u.role === 'PADRE' || u.role === 'ESTUDIANTE' || !u.role;
        }
        return false;
    });

    const filteredNinos = state.ninos.filter(n => {
        if (activeTab !== 'ALUMNOS') return false;
        return n.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ADMIN_INSTITUCION': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'DOCENTE': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ESPECIALES': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'PADRE': return 'bg-rose-100 text-rose-800 border-rose-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Directorio Completo</h1>
                    <p className="text-slate-500 mt-1">Administra el staff institucional, a las familias y alumnos.</p>
                </div>
                <button
                    onClick={() => activeTab === 'ALUMNOS' ? setIsAddNinoModalOpen(true) : setIsAddModalOpen(true)}
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center shadow-lg shadow-primary-200"
                >
                    <UserPlus size={18} className="mr-2" />
                    {activeTab === 'ALUMNOS' ? 'Inscribir Alumno' : 'Nuevo Usuario'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('INSTITUCIONAL')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors ${activeTab === 'INSTITUCIONAL' ? 'bg-white text-primary-600 border-t border-x border-slate-200 -mb-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Shield size={16} /> Institucional
                </button>
                <button
                    onClick={() => setActiveTab('PADRES')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors ${activeTab === 'PADRES' ? 'bg-white text-primary-600 border-t border-x border-slate-200 -mb-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <UsersIcon size={16} /> Familias / Padres
                </button>
                <button
                    onClick={() => setActiveTab('ALUMNOS')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors ${activeTab === 'ALUMNOS' ? 'bg-white text-primary-600 border-t border-x border-slate-200 -mb-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <GraduationCap size={16} /> Alumnos
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between bg-white z-10 relative">
                    <div className="relative max-w-sm w-full">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil</th>
                                {activeTab === 'INSTITUCIONAL' && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Posición / Rol</th>}
                                {activeTab === 'PADRES' && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hijos Vinculados</th>}
                                {activeTab === 'ALUMNOS' && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sala / Aula</th>}
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Estado / Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* INSTITUCIONAL & PADRES */}
                            {['INSTITUCIONAL', 'PADRES'].includes(activeTab) && filteredUsers.map((u) => {
                                const myKids = state.ninos.filter(n => n.parentIds?.includes(u.id));
                                return (
                                    <tr
                                        key={u.id}
                                        onClick={() => { setEditUser(u); setIsEditModalOpen(true); }}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-primary-100 transition-all" src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`} alt="" />
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{u.name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                                        <Mail size={12} className="mr-1" /> {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {activeTab === 'INSTITUCIONAL' && (
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase border ${getRoleBadgeColor(u.role)}`}>
                                                    {u.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                        )}

                                        {activeTab === 'PADRES' && (
                                            <td className="px-6 py-4">
                                                {u.role === 'ESTUDIANTE' ? (
                                                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md">Alumno</span>
                                                ) : myKids.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {myKids.map(k => (
                                                            <span key={k.id} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium border border-slate-200">
                                                                {k.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No tiene hijos vinculados...</span>
                                                )}
                                            </td>
                                        )}

                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 p-2 rounded-full hover:bg-slate-100 hover:text-primary-600 transition-colors">
                                                <Edit size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* ALUMNOS */}
                            {activeTab === 'ALUMNOS' && filteredNinos.map((n) => {
                                const aula = state.aulas.find(a => a.id === n.aulaId);
                                return (
                                    <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={n.avatar} alt="" />
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900">{n.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm text-slate-600">
                                            {aula?.name || 'Sin Sala'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-100 transition-colors">
                                                Ficha Técnica
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Empty States */}
                    {(activeTab === 'INSTITUCIONAL' || activeTab === 'PADRES') && filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-slate-500">Ningún usuario coincide con la búsqueda.</div>
                    )}
                    {activeTab === 'ALUMNOS' && filteredNinos.length === 0 && (
                        <div className="p-12 text-center text-slate-500">Ningún alumno coincide con la búsqueda.</div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center">
                                <UserPlus size={20} className="mr-2 text-primary-600" />
                                Nuevo Usuario
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                <input type="text" name="name" required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none" placeholder="Ej. Juan Pérez" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                                <input type="email" name="email" required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none" placeholder="juan@ejemplo.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">A qué grupo pertenece:</label>
                                <select name="role" required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none bg-white font-medium">
                                    <option value="PADRE">Familia / Tutores Responsables</option>
                                    <option value="DOCENTE">Maestra / Docente</option>
                                    <option value="ESPECIALES">Profesor Especial / Staff</option>
                                    <option value="ADMIN_INSTITUCION">Administración / Directivo</option>
                                    {isSuperAdmin && <option value="SUPER_ADMIN">Dueña / Super Administrador</option>}
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                                    Crear Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center">
                                <Edit size={20} className="mr-2 text-primary-600" />
                                Editar Perfil
                            </h3>
                            <button onClick={() => { setIsEditModalOpen(false); setEditUser(null); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleEditUser} className="p-6 space-y-4">
                            <div className="flex flex-col items-center mb-6">
                                <img src={editUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editUser.name)}`} alt="" className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow-md ring-1 ring-slate-200" />
                                <input type="url" name="avatar" defaultValue={editUser.avatar} className="w-full text-xs border border-slate-200 rounded-lg p-2 text-center text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300" placeholder="URL de la imagen (opcional)" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                <input type="text" name="name" defaultValue={editUser.name} required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none" placeholder="Ej. Juan Pérez" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                                <input type="email" name="email" defaultValue={editUser.email} required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none" />
                            </div>

                            {isSuperAdmin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Agrupación / Rol</label>
                                    <select name="role" defaultValue={editUser.role} required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none bg-white font-medium">
                                        <option value="PADRE">Familia / Tutores Responsables</option>
                                        <option value="DOCENTE">Maestra / Docente</option>
                                        <option value="ESPECIALES">Profesor Especial / Staff</option>
                                        <option value="ADMIN_INSTITUCION">Administración / Directivo</option>
                                        <option value="SUPER_ADMIN">Dueña / Super Administrador</option>
                                    </select>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-700 flex items-center mb-0.5">
                                        <Key size={14} className="mr-1.5" /> Seguridad
                                    </p>
                                    <p className="text-xs text-slate-500">Enviar link para que recupere su clave</p>
                                </div>
                                <button type="button" onClick={handleResetPassword} className="px-4 py-2 bg-white text-rose-600 text-sm font-bold rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors">
                                    Restablecer
                                </button>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditUser(null); }} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Nino Modal */}
            {isAddNinoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-16 bg-primary-100/50 rounded-full transform translate-x-8 -translate-y-8"></div>
                            <h3 className="text-xl font-bold text-slate-800 flex items-center relative z-10">
                                <GraduationCap size={20} className="mr-2 text-primary-600" />
                                {createdNinoConfirmation ? '¡Inscripción Exitosa!' : 'Inscribir Alumno'}
                            </h3>
                            {(!isSavingNino) && (
                                <button onClick={() => { setIsAddNinoModalOpen(false); setCreatedNinoConfirmation(null); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors relative z-10">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Loading State */}
                        {isSavingNino && (
                            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                                <div className="animate-spin w-12 h-12 border-4 border-slate-100 border-t-primary-600 rounded-full"></div>
                                <p className="text-slate-500 font-medium">Guardando perfil del alumno y vinculando tutores...</p>
                            </div>
                        )}

                        {/* Confirmation State */}
                        {!isSavingNino && createdNinoConfirmation && (
                            <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
                                    <Shield size={40} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">{createdNinoConfirmation.name}</h4>
                                    <p className="text-slate-500 font-medium mt-1">El alumno ha sido inscripto correctamente en la plataforma.</p>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 w-full rounded-2xl p-5 text-left mb-2">
                                    <h5 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Resumen de Asignación</h5>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                            <span className="text-slate-500 text-sm">Aula / Sala Módulo:</span>
                                            <span className="font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-lg border border-primary-100">
                                                {state.aulas.find(a => a.id === createdNinoConfirmation.aulaId)?.name || createdNinoConfirmation.aulaId}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 text-sm">Tutores Vinculados:</span>
                                            <span className="font-bold text-slate-700">
                                                {createdNinoConfirmation.parentIds.length} Familiares
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setIsAddNinoModalOpen(false); setCreatedNinoConfirmation(null); }}
                                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                                >
                                    Entendido, continuar
                                </button>
                            </div>
                        )}

                        {/* Creation Form State */}
                        {!isSavingNino && !createdNinoConfirmation && (
                            <form onSubmit={handleAddNino} className="p-6 overflow-y-auto flex-1 bg-white">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombre y Apellido <span className="text-red-500">*</span></label>
                                        <input type="text" name="name" required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none" placeholder="Ej. Mateo Gómez" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Género <span className="text-red-500">*</span></label>
                                        <select name="gender" required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none bg-white">
                                            <option value="">Seleccione</option>
                                            <option value="MASCULINO">Niño (M)</option>
                                            <option value="FEMENINO">Niña (F)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Fecha de Nacimiento <span className="text-red-500">*</span></label>
                                        <input type="date" name="birthDate" required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none text-slate-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Asignar Sala / Aula <span className="text-red-500">*</span></label>
                                        <select name="aulaId" required className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none bg-white">
                                            <option value="">Seleccione un aula</option>
                                            {state.aulas.map(a => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Alergias Conocidas (Opcional)</label>
                                    <p className="text-xs text-slate-500 mb-2">Ingresa las alergias separadas por coma (ej: Maní, Polen)</p>
                                    <input type="text" name="allergies" className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none" placeholder="Ej. Chocolate, Penicilina..." />
                                </div>

                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <label className="block text-sm font-bold text-slate-800 mb-1">Vincular Familiares / Tutores <span className="text-red-500">*</span></label>
                                    <p className="text-[11px] text-slate-500 mb-3 leading-tight">Manten presionado CTRL (o CMD) para seleccionar hasta 5 familiares responsables registrados en el directorio de padres.</p>
                                    <select
                                        name="parentIds"
                                        multiple
                                        required
                                        className="w-full text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-2 outline-none h-32 bg-white"
                                    >
                                        {users.filter(u => u.role === 'PADRE').map(u => (
                                            <option key={u.id} value={u.id} className="p-2 border-b border-slate-50 flex items-center gap-2">
                                                {u.name} ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                    <button type="button" onClick={() => setIsAddNinoModalOpen(false)} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                                        Finalizar Inscripción
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
