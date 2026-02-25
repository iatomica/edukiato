import React, { useState } from 'react';
import { CalendarEvent, User, Course, Aula } from '../types';
import { X, Clock, MapPin, Tag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { RichTextEditor } from './RichTextEditor';

interface EventEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: Partial<CalendarEvent>) => void;
    initialData?: CalendarEvent | null;
    currentUser: User;
    courses: Course[];
    aulas: Aula[];
}

export const EventEditorModal: React.FC<EventEditorModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    currentUser,
    courses,
    aulas
}) => {
    const { t } = useLanguage();

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');

    // Instead of datetime-local, we use separate states for date, startTime, and endTime
    const formatForDateInput = (date: Date) => {
        return date.toISOString().slice(0, 10);
    };

    const formatForTimeInput = (date: Date) => {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    const initialStartDate = initialData?.start || new Date();
    const initialEndDate = initialData?.end || new Date(Date.now() + 3600000);

    const [date, setDate] = useState(formatForDateInput(initialStartDate));
    const [startTime, setStartTime] = useState(formatForTimeInput(initialStartDate));
    const [endTime, setEndTime] = useState(formatForTimeInput(initialEndDate));

    // Generate 15-min intervals
    const timeOptions = Array.from({ length: 24 * 4 }).map((_, i) => {
        const hours = Math.floor(i / 4).toString().padStart(2, '0');
        const mins = ((i % 4) * 15).toString().padStart(2, '0');
        return `${hours}:${mins}`;
    });

    const [type, setType] = useState<'class' | 'workshop' | 'event'>(initialData?.type || 'event');
    const [scope, setScope] = useState<'ALL' | 'COURSE' | 'AULA' | 'INDIVIDUAL'>(initialData?.sharedWith?.scope || 'ALL');
    const [targetIds, setTargetIds] = useState<string[]>(initialData?.sharedWith?.targetIds || []);

    const userAulas = currentUser.role === 'DOCENTE' || currentUser.role === 'PADRE'
        ? aulas.filter(a => a.teachers?.includes(currentUser.id))
        : aulas;

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Choose color based on type
        const colorMap = {
            class: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            workshop: 'bg-orange-100 text-orange-700 border-orange-200',
            event: 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };

        const [year, month, dayPart] = date.split('-').map(Number);

        const [startHH, startMM] = startTime.split(':').map(Number);
        const startFull = new Date(year, month - 1, dayPart, startHH, startMM, 0, 0);

        const [endHH, endMM] = endTime.split(':').map(Number);
        const endFull = new Date(year, month - 1, dayPart, endHH, endMM, 0, 0);

        onSave({
            ...(initialData || {}),
            title,
            description,
            start: startFull,
            end: endFull,
            type,
            color: colorMap[type],
            creatorId: initialData?.creatorId || currentUser.id,
            sharedWith: {
                scope,
                targetIds: scope === 'ALL' ? [] : targetIds
            }
        });
        onClose();
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">

                <div className="flex items-center justify-between p-8 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {initialData ? 'Editar Evento' : 'Nuevo Evento'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                    <form id="event-form" onSubmit={handleSubmit} className="space-y-8 mt-4">

                        {/* Title */}
                        <div>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-3xl font-bold text-slate-800 placeholder:text-slate-300 border-none px-0 py-2 focus:ring-0 outline-none transition-all"
                                placeholder="Título del evento..."
                            />
                        </div>

                        {/* DateTime Section */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fecha</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all text-slate-700 font-medium"
                                />
                            </div>
                            <div className="flex-1 min-w-[120px]">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Inicio</label>
                                <select
                                    required
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all text-slate-700 font-medium appearance-none"
                                >
                                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fin</label>
                                <select
                                    required
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all text-slate-700 font-medium appearance-none"
                                >
                                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Type & Sharing Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Tipo de Evento
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all text-slate-700 font-medium appearance-none"
                                >
                                    <option value="class">Clase Regular</option>
                                    <option value="workshop">Taller / Workshop</option>
                                    <option value="event">Evento Especial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Audiencia
                                </label>
                                <select
                                    value={scope}
                                    onChange={(e) => {
                                        setScope(e.target.value as any);
                                        setTargetIds([]);
                                    }}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all text-slate-700 font-medium appearance-none"
                                >
                                    <option value="ALL">Todo el Instituto</option>
                                    {currentUser.role !== 'ESTUDIANTE' && (
                                        <option value="AULA">Aulas / Salas Específicas</option>
                                    )}
                                    {currentUser.role !== 'ESTUDIANTE' && (
                                        <option value="COURSE">Cursos Específicos</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Course Selector if needed */}
                        {scope === 'COURSE' && (
                            <div className="animate-fade-in">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Selecciona los Cursos</label>
                                <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                                    {courses.map(course => (
                                        <label key={course.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 cursor-pointer w-full sm:w-auto transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={targetIds.includes(course.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setTargetIds([...targetIds, course.id]);
                                                    else setTargetIds(targetIds.filter(id => id !== course.id));
                                                }}
                                                className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                                            />
                                            <span className="text-sm font-medium text-slate-700">{course.title}</span>
                                        </label>
                                    ))}
                                    {courses.length === 0 && <span className="text-sm text-slate-500">No hay cursos disponibles.</span>}
                                </div>
                            </div>
                        )}

                        {/* Aula Selector */}
                        {scope === 'AULA' && (
                            <div className="animate-fade-in">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Selecciona las Aulas / Salas</label>
                                <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                                    {userAulas.map(aula => (
                                        <label key={aula.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 cursor-pointer w-full sm:w-auto transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={targetIds.includes(aula.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setTargetIds([...targetIds, aula.id]);
                                                    else setTargetIds(targetIds.filter(id => id !== aula.id));
                                                }}
                                                className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                                            />
                                            <span className="text-sm font-medium text-slate-700">{aula.name}</span>
                                        </label>
                                    ))}
                                    {userAulas.length === 0 && <span className="text-sm text-slate-500">No hay aulas disponibles para seleccionar.</span>}
                                </div>
                            </div>
                        )}

                        {/* Rich Text Editor */}
                        <div>
                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                            />
                        </div>

                    </form>
                </div>

                <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="event-form"
                        className="px-8 py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all"
                    >
                        {initialData ? 'Guardar Cambios' : 'Crear Evento'}
                    </button>
                </div>
            </div>
        </div>
    );
};
