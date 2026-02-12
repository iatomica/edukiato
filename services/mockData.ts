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

import { Course, Student, CalendarEvent, FeedItem, Conversation, Message, Notification, Payment } from '../types';

// ── Institution IDs ──────────────────────────────────────────

export const INST_ARTE = 'inst-001';
export const INST_MUSICA = 'inst-002';

// ── COURSES ──────────────────────────────────────────────────

export const MOCK_COURSES: Course[] = [
  // ── Instituto de Arte Contemporáneo ──
  {
    id: 'c_jazz_01',
    institutionId: INST_ARTE,
    courseType: 'REGULAR',
    title: 'Improvisación de Jazz II',
    instructor: 'Marcus Cole',
    schedule: 'Mar/Jue 18:00',
    enrolled: 8,
    capacity: 12,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
    tags: ['Música', 'Avanzado', 'Ensamble'],
    nextSession: 'Martes, 18:00',
    description: 'Un curso intensivo enfocado en la armonía moderna, escalas modales y la interacción grupal en tiempo real.'
  },
  {
    id: 'c_ceramica_01',
    institutionId: INST_ARTE,
    courseType: 'WORKSHOP',
    title: 'Cerámica Artística I',
    instructor: 'Ana Beltrán',
    schedule: 'Lun/Mié 10:00',
    enrolled: 6,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
    tags: ['Arte', 'Principiante', 'Taller'],
    nextSession: 'Lunes, 10:00',
    description: 'Técnicas de modelado a mano, torno básico y esmaltado.'
  },
  {
    id: 'c_pintura_01',
    institutionId: INST_ARTE,
    courseType: 'REGULAR',
    title: 'Pintura al Óleo Avanzada',
    instructor: 'Carlos Mendoza',
    schedule: 'Vie 14:00',
    enrolled: 5,
    capacity: 8,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    tags: ['Arte', 'Avanzado'],
    nextSession: 'Viernes, 14:00',
    description: 'Composición avanzada y técnicas expresivas con óleo sobre lienzo.'
  },
  // ── Escuela de Música Moderna ──
  {
    id: 'c_guitarra_01',
    institutionId: INST_MUSICA,
    courseType: 'REGULAR',
    title: 'Guitarra Eléctrica Nivel I',
    instructor: 'Elena Fisher',
    schedule: 'Mar/Jue 16:00',
    enrolled: 10,
    capacity: 15,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800',
    tags: ['Música', 'Principiante', 'Rock'],
    nextSession: 'Martes, 16:00',
    description: 'Fundamentos de guitarra eléctrica, acordes, pentatónicas y técnicas de púa.'
  },
  {
    id: 'c_produccion_01',
    institutionId: INST_MUSICA,
    courseType: 'WORKSHOP',
    title: 'Producción Musical Digital',
    instructor: 'DJ Wave',
    schedule: 'Sáb 10:00',
    enrolled: 12,
    capacity: 20,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
    tags: ['Producción', 'Intermedio', 'Digital'],
    nextSession: 'Sábado, 10:00',
    description: 'DAWs, mezcla, síntesis sonora y beatmaking con Ableton Live.'
  },
  {
    id: 'c_seminario_sonido',
    institutionId: INST_MUSICA,
    courseType: 'SEMINAR',
    title: 'Seminario: El Futuro del Sonido Inmersivo',
    instructor: 'Dr. Laura Vega',
    schedule: 'Sáb 22 Mar, 17:00',
    enrolled: 35,
    capacity: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    tags: ['Seminario', 'Audio', 'Evento'],
    nextSession: 'Sáb 22 Mar, 17:00',
    description: 'Evento puntual sobre audio espacial, Dolby Atmos y el futuro de la producción inmersiva. Certificado automático incluido.'
  },
];

// ── STUDENTS ─────────────────────────────────────────────────

export const MOCK_STUDENTS: Student[] = [
  // ── Instituto de Arte Contemporáneo ──
  { id: 's1', institutionId: INST_ARTE, name: 'Sofia Chen', email: 'sofia@student.com', program: 'Música', status: 'active', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', attendanceRate: 95 },
  { id: 's2', institutionId: INST_ARTE, name: 'Liam O\'Connor', email: 'liam@student.com', program: 'Música', status: 'active', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', attendanceRate: 88 },
  { id: 's3', institutionId: INST_ARTE, name: 'Maya Patel', email: 'maya@student.com', program: 'Arte', status: 'active', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', attendanceRate: 92 },
  { id: 's4', institutionId: INST_ARTE, name: 'Lucas Silva', email: 'lucas@student.com', program: 'Arte', status: 'on_leave', avatar: 'https://randomuser.me/api/portraits/men/86.jpg', attendanceRate: 70 },
  // ── Escuela de Música Moderna ──
  { id: 's5', institutionId: INST_MUSICA, name: 'Valentina Ruiz', email: 'val@student.com', program: 'Guitarra', status: 'active', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', attendanceRate: 97 },
  { id: 's6', institutionId: INST_MUSICA, name: 'Diego Torres', email: 'diego@student.com', program: 'Producción', status: 'active', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', attendanceRate: 85 },
  { id: 's7', institutionId: INST_MUSICA, name: 'Camila Herrera', email: 'camila@student.com', program: 'Guitarra', status: 'active', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', attendanceRate: 91 },
];

// ── EVENTS ───────────────────────────────────────────────────

export const MOCK_EVENTS: CalendarEvent[] = [
  // ── Instituto de Arte Contemporáneo ──
  { id: 'e1', institutionId: INST_ARTE, title: 'Clase: Jazz Improv II', start: new Date(), end: new Date(), type: 'class', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'e2', institutionId: INST_ARTE, title: 'Taller: Cerámica al torno', start: new Date(Date.now() + 86400000), end: new Date(Date.now() + 86400000), type: 'workshop', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'e3', institutionId: INST_ARTE, title: 'Exposición de Pintura', start: new Date(Date.now() + 86400000 * 3), end: new Date(Date.now() + 86400000 * 3), type: 'event', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  // ── Escuela de Música Moderna ──
  { id: 'e4', institutionId: INST_MUSICA, title: 'Clase: Guitarra Eléctrica I', start: new Date(), end: new Date(), type: 'class', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'e5', institutionId: INST_MUSICA, title: 'Workshop: Producción en Ableton', start: new Date(Date.now() + 86400000 * 2), end: new Date(Date.now() + 86400000 * 2), type: 'workshop', color: 'bg-orange-100 text-orange-700 border-orange-200' },
];

// ── FEED (Classroom) ─────────────────────────────────────────

export const MOCK_FEED: FeedItem[] = [
  // ── Instituto de Arte Contemporáneo (Jazz course) ──
  {
    id: 'f1', institutionId: INST_ARTE, courseId: 'c_jazz_01', type: 'ANNOUNCEMENT', scope: 'COURSE',
    title: 'Bienvenidos al Ciclo 2024',
    description: 'Hola a todos. Este semestre nos enfocaremos en la época Post-Bop. Por favor traigan sus instrumentos a la primera clase.',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), author: 'Marcus Cole'
  },
  {
    id: 'f2', institutionId: INST_ARTE, courseId: 'c_jazz_01', type: 'MATERIAL', scope: 'COURSE',
    title: 'Partitura: Giant Steps (Coltrane)',
    description: 'Análisis armónico para la clase del jueves.',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), author: 'Marcus Cole',
    materialType: 'PDF', url: '#'
  },
  {
    id: 'f3', institutionId: INST_ARTE, courseId: 'c_jazz_01', type: 'MATERIAL', scope: 'COURSE',
    title: 'Video Referencia: Miles Davis 1964',
    description: 'Observen la interacción entre Herbie Hancock y Ron Carter.',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), author: 'Marcus Cole',
    materialType: 'VIDEO', url: '#'
  },
  {
    id: 'f4', institutionId: INST_ARTE, courseId: 'c_jazz_01', type: 'ASSIGNMENT', scope: 'COURSE',
    title: 'Transcripción de Solo',
    description: 'Transcribir 32 compases de un solo de su elección.',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), author: 'Marcus Cole',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), status: 'PENDING'
  },
  // ── Institutional Announcements ──
  {
    id: 'f_inst_1', institutionId: INST_ARTE, type: 'ANNOUNCEMENT', scope: 'INSTITUTION',
    title: 'Suspensión de actividades por feriado',
    description: 'La institución permanecerá cerrada el próximo lunes por feriado nacional.',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), author: 'Administración'
  },
  // ── Escuela de Música Moderna ──
  {
    id: 'f5', institutionId: INST_MUSICA, courseId: 'c_guitarra_01', type: 'ANNOUNCEMENT', scope: 'COURSE',
    title: 'Material de Clase',
    description: 'Descarguen el cancionero de acordes básicos desde la sección de materiales.',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), author: 'Elena Fisher'
  },
  {
    id: 'f6', institutionId: INST_MUSICA, courseId: 'c_guitarra_01', type: 'ASSIGNMENT', scope: 'COURSE',
    title: 'Práctica: Escala Pentatónica',
    description: 'Grabar un video de 1 minuto tocando la pentatónica menor en la tonalidad de Am.',
    postedAt: new Date(Date.now() - 1000 * 60 * 60), author: 'Elena Fisher',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), status: 'PENDING'
  },
  {
    id: 'f_inst_2', institutionId: INST_MUSICA, type: 'ANNOUNCEMENT', scope: 'INSTITUTION',
    title: '¡Bienvenidos al nuevo campus!',
    description: 'Estamos emocionados de inaugurar nuestras nuevas salas de ensayo en el ala norte.',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 72), author: 'Dirección'
  },
];

// ── NOTIFICATIONS ────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  // ── Instituto de Arte Contemporáneo ──
  { id: 'n1', institutionId: INST_ARTE, type: 'ANNOUNCEMENT', title: 'Cambio de Aula', message: 'La clase de hoy será en el Auditorio B.', time: '30m', isRead: false },
  { id: 'n2', institutionId: INST_ARTE, type: 'MESSAGE', title: 'Nuevo Mensaje', message: 'Sofia: ¿A qué hora es el ensayo?', time: '1h', isRead: true },
  { id: 'n3', institutionId: INST_ARTE, type: 'GRADE', title: 'Calificación', message: 'Tu transcripción fue evaluada: 9/10.', time: '2h', isRead: false },
  // ── Escuela de Música Moderna ──
  { id: 'n4', institutionId: INST_MUSICA, type: 'ANNOUNCEMENT', title: 'Nuevo Workshop', message: 'Workshop gratuito de pedales de efecto este sábado.', time: '15m', isRead: false },
  { id: 'n5', institutionId: INST_MUSICA, type: 'SYSTEM', title: 'Bienvenido', message: 'Tu matrícula ha sido confirmada para el próximo ciclo.', time: '3h', isRead: true },
];

// ── CONVERSATIONS ────────────────────────────────────────────

export const MOCK_CONVERSATIONS: Conversation[] = [
  // ── Instituto de Arte Contemporáneo ──
  {
    id: 'c1', institutionId: INST_ARTE,
    name: 'Grupo: Jazz II', type: 'COURSE_GROUP',
    avatar: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=200',
    unreadCount: 3, lastMessage: 'Marcus: No olviden la transcripción.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 10),
    participants: ['Marcus Cole', 'Sofia Chen', 'Liam', 'Maya', 'Tú']
  },
  {
    id: 'c2', institutionId: INST_ARTE,
    name: 'Marcus Cole', type: 'DIRECT',
    avatar: 'https://picsum.photos/seed/marcus/200',
    unreadCount: 0, lastMessage: 'Podemos revisar tu armonía antes de clase.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    participants: ['Marcus Cole', 'Tú']
  },
  {
    id: 'c3', institutionId: INST_ARTE,
    name: 'Sofia Chen', type: 'DIRECT',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    unreadCount: 0, lastMessage: '¿Tienes las copias de Real Book?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    participants: ['Sofia Chen', 'Tú']
  },
  // ── Escuela de Música Moderna ──
  {
    id: 'c4', institutionId: INST_MUSICA,
    name: 'Grupo: Guitarra I', type: 'COURSE_GROUP',
    avatar: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=200',
    unreadCount: 1, lastMessage: 'Elena: Recuerden practicar las escalas.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    participants: ['Elena Fisher', 'Valentina', 'Diego', 'Camila', 'Tú']
  },
  {
    id: 'c5', institutionId: INST_MUSICA,
    name: 'DJ Wave', type: 'DIRECT',
    avatar: 'https://picsum.photos/seed/djwave/200',
    unreadCount: 0, lastMessage: 'El preset de Serum está listo.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    participants: ['DJ Wave', 'Tú']
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', senderId: 't1', content: 'Bienvenidos al grupo oficial del curso.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), isRead: true },
    { id: 'm2', senderId: 's1', content: '¡Gracias profe! ¿El examen final es presencial?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: true },
    { id: 'm3', senderId: 't1', content: 'Sí, será un concierto en vivo.', timestamp: new Date(Date.now() - 1000 * 60 * 10), isRead: false },
  ],
  'c2': [
    { id: 'm4', senderId: 'me', content: 'Hola Marcus, tengo una duda con la escala Lidia Dominante.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), isRead: true },
    { id: 'm5', senderId: 't1', content: 'Podemos revisar tu armonía antes de clase. Llega 15 min antes.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: true },
  ],
  'c4': [
    { id: 'm6', senderId: 'elena', content: 'Bienvenidos a Guitarra I. Recuerden comprar cuerdas nuevas.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isRead: true },
    { id: 'm7', senderId: 's5', content: '¿Recomiendan cuerdas .09 o .10?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: true },
    { id: 'm8', senderId: 'elena', content: '.09 para empezar, son más suaves.', timestamp: new Date(Date.now() - 1000 * 60 * 30), isRead: false },
  ],
};

// ── PAYMENTS ─────────────────────────────────────────────────

export const MOCK_PAYMENTS: Payment[] = [
  // ── Instituto de Arte Contemporáneo ──
  { id: 'p1', institutionId: INST_ARTE, studentName: 'Sofia Chen', studentAvatar: 'https://randomuser.me/api/portraits/women/44.jpg', courseTitle: 'Improvisación de Jazz II', amount: 250, dueDate: new Date('2024-03-01'), paidDate: new Date('2024-02-28'), status: 'PAID', method: 'TRANSFER' },
  { id: 'p2', institutionId: INST_ARTE, studentName: 'Liam O\'Connor', studentAvatar: 'https://randomuser.me/api/portraits/men/32.jpg', courseTitle: 'Improvisación de Jazz II', amount: 250, dueDate: new Date('2024-03-01'), status: 'OVERDUE' },
  { id: 'p3', institutionId: INST_ARTE, studentName: 'Maya Patel', studentAvatar: 'https://randomuser.me/api/portraits/women/68.jpg', courseTitle: 'Cerámica Artística I', amount: 180, dueDate: new Date('2024-03-15'), paidDate: new Date('2024-03-10'), status: 'PAID', method: 'CARD' },
  // ── Escuela de Música Moderna ──
  { id: 'p4', institutionId: INST_MUSICA, studentName: 'Valentina Ruiz', studentAvatar: 'https://randomuser.me/api/portraits/women/22.jpg', courseTitle: 'Guitarra Eléctrica Nivel I', amount: 200, dueDate: new Date('2024-03-01'), paidDate: new Date('2024-02-27'), status: 'PAID', method: 'TRANSFER' },
  { id: 'p5', institutionId: INST_MUSICA, studentName: 'Diego Torres', studentAvatar: 'https://randomuser.me/api/portraits/men/45.jpg', courseTitle: 'Producción Musical Digital', amount: 300, dueDate: new Date('2024-03-01'), status: 'PENDING' },
];

// ── REVENUE & ATTENDANCE (Reports) ───────────────────────────

export const MOCK_REVENUE_DATA: Record<string, Array<{ name: string; value: number }>> = {
  [INST_ARTE]: [
    { name: 'Jazz II', value: 2500 },
    { name: 'Cerámica I', value: 1800 },
    { name: 'Pintura Óleo', value: 1200 },
  ],
  [INST_MUSICA]: [
    { name: 'Guitarra I', value: 3000 },
    { name: 'Producción', value: 3600 },
  ],
};

export const MOCK_ATTENDANCE_DATA: Record<string, Array<{ name: string; value: number; fill: string }>> = {
  [INST_ARTE]: [
    { name: 'Presente', value: 85, fill: '#10b981' },
    { name: 'Tarde', value: 10, fill: '#f59e0b' },
    { name: 'Ausente', value: 5, fill: '#f43f5e' },
  ],
  [INST_MUSICA]: [
    { name: 'Presente', value: 90, fill: '#10b981' },
    { name: 'Tarde', value: 7, fill: '#f59e0b' },
    { name: 'Ausente', value: 3, fill: '#f43f5e' },
  ],
};
