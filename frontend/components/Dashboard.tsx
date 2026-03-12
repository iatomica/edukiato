import { Feed } from '@/components/Feed';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTenantData } from '@/hooks/useTenantData';
import { FeedItem, View, User } from '@/types';
import { BookOpen, MessageSquare, Calendar, Gift } from 'lucide-react';
import React, { useEffect } from 'react';

interface DashboardProps {
  onViewChange: (view: View) => void;
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange, user }) => {
  const { aulas, events, communications, ninos, students } = useTenantData();
  const { token } = useAuth();
  const { t } = useLanguage();
  const userFirstName = React.useMemo(() => {
    const normalizedName = user?.name?.trim();
    if (normalizedName) {
      return normalizedName.split(/\s+/)[0];
    }

    const emailPrefix = user?.email?.split('@')[0]?.trim();
    return emailPrefix || 'Usuario';
  }, [user]);

  const [feedFilter, setFeedFilter] = React.useState<'ALL' | 'ONLY_COMMUNICATIONS' | 'ONLY_EVENTS'>('ALL');

  const upcomingBirthdays = React.useMemo(() => {
    if (!['ADMIN_INSTITUCION', 'SUPER_ADMIN', 'DOCENTE', 'ESPECIALES'].includes(user.role)) {
      return { ninosToday: [], ninosUpcoming: [], staffToday: [], staffUpcoming: [] };
    }

    // Find classrooms assigned to this teacher/staff
    const teacherAulasIds = aulas
      .filter(a => a.teachers?.includes(user.id))
      .map(a => a.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();

    const ninosToday: any[] = [];
    const ninosUpcoming: any[] = [];
    const staffToday: any[] = [];
    const staffUpcoming: any[] = [];

    const isDirective = ['ADMIN_INSTITUCION', 'SUPER_ADMIN'].includes(user.role);

    // 1. Process Ninos
    if (ninos) {
      ninos.forEach(nino => {
        const isTeacherOfStudent = ['DOCENTE', 'ESPECIALES'].includes(user.role) && teacherAulasIds.includes(nino.aulaId);
        if (!isDirective && !isTeacherOfStudent) return;
        if (!nino.birthDate) return;

        const bDate = new Date(nino.birthDate);
        bDate.setMinutes(bDate.getMinutes() + bDate.getTimezoneOffset());
        let nextBirthday = new Date(currentYear, bDate.getMonth(), bDate.getDate());
        if (nextBirthday.getTime() < today.getTime()) nextBirthday.setFullYear(currentYear + 1);

        const diffTime = nextBirthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) ninosToday.push(nino);
        else if (diffDays > 0 && diffDays <= 21) ninosUpcoming.push({ item: nino, diffDays, nextBirthday });
      });
    }

    // 2. Process Staff (SuperAdmin & Admin only)
    if (isDirective && students) {
      students.forEach((staff: any) => {
        // En AppStateContext los usuarios se mapean como "students" :(
        if (!staff.birthDate) return;

        const bDate = new Date(staff.birthDate);
        bDate.setMinutes(bDate.getMinutes() + bDate.getTimezoneOffset());
        let nextBirthday = new Date(currentYear, bDate.getMonth(), bDate.getDate());
        if (nextBirthday.getTime() < today.getTime()) nextBirthday.setFullYear(currentYear + 1);

        const diffTime = nextBirthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) staffToday.push(staff);
        else if (diffDays > 0 && diffDays <= 21) staffUpcoming.push({ item: staff, diffDays, nextBirthday });
      });
    }

    ninosUpcoming.sort((a, b) => a.diffDays - b.diffDays);
    staffUpcoming.sort((a, b) => a.diffDays - b.diffDays);

    return { ninosToday, ninosUpcoming, staffToday, staffUpcoming };
  }, [ninos, students, aulas, user]);

  const [totalUnreadMessages, setTotalUnreadMessages] = React.useState(0);

  // Unread Communications (ANNOUNCEMENT notifications)
  const unreadCommunicationsCount = React.useMemo(() => {
    // We filter notifications globally first, then applying same recipient logic as Layout.tsx
    const userNotifications = communications.filter(c => {
      // Mock approach: check if communication is not read and intended for user
      if (c.recipientId && c.recipientId !== user.id) return false;
      return !c.isRead;
    });
    return userNotifications.length;
  }, [communications, user]);

  const [lastSeenCalendar, setLastSeenCalendar] = React.useState<number>(0);

  // Sync Calendar view status
  useEffect(() => {
    if (!user) return;
    const updateSeen = () => {
      const seen = localStorage.getItem('lastSeenCalendar_' + user.id);
      setLastSeenCalendar(seen ? new Date(seen).getTime() : 0);
    };
    updateSeen();
    window.addEventListener('CALENDAR_VIEWED', updateSeen);
    return () => window.removeEventListener('CALENDAR_VIEWED', updateSeen);
  }, [user]);

  // Upcoming Events (Events with start date >= today and created AFTER we last saw the calendar)
  const upcomingEventsCount = React.useMemo(() => {
    return events.filter(e => {
      const isUpcoming = new Date(e.start) >= new Date(new Date().setHours(0, 0, 0, 0));
      if (!isUpcoming) return false;
      if (lastSeenCalendar === 0) return true; // Never opened calendar, so show all as unread
      const eventCreated = e.createdAt ? new Date(e.createdAt).getTime() : 0;
      return eventCreated > lastSeenCalendar;
    }).length;
  }, [events, lastSeenCalendar]);

  // Real-time synchronization for Dashboard Widget
  useEffect(() => {
    const fetchUnread = async () => {
      if (!user || !token) return;

      import('@/services/api').then(({ messagesApi }) => {
        messagesApi.getConversations(user.id, token).then(convs => {
          // In Dashboard, typically counting all unread interactions or precisely conversations where count > 0
          // The user asks "contador de conversaciones". Meaning how many distinct *chats* have unread messages?
          const conversationsWithUnread = convs.filter(c => (c.unreadCount || 0) > 0).length;
          setTotalUnreadMessages(conversationsWithUnread);
        }).catch(() => setTotalUnreadMessages(0));
      });
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [user, token]);

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
            const isParentOfAula = ninos.some(n => e.sharedWith!.targetIds!.includes(n.aulaId) && n.parentIds?.includes(user.id));
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
                {t.dashboard.greeting}, {userFirstName}.
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                {user.role === 'ADMIN_INSTITUCION' && t.dashboard.adminSub}
                {user.role === 'DOCENTE' && t.dashboard.teacherSub}
                {user.role === 'ESTUDIANTE' && t.dashboard.studentSub}
              </p>
            </div>
          </div>
        </div>

        {/* Alumnos Cumpleañeros (Banner Naranja) */}
        {['ADMIN_INSTITUCION', 'SUPER_ADMIN', 'DOCENTE', 'ESPECIALES'].includes(user.role) && upcomingBirthdays.ninosToday.length > 0 && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 shadow-lg text-white flex items-center gap-5 animate-scale-in relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform scale-150 -translate-y-1/4 translate-x-1/4 pointer-events-none">
              <Gift size={160} />
            </div>
            <div className="bg-white/20 p-4 rounded-2xl shrink-0 backdrop-blur-sm border border-white/30 hidden sm:block">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-2xl tracking-tight leading-tight">¡Hoy es el cumpleaños de {upcomingBirthdays.ninosToday.map((n: any) => n.name.split(' ')[0]).join(', ')}! 🎂</h3>
              <p className="text-amber-50 font-medium text-lg mt-1 opacity-90">No te olvides de enviarles un saludo especial en su día.</p>
            </div>
          </div>
        )}

        {/* Staff Cumpleañeros (Banner Azul - Solo Admins) */}
        {['ADMIN_INSTITUCION', 'SUPER_ADMIN'].includes(user.role) && upcomingBirthdays.staffToday.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-lg text-white flex items-center gap-5 animate-scale-in relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform scale-150 -translate-y-1/4 translate-x-1/4 pointer-events-none">
              <Gift size={160} />
            </div>
            <div className="bg-white/20 p-4 rounded-2xl shrink-0 backdrop-blur-sm border border-white/30 hidden sm:block">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-2xl tracking-tight leading-tight">¡Hoy cumple años {upcomingBirthdays.staffToday.map((n: any) => n.name.split(' ')[0]).join(', ')} del equipo! 🎉</h3>
              <p className="text-blue-50 font-medium text-lg mt-1 opacity-90">¡Saludale de parte de la institución!</p>
            </div>
          </div>
        )}

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
                  {unreadCommunicationsCount > 0 && (
                    <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCommunicationsCount}</span>
                  )}
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
                  {upcomingEventsCount > 0 && (
                    <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{upcomingEventsCount}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Upcoming Birthdays Widgets */}
            {['ADMIN_INSTITUCION', 'SUPER_ADMIN'].includes(user.role) && (
              <div className="space-y-6">
                {/* Alumnos */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Gift size={18} className="text-amber-500" /> Próximos Cumpleaños (Alumnos)
                  </h3>
                  {upcomingBirthdays.ninosUpcoming.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No hay cumpleaños en las próximas 3 semanas.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {upcomingBirthdays.ninosUpcoming.map(({ item, diffDays, nextBirthday }) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100 mt-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{item.name}</p>
                            <p className="text-xs font-bold text-amber-600 capitalize">
                              {nextBirthday.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold bg-white text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200 shadow-sm shrink-0 whitespace-nowrap">
                            {diffDays === 1 ? 'Mañana' : `En ${diffDays} días`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Staff */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Gift size={18} className="text-blue-500" /> Próximos Cumpleaños (Staff)
                  </h3>
                  {upcomingBirthdays.staffUpcoming.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No hay cumpleaños en las próximas 3 semanas.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {upcomingBirthdays.staffUpcoming.map(({ item, diffDays, nextBirthday }) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100 mt-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{item.name}</p>
                            <p className="text-xs font-bold text-blue-600 capitalize">
                              {nextBirthday.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold bg-white text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200 shadow-sm shrink-0 whitespace-nowrap">
                            {diffDays === 1 ? 'Mañana' : `En ${diffDays} días`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
