import React, { useEffect } from 'react';
import { View, User } from '../types';
import { Users, Clock, AlertCircle, ArrowRight, TrendingUp, BookOpen, CheckCircle, MessageSquare, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';
import { Feed } from './Feed';
import { FeedItem } from '../types';

interface DashboardProps {
  onViewChange: (view: View) => void;
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange, user }) => {
  const { aulas, events, communications, students } = useTenantData();
  const nextClass = aulas[0];
  const { t } = useLanguage();

  const [feedFilter, setFeedFilter] = React.useState<'ALL' | 'ONLY_COMMUNICATIONS' | 'ONLY_EVENTS'>('ALL');

  const [totalUnreadMessages, setTotalUnreadMessages] = React.useState(0);

  // Real-time synchronization for Dashboard Widget
  useEffect(() => {
    const fetchUnread = async () => {
      // @ts-ignore
      const token = localStorage.getItem('token') || 'dummy';
      if (!user) return;

      import('../services/api').then(({ messagesApi }) => {
        messagesApi.getConversations(user.id, token).then(convs => {
          const sum = convs.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
          // In Dashboard, typically counting all unread interactions or precisely conversations where count > 0
          // The user asks "contador de conversaciones". Meaning how many distinct *chats* have unread messages?
          const conversationsWithUnread = convs.filter(c => (c.unreadCount || 0) > 0).length;
          setTotalUnreadMessages(conversationsWithUnread);
        });
      });
    };

    fetchUnread();
    window.addEventListener('MOCK_MESSAGES_UPDATED', fetchUnread);
    const interval = setInterval(fetchUnread, 3000);
    return () => {
      window.removeEventListener('MOCK_MESSAGES_UPDATED', fetchUnread);
      clearInterval(interval);
    };
  }, [user]);

  // Map Communications and Events into a unified "Social Feed" structure matching FeedItem interface
  const unifiedFeed: FeedItem[] = React.useMemo(() => {
    // 1. Map Communications (ANUNCIO_GENERAL)
    const commsMapped: FeedItem[] = communications
      .filter(c => c.type === 'ANUNCIO_GENERAL')
      .map(c => ({
        id: `comm_${c.id}`,
        institutionId: c.institutionId,
        scope: 'INSTITUTION',
        type: 'ANNOUNCEMENT', // Using existing Feed UI type for style
        title: c.title,
        description: c.content,
        postedAt: new Date(c.createdAt),
        author: c.senderName,
      }));

    // 2. Map Events (Applying Visibility Privacy Filter)
    const eventsMapped: FeedItem[] = events
      .filter(e => {
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_INSTITUCION') return true;
        if (e.creatorId === user.id) return true;
        if (!e.sharedWith || e.sharedWith.scope === 'ALL') return true;

        if (e.sharedWith.scope === 'AULA' && e.sharedWith.targetIds) {
          if (user.role === 'DOCENTE') {
            const isTeacherOfAula = aulas.some(a => e.sharedWith!.targetIds!.includes(a.id) && a.teachers?.includes(user.id));
            if (isTeacherOfAula) return true;
          }
          if (user.role === 'PADRE') {
            const isParentOfAula = students.some(n => e.sharedWith!.targetIds!.includes(n.aulaId) && n.parentIds?.includes(user.id));
            if (isParentOfAula) return true;
          }
        }
        return false;
      })
      .map(e => ({
        id: `evt_${e.id}`,
        institutionId: e.institutionId,
        scope: 'COURSE', // Reusing tag style
        courseId: t.nav.schedule, // To display "Calendario" tag
        type: 'MATERIAL', // Reusing existing Feed icon/color style (blue)
        title: e.title,
        description: e.description || `Evento programado para: ${new Date(e.start).toLocaleString()}`,
        postedAt: new Date(e.start), // Using start date as the chronological anchor
        dueDate: new Date(e.start),
        author: 'Sistema',
      }));

    // Combine and sort chronologically (newest first)
    return [...commsMapped, ...eventsMapped].sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }, [communications, events, t.nav.schedule]);

  const filteredFeed = unifiedFeed.filter(item => {
    if (feedFilter === 'ALL') return true;
    if (feedFilter === 'ONLY_COMMUNICATIONS') return item.type === 'ANNOUNCEMENT';
    if (feedFilter === 'ONLY_EVENTS') return item.type === 'MATERIAL';
    return true;
  });

  return (
    <div className="space-y-8 relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Main Content Component, Elevated to be clickable over SVG */}
      <div className="relative z-10 space-y-8">
        {/* Header Panel with Airplane Animation */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/50 via-teal-50/30 to-white border border-indigo-100/50 shadow-sm rounded-3xl p-8">

          {/* Background SVG Animation Layer specifically for the header panel */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" preserveAspectRatio="xMinYMid slice" viewBox="0 0 1000 200">
              <path
                id="flightPath"
                d="M -100,160 Q 200,40 600,130 T 1200,60"
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="10 10"
                className="animate-dash"
              />
              <g className="animate-fly">
                {/* Paper Airplane SVG */}
                <path
                  d="M 0,10 L 30,0 L 12,20 L 0,10 Z M 12,20 L 15,30 L 20,22 Z"
                  fill="#14b8a6"
                  transform="translate(-15, -15) rotate(15)"
                />
              </g>
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-end">
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
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">

            {/* CENTRAL FEED PORTAL */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-end mb-6 gap-4">

                {/* Filters */}
                <div className="flex bg-slate-100/50 p-1 rounded-xl">
                  <button
                    onClick={() => setFeedFilter('ALL')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${feedFilter === 'ALL' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Cronología
                  </button>
                  <button
                    onClick={() => setFeedFilter('ONLY_COMMUNICATIONS')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${feedFilter === 'ONLY_COMMUNICATIONS' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Comunicados
                  </button>
                  <button
                    onClick={() => setFeedFilter('ONLY_EVENTS')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${feedFilter === 'ONLY_EVENTS' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Eventos
                  </button>
                </div>
              </div>
              <Feed items={filteredFeed} />
            </div>

          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">

            {/* Quick Tasks */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">{t.dashboard.quickLinks}</h3>
              <div className="space-y-2">
                <button onClick={() => onViewChange('communications')} className="w-full text-left p-3 hover:bg-slate-50 rounded-lg text-sm text-slate-600 flex items-center transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3"><BookOpen size={16} /></div>
                  Cuaderno de Comunicados
                </button>
                <button onClick={() => onViewChange('messages')} className="w-full text-left p-3 hover:bg-slate-50 rounded-lg text-sm text-slate-600 flex items-center transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3"><MessageSquare size={16} /></div>
                  {t.dashboard.unreadMessages}
                  {totalUnreadMessages > 0 && (
                    <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{totalUnreadMessages}</span>
                  )}
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
    </div>
  );
};
