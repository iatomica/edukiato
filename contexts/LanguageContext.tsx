
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View } from '../types';

export type Language = 'es' | 'en';

export interface TourStep {
  target?: string; // DOM ID to highlight. If undefined, shows centered modal.
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const translations = {
  es: {
    nav: {
      dashboard: 'Panel',
      courses: 'Cursos',
      myClasses: 'Mis Clases',
      students: 'Estudiantes',
      schedule: 'Calendario',
      messages: 'Mensajes',
      financials: 'Finanzas',
      reports: 'Reportes',
      admin: 'Administración',
      menu: 'Menú',
      settings: 'Configuración',
      logOut: 'Cerrar Sesión',
    },
    login: {
      welcome: 'Bienvenido de nuevo',
      subtitle: 'Inicia sesión en tu cuenta Edukiato.',
      admin: 'Admin',
      teacher: 'Docente',
      student: 'Estudiante',
      orEmail: 'O inicia con email',
      emailLabel: 'Correo Electrónico',
      passwordLabel: 'Contraseña',
      signIn: 'Ingresar',
      loading: 'Cargando...',
    },
    dashboard: {
      greeting: 'Buenos días',
      adminSub: 'Esto es lo que sucede en el instituto hoy.',
      teacherSub: '¿Listo para inspirar? Aquí está tu horario.',
      studentSub: 'Aprendamos algo nuevo hoy.',
      currentTerm: 'Ciclo Actual',
      termName: 'Primavera 2024',
      stats: {
        activeStudents: 'Estudiantes Activos',
        classesToday: 'Clases Hoy',
        pendingApprovals: 'Aprobaciones Pendientes',
        actionNeeded: 'Acción Requerida',
        enrolledCourses: 'Cursos Inscritos',
        attendanceRate: 'Asistencia',
        assignmentsPending: 'Tareas Pendientes',
        dueSoon: 'Vence Pronto',
      },
      chartTitle: 'Asistencia Semanal',
      chartDropdown: {
        thisWeek: 'Esta Semana',
        lastWeek: 'Semana Pasada',
      },
      upNext: 'Siguiente Clase',
      nextSession: 'Próxima Sesión',
      time: 'Hora',
      room: 'Aula',
      goToClass: 'Ir a Clase',
      quickLinks: 'Accesos Rápidos',
      unreadMessages: 'Mensajes No Leídos',
      viewSchedule: 'Ver Calendario Completo',
      myAssignments: 'Mis Tareas',
      submitted: 'Entregado',
      graded: 'Calificado',
    },
    courses: {
      title: 'Cursos',
      subtitle: 'Gestiona clases, talleres e instructores.',
      create: 'Crear Curso',
      search: 'Buscar cursos...',
      filter: 'Filtrar',
      by: 'por',
      schedule: 'Horario',
      capacity: 'Capacidad',
      goToClassroom: 'Ir al Aula',
      createModal: {
        title: 'Crear Nuevo Curso',
        courseName: 'Nombre del Curso',
        instructor: 'Instructor',
        schedule: 'Horario (ej. Mar/Jue 18:00)',
        capacity: 'Capacidad Máxima',
        description: 'Descripción Breve',
        cancel: 'Cancelar',
        create: 'Crear Curso'
      }
    },
    classroom: {
      back: 'Volver a Cursos',
      stream: 'Novedades',
      sortBy: 'Ordenar por',
      newest: 'Más recientes',
      upcomingDue: 'Próximos Vencimientos',
      instructor: 'Instructor',
      joinLive: 'Unirse a Clase en Vivo',
      createPost: 'Anuncia algo a tu clase...',
      addMaterial: {
        title: 'Agregar Material o Tarea',
        type: 'Tipo de Contenido',
        titleLabel: 'Título',
        descLabel: 'Descripción / Instrucciones',
        urlLabel: 'Enlace (URL)',
        dueDateLabel: 'Fecha de Entrega (Opcional)',
        cancel: 'Cancelar',
        publish: 'Publicar',
        types: {
          announcement: 'Anuncio',
          material: 'Material de Estudio',
          assignment: 'Tarea / Proyecto'
        }
      }
    },
    students: {
      title: 'Estudiantes',
      subtitle: 'Directorio de todos los alumnos registrados.',
      export: 'Exportar CSV',
      searchPlaceholder: 'Buscar por nombre o email...',
      table: {
        student: 'Estudiante',
        program: 'Programa',
        status: 'Estado',
        attendance: 'Asistencia',
        actions: 'Acciones',
      },
      status: {
        active: 'Activo',
        inactive: 'Inactivo',
        on_leave: 'Licencia',
      },
      certModal: {
        title: 'Vista Previa de Certificado',
        certTitle: 'Certificado de Finalización',
        institution: 'Instituto Educativo Edukiato',
        certifyThat: 'Certifica que',
        completedText: 'Ha completado exitosamente los requisitos para el curso',
        director: 'Director',
        instructor: 'Instructor',
        close: 'Cerrar',
        print: 'Imprimir / Descargar',
      }
    },
    schedule: {
      title: 'Calendario',
      subtitle: 'Gestiona tus clases y eventos semanales.',
      today: 'Hoy',
      markAttendance: 'Tomar Asistencia',
      saveAttendance: 'Guardar Asistencia',
      savedMessage: 'Asistencia guardada para',
      students: 'estudiantes',
      present: 'Presente',
      late: 'Tarde',
      absent: 'Ausente',
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      days: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
    },
    messages: {
      title: 'Mensajes',
      searchPlaceholder: 'Buscar conversaciones...',
      courseChannels: 'Canales del Curso',
      directMessages: 'Mensajes Directos',
      members: 'miembros',
      activeNow: 'Activo ahora',
      typeMessage: 'Escribe tu mensaje...',
      selectChat: 'Selecciona una conversación para chatear'
    },
    financials: {
      title: 'Finanzas',
      subtitle: 'Gestiona matrículas y pagos pendientes.',
      recordPayment: 'Registrar Pago',
      collected: 'Recaudado este Mes',
      overdue: 'Pagos Vencidos',
      pending: 'Pendiente (Proyectado)',
      searchPlaceholder: 'Buscar por estudiante o curso...',
      filterStatus: 'Filtrar Estado',
      table: {
        student: 'Estudiante',
        course: 'Curso',
        dueDate: 'Vencimiento',
        amount: 'Monto',
        status: 'Estado',
        method: 'Método'
      },
      modal: {
        title: 'Registrar Pago',
        studentLabel: 'Estudiante',
        selectStudent: 'Selecciona un estudiante...',
        courseLabel: 'Curso',
        selectCourse: 'Selecciona un curso...',
        amountLabel: 'Monto ($)',
        methodLabel: 'Método de Pago',
        confirm: 'Confirmar Pago',
        methods: {
          cash: 'Efectivo',
          transfer: 'Transferencia',
          card: 'Tarjeta'
        }
      }
    },
    reports: {
      title: 'Reportes',
      subtitle: 'Métricas clave e insights de tu institución.',
      totalRevenue: 'Ingresos Totales',
      vsLastTerm: 'vs último ciclo',
      activeStudents: 'Estudiantes Activos',
      activeCourses: 'En 12 cursos activos',
      avgAttendance: 'Asistencia Prom.',
      thisWeek: 'esta semana',
      atRisk: 'En Riesgo',
      below70: 'Estudiantes bajo 70% asistencia',
      revenuePerCourse: 'Ingresos por Curso',
      attendanceOverview: 'Resumen de Asistencia',
      enrollmentStatus: 'Estado de Inscripción',
      table: {
        courseName: 'Nombre del Curso',
        instructor: 'Instructor',
        status: 'Estado',
        capacity: 'Capacidad',
        utilization: 'Utilización',
        active: 'Activo'
      }
    },
    tour: {
      next: 'Siguiente',
      prev: 'Anterior',
      finish: 'Finalizar',
      skip: 'Omitir',
      // Tours specific to each View
      dashboard: [
        {
          title: 'Bienvenido a Edukiato',
          content: 'Este es tu Panel de Control principal. Aquí verás un resumen rápido de lo más importante del día.',
        },
        {
          target: 'tour-dash-stats',
          title: 'Métricas Rápidas',
          content: 'Un vistazo al estado actual: estudiantes activos, clases de hoy y alertas pendientes.',
          position: 'bottom'
        },
        {
          target: 'tour-dash-upnext',
          title: 'Tu Próxima Clase',
          content: 'No pierdas tiempo buscando. Aquí siempre verás dónde debes estar a continuación.',
          position: 'left'
        },
        {
          target: 'tour-notifs',
          title: 'Notificaciones',
          content: 'Mantente al día con anuncios, calificaciones y mensajes aquí arriba.',
          position: 'left'
        }
      ] as TourStep[],
      courses: [
        {
          title: 'Gestión de Cursos',
          content: 'Aquí administras toda la oferta académica de la institución.'
        },
        {
          target: 'tour-courses-create',
          title: 'Nuevo Curso',
          content: 'Usa este botón para abrir un nuevo taller o materia en el ciclo actual.',
          position: 'left'
        },
        {
          target: 'tour-courses-filter',
          title: 'Búsqueda Avanzada',
          content: 'Encuentra rápidamente cursos por nombre, estado o profesor.',
          position: 'bottom'
        }
      ] as TourStep[],
      students: [
        {
          title: 'Directorio de Estudiantes',
          content: 'Administra la información de todos los alumnos inscritos en la institución.'
        },
        {
          target: 'tour-students-search',
          title: 'Buscador y Filtros',
          content: 'Localiza alumnos por nombre o filtra por programa y estado activo.',
          position: 'bottom'
        },
        {
          target: 'tour-students-export',
          title: 'Exportar Datos',
          content: 'Descarga la lista actual en formato CSV para reportes externos.',
          position: 'left'
        },
        {
          target: 'tour-students-list',
          title: 'Gestión Individual',
          content: 'En esta tabla puedes ver asistencia y generar certificados de finalización.',
          position: 'top'
        }
      ] as TourStep[],
      schedule: [
        {
          title: 'Calendario Semanal',
          content: 'Visualiza todas las sesiones de clase, talleres y eventos de la semana.'
        },
        {
          target: 'tour-schedule-nav',
          title: 'Navegación',
          content: 'Cambia entre semanas o meses para planificar con antelación.',
          position: 'bottom'
        },
        {
          target: 'tour-schedule-grid',
          title: 'Eventos Interactivos',
          content: 'Haz clic en cualquier clase coloreada para ver detalles y tomar asistencia.',
          position: 'top'
        }
      ] as TourStep[],
      messages: [
        {
          title: 'Centro de Mensajes',
          content: 'Mantén la comunicación fluida con estudiantes y colegas.'
        },
        {
          target: 'tour-messages-list',
          title: 'Tus Conversaciones',
          content: 'Aquí verás los grupos de curso (automáticos) y mensajes directos privados.',
          position: 'right'
        },
        {
          target: 'tour-messages-chat',
          title: 'Área de Chat',
          content: 'Envía mensajes, archivos o inicia videollamadas desde aquí.',
          position: 'left'
        }
      ] as TourStep[],
      financials: [
        {
          title: 'Gestión Financiera',
          content: 'Controla los ingresos por matrículas y pagos pendientes.'
        },
        {
          target: 'tour-financials-create',
          title: 'Registrar Pago',
          content: 'Ingresa manualmente pagos en efectivo o transferencia de los alumnos.',
          position: 'left'
        },
        {
          target: 'tour-financials-stats',
          title: 'Resumen Financiero',
          content: 'Métricas clave sobre recaudación mensual y deudas.',
          position: 'bottom'
        }
      ] as TourStep[],
      reports: [
        {
          title: 'Reportes y Analíticas',
          content: 'Visualiza la salud general de la institución.'
        },
        {
          target: 'tour-reports-kpi',
          title: 'Indicadores Clave',
          content: 'Datos rápidos sobre ingresos, retención de alumnos y asistencia.',
          position: 'bottom'
        },
        {
          target: 'tour-reports-charts',
          title: 'Gráficos Detallados',
          content: 'Analiza tendencias de asistencia y distribución de ingresos por curso.',
          position: 'top'
        }
      ] as TourStep[],
      classroom: [
        {
          title: 'Aula Virtual',
          content: 'El espacio de aprendizaje para estudiantes y docentes.',
        },
        {
          title: 'Novedades',
          content: 'Aquí verás anuncios, material y tareas en orden cronológico.',
          position: 'left'
        }
      ] as TourStep[],
      // Fallback
      default: [
        {
          title: 'Navegación',
          content: 'Usa el menú lateral para moverte entre las diferentes secciones de Edukiato.'
        },
        {
          target: 'tour-lang-switch',
          title: 'Idioma',
          content: 'Puedes cambiar el idioma de la plataforma aquí en cualquier momento.',
          position: 'right'
        }
      ] as TourStep[]
    },
    institutionPicker: {
      title: 'Selecciona tu institución',
      subtitle: 'Elige en cuál institución deseas trabajar hoy.',
      switchLabel: 'Cambiar institución',
    }
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      courses: 'Courses',
      myClasses: 'My Classes',
      students: 'Students',
      schedule: 'Schedule',
      messages: 'Messages',
      financials: 'Financials',
      reports: 'Reports',
      admin: 'Admin',
      menu: 'Menu',
      settings: 'Settings',
      logOut: 'Log Out',
    },
    login: {
      welcome: 'Welcome back',
      subtitle: 'Sign in to your Edukiato account.',
      admin: 'Admin',
      teacher: 'Teacher',
      student: 'Student',
      orEmail: 'Or sign in with email',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      signIn: 'Sign In',
      loading: 'Loading...',
    },
    dashboard: {
      greeting: 'Good morning',
      adminSub: "Here's what's happening at the institute today.",
      teacherSub: "Ready to inspire? Here's your teaching schedule.",
      studentSub: "Let's learn something new today.",
      currentTerm: 'Current Term',
      termName: 'Spring 2024',
      stats: {
        activeStudents: 'Active Students',
        classesToday: 'Classes Today',
        pendingApprovals: 'Pending Approvals',
        actionNeeded: 'Action Needed',
        enrolledCourses: 'Enrolled Courses',
        attendanceRate: 'Attendance Rate',
        assignmentsPending: 'Assignment Pending',
        dueSoon: 'Due Soon',
      },
      chartTitle: 'Weekly Attendance',
      chartDropdown: {
        thisWeek: 'This Week',
        lastWeek: 'Last Week',
      },
      upNext: 'Up Next',
      nextSession: 'Next Session',
      time: 'Time',
      room: 'Room',
      goToClass: 'Go to Class',
      quickLinks: 'Quick Links',
      unreadMessages: 'Unread Messages',
      viewSchedule: 'View Full Schedule',
      myAssignments: 'My Assignments',
      submitted: 'Submitted',
      graded: 'Graded',
    },
    courses: {
      title: 'Courses',
      subtitle: 'Manage classes, workshops, and instructors.',
      create: 'Create Course',
      search: 'Search courses...',
      filter: 'Filter',
      by: 'by',
      schedule: 'Schedule',
      capacity: 'Capacity',
      goToClassroom: 'Go to Classroom',
      createModal: {
        title: 'Create New Course',
        courseName: 'Course Name',
        instructor: 'Instructor',
        schedule: 'Schedule (e.g. Mon/Wed 18:00)',
        capacity: 'Max Capacity',
        description: 'Short Description',
        cancel: 'Cancel',
        create: 'Create Course'
      }
    },
    classroom: {
      back: 'Back to Courses',
      stream: 'Stream',
      sortBy: 'Sort by',
      newest: 'Newest',
      upcomingDue: 'Upcoming Due Dates',
      instructor: 'Instructor',
      joinLive: 'Join Live Class',
      createPost: 'Announce something to your class...',
      addMaterial: {
        title: 'Add Material or Assignment',
        type: 'Content Type',
        titleLabel: 'Title',
        descLabel: 'Description / Instructions',
        urlLabel: 'Link (URL)',
        dueDateLabel: 'Due Date (Optional)',
        cancel: 'Cancel',
        publish: 'Publish',
        types: {
          announcement: 'Announcement',
          material: 'Study Material',
          assignment: 'Assignment / Project'
        }
      }
    },
    students: {
      title: 'Students',
      subtitle: 'Directory of all registered students.',
      export: 'Export CSV',
      searchPlaceholder: 'Search by name or email...',
      table: {
        student: 'Student',
        program: 'Program',
        status: 'Status',
        attendance: 'Attendance',
        actions: 'Actions',
      },
      status: {
        active: 'Active',
        inactive: 'Inactive',
        on_leave: 'On Leave',
      },
      certModal: {
        title: 'Certificate Preview',
        certTitle: 'Certificate of Completion',
        institution: 'Edukiato Educational Institute',
        certifyThat: 'This is to certify that',
        completedText: 'Has successfully completed the requirements for the course',
        director: 'Director',
        instructor: 'Instructor',
        close: 'Close',
        print: 'Print / Download',
      }
    },
    schedule: {
      title: 'Schedule',
      subtitle: 'Manage your weekly classes and events.',
      today: 'Today',
      markAttendance: 'Mark Attendance',
      saveAttendance: 'Save Attendance',
      savedMessage: 'Attendance saved for',
      students: 'students',
      present: 'Present',
      late: 'Late',
      absent: 'Absent',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    },
    messages: {
      title: 'Messages',
      searchPlaceholder: 'Search conversations...',
      courseChannels: 'Course Channels',
      directMessages: 'Direct Messages',
      members: 'members',
      activeNow: 'Active now',
      typeMessage: 'Type your message...',
      selectChat: 'Select a conversation to start chatting'
    },
    financials: {
      title: 'Financials',
      subtitle: 'Manage tuition fees and track payments.',
      recordPayment: 'Record Payment',
      collected: 'Collected This Month',
      overdue: 'Overdue Payments',
      pending: 'Pending (Projected)',
      searchPlaceholder: 'Search by student or course...',
      filterStatus: 'Filter Status',
      table: {
        student: 'Student',
        course: 'Course',
        dueDate: 'Due Date',
        amount: 'Amount',
        status: 'Status',
        method: 'Method'
      },
      modal: {
        title: 'Record Payment',
        studentLabel: 'Student',
        selectStudent: 'Select a student...',
        courseLabel: 'Course',
        selectCourse: 'Select a course...',
        amountLabel: 'Amount ($)',
        methodLabel: 'Payment Method',
        confirm: 'Confirm Payment',
        methods: {
          cash: 'Cash',
          transfer: 'Transfer',
          card: 'Card'
        }
      }
    },
    reports: {
      title: 'Reports',
      subtitle: 'Key metrics and insights for your institution.',
      totalRevenue: 'Total Revenue',
      vsLastTerm: 'vs last term',
      activeStudents: 'Active Students',
      activeCourses: 'Across 12 active courses',
      avgAttendance: 'Avg Attendance',
      thisWeek: 'this week',
      atRisk: 'At Risk',
      below70: 'Students below 70% attendance',
      revenuePerCourse: 'Revenue per Course',
      attendanceOverview: 'Attendance Overview',
      enrollmentStatus: 'Course Enrollment Status',
      table: {
        courseName: 'Course Name',
        instructor: 'Instructor',
        status: 'Status',
        capacity: 'Capacity',
        utilization: 'Utilization',
        active: 'Active'
      }
    },
    tour: {
      next: 'Next',
      prev: 'Previous',
      finish: 'Finish',
      skip: 'Skip',
      dashboard: [
        {
          title: 'Welcome to Edukiato',
          content: 'This is your main Dashboard. Here you will see a quick summary of what is most important for the day.',
        },
        {
          target: 'tour-dash-stats',
          title: 'Quick Metrics',
          content: 'A glance at current status: active students, classes today, and pending alerts.',
          position: 'bottom'
        },
        {
          target: 'tour-dash-upnext',
          title: 'Your Next Class',
          content: 'Don\'t waste time searching. Always see where you need to be next right here.',
          position: 'left'
        },
        {
          target: 'tour-notifs',
          title: 'Notifications',
          content: 'Stay updated with announcements, grades, and messages up here.',
          position: 'left'
        }
      ] as TourStep[],
      courses: [
        {
          title: 'Course Management',
          content: 'Here you manage all academic offerings of the institution.'
        },
        {
          target: 'tour-courses-create',
          title: 'New Course',
          content: 'Use this button to open a new workshop or subject in the current cycle.',
          position: 'left'
        },
        {
          target: 'tour-courses-filter',
          title: 'Advanced Search',
          content: 'Quickly find courses by name, status, or teacher.',
          position: 'bottom'
        }
      ] as TourStep[],
      students: [
        {
          title: 'Student Directory',
          content: 'Manage information for all enrolled students in the institution.'
        },
        {
          target: 'tour-students-search',
          title: 'Search and Filters',
          content: 'Locate students by name or filter by program and active status.',
          position: 'bottom'
        },
        {
          target: 'tour-students-export',
          title: 'Export Data',
          content: 'Download current list in CSV format for external reports.',
          position: 'left'
        },
        {
          target: 'tour-students-list',
          title: 'Individual Management',
          content: 'In this table you can view attendance and generate completion certificates.',
          position: 'top'
        }
      ] as TourStep[],
      schedule: [
        {
          title: 'Weekly Calendar',
          content: 'Visualize all class sessions, workshops, and events for the week.'
        },
        {
          target: 'tour-schedule-nav',
          title: 'Navigation',
          content: 'Switch between weeks or months to plan ahead.',
          position: 'bottom'
        },
        {
          target: 'tour-schedule-grid',
          title: 'Interactive Events',
          content: 'Click on any colored class to see details and take attendance.',
          position: 'top'
        }
      ] as TourStep[],
      messages: [
        {
          title: 'Message Center',
          content: 'Keep communication flowing with students and colleagues.'
        },
        {
          target: 'tour-messages-list',
          title: 'Your Conversations',
          content: 'Here you will see course groups (automatic) and private direct messages.',
          position: 'right'
        },
        {
          target: 'tour-messages-chat',
          title: 'Chat Area',
          content: 'Send messages, files, or start video calls from here.',
          position: 'left'
        }
      ] as TourStep[],
      financials: [
        {
          title: 'Financial Management',
          content: 'Control tuition income and pending payments.'
        },
        {
          target: 'tour-financials-create',
          title: 'Record Payment',
          content: 'Manually enter cash or transfer payments from students.',
          position: 'left'
        },
        {
          target: 'tour-financials-stats',
          title: 'Financial Summary',
          content: 'Key metrics on monthly collection and debts.',
          position: 'bottom'
        }
      ] as TourStep[],
      reports: [
        {
          title: 'Reports and Analytics',
          content: 'Visualize the general health of the institution.'
        },
        {
          target: 'tour-reports-kpi',
          title: 'Key Indicators',
          content: 'Quick data on revenue, student retention, and attendance.',
          position: 'bottom'
        },
        {
          target: 'tour-reports-charts',
          title: 'Detailed Charts',
          content: 'Analyze attendance trends and revenue distribution by course.',
          position: 'top'
        }
      ] as TourStep[],
      classroom: [
        {
          title: 'Virtual Classroom',
          content: 'The learning space for students and teachers.',
        },
        {
          title: 'Stream',
          content: 'Here you will see announcements, material, and assignments in chronological order.',
          position: 'left'
        }
      ] as TourStep[],
      default: [
        {
          title: 'Navigation',
          content: 'Use the sidebar menu to move between different sections of Edukiato.'
        },
        {
          target: 'tour-lang-switch',
          title: 'Language',
          content: 'You can switch the platform language here at any time.',
          position: 'right'
        }
      ] as TourStep[]
    },
    institutionPicker: {
      title: 'Select your institution',
      subtitle: 'Choose which institution you want to work in today.',
      switchLabel: 'Switch institution',
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['es'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
