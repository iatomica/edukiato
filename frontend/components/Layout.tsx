import React, { useState, useRef, useEffect } from 'react';
import { Home, BookOpen, Users, Calendar, Settings, LogOut, Menu, Bell, MessageSquare, Globe, Info, Building2, ChevronDown, FileText, GraduationCap } from 'lucide-react';
import { View, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTour } from '../contexts/TourContext';
import { usePermissions } from '../contexts/PermissionsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTenantData } from '../hooks/useTenantData';
import { TourGuide } from './TourGuide';

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
  const notifRef = useRef<HTMLDivElement>(null);
  const { t, language, setLanguage } = useLanguage();
  const { startTour, hasSeenTour, isOpen } = useTour();
  const { can } = usePermissions();
  const { theme } = useTheme();
  const { clearInstitution } = useAuth();
  const { notifications, aulas, ninos } = useTenantData();

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

    // 1. Direct recipient
    if (n.recipientId && n.recipientId === user.id) return true;
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

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          onViewChange(view);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
      >
        <Icon size={20} className={isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <TourGuide />

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">{theme.institutionName.charAt(0)}</div>
          <span className="font-bold text-slate-800 text-lg">{theme.institutionName}</span>
        </div>
        <div className="flex items-center space-x-4">
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
        fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 md:p-8 flex items-center space-x-3">
          {theme.logoUrl ? (
            <img src={theme.logoUrl} alt="" className="w-9 h-9 rounded-xl object-cover shadow-lg" />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-200">
              {theme.institutionName.charAt(0)}
            </div>
          )}
          <span className="font-bold text-slate-800 text-xl tracking-tight">{theme.institutionName}</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">{t.nav.menu}</div>
          <NavItem view="dashboard" icon={Home} label={t.nav.dashboard} />



          {user.role !== 'PADRE' && can('read', 'aula') && (
            <NavItem view="aulas" icon={Users} label="Aulas y Salas" />
          )}
          <NavItem view="students" icon={GraduationCap} label={t.nav.students} />




          <NavItem view="schedule" icon={Calendar} label={t.nav.schedule} />
          <NavItem view="messages" icon={MessageSquare} label={t.nav.messages} />
          <NavItem view="communications" icon={FileText} label="Cuaderno" />

          {can('read', 'financial') && (
            <>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-6">{t.nav.admin}</div>
              {can('manage', 'institution') && (
                <NavItem view="institutions" icon={Building2} label="Instituciones" />
              )}
              {can('manage', 'user') && (
                <NavItem view="usuarios" icon={Users} label="Usuarios y Roles" />
              )}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">


          <button className="w-full flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings size={20} />
            <span>{t.nav.settings}</span>
          </button>

          {/* Institution switcher */}
          {(user.institutions?.length ?? 0) > 1 && (
            <button
              onClick={clearInstitution}
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors mb-2"
            >
              <Building2 size={18} />
              <span className="text-sm font-medium truncate">{t.institutionPicker?.switchLabel || 'Cambiar institución'}</span>
            </button>
          )}

          <div className="mt-4 flex items-center p-3 bg-slate-50 rounded-xl">
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
            <button onClick={onLogout} title={t.nav.logOut}>
              <LogOut size={16} className="text-slate-400 cursor-pointer hover:text-rose-500" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-65px)] md:h-screen">
        {/* Desktop Top Bar (Notifications) */}
        <div className="hidden md:flex justify-end items-center px-8 py-4 bg-background space-x-4">
          {/* Info / Walkthrough Trigger */}
          <button
            onClick={() => startTour(currentView)}
            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white hover:shadow-sm rounded-full transition-all"
            title="Ver Guía de esta Pantalla"
          >
            <Info size={20} />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              id="tour-notifs"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:bg-white hover:shadow-sm'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <button className="text-xs text-primary-600 font-medium hover:underline">Mark all read</button>
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
                      <p>No tienes nuevas notificaciones.</p>
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
                          {notif.type}
                        </span>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 text-center">
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-800">View History</button>
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