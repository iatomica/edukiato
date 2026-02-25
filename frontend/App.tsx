
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Courses } from './components/Courses';
import { Students } from './components/Students';
import { Schedule } from './components/Schedule';
import { Classroom } from './components/Classroom';
import { Messages } from './components/Messages';
import { Login } from './components/Login';
import { InstitutionPicker } from './components/InstitutionPicker';
import { Usuarios } from './components/Usuarios';
import { Institutions } from './components/Institutions';
import Aulas from './components/Aulas';
import { View } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { TourProvider } from './contexts/TourContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PermissionsProvider } from './contexts/PermissionsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppStateProvider } from './contexts/AppStateContext';

// ── Main application flow ─────────────────────────────────────
// Login → InstitutionPicker (if multi-tenant) → Dashboard

const AppContent: React.FC = () => {
  const { user, isAuthenticated, currentInstitution, isLoading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [commParams, setCommParams] = useState<any>(null);

  const handleViewChange = (view: View, params?: any) => {
    setCurrentView(view);

    // Messages handling
    if (view === 'messages' && params?.targetUserId) {
      setTargetUserId(params.targetUserId);
    } else {
      setTargetUserId(null);
    }

    // Communications handling
    if (view === 'communications' && params?.commParams) {
      setCommParams(params.commParams);
    } else {
      setCommParams(null);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('classroom');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('dashboard');
    setSelectedCourseId(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={(view, params) => {
          if (view === 'classroom') {
            setSelectedCourseId('c_jazz_01');
          }
          handleViewChange(view, params);
        }} user={user!} />;
      case 'courses':
        return <Courses
          onViewChange={(v) => handleViewChange(v)}
          onCourseSelect={handleCourseSelect}
          userRole={user!.role}
        />;
      case 'students':
        return <Students />;
      case 'schedule':
        return <Schedule user={user!} />;
      case 'classroom':
        return <Classroom
          courseId={selectedCourseId || 'c_jazz_01'}
          user={user!}
          onBack={() => setCurrentView('courses')}
        />;
      case 'messages':
        return <Messages initialUserId={targetUserId} />;
      case 'communications':
        return <Students initialViewMode="NOTEBOOK" initialCommParams={commParams} />;
      case 'usuarios':
        return <Usuarios />;
      case 'institutions':
        return <Institutions />;
      case 'aulas':
        return <Aulas onViewChange={(v, p) => handleViewChange(v, p)} />;
      default:
        return <Dashboard onViewChange={(v) => handleViewChange(v)} user={user!} />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  // Step 1: Login
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  // Step 2: Institution selection (multi-tenant)
  if (!currentInstitution) {
    return <InstitutionPicker />;
  }

  // Step 3: Main app
  return (
    <Layout currentView={currentView} onViewChange={setCurrentView} user={user} onLogout={handleLogout}>
      {renderView()}
    </Layout>
  );
};

// ── Provider Stack ────────────────────────────────────────────

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PermissionsProvider>
          <ThemeProvider>
            <AppStateProvider>
              <TourProvider>
                <AppContent />
              </TourProvider>
            </AppStateProvider>
          </ThemeProvider>
        </PermissionsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
