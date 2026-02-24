
import React from 'react';
import { View, User } from '../types';
import { Users, Clock, AlertCircle, ArrowRight, TrendingUp, BookOpen, CheckCircle, MessageSquare, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';
import { Feed } from './Feed';
import { OnboardingWidget } from './OnboardingWidget';

interface DashboardProps {
  onViewChange: (view: View) => void;
  user: User;
}

const data = [
  { name: 'Mon', active: 45 },
  { name: 'Tue', active: 52 },
  { name: 'Wed', active: 48 },
  { name: 'Thu', active: 61 },
  { name: 'Fri', active: 55 },
  { name: 'Sat', active: 30 },
  { name: 'Sun', active: 20 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange, user }) => {
  const { courses, feed, students, events } = useTenantData();
  const nextClass = courses[0];
  const { t } = useLanguage();

  // In a real app, course IDs come from the user's real relationships
  const myCourses = (user as any).enrolledCourseIds || [];

  const personalizedFeed = feed.filter(item => {
    if (item.scope === 'INSTITUTION') return true;
    if (user.role === 'ADMIN_INSTITUCION' || user.role === 'SUPER_ADMIN') return true;
    if (user.role === 'DOCENTE') return courses.some(c => c.id === item.courseId && c.instructor === user.name);
    return item.courseId && myCourses.includes(item.courseId);
  }).slice(0, 10);

  const AdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="tour-dash-stats">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
            <Users size={24} />
          </div>
          <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} className="mr-1" /> +12%
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-slate-800">{students.length}</h3>
          <p className="text-slate-500 font-medium">{t.dashboard.stats.activeStudents}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
            <Clock size={24} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-slate-800">
            {events.filter(e => new Date(e.start).toDateString() === new Date().toDateString()).length}
          </h3>
          <p className="text-slate-500 font-medium">{t.dashboard.stats.classesToday}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <AlertCircle size={24} />
          </div>
          <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
            {t.dashboard.stats.actionNeeded}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-slate-800">3</h3>
          <p className="text-slate-500 font-medium">{t.dashboard.stats.pendingApprovals}</p>
        </div>
      </div>
    </div>
  );

  const StudentStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="tour-dash-stats">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <BookOpen size={24} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-slate-800">{myCourses.length}</h3>
          <p className="text-slate-500 font-medium">{t.dashboard.stats.enrolledCourses}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle size={24} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-slate-800">
            {students.find(s => s.id === user.id)?.attendanceRate || 0}%
          </h3>
          <p className="text-slate-500 font-medium">{t.dashboard.stats.attendanceRate}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock size={24} />
          </div>
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            {t.dashboard.stats.dueSoon}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-slate-800">1</h3>
          <p className="text-slate-500 font-medium">{t.dashboard.stats.assignmentsPending}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {t.dashboard.greeting}, {user.name.split(' ')[0]}.
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            {user.role === 'ADMIN_INSTITUCION' && t.dashboard.adminSub}
            {user.role === 'DOCENTE' && t.dashboard.teacherSub}
            {user.role === 'ESTUDIANTE' && t.dashboard.studentSub}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t.dashboard.currentTerm}</p>
          <p className="text-xl font-semibold text-slate-800">{t.dashboard.termName}</p>
        </div>
      </div>

      {/* Onboarding Widget */}
      <OnboardingWidget role={user.role} onViewChange={onViewChange} />

      {/* Stats Grid based on Role */}
      {(user.role === 'ADMIN_INSTITUCION' || user.role === 'SUPER_ADMIN') ? <AdminStats /> : <StudentStats />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">

          {/* Chart only for Admin/Teacher */}
          {user.role !== 'ESTUDIANTE' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">{t.dashboard.chartTitle}</h3>
                <select className="bg-slate-50 border-none text-sm text-slate-500 rounded-lg p-2 focus:ring-0 cursor-pointer outline-none">
                  <option>{t.dashboard.chartDropdown.thisWeek}</option>
                  <option>{t.dashboard.chartDropdown.lastWeek}</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    />
                    <Area type="monotone" dataKey="active" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* CENTRAL FEED PORTAL (Replaces My Assignments) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Actividad Reciente</h3>
            </div>
            <Feed items={personalizedFeed} />
          </div>

        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Up Next Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden" id="tour-dash-upnext">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20 transform translate-x-10 -translate-y-10"></div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-300 uppercase tracking-widest">
                  {user.role === 'ESTUDIANTE' ? t.dashboard.upNext : t.dashboard.nextSession}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{nextClass ? nextClass.title : 'No classes'}</h3>
              <p className="text-slate-400">{nextClass ? nextClass.instructor : ''}</p>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                <span className="text-slate-400">{t.dashboard.time}</span>
                <span className="font-medium">{nextClass ? nextClass.nextSession : '--'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                <span className="text-slate-400">{t.dashboard.room}</span>
                <span className="font-medium">Studio B</span>
              </div>
            </div>

            <button
              onClick={() => onViewChange(user.role === 'ESTUDIANTE' ? 'classroom' : 'courses')}
              className="mt-6 w-full bg-white text-slate-900 py-3 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center group"
            >
              {t.dashboard.goToClass}
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">{t.dashboard.quickLinks}</h3>
            <div className="space-y-2">
              <button onClick={() => onViewChange('messages')} className="w-full text-left p-3 hover:bg-slate-50 rounded-lg text-sm text-slate-600 flex items-center transition-colors">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3"><MessageSquare size={16} /></div>
                {t.dashboard.unreadMessages} <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
              </button>
              <button onClick={() => onViewChange('schedule')} className="w-full text-left p-3 hover:bg-slate-50 rounded-lg text-sm text-slate-600 flex items-center transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3"><Calendar size={16} /></div>
                {t.dashboard.viewSchedule}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
