import React, { useState, useMemo, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useAuth } from '../contexts/AuthContext';
import { Aula, Nino, User } from '../types';
import { Users, LayoutGrid, List, MessageSquare, Info, ShieldAlert, ChevronRight, User as UserIcon, Settings, Plus, Search, Trash2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from './Modal';
import { usersApi } from '../services/api';
import { AnimatedAvatar } from './AnimatedAvatar';

export default function Aulas({ onViewChange }: { onViewChange?: (view: any, params?: any) => void }) {
    const { state, dispatch } = useAppState();
    const { user, token, currentInstitution } = useAuth();

    // UI States
    const [selectedAulaId, setSelectedAulaId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'CARD' | 'LIST'>('CARD');
    const [selectedNino, setSelectedNino] = useState<Nino | null>(null);

    // Config Modal States
    const [configAulaId, setConfigAulaId] = useState<string | null>(null);
    const [configTab, setConfigTab] = useState<'DOCENTES' | 'ALUMNOS'>('DOCENTES');
    const [allUsers, setAllUsers] = useState<User[]>([]);

    // Multiple Teacher Assignment States
    const [teacherAssignConfirm, setTeacherAssignConfirm] = useState<{ aulaId: string, docente: User, action: 'ASSIGN' | 'UNASSIGN' } | null>(null);
    const [isProcessingTeacher, setIsProcessingTeacher] = useState(false);

    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_INSTITUCION';

    useEffect(() => {
        if (isAdmin && configAulaId && currentInstitution && token && allUsers.length === 0) {
            usersApi.getAll(currentInstitution.id, token).then(setAllUsers);
        }
    }, [isAdmin, configAulaId, currentInstitution, token, allUsers.length]);

    // Filter Aulas based on user role
    const accessibleAulas = useMemo(() => {
        if (!user) return [];
        if (isAdmin) {
            return state.aulas;
        }
        if (user.role === 'DOCENTE') {
            return state.aulas.filter(a => a.teachers.includes(user.id));
        }
        return [];
    }, [state.aulas, user, isAdmin]);

    // View: specific Aula Detail
    const activeAula = useMemo(() => accessibleAulas.find(a => a.id === selectedAulaId), [accessibleAulas, selectedAulaId]);

    const aulaNinos = useMemo(() => {
        if (!activeAula) return [];
        return state.ninos.filter(n => n.aulaId === activeAula.id);
    }, [state.ninos, activeAula]);

    // No access
    if (accessibleAulas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                <ShieldAlert size={48} className="text-slate-300 mb-4" />
                <h2 className="text-xl font-medium text-slate-700">No tienes acceso a ninguna sala</h2>
                <p className="mt-2 text-center max-w-md">Contacta a dirección para que te asignen a un aula.</p>
            </div>
        );
    }

    // --- DASHBOARD VIEW (List of Aulas) ---
    if (!selectedAulaId) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard de Aulas</h1>
                    <p className="text-slate-500 text-sm mt-1">Selecciona una de tus salas asignadas para ver el listado de alumnos.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accessibleAulas.map(aula => {
                        const ninosCount = state.ninos.filter(n => n.aulaId === aula.id).length;
                        return (
                            <div
                                key={aula.id}
                                className={`bg-white rounded-2xl border-2 border-transparent shadow-sm hover:shadow-md hover:border-primary-100 transition-all overflow-hidden flex flex-col min-h-[220px] relative`}
                            >
                                <div className={`h-3 ${aula.color?.split(' ')[0] || 'bg-slate-200'}`} />
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="pr-8">
                                            <h3 className="text-xl font-bold text-slate-800 leading-tight">{aula.name}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{aula.capacity} lugares totales</p>
                                        </div>
                                        {isAdmin ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setConfigAulaId(aula.id); }}
                                                className="absolute top-6 right-6 p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-full transition-colors z-10"
                                                title="Configurar Aula"
                                            >
                                                <Settings size={20} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedAulaId(aula.id); }}
                                                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors z-10"
                                                title="Ver Fichas"
                                            >
                                                <List size={20} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex -space-x-3">
                                            {aula.teachers.map((tId, idx) => (
                                                <div key={tId} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shadow-sm z-[${10 - idx}]`} title={tId}>
                                                    D{idx + 1}
                                                </div>
                                            ))}
                                            {aula.teachers.length === 0 && (
                                                <div className="text-xs text-rose-500 font-medium bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">Sin Docentes</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                                        <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${aula.color || 'bg-slate-100 text-slate-600'}`}>
                                            <Users size={16} />
                                            {ninosCount} alumnos
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isAdmin) {
                                                    setConfigAulaId(aula.id);
                                                } else {
                                                    setSelectedAulaId(aula.id);
                                                }
                                            }}
                                            className="text-primary-600 bg-primary-50 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-primary-100 transition-colors"
                                        >
                                            Ver Detalles <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* --- CONFIG MODAL (Admins Only) --- */}
                {isAdmin && configAulaId && (
                    <Modal
                        isOpen={!!configAulaId}
                        onClose={() => setConfigAulaId(null)}
                        title={`Configuración de Sala`}
                        size="xl"
                    >
                        {/* Sub-modal flotante para Asignación */}
                        {teacherAssignConfirm && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
                                <div className="bg-white border border-slate-200 shadow-2xl p-6 rounded-2xl w-full max-w-sm text-center">
                                    {isProcessingTeacher ? (
                                        <div className="flex flex-col items-center py-4">
                                            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                                            <p className="text-sm font-bold text-slate-700">Guardando cambios...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <ShieldAlert className={`w-12 h-12 mx-auto mb-4 ${teacherAssignConfirm.action === 'ASSIGN' ? 'text-emerald-500' : 'text-rose-500'}`} />
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirmar Acción</h3>
                                            <p className="text-sm text-slate-600 mb-6">
                                                ¿Deseas {teacherAssignConfirm.action === 'ASSIGN' ? 'asignar al docente' : 'remover al docente'} <span className="font-bold">{teacherAssignConfirm.docente.name}</span> de esta sala?
                                            </p>
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => setTeacherAssignConfirm(null)}
                                                    className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsProcessingTeacher(true);
                                                        setTimeout(() => {
                                                            const targetAulaC = state.aulas.find(a => a.id === teacherAssignConfirm.aulaId);
                                                            if (targetAulaC) {
                                                                let updatedTeachers = [...targetAulaC.teachers];
                                                                if (teacherAssignConfirm.action === 'ASSIGN') {
                                                                    updatedTeachers.push(teacherAssignConfirm.docente.id);
                                                                } else {
                                                                    updatedTeachers = updatedTeachers.filter(id => id !== teacherAssignConfirm.docente.id);
                                                                }
                                                                dispatch({ type: 'UPDATE_AULA', payload: { ...targetAulaC, teachers: updatedTeachers } });
                                                            }
                                                            setIsProcessingTeacher(false);
                                                            setTeacherAssignConfirm(null);
                                                        }, 1200);
                                                    }}
                                                    className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-colors ${teacherAssignConfirm.action === 'ASSIGN' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}`}
                                                >
                                                    {teacherAssignConfirm.action === 'ASSIGN' ? 'Asignar Docente' : 'Remover Docente'}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-6 min-h-[400px]">
                            {/* Sidebar Menu */}
                            <div className="w-48 flex-shrink-0 border-r border-slate-100 pr-4 space-y-1">
                                <button
                                    onClick={() => setConfigTab('DOCENTES')}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${configTab === 'DOCENTES' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Docentes Asignados
                                </button>
                                <button
                                    onClick={() => setConfigTab('ALUMNOS')}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${configTab === 'ALUMNOS' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Alumnos
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 pb-4">
                                {configTab === 'DOCENTES' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">Docentes Asignados</h3>
                                            <p className="text-sm text-slate-500 mb-4">Selecciona qué maestros tienen acceso a esta sala.</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 max-h-[300px] overflow-y-auto space-y-1">
                                            {allUsers.filter(u => u.role === 'DOCENTE').map(docente => {
                                                const targetAula = accessibleAulas.find(a => a.id === configAulaId);
                                                const isAssigned = targetAula?.teachers.includes(docente.id);

                                                return (
                                                    <label key={docente.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-primary-200 cursor-pointer transition-colors shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <img src={docente.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(docente.name)}`} className="w-8 h-8 rounded-full bg-slate-100" />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800">{docente.name}</p>
                                                                <p className="text-xs text-slate-500">{docente.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="relative flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer"
                                                                checked={isAssigned || false}
                                                                onChange={() => {
                                                                    if (isAssigned) {
                                                                        if (targetAula && targetAula.teachers.length <= 1) {
                                                                            alert("No puedes dejar el aula sin docentes.");
                                                                            return;
                                                                        }
                                                                        setTeacherAssignConfirm({ aulaId: configAulaId!, docente, action: 'UNASSIGN' });
                                                                    } else {
                                                                        setTeacherAssignConfirm({ aulaId: configAulaId!, docente, action: 'ASSIGN' });
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {configTab === 'ALUMNOS' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-1">Alumnos Inscritos</h3>
                                                <p className="text-sm text-slate-500">Añade alumnos y vincúlalos a la cuenta de sus tutores.</p>
                                            </div>
                                            <button
                                                onClick={() => alert('Mock: Abrir sub-modal para rellenar datos del nuevo niño')}
                                                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-primary-200 hover:bg-primary-700 flex items-center gap-2"
                                            >
                                                <Plus size={16} /> Inscribir Alumno
                                            </button>
                                        </div>

                                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                            <table className="min-w-full divide-y divide-slate-200">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Alumno</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Familiar</th>
                                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-slate-100">
                                                    {state.ninos.filter(n => n.aulaId === configAulaId).map(nino => (
                                                        <tr key={nino.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 whitespace-nowrap">
                                                                <div className="flex items-center gap-3">
                                                                    <AnimatedAvatar gender={nino.gender} className="w-8 h-8 rounded-full border border-slate-200" />
                                                                    <span className="text-sm font-bold text-slate-800">{nino.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {nino.parentIds?.map(pId => {
                                                                            const parentUser = allUsers.find(u => u.id === pId);
                                                                            return (
                                                                                <span key={pId} className="text-sm bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium border border-slate-200" title={`ID: ${pId}`}>
                                                                                    {parentUser ? parentUser.name : `ID: ${pId}`}
                                                                                </span>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    <button onClick={() => alert('Abrir buscador de usuarios rol PADRE para re-vincular')} className="text-xs text-primary-600 font-medium hover:underline ml-2">Asignar</button>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setConfigAulaId(null);
                                                                            setTimeout(() => setSelectedNino(nino), 50); // Small delay to avoid overlay conflicts
                                                                        }}
                                                                        className="text-primary-600 hover:text-primary-800 p-1.5 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                                                                        title="Ver Perfil"
                                                                    >
                                                                        <Info size={16} />
                                                                    </button>
                                                                    <button
                                                                        className="text-slate-400 hover:text-rose-600 p-1.5 bg-slate-50 hover:bg-rose-50 rounded-lg transition-colors"
                                                                        title="Desvincular Alumno"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {state.ninos.filter(n => n.aulaId === configAulaId).length === 0 && (
                                                        <tr>
                                                            <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">No hay alumnos en esta sala.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Modal>
                )}

            </div>
        );
    }

    // --- AULA DETAIL VIEW ---
    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <button
                        onClick={() => setSelectedAulaId(null)}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 mb-2"
                    >
                        &larr; Volver al Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">{activeAula?.name}</h1>
                    <p className="text-slate-500 text-sm mt-1">Gestiona los alumnos de esta sala.</p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white rounded-lg border border-slate-200 p-1 flex shadow-sm">
                        <button
                            onClick={() => setViewMode('CARD')}
                            className={`p-2 rounded-md ${viewMode === 'CARD' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Vista Tarjetas"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={`p-2 rounded-md ${viewMode === 'LIST' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Vista Lista"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Aula Info summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1 font-medium"><Users size={16} className="text-primary-500" /> {aulaNinos.length} inscritos / {activeAula?.capacity} máxima</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500 hidden sm:block">Docentes a cargo:</span>
                    <div className="flex -space-x-2">
                        {activeAula?.teachers.map((tId, idx) => (
                            <div key={tId} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 z-[${10 - idx}] shadow-sm tooltip`} title={tId}>
                                D{idx + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'CARD' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {aulaNinos.map(nino => (
                        <div
                            key={nino.id}
                            onClick={() => setSelectedNino(nino)}
                            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer flex flex-col items-center text-center group"
                        >
                            <AnimatedAvatar gender={nino.gender} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-slate-50 group-hover:border-primary-100 transition-colors shadow-sm" />
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-700 transition-colors">{nino.name}</h3>
                            <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <Info size={14} className="text-slate-400" /> Ver Ficha
                            </p>
                        </div>
                    ))}
                    {aulaNinos.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500">
                            <Users size={32} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-lg font-medium text-slate-600">No hay niños asignados.</p>
                            <p className="text-sm mt-1 max-w-sm mx-auto">Vuelve al Dashboard y usa el ícono de Configuración para inscribir alumnos en esta sala.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Niño/a</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Nacimiento</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Asistencia</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {aulaNinos.map(nino => (
                                <tr key={nino.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <AnimatedAvatar gender={nino.gender} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900">{nino.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                        <div className="text-sm text-slate-500 font-medium">
                                            {nino.birthDate ? format(new Date(nino.birthDate), 'dd MMM yyyy', { locale: es }) : 'No registra'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-lg border ${nino.attendanceRate && nino.attendanceRate > 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            {nino.attendanceRate || 0}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => setSelectedNino(nino)}
                                            className="text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors border border-transparent shadow-sm"
                                        >
                                            Ver Perfil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {aulaNinos.length === 0 && (
                        <div className="py-12 text-center text-slate-500">
                            No hay niños en esta tabla.
                        </div>
                    )}
                </div>
            )}

            {/* Nino Detail Modal */}
            <Modal
                isOpen={!!selectedNino}
                onClose={() => setSelectedNino(null)}
                title="Ficha Técnica Individual"
                size="lg"
            >
                {selectedNino && (
                    <div className="space-y-6 pb-2">
                        {/* Main Info Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-slate-100 p-6 -mx-6 -mt-6 rounded-t-2xl border-b border-slate-200">
                            <AnimatedAvatar gender={selectedNino.gender} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto sm:mx-0" />
                            <div className="text-center sm:text-left flex-1">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedNino.name}</h2>
                                <p className="text-slate-500 font-medium mt-1">Asignado a: <span className="text-primary-700 font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">{activeAula?.name}</span></p>
                                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2 text-sm">
                                    <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 shadow-sm">
                                        <span className="font-bold text-slate-400 mr-2 uppercase text-xs">Nacimiento</span>
                                        {selectedNino.birthDate ? format(new Date(selectedNino.birthDate), 'dd/MM/yyyy') : 'N/A'}
                                    </div>
                                    <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 shadow-sm flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${selectedNino.attendanceRate && selectedNino.attendanceRate > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                        <span className="font-bold text-slate-400 mr-1 uppercase text-xs">Asistencia</span>
                                        {selectedNino.attendanceRate}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical Info */}
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 shadow-sm">
                            <h3 className="text-rose-800 font-black mb-2 flex items-center gap-2 tracking-tight">
                                <ShieldAlert size={18} /> Historial Médico y Alergias
                            </h3>
                            <p className="text-rose-700 text-sm leading-relaxed font-medium">
                                {selectedNino.medicalInfo || 'No se registraron condiciones médicas particulares o alergias.'}
                            </p>
                        </div>

                        {/* Familiares / Tutores Info */}
                        <div>
                            <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2 tracking-tight text-lg">
                                <UserIcon size={20} className="text-primary-500" /> Familia / Tutores Responsables
                            </h3>
                            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white divide-y divide-slate-100">
                                {selectedNino.parentIds?.map((pId) => {
                                    // Normally we would have the User object here. Mocking for now.
                                    return (
                                        <div key={pId} className="p-5 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                            <div className="flex items-center gap-4 text-center sm:text-left">
                                                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg shadow-inner border border-primary-200">
                                                    {pId.charAt(2).toUpperCase() || 'P'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">Familiar Vinculado</p>
                                                    <p className="text-sm text-slate-500 font-medium">ID Vinculado: <span className="font-mono bg-slate-100 p-1 rounded-md text-xs border border-slate-200">{pId}</span></p>
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                                                <button
                                                    onClick={() => {
                                                        if (onViewChange) {
                                                            onViewChange('messages', { targetUserId: pId });
                                                        }
                                                    }}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-900 transition-all hover:-translate-y-0.5"
                                                >
                                                    <MessageSquare size={16} /> Contactar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (onViewChange) {
                                                            onViewChange('communications', {
                                                                commParams: {
                                                                    type: 'NOTIFICACION_INDIVIDUAL',
                                                                    isLocked: true,
                                                                    recipientIds: [pId]
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all hover:-translate-y-0.5"
                                                >
                                                    <Send size={16} /> Comunicado
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
}
