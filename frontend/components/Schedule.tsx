import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Check, X, AlertCircle, Save, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, getHours } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';
import { CalendarEvent, User } from '../types';
import { EventDetailModal } from './EventDetailModal';
import { EventEditorModal } from './EventEditorModal';

interface ScheduleProps {
  user: User;
}

export const Schedule: React.FC<ScheduleProps> = ({ user }) => {
  const { t } = useLanguage();
  const { events, aulas, ninos, students, emitEvent, dispatch, institutionId } = useTenantData();
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(startOfCurrentWeek, i));

  const [attendanceEvent, setAttendanceEvent] = useState<CalendarEvent | null>(null);
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  // New Modal States
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (user.role === 'ESTUDIANTE') {
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'check_schedule' });
    } else if (user.role === 'DOCENTE') {
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'view_schedule' });
    }
  }, [user.role, dispatch]);

  const handleAttendance = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status: status as 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED',
    }));
    emitEvent({
      type: 'ATTENDANCE_TAKEN',
      payload: {
        eventId: attendanceEvent?.id || '',
        courseTitle: attendanceEvent?.title || '',
        records,
      },
    });

    if (user.role === 'DOCENTE') {
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'take_attendance' });
    }

    setAttendanceEvent(null);
    setAttendance({});
  };

  const getLocalizedMonth = (date: Date) => {
    const monthIndex = date.getMonth();
    return t.schedule.months[monthIndex];
  };

  const getLocalizedDay = (date: Date) => {
    const dayIndex = date.getDay();
    return t.schedule.days[dayIndex];
  };

  const getEventStyle = (start: Date, end: Date) => {
    const startHour = getHours(start);
    const startMinute = start.getMinutes();
    const durationMinutes = (end.getTime() - start.getTime()) / 60000;

    const topOffset = (startHour - 8) * 60 + startMinute;
    // Minimum valid height and top 
    return {
      top: `${Math.max(0, topOffset)}px`,
      height: `${Math.max(20, durationMinutes)}px` // at least 20px so it's clickable
    };
  };

  // Helper arrays
  const hours = Array.from({ length: 14 }).map((_, i) => i + 8); // 8 AM to 9 PM
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter events based on audience targeting and permissions
  const visibleEvents = events.filter(e => {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_INSTITUCION') return true;
    if (e.creatorId === user.id) return true;
    if (!e.sharedWith || e.sharedWith.scope === 'ALL') return true;



    if (e.sharedWith.scope === 'AULA' && e.sharedWith.targetIds) {
      if (user.role === 'DOCENTE') {
        const isTeacherOfAula = aulas.some(a => e.sharedWith!.targetIds!.includes(a.id) && a.teachers?.includes(user.id));
        if (isTeacherOfAula) return true;
      }
      if (user.role === 'PADRE') {
        const isParentOfAula = ninos.some(n => e.sharedWith!.targetIds!.includes(n.aulaId) && n.parentIds?.includes(user.id));
        if (isParentOfAula) return true;
      }
      return false;
    }

    return false;
  });

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (editingEvent && editingEvent.id) {
      dispatch({
        type: 'UPDATE_EVENT',
        payload: { ...eventData, id: editingEvent.id } as CalendarEvent
      });
      emitEvent({
        type: 'SYSTEM_NOTIFICATION' as any,
        payload: { message: 'Evento actualizado exitosamente.', type: 'SYSTEM' } as any
      });
    } else {
      const newEvent = {
        ...eventData,
        id: `ev_${Date.now()}`,
        institutionId: institutionId || ''
      } as CalendarEvent;

      dispatch({ type: 'ADD_EVENT', payload: newEvent });
      emitEvent({
        type: 'SYSTEM_NOTIFICATION' as any,
        payload: { message: 'Evento creado exitosamente.', type: 'SYSTEM' } as any
      });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este evento?")) {
      dispatch({ type: 'DELETE_EVENT', payload: { id: eventId } });
      setViewingEvent(null);
      emitEvent({
        type: 'SYSTEM_NOTIFICATION' as any,
        payload: { message: 'Evento eliminado comunmente.', type: 'SYSTEM' } as any
      });
    }
  };
  // Bypass role restrictions for now so the user can test the UI freely.
  const canCreate = true;

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>, day: Date) => {
    if (!canCreate) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Grid starts at 8AM, every 60px is 1 hour
    const totalMinutes = y; // Since 1px = 1 min
    const hoursFrom8AM = Math.floor(totalMinutes / 60);
    const startHour = 8 + Math.max(0, hoursFrom8AM);

    // Nearest 15-minute increment
    const rawMinutes = totalMinutes % 60;
    const snappedMinutes = Math.floor(rawMinutes / 15) * 15;

    const clickDate = new Date(day);
    clickDate.setHours(startHour, snappedMinutes, 0, 0);

    const endDate = new Date(clickDate);
    // Determine context size? Let's say default event 1 hour
    endDate.setHours(startHour + 1, snappedMinutes, 0, 0);

    const newEventTemplate: Partial<CalendarEvent> = {
      start: clickDate,
      end: endDate,
      type: 'event',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };

    setEditingEvent(newEventTemplate as CalendarEvent);
    setIsEditorOpen(true);
  };

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 space-y-6 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.schedule.title}</h1>
            <p className="text-slate-500 mt-1">{t.schedule.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            {canCreate && (
              <button
                onClick={() => { setEditingEvent(null); setIsEditorOpen(true); }}
                className="bg-white text-slate-700 border border-slate-200 shadow-sm px-4 py-2 rounded-full font-medium hover:shadow-md hover:bg-slate-50 transition-all flex items-center pr-5"
              >
                <div className="text-primary-600 mr-2 flex items-center justify-center">
                  <Plus size={20} strokeWidth={2.5} />
                </div>
                Crear Evento
              </button>
            )}
            <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2 rounded-full font-medium text-sm shadow-sm hover:bg-slate-50 transition-all">
              Hoy
            </button>
            <div id="tour-schedule-nav" className="flex items-center space-x-1 bg-white rounded-full border border-slate-200 p-1 shadow-sm">
              <button className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronLeft size={20} /></button>
              <button className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronRight size={20} /></button>
            </div>
            <span className="text-xl font-semibold text-slate-800 ml-2">
              {getLocalizedMonth(today)} {format(today, 'yyyy')}
            </span>
          </div>
        </div>

        <div id="tour-schedule-grid" className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {/* Header Row */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            {/* Empty corner for time column */}
            <div className="w-16 shrink-0 border-r border-slate-200"></div>
            <div className="flex-1 grid grid-cols-5">
              {weekDays.map((day, idx) => (
                <div key={idx} className={`py-4 text-center border-r border-slate-200 last:border-r-0 ${isSameDay(day, today) ? 'bg-primary-50/50' : ''}`}>
                  <span className="block text-xs uppercase font-bold text-slate-400">{getLocalizedDay(day)}</span>
                  <span className={`block text-xl font-bold mt-1 ${isSameDay(day, today) ? 'text-primary-600' : 'text-slate-700'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto flex">
            {/* Time Column Sidebar */}
            <div className="w-16 shrink-0 bg-white border-r border-slate-200 flex flex-col pt-2 relative z-10" style={{ height: `${hours.length * 60}px` }}>
              {hours.map((hour) => (
                <div key={hour} className="h-[60px] relative">
                  <span className="absolute -top-3 right-2 text-xs font-semibold text-slate-400">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Grid Container */}
            <div className="flex-1 relative bg-white" style={{ height: `${hours.length * 60}px` }}>

              {/* Horizontal Hour Lines Background */}
              <div className="absolute inset-x-0 inset-y-0 pointer-events-none">
                {hours.map((hour) => (
                  <div key={hour} className="h-[60px] border-b border-slate-100"></div>
                ))}
              </div>

              {/* Current Time Line Indicator */}
              {isSameDay(today, new Date()) && getHours(currentTime) >= 8 && getHours(currentTime) <= 21 && (
                <div
                  className="absolute inset-x-0 border-t-2 border-rose-500 z-20 pointer-events-none opacity-80"
                  style={{ top: `${(getHours(currentTime) - 8) * 60 + currentTime.getMinutes()}px` }}
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 absolute -top-[5px] -left-1"></div>
                </div>
              )}

              <div className="grid grid-cols-5 h-full relative z-10">
                {weekDays.map((day, colIndex) => {
                  const dayEvents = visibleEvents.filter(e => isSameDay(e.start, day));

                  return (
                    <div
                      key={colIndex}
                      className="border-r border-slate-100 relative h-full cursor-pointer hover:bg-slate-50/20 transition-colors group"
                      onClick={(e) => handleGridClick(e, day)}
                    >
                      {canCreate && (
                        <div className="absolute inset-x-0 inset-y-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-primary-600"></div>
                      )}
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => { e.stopPropagation(); setViewingEvent(event); }}
                          className={`absolute left-1 right-1 p-2 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${event.color}`}
                          style={getEventStyle(event.start, event.end)}
                        >
                          <p className="text-[10px] leading-tight font-bold mb-0.5 opacity-80">
                            {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                          </p>
                          <p className="text-xs font-bold leading-tight opacity-90 truncate">{event.title}</p>

                          {/* Only show "Pasar Lista" if event is long enough (e.g., >= 45m) and it's a class */}
                          {event.type === 'class' && (event.end.getTime() - event.start.getTime()) >= 45 * 60000 && (
                            <div className="flex items-center mt-2 text-[10px] opacity-70" onClick={(e) => {
                              if (['DOCENTE', 'ADMIN_INSTITUCION', 'SUPER_ADMIN'].includes(user.role)) {
                                e.stopPropagation();
                                setAttendanceEvent(event);
                              }
                            }}>
                              <Check size={10} className="mr-1" /> Pasar Lista
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Sidebar */}
      {attendanceEvent && (
        <div className="w-96 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col animate-fade-in-right">
          <div className="p-5 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900">{attendanceEvent.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <Clock size={12} className="mr-1" /> {format(attendanceEvent.start, 'EEEE, d MMMM')}
              </p>
            </div>
            <button onClick={() => setAttendanceEvent(null)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.schedule.markAttendance}</h4>
            {students.map(student => (
              <div key={student.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center space-x-3">
                  <img src={student.avatar} className="w-8 h-8 rounded-full" alt={student.name} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-400">{student.program}</p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  {[
                    { id: 'PRESENT', icon: Check, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100', title: t.schedule.present },
                    { id: 'LATE', icon: AlertCircle, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100', title: t.schedule.late },
                    { id: 'ABSENT', icon: X, color: 'text-rose-600 bg-rose-50 hover:bg-rose-100', title: t.schedule.absent },
                  ].map((status) => (
                    <button
                      key={status.id}
                      onClick={() => handleAttendance(student.id, status.id)}
                      className={`p-1.5 rounded-lg transition-colors ${attendance[student.id] === status.id
                        ? status.color.replace('hover:', '') + ' ring-2 ring-offset-1 ring-slate-200'
                        : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                        }`}
                      title={status.title}
                    >
                      <status.icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button
              onClick={saveAttendance}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <Save size={18} className="mr-2" />
              {t.schedule.saveAttendance}
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {viewingEvent && (
        <EventDetailModal
          event={viewingEvent}
          currentUser={user}
          onClose={() => setViewingEvent(null)}
          onDelete={handleDeleteEvent}
          onEdit={(e) => {
            setViewingEvent(null);
            setEditingEvent(e);
            setIsEditorOpen(true);
          }}
        />
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <EventEditorModal
          isOpen={isEditorOpen}
          onClose={() => { setIsEditorOpen(false); setEditingEvent(null); }}
          onSave={handleSaveEvent}
          initialData={editingEvent}
          currentUser={user}
          aulas={aulas}
        />
      )}
    </div>
  );
};
