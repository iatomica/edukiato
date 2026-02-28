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

    const totalMinutesDay = 13 * 60; // 8 AM to 8 PM (13 hours)
    const minutesFrom8AM = (startHour - 8) * 60 + startMinute;

    const topPercent = (minutesFrom8AM / totalMinutesDay) * 100;
    const heightPercent = (durationMinutes / totalMinutesDay) * 100;

    return {
      top: `${Math.max(0, topPercent)}%`,
      height: `${Math.max(2, heightPercent)}%` // at least 2% so it's clickable
    };
  };

  // Helper arrays
  const hours = Array.from({ length: 13 }).map((_, i) => i + 8); // 8 AM to 8 PM
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
  // Restrict calendar creation entirely for Students and Parents
  const canCreate = user.role !== 'PADRE' && user.role !== 'ESTUDIANTE';

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>, day: Date) => {
    if (!canCreate) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Grid spans 13 hours (8 AM to 8 PM) over the total height
    const percentageY = y / rect.height;
    const totalMinutesDay = 13 * 60;
    const totalMinutes = percentageY * totalMinutesDay;

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
    <div className="flex h-full w-full min-h-0 md:gap-6">
      <div className="flex-1 space-y-2 md:space-y-4 flex flex-col min-h-0 w-full">
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="hidden lg:block">
            <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">{t.schedule.title}</h1>
            <p className="text-slate-500 mt-1 hidden md:block">{t.schedule.subtitle}</p>
          </div>

          <div className="flex flex-1 lg:flex-none items-center justify-between lg:justify-end gap-2 md:gap-4">
            <div className="flex items-center gap-1 md:gap-2">
              {canCreate && (
                <button
                  onClick={() => { setEditingEvent(null); setIsEditorOpen(true); }}
                  className="bg-white text-slate-700 border border-slate-200 shadow-sm px-2 md:px-4 py-1.5 md:py-2 rounded-full font-medium hover:shadow-md hover:bg-slate-50 transition-all flex items-center md:pr-5"
                  title="Crear Evento"
                >
                  <div className="text-primary-600 flex items-center justify-center md:mr-2">
                    <Plus size={18} strokeWidth={2.5} />
                  </div>
                  <span className="hidden md:inline">Crear Evento</span>
                </button>
              )}
              <button className="bg-white border border-slate-200 text-slate-700 px-3 md:px-5 py-1.5 md:py-2 rounded-full font-medium text-xs md:text-sm shadow-sm hover:bg-slate-50 transition-all">
                Hoy
              </button>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div id="tour-schedule-nav" className="flex items-center space-x-0.5 md:space-x-1 bg-white rounded-full border border-slate-200 p-0.5 md:p-1 shadow-sm">
                <button className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronLeft size={16} /></button>
                <button className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronRight size={16} /></button>
              </div>
              <span className="text-xs md:text-xl font-semibold text-slate-800 capitalize ml-1">
                <span className="md:hidden">{getLocalizedMonth(today).slice(0, 3)} '{format(today, 'yy')}</span>
                <span className="hidden md:inline">{getLocalizedMonth(today)} {format(today, 'yyyy')}</span>
              </span>
            </div>
          </div>
        </div>

        <div id="tour-schedule-grid" className="flex-1 bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col custom-scrollbar relative">
            <div className="flex flex-col flex-1 min-h-[600px] md:min-h-[800px] w-full relative">
              {/* Header Row */}
              <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-30">
                {/* Empty corner for time column */}
                <div className="w-10 md:w-16 shrink-0 border-r border-slate-200 bg-slate-50 sticky left-0 z-40"></div>
                <div className="flex-1 grid grid-cols-5">
                  {weekDays.map((day, idx) => (
                    <div key={idx} className={`py-2 md:py-4 px-0.5 md:px-2 text-center border-r border-slate-200 last:border-r-0 flex flex-col items-center justify-center ${isSameDay(day, today) ? 'bg-primary-50/50' : ''}`}>
                      <span className="block text-[9px] md:text-xs uppercase font-bold text-slate-400 truncate w-full">
                        <span className="md:hidden">{getLocalizedDay(day).slice(0, 3)}</span>
                        <span className="hidden md:inline">{getLocalizedDay(day)}</span>
                      </span>
                      <span className={`block text-base md:text-xl font-bold mt-0.5 md:mt-1 ${isSameDay(day, today) ? 'text-primary-600' : 'text-slate-700'}`}>
                        {format(day, 'd')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex h-full w-full">
                {/* Time Column Sidebar */}
                <div className="w-10 md:w-16 shrink-0 bg-white border-r border-slate-200 flex flex-col pt-2 sticky left-0 z-20 h-full">
                  {hours.map((hour) => (
                    <div key={hour} className="flex-1 relative">
                      <span className="absolute top-0 right-1 md:right-2 text-[9px] md:text-xs font-semibold text-slate-400 -translate-y-1/2">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                    </div>
                  ))}
                </div>

                {/* Grid Container */}
                <div className="flex-1 relative bg-white h-full flex flex-col">

                  {/* Horizontal Hour Lines Background */}
                  <div className="absolute inset-x-0 inset-y-0 pointer-events-none flex flex-col">
                    {hours.map((hour) => (
                      <div key={hour} className="flex-1 border-b border-slate-100"></div>
                    ))}
                  </div>

                  {/* Current Time Line Indicator */}
                  {isSameDay(today, new Date()) && getHours(currentTime) >= 8 && getHours(currentTime) <= 21 && (
                    <div
                      className="absolute inset-x-0 border-t-2 border-rose-500 z-20 pointer-events-none opacity-80"
                      style={{ top: `${(((getHours(currentTime) - 8) * 60 + currentTime.getMinutes()) / (13 * 60)) * 100}%` }}
                    >
                      <div className="w-2 h-2 rounded-full bg-rose-500 absolute -top-[5px] -left-1"></div>
                    </div>
                  )}

                  <div className="flex-1 grid grid-cols-5 relative z-10">
                    {weekDays.map((day, colIndex) => {
                      const dayEvents = visibleEvents.filter(e => isSameDay(e.start, day));

                      // Google Calendar Overlapping Logic
                      const sortedEvents = [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime());
                      const positionedEvents: { event: CalendarEvent, style: React.CSSProperties }[] = [];
                      let currentCluster: CalendarEvent[] = [];
                      let clusterEnd = 0;

                      const processCluster = (cluster: CalendarEvent[]) => {
                        const columns: number[] = [];
                        cluster.forEach(ev => {
                          let colIdx = 0;
                          while (columns[colIdx] && columns[colIdx] > ev.start.getTime()) {
                            colIdx++;
                          }
                          columns[colIdx] = ev.end.getTime();
                          (ev as any)._colIdx = colIdx;
                        });
                        const numCols = columns.length;
                        cluster.forEach(ev => {
                          const colIdx = (ev as any)._colIdx;
                          positionedEvents.push({
                            event: ev,
                            style: {
                              ...getEventStyle(ev.start, ev.end),
                              left: `calc(${(colIdx / numCols) * 100}% + 2px)`,
                              width: `calc(${100 / numCols}% - 4px)`,
                              zIndex: 10 + colIdx
                            }
                          });
                        });
                      };

                      sortedEvents.forEach(event => {
                        if (event.start.getTime() >= clusterEnd) {
                          if (currentCluster.length > 0) processCluster(currentCluster);
                          currentCluster = [event];
                          clusterEnd = event.end.getTime();
                        } else {
                          currentCluster.push(event);
                          clusterEnd = Math.max(clusterEnd, event.end.getTime());
                        }
                      });
                      if (currentCluster.length > 0) processCluster(currentCluster);

                      return (
                        <div
                          key={colIndex}
                          className="border-r border-slate-100 relative h-full cursor-pointer hover:bg-slate-50/20 transition-colors group"
                          onClick={(e) => handleGridClick(e, day)}
                        >
                          {canCreate && (
                            <div className="absolute inset-x-0 inset-y-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-primary-600"></div>
                          )}
                          {positionedEvents.map(({ event, style }) => (
                            <div
                              key={event.id}
                              onClick={(e) => { e.stopPropagation(); setViewingEvent(event); }}
                              className={`absolute p-1 md:p-2 rounded-lg border-l-2 md:border-l-4 cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${event.color}`}
                              style={style}
                            >
                              <p className="text-[9px] md:text-[10px] leading-none md:leading-tight font-bold mb-0.5 opacity-80 truncate">
                                {format(event.start, 'HH:mm')}
                                <span className="hidden md:inline"> - {format(event.end, 'HH:mm')}</span>
                              </p>
                              <p className="text-[9px] md:text-xs font-bold leading-tight opacity-90 truncate">{event.title}</p>

                              {/* Only show "Pasar Lista" if event is long enough (e.g., >= 45m) and it's a class */}
                              {event.type === 'class' && (event.end.getTime() - event.start.getTime()) >= 45 * 60000 && (
                                <div className="hidden md:flex items-center mt-2 text-[10px] opacity-70" onClick={(e) => {
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
