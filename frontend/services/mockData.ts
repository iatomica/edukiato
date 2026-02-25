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

import { Course, Student, CalendarEvent, FeedItem, Conversation, Message, Notification, Communication, UserRole, Aula, Nino } from '../types';

// ── Institution IDs ──────────────────────────────────────────

export const INST_VINCULOS = 'inst-vinculos';

export const MOCK_COURSES: Course[] = [];

export const MOCK_AULAS: Aula[] = [
  { id: 'aula_45d', institutionId: INST_VINCULOS, name: 'Sala (45 días a 2 años)', capacity: 15, teachers: ['u_teach_0'], assistants: [], color: 'bg-rose-100 text-rose-700 border-rose-200' }, // Fiorela
  { id: 'aula_anidar', institutionId: INST_VINCULOS, name: 'Sala Anidar (2 años)', capacity: 20, teachers: ['u_teach_1'], assistants: [], color: 'bg-amber-100 text-amber-700 border-amber-200' }, // Antonela
  { id: 'aula_libertad', institutionId: INST_VINCULOS, name: 'Sala Libertad (3 años)', capacity: 20, teachers: ['u_teach_2'], assistants: [], color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }, // Romina Engel
  { id: 'aula_cielo', institutionId: INST_VINCULOS, name: 'Sala Cielo (4 años)', capacity: 25, teachers: ['u_teach_3'], assistants: [], color: 'bg-blue-100 text-blue-700 border-blue-200' }, // Romina Alvarenga
  { id: 'aula_vuelo', institutionId: INST_VINCULOS, name: 'Sala Vuelo (5 años)', capacity: 25, teachers: ['u_teach_4'], assistants: [], color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }, // Stefania
];

export const MOCK_NINOS: Nino[] = [
  { id: 'n1', institutionId: INST_VINCULOS, name: 'Martín Pérez', aulaId: 'aula_vuelo', parentIds: ['p_perez'], avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', birthDate: '2021-04-15', medicalInfo: 'Alérgico al maní y picaduras de abeja.', allergies: ['Maní', 'Picaduras de Abeja'], attendanceRate: 98 },
  { id: 'n2', institutionId: INST_VINCULOS, name: 'Lucía Gómez', aulaId: 'aula_cielo', parentIds: ['p_gomez'], avatar: 'https://randomuser.me/api/portraits/lego/2.jpg', birthDate: '2022-08-02', medicalInfo: 'Ninguna alergia conocida.', allergies: [], attendanceRate: 92 },
  { id: 'n3', institutionId: INST_VINCULOS, name: 'Tomás Díaz', aulaId: 'aula_libertad', parentIds: ['p_diaz'], avatar: 'https://randomuser.me/api/portraits/lego/3.jpg', birthDate: '2023-01-20', medicalInfo: 'Asma leve, usar inhalador si es necesario.', allergies: ['Asma'], attendanceRate: 85 },
  { id: 'n4', institutionId: INST_VINCULOS, name: 'Emma Pérez', aulaId: 'aula_anidar', parentIds: ['p_perez'], avatar: 'https://randomuser.me/api/portraits/lego/4.jpg', birthDate: '2024-05-10', medicalInfo: 'Intolerancia a la lactosa.', allergies: ['Lactosa'], attendanceRate: 95 },
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

