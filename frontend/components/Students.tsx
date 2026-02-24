
import React, { useState, useMemo } from 'react';
import { Search, Mail, MoreHorizontal, Download, Award, X, Printer, ArrowLeft, Send, Paperclip, Filter, User, Users, Calendar, BookOpen, MessageSquare, Plus, GraduationCap } from 'lucide-react';
import { Student, Communication, CommunicationType, UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';
import { usePermissions } from '../contexts/PermissionsContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { usersApi } from '../services/api';

// ── SUB-COMPONENTS ───────────────────────────────────────────

const CommunicationsModal = ({ onClose, students, courses, onSend }: { onClose: () => void, students: Student[], courses: any[], onSend: (data: any) => void }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<'INDIVIDUAL' | 'COURSE' | 'ALL'>('INDIVIDUAL');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [commType, setCommType] = useState<CommunicationType>('ANUNCIO_GENERAL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({
      type: commType,
      title: subject,
      content: message,
      recipientId: recipientType === 'INDIVIDUAL' ? selectedStudent : null,
      courseId: recipientType === 'COURSE' ? selectedCourse : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">Enviar Comunicado</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Comunicado</label>
              <select
                value={commType}
                onChange={(e) => setCommType(e.target.value as CommunicationType)}
                className="w-full text-sm border-slate-200 rounded-lg focus:ring-primary-500"
              >
                <option value="ANUNCIO_GENERAL">Anuncio general (todo el jardín)</option>
                <option value="ANUNCIO_SALA">Anuncio por sala</option>
                <option value="NOTIFICACION_INDIVIDUAL">Notificación individual por familia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destinatarios</label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value as any)}
                className="w-full text-sm border-slate-200 rounded-lg focus:ring-primary-500"
              >
                <option value="INDIVIDUAL">Estudiante Individual</option>
                <option value="COURSE">Curso Completo</option>
                <option value="ALL">Todos los Estudiantes</option>
              </select>
            </div>
          </div>

          {recipientType === 'INDIVIDUAL' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar Estudiante</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
                className="w-full text-sm border-slate-200 rounded-lg focus:ring-primary-500"
              >
                <option value="">Buscar estudiante...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          {recipientType === 'COURSE' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar Curso</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
                className="w-full text-sm border-slate-200 rounded-lg focus:ring-primary-500"
              >
                <option value="">Seleccionar curso...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full text-sm border-slate-200 rounded-lg focus:ring-primary-500"
              placeholder="Ej. Reporte de inasistencia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full text-sm border-slate-200 rounded-lg focus:ring-primary-500 resize-none"
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <button type="button" className="flex items-center px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              <Paperclip size={16} className="mr-2" /> Adjuntar archivo
            </button>
            <span className="text-xs italic">Soporta PDF, JPG, PNG (Max 5MB)</span>
          </div>
        </form>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancelar</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 flex items-center">
            <Send size={16} className="mr-2" /> Enviar Comunicado
          </button>
        </div>
      </div>
    </div>
  );
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
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotebookView = ({ communications }: { communications: Communication[] }) => {
  return (
    <div className="space-y-4">
      {communications.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p>No hay comunicaciones recibidas.</p>
        </div>
      ) : (
        communications.map(comm => (
          <div key={comm.id} className={`bg-white p-5 rounded-xl border ${comm.isRead ? 'border-slate-200' : 'border-primary-200 shadow-sm'} transition-all`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide
                  ${comm.type === 'NOTIFICACION_INDIVIDUAL' ? 'bg-rose-100 text-rose-700' :
                    comm.type === 'ANUNCIO_SALA' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {comm.type === 'ANUNCIO_GENERAL' ? 'ANUNCIO GENERAL' : comm.type === 'ANUNCIO_SALA' ? 'ANUNCIO POR SALA' : 'NOTIFICACIÓN INDIVIDUAL'}
                </span>
                <span className="text-xs text-slate-500">{format(new Date(comm.createdAt), 'dd MMM yyyy, HH:mm')}</span>
              </div>
              {!comm.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full"></span>}
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">{comm.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">{comm.content}</p>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="flex items-center text-xs text-slate-500">
                <User size={14} className="mr-1" />
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
    </div>
  );
};

const StudentDetail = ({ student, onClose, communications }: { student: Student, onClose: () => void, communications: Communication[] }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'ACADEMIC' | 'COMMUNICATIONS'>('INFO');

  // Filter comms for this student
  const studentComms = communications.filter(c => c.recipientId === student.id || !c.recipientId);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in relative border border-slate-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-primary-500/10 rounded-full transform translate-x-10 -translate-y-10 blur-3xl"></div>
        <div className="relative z-10 flex items-center space-x-6">
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <img src={student.avatar} alt={student.name} className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl" />
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
          { id: 'INFO', label: 'Información Personal', icon: User },
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <User size={18} className="mr-2 text-primary-500" /> Datos Personales
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-slate-500">Fecha Nacimiento</span>
                  <span className="col-span-2 font-medium text-slate-800">12 Feb 2005</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-slate-500">Teléfono</span>
                  <span className="col-span-2 font-medium text-slate-800">+1 234 567 890</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-slate-500">Dirección</span>
                  <span className="col-span-2 font-medium text-slate-800">123 Calle Principal, Ciudad</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Users size={18} className="mr-2 text-primary-500" /> Información de Padres / Contacto
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-slate-500">Padre/Tutor</span>
                  <span className="col-span-2 font-medium text-slate-800">Carlos Chen</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-slate-500">Email Contacto</span>
                  <span className="col-span-2 font-medium text-slate-800">carlos.c@example.com</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-slate-500">Teléfono Emergencia</span>
                  <span className="col-span-2 font-medium text-slate-800">+1 555 000 000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ACADEMIC' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Resumen de Asistencia</h3>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-2">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${student.attendanceRate}%` }}></div>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Asistencia Global</span>
                <span className="font-bold">{student.attendanceRate}%</span>
              </div>
            </div>
          </div>
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

export const Students: React.FC<{ initialViewMode?: 'LIST' | 'NOTEBOOK' }> = ({ initialViewMode = 'LIST' }) => {
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'LIST' | 'NOTEBOOK'>(initialViewMode);
  const [activeTab, setActiveTab] = useState<'ALUMNOS' | 'PADRES'>('ALUMNOS');

  const { t } = useLanguage();
  const { students, courses, communications, dispatch, emitEvent } = useTenantData();
  const { can } = usePermissions();
  const { user, currentInstitution, token } = useAuth();

  // Verify permissions via role to show correct initial view
  const isStudentOrParent = user?.role === 'ESTUDIANTE'; // Add PARENT logic if needed

  // If user is student, default to showing their notebook (or allow toggling if they want to see "classmates" - usually restricted)
  // For this demo, we assume Students section for Admin is "Management", and for Student is "My Notebook"

  const courseName = courses[0]?.title ?? 'N/A';
  const instructorName = courses[0]?.instructor ?? 'N/A';

  const handleSendCommunication = (data: any) => {
    if (!currentInstitution) return;

    const newComm: Communication = {
      id: `comm_${Date.now()}`,
      institutionId: currentInstitution.id,
      type: data.type,
      title: data.title,
      content: data.content,
      senderId: user?.id || 'current_user',
      senderName: user?.name || 'Admin Usuario',
      recipientId: data.recipientId,
      courseId: data.courseId,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    dispatch({ type: 'ADD_COMMUNICATION', payload: newComm });
    emitEvent({ type: 'COMMUNICATION_SENT', payload: newComm }); // Emit full payload for handlers
    // Optional: Local toast for success feedback (could be handled by a separate Toaster component listening to same event)
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
  if (selectedStudentDetail) {
    return (
      <StudentDetail
        student={selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
        communications={communications}
      />
    );
  }

  // If in Notebook Mode (Student View)
  if (viewMode === 'NOTEBOOK') {
    // Filter by auth.user.id
    const myComms = communications.filter(c => c.recipientId === user?.id || !c.recipientId);

    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Cuaderno de Comunicados</h1>
            <p className="text-slate-500 mt-2">Notificaciones oficiales y actas académicas</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <NotebookView communications={myComms} />
        </div>
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
          {can('manage', 'student') && (
            <>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium shadow-lg shadow-primary-200 transition-all hover:scale-105"
              >
                <Plus size={16} className="mr-2" />
                Agregar Estudiante
              </button>
              <button
                onClick={() => setIsCommModalOpen(true)}
                className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-sm font-medium shadow-lg shadow-slate-200 transition-all hover:scale-105"
              >
                <Send size={16} className="mr-2" />
                Enviar Comunicado
              </button>
            </>
          )}

          <button
            id="tour-students-export"
            className="hidden md:flex items-center px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium"
          >
            <Download size={16} className="mr-2" />
            {t.students.export}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ALUMNOS')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors ${activeTab === 'ALUMNOS' ? 'bg-white text-primary-600 border-t border-x border-slate-200 -mb-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <GraduationCap size={16} /> Alumnos
        </button>
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
            <select className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-primary-200 cursor-pointer">
              <option>All Programs</option>
              <option>Visual Arts</option>
              <option>Music</option>
            </select>
            <select className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-primary-200 cursor-pointer">
              <option>{t.students.table.status}: All</option>
              <option>{t.students.status.active}</option>
              <option>{t.students.status.inactive}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">{t.students.table.student}</th>
                <th className="px-6 py-4">{t.students.table.program}</th>
                <th className="px-6 py-4">{t.students.table.status}</th>
                <th className="px-6 py-4">{t.students.table.attendance}</th>
                <th className="px-6 py-4 text-right">{t.students.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students
                .filter(s => s.role === (activeTab === 'PADRES' ? 'PADRE' : 'ESTUDIANTE'))
                .map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudentDetail(student)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={student.avatar} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700 font-medium">{student.program}</span>
                    </td>
                    <td className="px-6 py-4">
                      {can('manage', 'student') ? (
                        <select
                          value={student.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const newStatus = e.target.value as any;
                            const oldStatus = student.status;
                            dispatch({ type: 'UPDATE_STUDENT', payload: { id: student.id, status: newStatus } });
                            emitEvent({
                              type: 'STUDENT_STATUS_CHANGED',
                              payload: {
                                studentId: student.id,
                                studentName: student.name,
                                oldStatus,
                                newStatus,
                                changedBy: 'Admin', // In real app, get from auth.user.name
                              }
                            });
                          }}
                          className={`text-xs font-medium rounded-full px-2 py-0.5 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-primary-200
                          ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                              student.status === 'on_leave' ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-100 text-slate-800'}`}
                        >
                          <option value="active">{t.students.status.active}</option>
                          <option value="inactive">{t.students.status.inactive}</option>
                          <option value="on_leave">{t.students.status.on_leave}</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                            student.status === 'on_leave' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-800'}`}>
                          {t.students.status[student.status] || student.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 mr-2">
                          <div
                            className={`h-1.5 rounded-full ${student.attendanceRate > 80 ? 'bg-emerald-500' : student.attendanceRate > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${student.attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">{student.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedStudentForCert(student); }}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Generate Certificate"
                        >
                          <Award size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedStudentDetail(student); }}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <BookOpen size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedStudentForCert && (
        <CertificateModal student={selectedStudentForCert} onClose={() => setSelectedStudentForCert(null)} />
      )}

      {/* Communications Modal */}
      {isCommModalOpen && (
        <CommunicationsModal
          onClose={() => setIsCommModalOpen(false)}
          students={students}
          courses={courses}
          onSend={handleSendCommunication}
        />
      )}
      {/* Add Student Modal */}
      {isAddModalOpen && (
        <AddStudentModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddStudent}
        />
      )}
    </div>
  );
};
