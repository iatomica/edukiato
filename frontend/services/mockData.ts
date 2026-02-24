/**
 * Mock Data — Institution-Scoped
 *
 * All entities carry an `institutionId` so the useTenantData hook
 * can filter down to only the active institution's data.
 *
 * Two institutions:
 *   inst-001 → Instituto de Arte Contemporáneo  (music focus)
 *   inst-002 → Escuela de Música Moderna        (modern music focus)
 */

import { Course, Student, CalendarEvent, FeedItem, Conversation, Message, Notification, Payment, Communication, UserRole, Aula, Nino } from '../types';

// ── Institution IDs ──────────────────────────────────────────

export const INST_VINCULOS = 'inst-vinculos';

export const MOCK_COURSES: Course[] = [
  { id: 'c_sala_45d', institutionId: INST_VINCULOS, courseType: 'REGULAR', title: 'Sala (45 días a 2 años)', instructor: 'Fiorela Sotelo', schedule: 'Lun a Vie 08:00', enrolled: 12, capacity: 15, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', tags: ['Maternal'], nextSession: 'Lunes, 08:00', description: 'Atención integral y estimulación temprana.' },
  { id: 'c_anidar', institutionId: INST_VINCULOS, courseType: 'REGULAR', title: 'Sala Anidar (2 años)', instructor: 'Antonela Michelena', schedule: 'Lun a Vie 08:00', enrolled: 14, capacity: 20, image: 'https://images.unsplash.com/photo-1531804226530-70f8004aa44e?auto=format&fit=crop&q=80&w=800', tags: ['Desarrollo', 'Juego'], nextSession: 'Lunes, 08:00', description: 'Desarrollo de autonomía y sociabilización.' },
  { id: 'c_libertad', institutionId: INST_VINCULOS, courseType: 'REGULAR', title: 'Sala Libertad (3 años)', instructor: 'Romina Engel', schedule: 'Lun a Vie 08:00', enrolled: 18, capacity: 20, image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800', tags: ['Creatividad'], nextSession: 'Lunes, 08:00', description: 'Expresión artística y juegos grupales.' },
  { id: 'c_cielo', institutionId: INST_VINCULOS, courseType: 'REGULAR', title: 'Sala Cielo (4 años)', instructor: 'Romina Alvarenga', schedule: 'Lun a Vie 08:00', enrolled: 20, capacity: 25, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', tags: ['Preescolar'], nextSession: 'Lunes, 08:00', description: 'Iniciación a las letras y números mediante el juego.' },
  { id: 'c_vuelo', institutionId: INST_VINCULOS, courseType: 'REGULAR', title: 'Sala Vuelo (5 años)', instructor: 'Stefania Bah', schedule: 'Lun a Vie 08:00', enrolled: 22, capacity: 25, image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=800', tags: ['Jardín'], nextSession: 'Lunes, 08:00', description: 'Preparación integral para la escuela primaria.' },
  { id: 'c_pickler', institutionId: INST_VINCULOS, courseType: 'SEMINAR', title: 'Cursos (Seila y Romina Pickler metodologia)', instructor: 'Seila Ayala y Romina Ayala', schedule: 'A tu propio ritmo', enrolled: 50, capacity: 100, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800', tags: ['Metodología', 'Capacitación'], nextSession: 'Virtual', description: 'Contenido: PDFs, videos y enlaces a YouTube. No más que eso. Formación intensiva en metodología.' },
];

export const MOCK_AULAS: Aula[] = [
  { id: 'aula_45d', institutionId: INST_VINCULOS, name: 'Sala (45 días a 2 años)', capacity: 15, teachers: ['u_teach_0'], assistants: [], color: 'bg-rose-100 text-rose-700 border-rose-200' }, // Fiorela
  { id: 'aula_anidar', institutionId: INST_VINCULOS, name: 'Sala Anidar (2 años)', capacity: 20, teachers: ['u_teach_1'], assistants: [], color: 'bg-amber-100 text-amber-700 border-amber-200' }, // Antonela
  { id: 'aula_libertad', institutionId: INST_VINCULOS, name: 'Sala Libertad (3 años)', capacity: 20, teachers: ['u_teach_2'], assistants: [], color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }, // Romina Engel
  { id: 'aula_cielo', institutionId: INST_VINCULOS, name: 'Sala Cielo (4 años)', capacity: 25, teachers: ['u_teach_3'], assistants: [], color: 'bg-blue-100 text-blue-700 border-blue-200' }, // Romina Alvarenga
  { id: 'aula_vuelo', institutionId: INST_VINCULOS, name: 'Sala Vuelo (5 años)', capacity: 25, teachers: ['u_teach_4'], assistants: [], color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }, // Stefania
];

export const MOCK_NINOS: Nino[] = [
  { id: 'n1', institutionId: INST_VINCULOS, name: 'Martín Pérez', aulaId: 'aula_vuelo', parentId: 'p_perez', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', birthDate: '2021-04-15', medicalInfo: 'Alérgico al maní y picaduras de abeja.', attendanceRate: 98 },
  { id: 'n2', institutionId: INST_VINCULOS, name: 'Lucía Gómez', aulaId: 'aula_cielo', parentId: 'p_gomez', avatar: 'https://randomuser.me/api/portraits/lego/2.jpg', birthDate: '2022-08-02', medicalInfo: 'Ninguna alergia conocida.', attendanceRate: 92 },
  { id: 'n3', institutionId: INST_VINCULOS, name: 'Tomás Díaz', aulaId: 'aula_libertad', parentId: 'p_diaz', avatar: 'https://randomuser.me/api/portraits/lego/3.jpg', birthDate: '2023-01-20', medicalInfo: 'Asma leve, usar inhalador si es necesario.', attendanceRate: 85 },
  { id: 'n4', institutionId: INST_VINCULOS, name: 'Emma Pérez', aulaId: 'aula_anidar', parentId: 'p_perez', avatar: 'https://randomuser.me/api/portraits/lego/4.jpg', birthDate: '2024-05-10', medicalInfo: 'Intolerancia a la lactosa.', attendanceRate: 95 },
];

export const MOCK_STUDENTS: Student[] = [
  // Keeping for backwards compatibility if needed elsewhere
  { id: 's1', institutionId: INST_VINCULOS, name: 'Martín Pérez', email: 'martin@familia.com', program: 'Sala Vuelo', status: 'active', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', attendanceRate: 98 },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 'e_vinculos',
    institutionId: INST_VINCULOS,
    title: 'Acto Patrio',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    type: 'event',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    creatorId: 'u_dir',
    description: 'Acto general con participación de todas las salas.',
    sharedWith: { scope: 'ALL' }
  }
];

export const MOCK_FEED: FeedItem[] = [
  {
    id: 'f1', institutionId: INST_VINCULOS, courseId: 'c_pickler', type: 'MATERIAL', scope: 'COURSE',
    title: 'PDF: Metodología Pickler Básica',
    description: 'Material de lectura obligatoria.',
    postedAt: new Date(), author: 'Seila Ayala',
    materialType: 'PDF', url: '#'
  },
  {
    id: 'f2', institutionId: INST_VINCULOS, courseId: 'c_pickler', type: 'MATERIAL', scope: 'COURSE',
    title: 'Video Introductorio',
    description: 'Enlace a YouTube con la charla inicial.',
    postedAt: new Date(Date.now() - 3600000), author: 'Romina Ayala',
    materialType: 'LINK', url: 'https://youtube.com'
  }
];

const storedNotifications = typeof window !== 'undefined' ? localStorage.getItem('MOCK_NOTIFICATIONS') : null;
export const MOCK_NOTIFICATIONS: Notification[] = storedNotifications ? JSON.parse(storedNotifications) : [];
export const MOCK_CONVERSATIONS: Conversation[] = [];
const storedMessages = typeof window !== 'undefined' ? localStorage.getItem('MOCK_MESSAGES') : null;
export const MOCK_MESSAGES: Record<string, Message[]> = storedMessages ? JSON.parse(storedMessages) : {};
export const MOCK_PAYMENTS: Payment[] = [];

export const MOCK_REVENUE_DATA: Record<string, Array<{ name: string; value: number }>> = {
  [INST_VINCULOS]: [
    { name: 'Sala Anidar', value: 50 },
    { name: 'Sala Libertad', value: 60 },
  ],
};

export const MOCK_ATTENDANCE_DATA: Record<string, Array<{ name: string; value: number; fill: string }>> = {
  [INST_VINCULOS]: [
    { name: 'Presente', value: 95, fill: '#10b981' },
    { name: 'Ausente', value: 5, fill: '#f43f5e' },
  ]
};

const storedCommunications = typeof window !== 'undefined' ? localStorage.getItem('MOCK_COMMUNICATIONS') : null;
export const MOCK_COMMUNICATIONS: Communication[] = storedCommunications ? JSON.parse(storedCommunications) : [
  {
    id: 'comm_vinculos_1',
    institutionId: INST_VINCULOS,
    type: 'ANUNCIO_GENERAL',
    title: 'Bienvenida al nuevo ciclo',
    content: 'Les damos una cálida bienvenida a todas las familias.',
    senderId: 'u_dir',
    senderName: 'Directora',
    createdAt: new Date().toISOString(),
    isRead: true,
  }
];

