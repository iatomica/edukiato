
// ============================================================
// MULTI-TENANT / INSTITUTION
// ============================================================

export interface Institution {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  isActive: boolean;
  permissionOverrides?: PermissionOverride[];
}

export interface InstitutionTheme {
  institutionName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

// ============================================================
// USERS & ROLES
// ============================================================

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_INSTITUCION' | 'DOCENTE' | 'PADRE' | 'ESPECIALES' | 'ESTUDIANTE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  institutions?: UserInstitution[];
}

export interface UserInstitution {
  institutionId: string;
  institutionName: string;
  institutionSlug: string;
  role: UserRole;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

// ============================================================
// PERMISSIONS — Hierarchical, Decoupled, Per-Institution
// ============================================================

export type PermissionAction =
  | 'create' | 'read' | 'update' | 'delete'
  | 'manage'
  | 'export'
  | 'grade'
  | 'submit'
  | 'enroll'
  | 'record_payment'
  | 'take_attendance';

export type PermissionResource =
  | 'course' | 'student' | 'schedule' | 'classroom'
  | 'message' | 'financial' | 'report' | 'institution'
  | 'user' | 'enrollment' | 'attendance' | 'assignment'
  | 'certificate' | 'announcement' | 'aula' | 'nino';

export interface PermissionRule {
  action: PermissionAction | PermissionAction[];
  resource: PermissionResource;
}

// ── Data Classification ─────────────────────────────────────

export type SensitivityLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export const DATA_CLASSIFICATION: Record<PermissionResource, SensitivityLevel> = {
  course: 'PUBLIC',
  announcement: 'PUBLIC',
  schedule: 'PUBLIC',
  classroom: 'INTERNAL',
  assignment: 'INTERNAL',
  attendance: 'INTERNAL',
  certificate: 'INTERNAL',
  student: 'CONFIDENTIAL', // Identifying info
  nino: 'CONFIDENTIAL', // Identifying info for children
  aula: 'INTERNAL',
  enrollment: 'CONFIDENTIAL',
  message: 'CONFIDENTIAL',
  user: 'CONFIDENTIAL',
  report: 'CONFIDENTIAL', // Aggregated data
  institution: 'RESTRICTED',
  financial: 'RESTRICTED', // Only Admin
};

// ── Hierarchy & Inheritance ─────────────────────────────────

/**
 * Role Inheritance Map (Branching Model)
 * - STUDENT: Base
 * - TEACHER: Inherits STUDENT
 * - ADMIN: Inherits STUDENT (Does NOT inherit TEACHER to prevent grading)
 * - SUPER_ADMIN: Inherits ADMIN
 */
export const ROLE_PARENTS: Record<UserRole, UserRole[]> = {
  ESTUDIANTE: [],
  PADRE: ['ESTUDIANTE'],
  ESPECIALES: ['ESTUDIANTE'],
  DOCENTE: ['ESTUDIANTE'],
  ADMIN_INSTITUCION: ['ESTUDIANTE'],
  SUPER_ADMIN: ['ADMIN_INSTITUCION'],
};

// ── Per-Role Additions ──────────────────────────────────────
// Each role declares ONLY the permissions it ADDS on top of
// what it inherits.

export const ROLE_OWN_PERMISSIONS: Record<UserRole, PermissionRule[]> = {

  ESTUDIANTE: [
    { action: 'read', resource: 'course' },
    { action: 'read', resource: 'schedule' },
    { action: 'read', resource: 'classroom' },
    { action: 'read', resource: 'announcement' },
    { action: 'read', resource: 'assignment' },
    { action: 'submit', resource: 'assignment' },
    { action: 'read', resource: 'attendance' },
    { action: 'read', resource: 'certificate' },
    { action: 'read', resource: 'enrollment' },
    { action: 'manage', resource: 'message' },
    { action: 'read', resource: 'aula' },
  ],

  PADRE: [
    { action: 'read', resource: 'nino' },
    { action: 'read', resource: 'aula' },
  ],

  ESPECIALES: [
    { action: 'read', resource: 'schedule' },
    { action: 'read', resource: 'message' },
  ],

  DOCENTE: [
    { action: ['create', 'update'], resource: 'course' },
    { action: 'read', resource: 'student' },
    { action: 'manage', resource: 'classroom' },
    { action: ['create', 'read'], resource: 'announcement' },
    { action: 'manage', resource: 'assignment' },
    { action: 'grade', resource: 'assignment' },
    { action: 'take_attendance', resource: 'attendance' },
    { action: 'manage', resource: 'attendance' },
    { action: ['create', 'read'], resource: 'certificate' },
    { action: 'create', resource: 'schedule' },
  ],

  ADMIN_INSTITUCION: [
    // Re-declare READ permissions for academic resources
    // (since we no longer inherit from Docente)
    { action: 'read', resource: 'assignment' },
    { action: 'read', resource: 'attendance' },
    { action: 'read', resource: 'student' },
    { action: 'read', resource: 'nino' },
    { action: 'read', resource: 'certificate' },

    // Admin Management Privileges
    { action: 'manage', resource: 'course' },
    { action: 'manage', resource: 'student' },
    { action: 'manage', resource: 'financial' }, // RESTRICTED
    { action: 'manage', resource: 'report' },
    { action: 'manage', resource: 'schedule' },
    { action: 'manage', resource: 'enrollment' },
    { action: 'manage', resource: 'certificate' },
    { action: 'manage', resource: 'announcement' },
    { action: ['create', 'read', 'update'], resource: 'user' },
    { action: 'read', resource: 'institution' },
    { action: 'export', resource: 'report' },
  ],

  SUPER_ADMIN: [
    { action: 'manage', resource: 'institution' },
    { action: 'manage', resource: 'user' },
  ],
};

// ── Permission Resolution ───────────────────────────────────

export function resolveRolePermissions(role: UserRole): PermissionRule[] {
  const rules: PermissionRule[] = [...(ROLE_OWN_PERMISSIONS[role] || [])];
  const parents = ROLE_PARENTS[role] || [];

  parents.forEach(parent => {
    rules.push(...resolveRolePermissions(parent));
  });

  return rules;
}

// ── Per-Institution Overrides ──────────────────────────────

export interface PermissionOverride {
  role: UserRole;
  grant?: PermissionRule[];
  deny?: PermissionRule[];
}

// ============================================================
// AUTH STATE
// ============================================================

export interface AuthState {
  user: User | null;
  token: string | null;
  currentInstitution: Institution | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================================
// COURSE TYPES — Flexible, Data-Driven Configuration
// ============================================================

export type CourseType = 'REGULAR' | 'WORKSHOP' | 'SEMINAR';

export interface AttendancePolicy {
  mode: 'MANDATORY' | 'FLEXIBLE' | 'NONE';
  /** Minimum attendance rate required (0-100). null = no minimum. */
  minRate: number | null;
}

export interface EvaluationPolicy {
  mode: 'GRADES' | 'PROJECT' | 'NONE';
  /** Whether numeric grades are used */
  hasGrades: boolean;
  /** Whether a final project or deliverable is expected */
  hasProject: boolean;
}

export interface SchedulePolicy {
  mode: 'RECURRENT' | 'FIXED' | 'SINGLE';
  /** Whether sessions repeat on a weekly calendar */
  recurrent: boolean;
}

export interface CertificatePolicy {
  /** Whether a certificate is generated automatically on completion */
  autoGenerate: boolean;
  /** Whether manual generation by instructor is allowed */
  manualAllowed: boolean;
}

export interface CourseTypeConfig {
  id: CourseType;
  label: { es: string; en: string };
  icon: string;
  color: string;
  attendance: AttendancePolicy;
  evaluation: EvaluationPolicy;
  schedule: SchedulePolicy;
  certificate: CertificatePolicy;
}

// ============================================================
// COURSES
// ============================================================

export interface Course {
  id: string;
  institutionId: string;
  courseType: CourseType;
  title: string;
  instructor: string;
  schedule: string;
  enrolled: number;
  capacity: number;
  image: string;
  tags: string[];
  nextSession: string;
  description?: string;
  /** Per-course overrides of the base type config */
  typeConfigOverrides?: Partial<Omit<CourseTypeConfig, 'id' | 'label' | 'icon' | 'color'>>;
}

export interface Student {
  id: string;
  institutionId: string;
  name: string;
  email: string;
  program: string;
  status: 'active' | 'inactive' | 'on_leave';
  avatar: string;
  attendanceRate: number;
  role?: UserRole;
}

export interface Nino {
  id: string;
  institutionId: string;
  name: string;
  birthDate?: string;
  medicalInfo?: string;
  avatar: string;
  aulaId: string;         // Link to the Aula
  parentId: string;       // Link to the User Padres
  attendanceRate?: number;
}

export interface Aula {
  id: string;
  institutionId: string;
  name: string;
  capacity: number;
  teachers: string[];     // Array of User IDs with DOCENTE role
  assistants?: string[];  // Other roles if assigned by Admin
  color?: string;
}

export interface CalendarEvent {
  id: string;
  institutionId: string;
  title: string;
  start: Date;
  end: Date;
  type: 'class' | 'workshop' | 'event';
  color: string;
  description?: string;
  creatorId?: string;
  sharedWith?: {
    scope: 'ALL' | 'COURSE' | 'INDIVIDUAL';
    targetIds?: string[];
  };
}

export interface FeedItem {
  id: string;
  institutionId: string;
  scope: 'COURSE' | 'INSTITUTION';
  courseId?: string;
  type: 'MATERIAL' | 'ASSIGNMENT' | 'ANNOUNCEMENT';
  title: string;
  description?: string;
  postedAt: Date;
  author: string;
  materialType?: 'PDF' | 'VIDEO' | 'LINK';
  url?: string;
  dueDate?: Date;
  status?: 'PENDING' | 'SUBMITTED' | 'GRADED';
}

export type CommunicationType = 'ANUNCIO_GENERAL' | 'ANUNCIO_SALA' | 'NOTIFICACION_INDIVIDUAL';

export interface Communication {
  id: string;
  institutionId: string;
  type: CommunicationType;
  title: string;
  content: string;
  senderId: string;
  senderName: string;
  recipientId?: string; // If null, it's a broadcast (course or institution)
  courseId?: string; // Linked course
  createdAt: string;
  isRead: boolean;
  attachments?: { name: string; url: string }[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  file?: {
    name: string;
    url: string;
    type: string;
    size: number;
  };
}

export interface Conversation {
  id: string;
  institutionId: string;
  name: string;
  type: 'DIRECT' | 'COURSE_GROUP';
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  participants: string[];
}

export interface Notification {
  id: string;
  institutionId: string;
  type: 'ANNOUNCEMENT' | 'MESSAGE' | 'GRADE' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  time: string;
  actionLink?: string; // e.g., '/communications' or 'communications'
  recipientId?: string; // Target specific user
  courseId?: string; // Target specific course members
}

export type View = 'dashboard' | 'courses' | 'students' | 'schedule' | 'classroom' | 'messages' | 'communications' | 'usuarios' | 'institutions' | 'aulas';

// ── Onboarding ──────────────────────────────────────────────

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetView: View;
  actionLabel: string;
}

export interface OnboardingProgress {
  completedSteps: string[];
  isDismissed: boolean;
}
