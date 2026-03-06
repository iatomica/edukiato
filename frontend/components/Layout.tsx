import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTenantData } from '@/hooks/useTenantData';
import { View, User } from '@/types';
import { Home, Users, Calendar, Settings, LogOut, Menu, Bell, MessageSquare, Building2, FileText, GraduationCap, X, Send } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { can } = usePermissions();
  const { theme } = useTheme();
  const { clearInstitution, token } = useAuth();
  const { notifications, aulas, ninos, events, communications, dispatch } = useTenantData();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [lastSeenCalendar, setLastSeenCalendar] = useState<number>(0);

  const markCalendarAsSeen = React.useCallback(() => {
    if (!user?.id) return;
    const nowIso = new Date().toISOString();
    localStorage.setItem(`lastSeenCalendar_${user.id}`, nowIso);
    setLastSeenCalendar(new Date(nowIso).getTime());
  }, [user?.id]);

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter notifications relevant to the current user
  const userNotifications = notifications.filter(n => {
    // 0. General Announcements go to everyone
    if (n.type === 'ANNOUNCEMENT' && !n.courseId && !n.recipientId) return true;

    if (n.recipientId && n.recipientId !== user.id) return false;

    // 2. Admins can see broadcasts and room-specific announcements
    if (user.role === 'ADMIN_INSTITUCION' || user.role === 'SUPER_ADMIN') {
      return true;
    }

    // 3. Room-specific broadcast (courseId mapped to aulaId conceptually for announcements)
    if (n.courseId) {
      const aula = aulas.find(a => a.id === n.courseId);
      if (!aula) return false;

      if (user.role === 'DOCENTE' || user.role === 'ESPECIALES') {
        return aula.teachers.includes(user.id) || !!aula.assistants?.includes(user.id);
      }

      if (user.role === 'PADRE') {
        const hasChildInClass = ninos.some(child => child.aulaId === n.courseId && child.parentIds?.includes(user.id));
        return hasChildInClass;
      }

      return false; // Other roles shouldn't see it if it's strictly for this room
    }

    // If no courseId and no recipientId, it's a general broadcast
    return true;
  });

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const hasUnreadCommunications = communications.some(c => {
    // Logic mirroring Dashboard: check if communication is not read and intended for user
    if (c.recipientId && c.recipientId !== user.id) return false;
    return !c.isRead;
  });

  useEffect(() => {
    if (!user?.id) return;
    const seen = localStorage.getItem(`lastSeenCalendar_${user.id}`);
    setLastSeenCalendar(seen ? new Date(seen).getTime() : 0);
  }, [user?.id]);

  useEffect(() => {
    if (currentView === 'schedule') {
      markCalendarAsSeen();
    }
  }, [currentView, markCalendarAsSeen]);

  useEffect(() => {
    const handleCalendarViewed = () => {
      markCalendarAsSeen();
    };

    window.addEventListener('CALENDAR_VIEWED', handleCalendarViewed);
    return () => window.removeEventListener('CALENDAR_VIEWED', handleCalendarViewed);
  }, [markCalendarAsSeen]);

  const hasUpcomingEvents = currentView !== 'schedule' && events.some(e => {
    const isUpcoming = new Date(e.start) >= new Date(new Date().setHours(0, 0, 0, 0));
    if (!isUpcoming) return false;

    // Apply privacy filter
    let canView = false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_INSTITUCION' || e.creatorId === user.id) {
      canView = true;
    } else if (!e.sharedWith || e.sharedWith.scope === 'ALL') {
      canView = true;
    } else if (e.sharedWith.scope === 'AULA' && e.sharedWith.targetIds) {
      if (user.role === 'DOCENTE' || user.role === 'ESPECIALES') {
        canView = aulas.some(a => e.sharedWith!.targetIds!.includes(a.id) && a.teachers?.includes(user.id));
      } else if (user.role === 'PADRE') {
        canView = ninos.some(n => e.sharedWith!.targetIds!.includes(n.aulaId) && n.parentIds?.includes(user.id));
      }
    }

    if (lastSeenCalendar === 0) return canView;
    const eventTimestamp = e.createdAt ? new Date(e.createdAt).getTime() : new Date(e.start).getTime();
    return eventTimestamp > lastSeenCalendar && canView;
  });

  const hasUnreadMessages = unreadMessagesCount > 0;

  // Real-time synchronization for Sidebar Dot
  useEffect(() => {
    const fetchUnread = async () => {
      if (!user || !token) return;

      import('@/services/api').then(({ messagesApi }) => {
        messagesApi.getConversations(user.id, token).then(convs => {
          const sum = convs.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
          setUnreadMessagesCount(sum);
        }).catch(() => setUnreadMessagesCount(0));
      });
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [user, token]);

  const NavItem = ({ view, icon: Icon, label, hasDot }: { view: View; icon: React.ElementType; label: string; hasDot?: boolean }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          onViewChange(view);
          setIsMobileMenuOpen(false);
        }}
        title={isDesktopCollapsed ? label : undefined}
        className={`w-full flex items-center ${isDesktopCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'} rounded-xl transition-all duration-200 group ${isActive
          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
      >
        <div className="relative">
          <Icon size={20} className={isActive ? 'text-primary-600 shrink-0' : 'text-slate-400 group-hover:text-slate-600 shrink-0'} />
          {hasDot && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
        </div>
        <span className={`whitespace-nowrap transition-all duration-300 ${isDesktopCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100 w-auto'}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20 gap-4">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="w-8 h-8 shrink-0 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">{theme.institutionName.charAt(0)}</div>
          <span className="font-bold text-slate-800 text-lg truncate leading-tight">{theme.institutionName}</span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button className="relative p-2 text-slate-600" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <Bell size={24} />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transform transition-all duration-300 ease-in-out md:relative flex flex-col items-center overflow-x-hidden
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${isDesktopCollapsed && !isMobileMenuOpen ? 'md:w-20' : 'md:w-64'}
      `}>
        {/* Mobile Close Button */}
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full z-50">
            <X size={20} />
          </button>
        )}

        <div className={`p-6 md:p-8 flex items-center w-full relative min-w-0 ${isDesktopCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-9 h-9 min-w-[36px] bg-slate-900 rounded-xl flex flex-shrink-0 items-center justify-center text-white shadow-lg shadow-slate-900/20">
            <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
          </div>
          <span title={theme.institutionName} className={`font-bold text-slate-800 text-lg tracking-tight transition-all duration-300 ${isDesktopCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'flex-1 opacity-100 truncate'}`}>{theme.institutionName}</span>

          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden md:flex absolute -right-3 top-8 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 p-1 rounded-full shadow-sm z-50 transition-all"
          >
            <Menu size={14} className={isDesktopCollapsed ? 'rotate-180' : ''} />
          </button>
        </div>

        <nav className={`flex-1 w-full space-y-2 mt-4 px-3 overflow-y-auto custom-scrollbar`}>
          <div className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 transition-all duration-300 ${isDesktopCollapsed ? 'px-0 text-center text-[10px]' : 'px-4'}`}>
            {isDesktopCollapsed ? '•••' : t.nav.menu}
          </div>
          <NavItem view="dashboard" icon={Home} label={t.nav.dashboard} />



          {user.role !== 'PADRE' && can('read', 'aula') && (
            <NavItem view="aulas" icon={Users} label="Aulas y Salas" />
          )}
          <NavItem view="students" icon={GraduationCap} label={t.nav.students} />




          <NavItem view="schedule" icon={Calendar} label={t.nav.schedule} hasDot={hasUpcomingEvents} />
          <NavItem view="messages" icon={MessageSquare} label={t.nav.messages} hasDot={hasUnreadMessages} />
          <NavItem view="communications" icon={FileText} label="Cuaderno" hasDot={hasUnreadCommunications} />

          {can('read', 'financial') && (
            <>
              <div className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 transition-all duration-300 ${isDesktopCollapsed ? 'px-0 text-center text-[10px]' : 'px-4'}`}>
                {isDesktopCollapsed ? '•••' : t.nav.admin}
              </div>
              {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_INSTITUCION') && can('manage', 'user') && (
                <NavItem view="usuarios" icon={Users} label="Usuarios y Roles" />
              )}
            </>
          )}
        </nav>

        <div className={`p-4 border-t border-slate-100 w-full flex flex-col ${isDesktopCollapsed ? 'items-center px-2' : ''}`}>

          <button
            title={isDesktopCollapsed ? t.nav.settings : undefined}
            onClick={() => onViewChange('settings')}
            className={`w-full flex items-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors ${isDesktopCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-2'}`}
          >
            <Settings size={20} className="shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${isDesktopCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100 w-auto'}`}>{t.nav.settings}</span>
          </button>

          {/* Institution switcher */}
          {(user.institutions?.length ?? 0) > 1 && (
            <button
              onClick={clearInstitution}
              title={isDesktopCollapsed ? t.institutionPicker?.switchLabel || 'Cambiar institución' : undefined}
              className={`w-full flex items-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors mb-2 ${isDesktopCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-2'}`}
            >
              <Building2 size={18} className="shrink-0" />
              <span className={`font-medium truncate transition-all duration-300 ${isDesktopCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'text-sm opacity-100 w-auto'}`}>
                {t.institutionPicker?.switchLabel || 'Cambiar institución'}
              </span>
            </button>
          )}

          <div className={`mt-4 flex bg-slate-50 rounded-xl w-full ${isDesktopCollapsed ? 'flex-col items-center p-2 text-center' : 'items-center p-3'}`}>
            <UserAvatar name={user.name} role={user.role} className="w-10 h-10 border-2 border-white shadow-sm shrink-0" />

            <div className={`transition-all duration-300 delay-100 min-w-0 ${isDesktopCollapsed ? 'w-0 h-0 opacity-0 overflow-hidden m-0' : 'ml-3 flex-1 w-auto opacity-100 h-auto'}`}>
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>

            <button onClick={onLogout} title={t.nav.logOut} className={isDesktopCollapsed ? 'mt-3 p-2 bg-slate-200 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors' : ''}>
              <LogOut size={16} className={isDesktopCollapsed ? 'text-slate-600 cursor-pointer' : 'text-slate-400 cursor-pointer hover:text-rose-500'} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-65px)] md:h-screen">
        {/* Desktop Top Bar (Notifications) */}
        <div className="hidden md:flex justify-end items-center px-8 py-4 bg-background space-x-4">

          <div className="relative" ref={notifRef}>
            <button
              id="tour-notifs"
              onClick={() => {
                const willOpen = !isNotifOpen;
                setIsNotifOpen(willOpen);
                if (willOpen && unreadCount > 0) {
                  dispatch({ type: 'MARK_NOTIFICATIONS_READ', payload: { userId: user.id } });
                }
              }}
              className={`p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:bg-white hover:shadow-sm'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">{t.notifications?.title || 'Notificaciones'}</h3>
                  <button
                    onClick={() => dispatch({ type: 'MARK_NOTIFICATIONS_READ', payload: { userId: user.id } })}
                    className="text-xs text-primary-600 font-medium hover:underline"
                  >
                    {t.notifications?.markAllRead || 'Marcar como leídas'}
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* 
                    Captured Events triggering Notifications:
                    1. COURSE_CREATED -> System Alert
                    2. COURSE_SUSPENDED -> System Alert
                    3. PAYMENT_RECORDED -> System Alert
                    4. ATTENDANCE_TAKEN -> System Alert (Absences)
                    5. CONTENT_PUBLISHED -> Announcement/Assignment
                    6. STUDENT_ENROLLED -> System Alert
                    7. STUDENT_STATUS_CHANGED -> System Alert
                    8. COMMUNICATION_SENT -> Announcement/Message/System (Depending on type)
                  */}
                  {userNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      <p>{t.notifications?.empty || 'No tienes nuevas notificaciones.'}</p>
                    </div>
                  ) : userNotifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.actionLink) {
                          onViewChange(notif.actionLink.replace('/', '') as any); // Simple hack for now, ideally remove '/' in handler or handle routing properly
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-primary-50/30' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide mb-1 inline-block
                                ${notif.type === 'ANNOUNCEMENT' ? 'bg-amber-100 text-amber-700' :
                            notif.type === 'GRADE' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}
                              `}>
                          {t.notifications?.types?.[notif.type] || notif.type}
                        </span>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 text-center">
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-800">{t.notifications?.viewHistory || 'Ver historial'}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:px-8 md:pb-8">
          <div className="max-w-6xl mx-auto animate-fade-in h-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-0 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};