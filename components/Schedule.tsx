
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Check, X, AlertCircle, Info, Save } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, getHours, getMinutes } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';
import { useRef, useEffect } from 'react'; // Added useEffect
import { User } from '../types'; // Added User

interface ScheduleProps {
  user: User;
}

export const Schedule: React.FC<ScheduleProps> = ({ user }) => {
  const { t } = useLanguage();
  const { events, students, emitEvent, dispatch } = useTenantData(); // Added dispatch
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(startOfCurrentWeek, i));

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  // Onboarding: Mark 'check_schedule' as complete for students
  useEffect(() => {
    if (user.role === 'ESTUDIANTE') {
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'check_schedule' }); // Note: ID in onboarding.ts is 'check_schedule' (student) vs 'view_schedule' (teacher)
    } else if (user.role === 'DOCENTE') {
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'view_schedule' });
    }
  }, [user.role, dispatch]);

  const handleAttendance = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    // Dispatch cross-module event
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status: status as 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED',
    }));
    emitEvent({
      type: 'ATTENDANCE_TAKEN',
      payload: {
        eventId: selectedEvent?.id || '',
        courseTitle: selectedEvent?.title || '',
        records,
      },
    });

    // Onboarding: Mark 'take_attendance' as complete for teachers
    if (user.role === 'DOCENTE') {
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'take_attendance' });
    }

    setSelectedEvent(null);
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

  // Helper to place events on the grid roughly based on time (Simplified for MVP)
  // Assuming day starts at 8AM. 
  const getEventStyle = (start: Date, end: Date) => {
    const startHour = getHours(start);
    const topOffset = (startHour - 8) * 60; // Approximate pixel mapping
    return { top: `${Math.max(10, topOffset)}px` };
  };

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 space-y-6 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.schedule.title}</h1>
            <p className="text-slate-500 mt-1">{t.schedule.subtitle}</p>
          </div>
          <div id="tour-schedule-nav" className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1">
            <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft size={20} /></button>
            <span className="text-sm font-semibold text-slate-700 px-2">{getLocalizedMonth(today)} {format(today, 'yyyy')}</span>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div id="tour-schedule-grid" className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {/* Week Header */}
          <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
            {weekDays.map((day, idx) => (
              <div key={idx} className={`py-4 text-center border-r border-slate-200 last:border-r-0 ${isSameDay(day, today) ? 'bg-primary-50/50' : ''}`}>
                <span className="block text-xs uppercase font-bold text-slate-400">{getLocalizedDay(day)}</span>
                <span className={`block text-xl font-bold mt-1 ${isSameDay(day, today) ? 'text-primary-600' : 'text-slate-700'}`}>
                  {format(day, 'd')}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="flex-1 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-opacity-20">
            <div className="grid grid-cols-5 h-[600px] min-h-full relative">
              {weekDays.map((day, colIndex) => {
                const dayEvents = events.filter(e => isSameDay(e.start, day));

                return (
                  <div key={colIndex} className="border-r border-slate-100 p-2 relative h-full">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`absolute left-2 right-2 p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${event.color}`}
                        style={getEventStyle(event.start, event.end)}
                      >
                        <p className={`text-xs font-bold mb-1 opacity-80`}>
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </p>
                        <p className="text-sm font-bold opacity-90">{event.title}</p>
                        {event.type === 'class' && (
                          <div className="flex items-center mt-2 text-xs opacity-70">
                            <MapPin size={12} className="mr-1" /> Room 104
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

      {/* Attendance Sidebar */}
      {selectedEvent && (
        <div className="w-96 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col animate-fade-in-right">
          <div className="p-5 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900">{selectedEvent.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <Clock size={12} className="mr-1" /> {format(selectedEvent.start, 'EEEE, d MMMM')}
              </p>
            </div>
            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">
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
    </div>
  );
};
