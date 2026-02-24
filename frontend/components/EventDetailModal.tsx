import React from 'react';
import { CalendarEvent, User } from '../types';
import { X, Clock, Edit2, Trash2, Users, AlignLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';

interface EventDetailModalProps {
    event: CalendarEvent | null;
    onClose: () => void;
    onEdit: (event: CalendarEvent) => void;
    onDelete: (eventId: string) => void;
    currentUser: User;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
    event,
    onClose,
    onEdit,
    onDelete,
    currentUser
}) => {
    const { t } = useLanguage();

    if (!event) return null;

    const typeMap = {
        class: 'Clase Regular',
        workshop: 'Taller / Workshop',
        event: 'Evento Especial'
    };

    // Edit/Delete Permissions: Only SuperAdmin, Admin, or the Creator can edit.
    const canEdit =
        currentUser.role === 'SUPER_ADMIN' ||
        currentUser.role === 'ADMIN_INSTITUCION' ||
        currentUser.id === event.creatorId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4">
            <div className="bg-white justify-between rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header Section */}
                <div className="flex items-start justify-between p-8 pb-4">
                    <div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${event.color}`}>
                            {event.type}
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{event.title}</h2>
                        <p className="text-sm font-semibold text-slate-500 mt-2 flex items-center">
                            <Clock size={18} className="mr-2 text-slate-400" />
                            {format(event.start, 'EEEE, d MMM yyyy')} • {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <>
                                <button onClick={() => onEdit(event)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors" title="Editar">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => onDelete(event.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors" title="Eliminar">
                                    <Trash2 size={18} />
                                </button>
                                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                            </>
                        )}
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body Content - Rich Text Description */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    {event.description ? (
                        <div
                            className="prose prose-sm sm:prose-base max-w-none text-slate-700 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-a:text-primary-600 prose-ul:list-disc prose-ol:list-decimal prose-li:my-0.5"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                    ) : (
                        <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 border-dashed text-center">
                            <p className="text-slate-500 italic">No hay detalles adicionales provistos para este evento.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
