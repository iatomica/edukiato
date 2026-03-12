
import AcademicReportsTab from '@/components/AcademicReportsTab';
import { AnimatedAvatar } from '@/components/AnimatedAvatar';
import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useTenantData } from '@/hooks/useTenantData';
import { communicationsApi, usersApi } from '@/services/api';
import type { Student, Communication, CommunicationType, Aula, Nino } from '@/types';
import { format } from 'date-fns';
import { Search, Mail, Award, X, Printer, ArrowLeft, Send, Paperclip, User as UserIcon, Users, BookOpen, MessageSquare, GraduationCap, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

// ── SUB-COMPONENTS ───────────────────────────────────────────

export const CommunicationsModal = ({
  onClose,
  students,
  aulas,
  user,
  ninos,
  onSend,
  initialType,
  isTypeLocked,
  initialRecipientIds
}: {
  onClose: () => void,
  students: Student[],
  aulas: Aula[],
  user: any,
  ninos: Nino[],
  onSend: (data: any) => Promise<Communication>,
  initialType?: CommunicationType,
  isTypeLocked?: boolean,
  initialRecipientIds?: string[]
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{ success: string[]; failed: string[] } | null>(null);

  const isAdmin = user?.role === 'ADMIN_INSTITUCION' || user?.role === 'SUPER_ADMIN';
  const fallbackCommType: CommunicationType = isAdmin ? 'ANUNCIO_GENERAL' : 'ANUNCIO_SALA';
  const [commType, setCommType] = useState<CommunicationType>(initialType || fallbackCommType);

  // Destinatarios states
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(initialRecipientIds || []);
  const [searchPadre, setSearchPadre] = useState('');

  // Filter Aulas for Dropdown
  const availableAulas = useMemo(() => {
    if (isAdmin) return aulas;
    if (user?.role === 'DOCENTE') {
      return aulas.filter(a => a.teachers.includes(user.id));
    }
    return [];
  }, [aulas, isAdmin, user]);

  // Derived options for recipients
  const availableRecipients = useMemo(() => {
    // Exclude SUPER_ADMIN from being messaged
    let baseUsers = students.filter(s => s.role !== 'SUPER_ADMIN');

    if (isAdmin) {
      return baseUsers.filter(s => s.role === 'PADRE' || s.role === 'DOCENTE' || s.role === 'ADMIN_INSTITUCION');
    }

    if (user?.role === 'DOCENTE') {
      const teacherAulas = availableAulas.map(a => a.id);
      const teacherNinos = ninos.filter(n => teacherAulas.includes(n.aulaId));
      const teacherParentsIds = teacherNinos.flatMap(n => n.parentIds || []);
      const parentUserIds = Array.from(new Set(teacherParentsIds));
      return baseUsers.filter(s => {
        if (s.role === 'PADRE') return parentUserIds.includes(s.id);
        if (s.role === 'DOCENTE' || s.role === 'ADMIN_INSTITUCION') return true;
        return false;
      });
    }

    return [];
  }, [students, isAdmin, user, availableAulas, ninos]);

  const filteredRecipients = availableRecipients.filter(p => p.name.toLowerCase().includes(searchPadre.toLowerCase()));

  const toggleRecipient = (id: string) => {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== id));
    } else {
      setSelectedRecipients([...selectedRecipients, id]);
    }
  };

  const selectAllRecipients = () => {
    setSelectedRecipients(availableRecipients.map(p => p.id));
  };

  const deselectAllRecipients = () => {
    setSelectedRecipients([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendFeedback(null);

    const baseData = {
      type: commType,
      title: subject,
      content: message,
    };

    setIsSubmitting(true);

    try {
      if (commType === 'ANUNCIO_GENERAL') {
        await onSend({ ...baseData, recipientId: null, courseId: null });
        onClose();
        return;
      }

      if (commType === 'ANUNCIO_SALA') {
        await onSend({ ...baseData, recipientId: null, courseId: selectedCourse });
        onClose();
        return;
      }

      if (selectedRecipients.length === 0) {
        alert('Debes seleccionar al menos un destinatario.');
        return;
      }

      const recipientById = new Map(availableRecipients.map((r) => [r.id, r.name]));
      const sendPromises = selectedRecipients.map((recipientId) =>
        onSend({ ...baseData, recipientId, courseId: null }),
      );
      const settledResults = await Promise.allSettled(sendPromises);

      const success: string[] = [];
      const failed: string[] = [];

      settledResults.forEach((result, index) => {
        const recipientId = selectedRecipients[index];
        const recipientName = recipientById.get(recipientId) ?? recipientId;

        if (result.status === 'fulfilled') {
          success.push(recipientName);
        } else {
          failed.push(recipientName);
        }
      });

      setSendFeedback({ success, failed });

      if (failed.length === 0) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-24 bg-primary-50 rounded-full transform translate-x-12 -translate-y-12"></div>
          <div className="relative flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-xl tracking-tight">Nuevo Comunicado</h3>
              <p className="text-sm text-slate-500">Envía información importante a tu comunidad</p>
            </div>
          </div>
          <button onClick={onClose} className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulary Area */}
        <form id="communication-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 bg-slate-50/30">

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de Comunicado</label>
              <select
                value={commType}
                disabled={isTypeLocked}
                onChange={(e) => {
                  setCommType(e.target.value as CommunicationType);
                  // Reset previous selections when changing type
                  setSelectedRecipients([]);
                  setSelectedCourse('');
                }}
                className={`w-full text-sm border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 py-2.5 px-3 ${isTypeLocked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`}
              >
                {isAdmin && <option value="ANUNCIO_GENERAL">📢 Anuncio general (Todo el jardín)</option>}
                <option value="ANUNCIO_SALA">🏫 Anuncio por sala / curso</option>
                <option value="NOTIFICACION_INDIVIDUAL">👤 Notificación individual a familias / personal</option>
              </select>
            </div>

            {commType === 'ANUNCIO_SALA' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Seleccionar Curso o Sala</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                  className="w-full text-sm border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white py-2.5 px-3"
                >
                  <option value="">Selecciona la sala destinataria...</option>
                  {availableAulas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}

            {commType === 'NOTIFICACION_INDIVIDUAL' && (
              <div className="animate-fade-in space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-slate-700">Seleccionar Destinatarios</label>
                  <div className="space-x-2 text-xs">
                    <button type="button" onClick={selectAllRecipients} className="text-primary-600 hover:underline font-medium">Seleccionar todos</button>
                    <span className="text-slate-300">|</span>
                    <button type="button" onClick={deselectAllRecipients} className="text-slate-500 hover:underline">Ninguno</button>
                  </div>
                </div>

                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar familia o miembro del personal..."
                    value={searchPadre}
                    onChange={(e) => setSearchPadre(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto bg-white">
                  {filteredRecipients.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">No se encontraron destinatarios.</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {filteredRecipients.map(padre => (
                        <label key={padre.id} className="flex items-center p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedRecipients.includes(padre.id)}
                            onChange={() => toggleRecipient(padre.id)}
                            className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 mr-3"
                          />
                          <div className="flex items-center gap-3">
                            <UserAvatar name={padre.name} role={padre.role} className="w-6 h-6 border border-slate-200 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">{padre.name}</p>
                              <p className="text-xs text-slate-500">{padre.email}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {selectedRecipients.length > 0 && (
                  <p className="text-xs text-primary-600 font-medium">{selectedRecipients.length} destinatarios seleccionados.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {sendFeedback && (
              <div className={`rounded-xl border p-3 text-sm ${sendFeedback.failed.length > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                {sendFeedback.success.length > 0 && (
                  <p className="font-medium">Enviados: {sendFeedback.success.join(', ')}</p>
                )}
                {sendFeedback.failed.length > 0 && (
                  <p className="font-medium mt-1">Fallaron: {sendFeedback.failed.join(', ')}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Asunto del Comunicado</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full text-sm border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 px-4 py-2.5 shadow-sm"
                placeholder="Escribe un título claro... (Ej. Suspensión de actividades)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                disabled={isSubmitting}
                className="w-full text-sm border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 px-4 py-3 shadow-sm resize-none"
                placeholder="Desarrolla el contenido del comunicado aquí..."
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Paperclip size={18} className="text-slate-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Adjuntar archivo</p>
                  <p className="text-xs text-slate-500">Soporta PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
              <button type="button" className="px-3 py-1.5 text-sm bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                Explorar...
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end items-center gap-3">
          <button type="button" disabled={isSubmitting} onClick={onClose} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} form="communication-form" className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-black shadow-lg flex items-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            <Send size={18} className="mr-2" /> {isSubmitting ? 'Enviando...' : 'Enviar Comunicado'}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return modalContent;
  return createPortal(modalContent, document.body);
};

const AddStudentModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (data: { name: string, email: string }) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, email });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">Agregar Estudiante</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm border-slate-200 rounded-lg focus:ring-primary-500 p-2"
              placeholder="Ej. Juan Pérez"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm border-slate-200 rounded-lg focus:ring-primary-500 p-2"
              placeholder="juan@ejemplo.com"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-black">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotebookView = ({ communications }: { communications: Communication[] }) => {
  const { user, currentInstitution, token } = useAuth();
  const { dispatch, emitEvent } = useTenantData();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleDelete = async (commId: string) => {
    if (!currentInstitution || !token) return;
    try {
      await communicationsApi.delete(commId, currentInstitution.id, token);
      dispatch({ type: 'DELETE_COMMUNICATION', payload: { id: commId } });
      emitEvent({
        type: 'NOTIFICATION_CREATED', payload: {
          id: `sys_${Date.now()}`,
          institutionId: currentInstitution.id,
          type: 'SYSTEM',
          title: 'Comunicado Eliminado',
          message: `El comunicado se ha eliminado correctamente.`,
          time: 'Ahora',
          isRead: true
        }
      });
    } catch (error) {
      console.error('Error deleting communication:', error);
      alert('Hubo un error al intentar eliminar el comunicado.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {communications.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p>No hay comunicaciones recibidas.</p>
        </div>
      ) : (
        communications.map(comm => (
          <div key={comm.id} className={`group bg-white p-5 rounded-xl border ${comm.isRead ? 'border-slate-200' : 'border-primary-200 shadow-sm'} transition-all relative`}>
            {isSuperAdmin && (
              <button
                onClick={() => setDeletingId(comm.id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Eliminar comunicado"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="flex justify-between items-start mb-2 pr-8">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide
                  ${comm.type === 'NOTIFICACION_INDIVIDUAL' ? 'bg-rose-100 text-rose-700' :
                    comm.type === 'ANUNCIO_SALA' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {comm.type === 'ANUNCIO_GENERAL' ? 'ANUNCIO GENERAL' : comm.type === 'ANUNCIO_SALA' ? 'ANUNCIO POR SALA' : 'NOTIFICACIÓN INDIVIDUAL'}
                </span>
                <span className="text-xs text-slate-500">{format(new Date(comm.createdAt), 'dd MMM yyyy, HH:mm')}</span>
              </div>
              {!comm.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0"></span>}
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">{comm.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">{comm.content}</p>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="flex items-center text-xs text-slate-500">
                <UserIcon size={14} className="mr-1" />
                Enviado por: <span className="font-medium ml-1 text-slate-700">{comm.senderName}</span>
              </div>
              {comm.attachments && (
                <div className="flex space-x-2">
                  {comm.attachments.map((att, i) => (
                    <button key={i} className="flex items-center text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 text-slate-600">
                      <Paperclip size={12} className="mr-1" /> {att.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-scale-in text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">¿Eliminar comunicado?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Esta acción es permanente. El comunicado desaparecerá del cuaderno de todos los destinatarios.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentDetail = ({ student, onClose, communications, aulas, ninos, allUsers, onViewChange, onOpenComm }: { student: Student, onClose: () => void, communications: Communication[], aulas: Aula[], ninos: Nino[], allUsers: Student[], onViewChange?: (view: any, params?: any) => void, onOpenComm?: (recipientId: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'ACADEMIC' | 'COMMUNICATIONS'>('INFO');

  // Filter comms for this student
  const studentComms = communications.filter(c => {
    // 0. General announcements go to everyone
    if (c.type === 'ANUNCIO_GENERAL') return true;

    if (c.recipientId && c.recipientId === student.id) return true;
    if (c.recipientId && c.recipientId !== student.id) return false;

    if (c.courseId) {
      if (student.role === 'ADMIN_INSTITUCION' || student.role === 'SUPER_ADMIN') return true;

      if (student.role === 'PADRE') {
        return ninos.some(n => n.aulaId === c.courseId && n.parentIds?.includes(student.id));
      }
      if (student.role === 'DOCENTE' || student.role === 'ESPECIALES') {
        const aula = aulas.find(a => a.id === c.courseId);
        return aula?.teachers.includes(student.id) || !!aula?.assistants?.includes(student.id);
      }
      return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in relative border border-slate-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-primary-500/10 rounded-full transform translate-x-10 -translate-y-10 blur-3xl"></div>
        <div className="relative z-10 flex items-center space-x-6">
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <UserAvatar name={student.name} role={student.role || 'ESTUDIANTE'} className="w-20 h-20 border-4 border-white/20 shadow-xl shrink-0" />
          <div>
            <h2 className="text-3xl font-bold">{student.name}</h2>
            <p className="text-slate-300 flex items-center mt-1">
              <Mail size={14} className="mr-2" /> {student.email}
            </p>
            <div className="flex space-x-2 mt-3">
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase bg-white/20 text-white`}>
                {student.program}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase
                ${student.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                {student.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white sticky top-0 z-20">
        {[
          { id: 'INFO', label: 'Información Personal', icon: UserIcon },
          { id: 'ACADEMIC', label: 'Académico', icon: Award },
          { id: 'COMMUNICATIONS', label: 'Cuaderno de Comunicados', icon: BookOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id ? 'border-primary-600 text-primary-700 bg-primary-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <tab.icon size={18} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8 flex-1 overflow-y-auto bg-slate-50/50">
        {activeTab === 'INFO' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <h3 className="font-black text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2 tracking-tight text-lg bg-slate-50">
                <Users size={20} className="text-primary-500" /> Familia / Tutores Responsables
              </h3>
              <div className="divide-y divide-slate-100">
                {(() => {
                  const actualNino = ninos.find(n => n.id === student.id);
                  if (!actualNino || !actualNino.parentIds || actualNino.parentIds.length === 0) {
                    return (
                      <div className="p-8 text-center text-slate-500 font-medium">
                        No hay familiares vinculados a este alumno.
                      </div>
                    );
                  }
                  return actualNino.parentIds.map((pId) => {
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
                              if (onOpenComm) {
                                onOpenComm(pId);
                              }
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all hover:-translate-y-0.5"
                          >
                            <Send size={16} /> Comunicado
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ACADEMIC' && (
          <AcademicReportsTab studentId={student.id} />
        )}

        {activeTab === 'COMMUNICATIONS' && (
          <div className="animate-fade-in">
            <NotebookView communications={studentComms} />
          </div>
        )}
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ───────────────────────────────────────────

export const Students: React.FC<{ initialViewMode?: 'LIST' | 'NOTEBOOK', initialCommParams?: any, onViewChange?: (view: any, params?: any) => void }> = ({ initialViewMode = 'LIST', initialCommParams, onViewChange }) => {
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [commModalParams, setCommModalParams] = useState<any>(initialCommParams || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'LIST' | 'NOTEBOOK'>(initialViewMode);
  const { user, currentInstitution, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'ALUMNOS' | 'PADRES'>(user?.role === 'PADRE' ? 'PADRES' : 'ALUMNOS');
  const [selectedAulaId, setSelectedAulaId] = useState<string>('ALL');

  const { t } = useLanguage();
  const { students, courses, communications, aulas, ninos, dispatch, emitEvent } = useTenantData();
  const { canAny } = usePermissions();

  const canCreateCommunications = canAny([
    { action: 'create', resource: 'announcement' },
    { action: 'manage', resource: 'announcement' },
  ]);

  const isAdmin = user?.role === 'ADMIN_INSTITUCION' || user?.role === 'SUPER_ADMIN';

  // Aulas list for filter based on role
  const filterableAulas = useMemo(() => {
    if (isAdmin) return aulas;
    if (user?.role === 'DOCENTE') {
      return aulas.filter(a => a.teachers.includes(user.id));
    }
    if (user?.role === 'PADRE') {
      const myKidsAulaIds = ninos.filter(n => n.parentIds?.includes(user.id)).map(n => n.aulaId);
      return aulas.filter(a => myKidsAulaIds.includes(a.id));
    }
    return aulas;
  }, [aulas, isAdmin, user, ninos]);

  const visibleTableStudents = useMemo(() => {
    let baseUsers = students.filter(s => s.role !== 'SUPER_ADMIN');

    // Mapear los niños como si fuesen 'ESTUDIANTE' (tipo Student) y mezclarlos en la base de datos visual
    const mappedNinosAsStudents: Student[] = ninos.map(n => {
      // Intentar encontrar qué aula tiene asignada para mostrarla en su "programa"
      const assignedAula = aulas.find(a => a.id === n.aulaId);
      return {
        id: n.id,
        institutionId: n.institutionId,
        name: n.name,
        email: `${n.parentIds?.length || 0} Tutores vinculados`, // Usa el email como descriptivo
        program: assignedAula ? assignedAula.name : 'Sin Aula',
        role: 'ESTUDIANTE',
        status: 'active',
        attendanceRate: n.attendanceRate || 100,
        avatar: n.avatar,
        gender: n.gender
      };
    });

    // Combinarlo con los usuarios registrados genuinamente
    baseUsers = [...baseUsers, ...mappedNinosAsStudents];
    // Deduplicar (por nombre) en caso que por tests el mismo Niño tenga una Cuenta Local + Perfil.
    baseUsers = baseUsers.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.name === value.name && t.role === value.role
      ))
    );

    let result: Student[] = [];

    if (isAdmin) {
      result = baseUsers;
    } else if (user?.role === 'DOCENTE') {
      const teacherAulas = aulas.filter(a => a.teachers.includes(user.id)).map(a => a.id);
      const teacherNinos = ninos.filter(n => teacherAulas.includes(n.aulaId));
      const teacherParentsIds = teacherNinos.flatMap(n => n.parentIds || []);
      const parentUserIds = Array.from(new Set(teacherParentsIds));

      result = baseUsers.filter(s => {
        if (s.role === 'PADRE') return parentUserIds.includes(s.id);
        if (s.role === 'ESTUDIANTE') return teacherNinos.some(n => n.name === s.name);
        return false;
      });
    } else if (user?.role === 'PADRE') {
      const myKidsAulaIds = ninos.filter(n => n.parentIds?.includes(user.id)).map(n => n.aulaId);
      const kidsInSameAulas = ninos.filter(n => myKidsAulaIds.includes(n.aulaId));
      const parentIdsInSameAulas = Array.from(new Set(kidsInSameAulas.flatMap(n => n.parentIds || [])));

      result = baseUsers.filter(s => {
        // Padres see other padres in same aulas
        if (s.role === 'PADRE') return parentIdsInSameAulas.includes(s.id);
        return false;
      });
    }

    // Aplicar filtro por Sala/Aula
    if (selectedAulaId !== 'ALL') {
      const ninosInAula = ninos.filter(n => n.aulaId === selectedAulaId);
      const ninoNamesInAula = new Set(ninosInAula.map(n => n.name));
      const parentIdsInAula = new Set(ninosInAula.flatMap(n => n.parentIds || []));

      result = result.filter(s => {
        if (s.role === 'ESTUDIANTE') {
          return ninosInAula.some(n => n.id === s.id) || ninoNamesInAula.has(s.name);
        }
        if (s.role === 'PADRE') {
          return parentIdsInAula.has(s.id);
        }
        return true;
      });
    }

    return result;
  }, [students, isAdmin, user, aulas, ninos, selectedAulaId]);

  React.useEffect(() => {
    if (initialCommParams) {
      if (initialViewMode === 'NOTEBOOK') setViewMode('NOTEBOOK');
      setIsCommModalOpen(true);
    }
  }, [initialCommParams, initialViewMode]);

  // Mark all relevant communications as read when opening the Notebook
  React.useEffect(() => {
    if (viewMode === 'NOTEBOOK' && user && currentInstitution && token) {
      dispatch({ type: 'MARK_COMMUNICATIONS_READ', payload: { userId: user.id } });
      // Persist to backend so it doesn't reappear on reload
      communicationsApi.markAsRead(currentInstitution.id, token).catch(console.error);
    }
  }, [viewMode, user, currentInstitution, token, dispatch]);

  // If user is student, default to showing their notebook (or allow toggling if they want to see "classmates" - usually restricted)
  // For this demo, we assume Students section for Admin is "Management", and for Student is "My Notebook"

  const courseName = courses[0]?.title ?? 'N/A';
  const instructorName = courses[0]?.instructor ?? 'N/A';

  const handleSendCommunication = async (data: any): Promise<Communication> => {
    if (!currentInstitution || !token) return;

    const newComm = await communicationsApi.create(
      {
        type: data.type,
        title: data.title,
        content: data.content,
        recipientId: data.recipientId,
        courseId: data.courseId,
      },
      currentInstitution.id,
      token,
    );

    dispatch({ type: 'ADD_COMMUNICATION', payload: newComm });
    emitEvent({ type: 'COMMUNICATION_SENT', payload: newComm });
    emitEvent({
      type: 'NOTIFICATION_CREATED', payload: {
        id: `sys_${Date.now()}`,
        institutionId: newComm.institutionId,
        type: 'SYSTEM',
        title: 'Comunicado Enviado',
        message: `Se ha enviado correctamente a ${data.recipientId ? 'Estudiante' : 'Curso'}`,
        time: 'Ahora',
        isRead: true
      }
    });

    return newComm;
  };

  const handleAddStudent = async (data: { name: string, email: string }) => {
    if (!currentInstitution || !token) return;
    try {
      const newUser = await usersApi.create({ ...data, role: 'ESTUDIANTE' }, currentInstitution.id, token);

      const newStudent: Student = {
        id: newUser.id,
        institutionId: currentInstitution.id,
        name: newUser.name,
        email: newUser.email,
        program: 'General',
        status: 'active',
        avatar: newUser.avatar,
        attendanceRate: 100
      };

      dispatch({ type: 'ADD_STUDENT', payload: newStudent });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  const CertificateModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center">
            <Award className="mr-2 text-primary-600" size={20} />
            {t.students.certModal.title}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 bg-slate-50 flex justify-center">
          {/* Certificate Design */}
          <div className="bg-white p-8 md:p-12 w-full text-center border-4 border-double border-slate-200 shadow-lg relative">
            <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded-full mx-auto mb-6">
              <span className="font-serif text-3xl font-bold">E</span>
            </div>
            <h2 className="text-4xl font-serif text-slate-900 mb-2">{t.students.certModal.certTitle}</h2>
            <p className="text-slate-500 mb-8 italic">{t.students.certModal.institution}</p>

            <p className="text-slate-600 mb-2">{t.students.certModal.certifyThat}</p>
            <h3 className="text-3xl font-bold text-primary-700 mb-6 font-serif">{student.name}</h3>

            <p className="text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
              {t.students.certModal.completedText}
              <span className="font-bold text-slate-800"> {courseName}</span>.
            </p>

            <div className="flex justify-around items-end mt-12">
              <div className="text-center">
                <div className="w-32 border-b border-slate-300 mb-2"></div>
                <p className="text-xs uppercase font-bold text-slate-400">Alex Rivera</p>
                <p className="text-[10px] text-slate-400">{t.students.certModal.director}</p>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-300 mb-2 text-slate-800 font-serif italic text-lg">{instructorName.split(' ')[0]}</div>
                <p className="text-xs uppercase font-bold text-slate-400">{instructorName}</p>
                <p className="text-xs text-slate-400">{t.students.certModal.instructor}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">{t.students.certModal.close}</button>
          <button onClick={() => alert('Printing...')} className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 flex items-center">
            <Printer size={18} className="mr-2" />
            {t.students.certModal.print}
          </button>
        </div>
      </div>
    </div>
  );

  // If selecting a student, show detail view
  {/* Student Detail Modal */ }
  if (selectedStudentDetail) {
    return (
      <StudentDetail
        student={selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
        communications={communications}
        aulas={aulas}
        ninos={ninos}
        allUsers={students}
        onViewChange={onViewChange}
        onOpenComm={(recipientId) => {
          setCommModalParams({
            type: 'NOTIFICACION_INDIVIDUAL',
            isLocked: true,
            recipientIds: [recipientId]
          });
          setIsCommModalOpen(true);
        }}
      />
    );
  }

  // If in Notebook Mode (Student View)
  if (viewMode === 'NOTEBOOK') {
    const myComms = communications.filter(c => {
      // 0. General announcements go to everyone
      if (c.type === 'ANUNCIO_GENERAL') return true;

      // 1. Direct recipient
      if (c.recipientId && c.recipientId !== user?.id) return false;

      if (user?.role === 'ADMIN_INSTITUCION' || user?.role === 'SUPER_ADMIN') return true;

      if (c.courseId) {
        if (user?.role === 'PADRE') {
          return ninos.some(n => n.aulaId === c.courseId && n.parentIds?.includes(user?.id));
        }
        if (user?.role === 'DOCENTE' || user?.role === 'ESPECIALES') {
          const aula = aulas.find(a => a.id === c.courseId);
          return aula?.teachers.includes(user?.id) || !!aula?.assistants?.includes(user?.id);
        }
        return false;
      }
      return true;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Cuaderno de Comunicados</h1>
            <p className="text-slate-500 mt-2">Notificaciones oficiales y actas académicas</p>
          </div>

          {canCreateCommunications && (
            <button
              onClick={() => {
                setCommModalParams(null);
                setIsCommModalOpen(true);
              }}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-900/10"
            >
              <Send size={18} className="mr-2" />
              Nuevo Comunicado
            </button>
          )}
        </div>
        <div className="max-w-3xl mx-auto">
          <NotebookView communications={myComms} />
        </div>

        {isCommModalOpen && (
          <CommunicationsModal
            onClose={() => setIsCommModalOpen(false)}
            students={students}
            aulas={aulas}
            user={user}
            ninos={ninos}
            onSend={handleSendCommunication}
            initialType={commModalParams?.type}
            isTypeLocked={commModalParams?.isLocked}
            initialRecipientIds={commModalParams?.recipientIds}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.students.title}</h1>
          <p className="text-slate-500 mt-1">{t.students.subtitle}</p>
        </div>

        <div className="flex space-x-3">
          {canCreateCommunications && (
            <>
              {/* Botón Agregar Estudiante eliminado por solicitud */}
              <button
                onClick={() => {
                  setCommModalParams(null);
                  setIsCommModalOpen(true);
                }}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-900/10"
              >
                <Send size={18} className="mr-2" />
                Enviar Comunicado
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        {user?.role !== 'PADRE' && (
          <button
            onClick={() => setActiveTab('ALUMNOS')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors ${activeTab === 'ALUMNOS' ? 'bg-white text-primary-600 border-t border-x border-slate-200 -mb-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <GraduationCap size={16} /> Alumnos
          </button>
        )}
        <button
          onClick={() => setActiveTab('PADRES')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors ${activeTab === 'PADRES' ? 'bg-white text-primary-600 border-t border-x border-slate-200 -mb-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Users size={16} /> Familias / Padres
        </button>
      </div>

      <div id="tour-students-list" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden rounded-tl-none">
        {/* Table Toolbar */}
        <div id="tour-students-search" className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.students.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedAulaId}
              onChange={(e) => setSelectedAulaId(e.target.value)}
              className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-primary-200 cursor-pointer"
            >
              <option value="ALL">Todas las salas</option>
              {filterableAulas.map(aula => (
                <option key={aula.id} value={aula.id}>{aula.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">{activeTab === 'PADRES' ? 'Familiar' : t.students.table.student}</th>
                <th className="px-6 py-4">{activeTab === 'PADRES' ? 'Alumnos' : t.students.table.program}</th>
                {/* Columnas Estado y Asistencia eliminadas en tab Alumnos */}
                <th className="px-6 py-4 text-right">{t.students.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleTableStudents
                .filter(s => s.role === (activeTab === 'PADRES' ? 'PADRE' : 'ESTUDIANTE'))
                .map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => {
                      if (student.role !== 'PADRE') {
                        setSelectedStudentDetail(student);
                      }
                    }}
                    className={`hover:bg-slate-50/50 transition-colors ${student.role !== 'PADRE' ? 'cursor-pointer' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {student.role === 'ESTUDIANTE' ? (
                          <AnimatedAvatar gender={(student as any).gender} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={student.avatar} alt="" />
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">
                            {student.role === 'PADRE'
                              ? `Familia de ${ninos.filter(n => n.parentIds?.includes(student.id)).map(n => n.name.split(' ')[0]).join(', ')} (${student.name})`
                              : student.name}
                          </div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {activeTab === 'PADRES' ? (
                        <span className="text-sm text-slate-700 font-medium">
                          {ninos.filter(n => n.parentIds?.includes(student.id)).map(n => n.name).join(', ')}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-700 font-medium">{student.program}</span>
                      )}
                    </td>
                    {/* Celdas Estado y Asistencia eliminadas de tab Alumnos */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {student.role === 'PADRE' && activeTab === 'PADRES' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewChange && onViewChange('messages', { targetUserId: student.id }); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 hover:text-primary-700 rounded-lg transition-colors border border-primary-100 shadow-sm"
                            title="Enviar Mensaje"
                          >
                            <MessageSquare size={14} />
                            <span className="hidden sm:inline">Mensaje</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedStudentDetail(student); }}
                              className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <BookOpen size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div >
      </div >

      {/* Certificate Modal */}
      {
        selectedStudentForCert && (
          <CertificateModal student={selectedStudentForCert} onClose={() => setSelectedStudentForCert(null)} />
        )
      }

      {/* Communications Modal */}
      {
        isCommModalOpen && (
          <CommunicationsModal
            onClose={() => setIsCommModalOpen(false)}
            students={students}
            aulas={aulas}
            user={user}
            ninos={ninos}
            onSend={handleSendCommunication}
            initialType={commModalParams?.type}
            isTypeLocked={commModalParams?.isLocked}
            initialRecipientIds={commModalParams?.recipientIds}
          />
        )
      }
      {/* Add Student Modal */}
      {
        isAddModalOpen && (
          <AddStudentModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddStudent}
          />
        )
      }
    </div >
  );
};
