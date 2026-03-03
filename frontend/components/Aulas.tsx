import React, { useState, useMemo, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useAuth } from '../contexts/AuthContext';
import { useTenantData } from '../hooks/useTenantData';
import { Aula, Nino, User, Communication } from '../types';
import { Users, LayoutGrid, List, MessageSquare, Info, ShieldAlert, ChevronRight, User as UserIcon, Settings, Plus, Search, Trash2, Send, BookOpen, Mail, Award, Paperclip, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from './Modal';
import { usersApi } from '../services/api';
import { AnimatedAvatar } from './AnimatedAvatar';
import { UserAvatar } from './UserAvatar';
import AcademicReportsTab from './AcademicReportsTab';
import { CommunicationsModal } from './Students';

export default function Aulas({ onViewChange }: { onViewChange?: (view: any, params?: any) => void }) {
    const { state, dispatch } = useAppState();
    const { user, token, currentInstitution } = useAuth();
    const { communications, emitEvent } = useTenantData();

    // UI States
    const [selectedAulaId, setSelectedAulaId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'CARD' | 'LIST'>('CARD');
    const [selectedNino, setSelectedNino] = useState<Nino | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState<'INFO' | 'ACADEMIC' | 'COMMUNICATIONS'>('INFO');

    // Communications Modal States
    const [isCommModalOpen, setIsCommModalOpen] = useState(false);
    const [commModalParams, setCommModalParams] = useState<any>(null);

    // Config Modal States
    const [configAulaId, setConfigAulaId] = useState<string | null>(null);
    const [configTab, setConfigTab] = useState<'DETALLES' | 'DOCENTES' | 'ALUMNOS'>('DETALLES');
    const [allUsers, setAllUsers] = useState<User[]>([]);

    // Multiple Teacher Assignment States
    const [teacherAssignConfirm, setTeacherAssignConfirm] = useState<{ aulaId: string, docente: User, action: 'ASSIGN' | 'UNASSIGN' } | null>(null);
    const [isProcessingTeacher, setIsProcessingTeacher] = useState(false);

    // Add/Delete Aula States
    const [isAddAulaModalOpen, setIsAddAulaModalOpen] = useState(false);
    const [deleteAulaConfirm, setDeleteAulaConfirm] = useState<string | null>(null);

    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_INSTITUCION';

    useEffect(() => {
        if (isAdmin && configAulaId && currentInstitution && token && allUsers.length === 0) {
            usersApi.getAll(currentInstitution.id, token).then(setAllUsers);
        }
    }, [isAdmin, configAulaId, currentInstitution, token, allUsers.length]);

    // Filter Aulas based on user role
    const accessibleAulas = useMemo(() => {
        if (!user) return [];
        let baseAulas: Aula[] = [];
        if (isAdmin) {
            baseAulas = state.aulas;
        } else if (user.role === 'DOCENTE') {
            baseAulas = state.aulas.filter(a => a.teachers.includes(user.id));
        }

        const unassignedCount = state.ninos.filter(n => !n.aulaId || n.aulaId === '').length;
        if (isAdmin && unassignedCount > 0) {
            return [...baseAulas, {
                id: 'unassigned',
                institutionId: currentInstitution?.id || '',
                name: '⚠️ Alumnos Sin Asignar',
                capacity: 0,
                teachers: [],
                assistants: [],
                color: 'bg-slate-100 text-slate-700 border-slate-300'
            }];
        }

        return baseAulas;
    }, [state.aulas, user, isAdmin, state.ninos, currentInstitution]);

    // View: specific Aula Detail
    const activeAula = useMemo(() => accessibleAulas.find(a => a.id === selectedAulaId), [accessibleAulas, selectedAulaId]);

    const aulaNinos = useMemo(() => {
        if (!activeAula) return [];
        return state.ninos.filter(n => n.aulaId === activeAula.id);
    }, [state.ninos, activeAula]);

    const studentComms = useMemo(() => {
        if (!selectedNino) return [];
        return communications.filter(c => {
            if (c.type === 'ANUNCIO_GENERAL') return true;
            if (c.recipientId && selectedNino.parentIds?.includes(c.recipientId)) return true;
            if (c.courseId === selectedNino.aulaId) return true;
            return false;
        });
    }, [communications, selectedNino]);

    const handleSendCommunication = (data: any) => {
        if (!currentInstitution) return;

        const newComm: Communication = {
            id: `comm_${Date.now()}`,
            institutionId: currentInstitution.id,
            type: data.type,
            title: data.title,
            content: data.content,
            senderId: user?.id || 'current_user',
            senderName: user?.name || 'Administrador',
            recipientId: data.recipientId,
            courseId: data.courseId,
            createdAt: new Date().toISOString(),
            isRead: false
        };

        dispatch({ type: 'ADD_COMMUNICATION', payload: newComm });
        emitEvent({ type: 'COMMUNICATION_SENT', payload: newComm });
    };

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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard de Aulas</h1>
                        <p className="text-slate-500 text-sm mt-1">Selecciona una de tus salas asignadas para ver el listado de alumnos.</p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddAulaModalOpen(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm transition-colors"
                        >
                            <Plus size={18} />
                            Agregar Aula
                        </button>
                    )}
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
                                                    if (aula.id === 'unassigned') {
                                                        setConfigTab('ALUMNOS');
                                                    } else {
                                                        setConfigTab('DETALLES');
                                                    }
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
                                {configAulaId !== 'unassigned' && (
                                    <>
                                        <button
                                            onClick={() => setConfigTab('DETALLES')}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${configTab === 'DETALLES' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            Detalles
                                        </button>
                                        <button
                                            onClick={() => setConfigTab('DOCENTES')}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${configTab === 'DOCENTES' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            Docentes Asignados
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setConfigTab('ALUMNOS')}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${configTab === 'ALUMNOS' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Alumnos
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 pb-4">
                                {configTab === 'DETALLES' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">Detalles de la Sala</h3>
                                            <p className="text-sm text-slate-500 mb-4">Modifica el nombre y color de esta aula.</p>
                                        </div>
                                        <div className="space-y-4 max-w-sm">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de Sala</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                    value={state.aulas.find(a => a.id === configAulaId)?.name || ''}
                                                    onChange={(e) => {
                                                        const aula = state.aulas.find(a => a.id === configAulaId);
                                                        if (aula) {
                                                            dispatch({ type: 'UPDATE_AULA', payload: { ...aula, name: e.target.value } });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Color Asignado</label>
                                                <select
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                    value={state.aulas.find(a => a.id === configAulaId)?.color || 'bg-slate-500 text-white'}
                                                    onChange={(e) => {
                                                        const aula = state.aulas.find(a => a.id === configAulaId);
                                                        if (aula) {
                                                            dispatch({ type: 'UPDATE_AULA', payload: { ...aula, color: e.target.value } });
                                                        }
                                                    }}
                                                >
                                                    <option value="bg-slate-100 text-slate-700 border-slate-200">Gris</option>
                                                    <option value="bg-rose-100 text-rose-700 border-rose-200">Rosa / Rojo</option>
                                                    <option value="bg-emerald-100 text-emerald-700 border-emerald-200">Verde Esmeralda</option>
                                                    <option value="bg-blue-100 text-blue-700 border-blue-200">Azul Cielo</option>
                                                    <option value="bg-amber-100 text-amber-700 border-amber-200">Amarillo / Ámbar</option>
                                                    <option value="bg-violet-100 text-violet-700 border-violet-200">Violeta</option>
                                                    <option value="bg-indigo-100 text-indigo-700 border-indigo-200">Índigo / Morado</option>
                                                </select>
                                            </div>

                                            <div className="pt-6 border-t border-slate-200 mt-6">
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); setDeleteAulaConfirm(configAulaId); }}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-sm font-bold transition-colors border border-rose-100"
                                                >
                                                    <Trash2 size={16} />
                                                    Eliminar Aula
                                                </button>
                                                <p className="text-xs text-slate-500 mt-2 text-center">
                                                    Atención: Los alumnos inscritos quedarán sin sala asignada.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                                            <UserAvatar name={docente.name} role={docente.role} className="w-8 h-8 shrink-0 bg-slate-100" />
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
                                                    {state.ninos.filter(n => n.aulaId === configAulaId || (configAulaId === 'unassigned' && (!n.aulaId || n.aulaId === ''))).map(nino => (
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
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setConfigAulaId(null);
                                                                            setSelectedAulaId(nino.aulaId); // Viajar a la pantalla 2
                                                                            setTimeout(() => setSelectedNino(nino), 50); // Abrir modal alojado allí
                                                                        }}
                                                                        className="text-primary-600 hover:text-primary-800 p-1.5 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                                                                        title="Ver Perfil"
                                                                    >
                                                                        <BookOpen size={16} />
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

                {/* --- ADD AULA MODAL --- */}
                <AddAulaModal
                    isOpen={isAddAulaModalOpen}
                    onClose={() => setIsAddAulaModalOpen(false)}
                    onAdd={(newAula: Partial<Aula>) => {
                        if (!currentInstitution) return;
                        const aula: Aula = {
                            id: `aula_${Date.now()}`,
                            institutionId: currentInstitution.id,
                            name: newAula.name || 'Nueva Sala',
                            capacity: 25,
                            teachers: newAula.teachers || [],
                            assistants: [],
                            color: newAula.color || 'bg-slate-100 text-slate-700 border-slate-200'
                        };
                        dispatch({ type: 'ADD_AULA', payload: aula });
                        setIsAddAulaModalOpen(false);
                    }}
                    allUsers={state.students as any}
                />

                {/* --- DELETE AULA CONFIRMATION MODAL --- */}
                {deleteAulaConfirm && (
                    <div style={{ zIndex: 9999 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-scale-in">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-rose-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Eliminar Sala</h3>
                            <p className="text-sm text-slate-600 mb-6">
                                ¿Estás seguro de que deseas eliminar permanentemente esta sala? Esta acción no reasignará a los alumnos a otra aula automáticamente.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteAulaConfirm(null)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        dispatch({ type: 'DELETE_AULA', payload: { id: deleteAulaConfirm } });
                                        setDeleteAulaConfirm(null);
                                        setConfigAulaId(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-sm shadow-rose-200"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
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
                onClose={() => {
                    setSelectedNino(null);
                    setActiveDetailTab('INFO');
                }}
                title={activeDetailTab === 'INFO' ? "" : "Perfil de Alumno"} // Hide default title for the banner
                size="lg"
            >
                {selectedNino && (
                    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden -m-6 animate-fade-in relative z-10 border border-slate-200 shadow-xl">
                        {/* Header Banner */}
                        <div className="bg-slate-900 text-white p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-primary-500/10 rounded-full transform translate-x-10 -translate-y-10 blur-3xl"></div>
                            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                                <AnimatedAvatar gender={selectedNino.gender} className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl" />
                                <div className="flex-1">
                                    <h2 className="text-3xl font-black">{selectedNino.name}</h2>
                                    <p className="text-slate-300 font-medium mt-1 mb-3">Asignado a: <span className="font-bold">{activeAula?.name}</span></p>
                                    <div className="flex space-x-2 justify-center sm:justify-start">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase bg-white/20 text-white`}>
                                            Estudiante
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${selectedNino.attendanceRate && selectedNino.attendanceRate < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                            Activo
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
                            {[
                                { id: 'INFO', label: 'Info & Contacto', icon: UserIcon },
                                { id: 'ACADEMIC', label: 'Académico', icon: Award },
                                { id: 'COMMUNICATIONS', label: 'Comunicados', icon: BookOpen },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveDetailTab(tab.id as any)}
                                    className={`flex-1 flex items-center justify-center py-4 text-sm font-bold border-b-2 transition-colors
                                      ${activeDetailTab === tab.id ? 'border-primary-600 text-primary-700 bg-primary-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <tab.icon size={18} className="mr-2" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tabs Content */}
                        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6 max-h-[60vh] custom-scrollbar">
                            {activeDetailTab === 'INFO' && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Familiares / Tutores Info */}
                                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                        <h3 className="font-black text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2 tracking-tight text-lg bg-slate-50">
                                            <Users size={20} className="text-primary-500" /> Familia / Tutores Responsables
                                        </h3>
                                        <div className="divide-y divide-slate-100">
                                            {selectedNino.parentIds?.map((pId) => {
                                                const parentUser = allUsers.find(u => u.id === pId);
                                                return (
                                                    <div key={pId} className="p-5 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                                        <div className="flex items-center gap-4 text-center sm:text-left w-full sm:w-auto">
                                                            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg shadow-inner border border-primary-200 shrink-0">
                                                                {parentUser ? parentUser.name.charAt(0).toUpperCase() : pId.charAt(2).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-slate-800 text-base truncate">{parentUser ? parentUser.name : 'Familiar Vinculado'}</p>
                                                                <p className="text-sm text-slate-500 font-medium truncate">ID: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs border border-slate-200">{pId}</span></p>
                                                            </div>
                                                        </div>
                                                        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 shrink-0">
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
                                                                    setCommModalParams({
                                                                        type: 'NOTIFICACION_INDIVIDUAL',
                                                                        isLocked: true,
                                                                        recipientIds: [pId]
                                                                    });
                                                                    setIsCommModalOpen(true);
                                                                }}
                                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all hover:-translate-y-0.5"
                                                            >
                                                                <Send size={16} /> Comunicado
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {(!selectedNino.parentIds || selectedNino.parentIds.length === 0) && (
                                                <div className="p-8 text-center text-slate-500 font-medium">
                                                    No hay familiares vinculados a este alumno.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeDetailTab === 'ACADEMIC' && (
                                <AcademicReportsTab studentId={selectedNino.id} />
                            )}

                            {activeDetailTab === 'COMMUNICATIONS' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 text-lg">Historial de Comunicados</h3>
                                            <p className="text-sm text-slate-500">Notificaciones enviadas al alumno y sus familiares.</p>
                                        </div>
                                        <button
                                            disabled={!selectedNino.parentIds || selectedNino.parentIds.length === 0}
                                            onClick={() => {
                                                if (selectedNino.parentIds && selectedNino.parentIds.length > 0) {
                                                    setCommModalParams({
                                                        type: 'NOTIFICACION_INDIVIDUAL',
                                                        isLocked: true,
                                                        recipientIds: selectedNino.parentIds
                                                    });
                                                    setIsCommModalOpen(true);
                                                }
                                            }}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all
                                              ${(!selectedNino.parentIds || selectedNino.parentIds.length === 0)
                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    : 'bg-slate-900 text-white hover:bg-black hover:-translate-y-0.5'}`}
                                            title={(!selectedNino.parentIds || selectedNino.parentIds.length === 0) ? "El alumno no tiene familiares registrados." : "Enviar un comunicado a los familiares."}
                                        >
                                            <Send size={16} /> Enviar Comunicado
                                        </button>
                                    </div>

                                    {studentComms.length === 0 ? (
                                        <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                                            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                                            <p className="font-medium text-lg">Cuaderno de comunicaciones vacío.</p>
                                            <p className="text-sm mt-1">Este alumno no ha recibido ninguna notificación individual o general aún.</p>
                                        </div>
                                    ) : (
                                        studentComms.map(comm => (
                                            <div key={comm.id} className={`bg-white p-6 rounded-2xl border ${comm.isRead ? 'border-slate-200' : 'border-primary-200 shadow-md'} transition-all hover:shadow-lg`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide inline-block
                                                          ${comm.type === 'NOTIFICACION_INDIVIDUAL' ? 'bg-rose-100 text-rose-700' :
                                                                comm.type === 'ANUNCIO_SALA' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {comm.type === 'ANUNCIO_GENERAL' ? 'ANUNCIO GENERAL' : comm.type === 'ANUNCIO_SALA' ? 'ANUNCIO POR SALA' : 'NOTIFICACIÓN INDIVIDUAL'}
                                                        </span>
                                                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar size={12} /> {format(new Date(comm.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}</span>
                                                    </div>
                                                    {!comm.isRead && <span className="w-2.5 h-2.5 bg-primary-500 rounded-full shadow-sm"></span>}
                                                </div>
                                                <h4 className="font-black text-slate-800 text-lg mb-2">{comm.title}</h4>
                                                <div
                                                    className="text-slate-600 text-sm leading-relaxed mb-4 prose prose-sm max-w-none prose-slate"
                                                    dangerouslySetInnerHTML={{ __html: comm.content || '' }}
                                                />
                                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                                                    <div className="flex items-center text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        <UserIcon size={14} className="mr-1.5 text-slate-400" />
                                                        Enviado por: <span className="font-bold ml-1 text-slate-700">{comm.senderName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {isCommModalOpen && commModalParams && (
                <CommunicationsModal
                    onClose={() => setIsCommModalOpen(false)}
                    students={state.students}
                    aulas={state.aulas}
                    user={user}
                    ninos={state.ninos}
                    onSend={handleSendCommunication}
                    initialType={commModalParams.type}
                    isTypeLocked={commModalParams.isLocked}
                    initialRecipientIds={commModalParams.recipientIds}
                />
            )}



        </div>
    );
}

// Subcomponente de Crear Aula
function AddAulaModal({ isOpen, onClose, onAdd, allUsers }: { isOpen: boolean, onClose: () => void, onAdd: (aula: Partial<Aula>) => void, allUsers: User[] }) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('bg-slate-100 text-slate-700 border-slate-200');
    const [teachers, setTeachers] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'DETALLES' | 'DOCENTES'>('DETALLES');

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setName('');
            setColor('bg-slate-100 text-slate-700 border-slate-200');
            setTeachers([]);
            setActiveTab('DETALLES');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Sala" size="xl">
            <div className="flex flex-col md:flex-row gap-6 relative z-[1000] -mx-2 h-full min-h-[400px]">

                {/* Sidebar Navigation */}
                <div className="md:w-64 flex-shrink-0 space-y-2 border-r border-slate-100 pr-6">
                    <button
                        onClick={() => setActiveTab('DETALLES')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'DETALLES' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Detalles
                    </button>
                    <button
                        onClick={() => setActiveTab('DOCENTES')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'DOCENTES' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Docentes Asignados
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 pb-4 flex flex-col justify-between">
                    <div>
                        {activeTab === 'DETALLES' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Detalles de la Sala</h3>
                                    <p className="text-sm text-slate-500 mb-4">Define el nombre y el color identificador de la nueva aula.</p>
                                </div>
                                <div className="space-y-4 max-w-sm">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de Sala <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Ej. Sala Vuelo (5 años)"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Color Identificador</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                        >
                                            <option value="bg-slate-100 text-slate-700 border-slate-200">Gris</option>
                                            <option value="bg-rose-100 text-rose-700 border-rose-200">Rosa / Rojo</option>
                                            <option value="bg-emerald-100 text-emerald-700 border-emerald-200">Verde Esmeralda</option>
                                            <option value="bg-blue-100 text-blue-700 border-blue-200">Azul Cielo</option>
                                            <option value="bg-amber-100 text-amber-700 border-amber-200">Amarillo / Ámbar</option>
                                            <option value="bg-violet-100 text-violet-700 border-violet-200">Violeta</option>
                                            <option value="bg-indigo-100 text-indigo-700 border-indigo-200">Índigo / Morado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'DOCENTES' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Docentes Asignados</h3>
                                    <p className="text-sm text-slate-500 mb-4">Selecciona qué maestros tendrán acceso a esta sala.</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 max-h-[300px] overflow-y-auto space-y-1">
                                    {allUsers.filter(u => u.role === 'DOCENTE').map(docente => {
                                        const isAssigned = teachers.includes(docente.id);
                                        return (
                                            <label key={docente.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-primary-200 cursor-pointer transition-colors shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar name={docente.name} role={docente.role} className="w-8 h-8 shrink-0 bg-slate-100" />
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
                                                                setTeachers(teachers.filter(id => id !== docente.id));
                                                            } else {
                                                                setTeachers([...teachers, docente.id]);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </label>
                                        )
                                    })}
                                    {allUsers.filter(u => u.role === 'DOCENTE').length === 0 && (
                                        <div className="p-4 text-center text-slate-500 text-sm">
                                            No hay docentes registrados en la institución aún.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (name.trim()) {
                                    onAdd({ name: name.trim(), color, teachers });
                                    setName(''); // reset
                                }
                            }}
                            disabled={!name.trim()}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Guardar y Crear Aula
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
