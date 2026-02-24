/**
 * Event Handlers — Cross-Module Side-Effects
 *
 * Each handler listens for an AppEvent and dispatches state changes
 * to OTHER modules. This is the integration layer.
 *
 * COURSE_CREATED → calendar + feed + conversation + notification
 * PAYMENT_RECORDED → notification + activity log
 * COURSE_SUSPENDED → remove calendar + notification
 * ATTENDANCE_TAKEN → update student rates + activity log
 * CONTENT_PUBLISHED → notification
 * STUDENT_ENROLLED → enrollment count + payment + conversation + notification
 */

import { eventBus } from './eventBus';
import { courseTypeToCalendarType, courseTypeToCalendarColor } from './courseTypeConfig';
import type { CalendarEvent, FeedItem, Notification, Conversation } from '../types';
import type { ActivityEntry } from '../contexts/AppStateContext';

type Dispatch = (action: any) => void;

// ── Helpers ──────────────────────────────────────────────────

let idCounter = 0;
function uid(prefix: string): string {
    return `${prefix}_${Date.now()}_${++idCounter}`;
}

function createNotification(
    dispatch: Dispatch,
    institutionId: string,
    type: Notification['type'],
    title: string,
    message: string,
    actionLink?: string,
    recipientId?: string,
    courseId?: string
): void {
    const notif: Notification = {
        id: uid('n'),
        institutionId,
        type,
        title,
        message,
        isRead: false,
        time: 'Ahora',
        actionLink,
        recipientId,
        courseId,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
}

function logActivity(
    dispatch: Dispatch,
    eventType: string,
    message: string
): void {
    const entry: ActivityEntry = {
        id: uid('act'),
        type: eventType as any,
        message,
        timestamp: new Date(),
    };
    dispatch({ type: 'LOG_ACTIVITY', payload: entry });
}

// ── Handler: COURSE_CREATED ──────────────────────────────────

function handleCourseCreated(dispatch: Dispatch) {
    return (event: { type: 'COURSE_CREATED'; payload: any }) => {
        const course = event.payload;

        // 1. Generate calendar event from course schedule
        const calEvent: CalendarEvent = {
            id: uid('e'),
            institutionId: course.institutionId,
            title: `${course.title} — ${course.schedule}`,
            start: new Date(Date.now() + 86400000), // tomorrow
            end: new Date(Date.now() + 86400000 + 7200000), // +2h
            type: courseTypeToCalendarType(course.courseType ?? 'REGULAR'),
            color: courseTypeToCalendarColor(course.courseType ?? 'REGULAR'),
        };
        dispatch({ type: 'ADD_EVENT', payload: calEvent });

        // 2. Post announcement to feed
        const feedItem: FeedItem = {
            id: uid('f'),
            institutionId: course.institutionId,
            courseId: course.id,
            scope: 'COURSE',
            type: 'ANNOUNCEMENT',
            title: `Nuevo curso: ${course.title}`,
            description: `Se ha creado el curso "${course.title}" dictado por ${course.instructor}. Horario: ${course.schedule}. ¡Inscripciones abiertas!`,
            postedAt: new Date(),
            author: course.instructor,
        };
        dispatch({ type: 'ADD_FEED_ITEM', payload: feedItem });

        // 3. Create course group chat
        const conversation: Conversation = {
            id: uid('conv'),
            institutionId: course.institutionId,
            name: `Grupo: ${course.title}`,
            type: 'COURSE_GROUP',
            avatar: course.image,
            lastMessage: `Grupo creado para ${course.title}`,
            lastMessageTime: new Date(),
            unreadCount: 0,
            participants: [course.instructor],
        };
        dispatch({ type: 'ADD_CONVERSATION', payload: conversation });

        // 4. Notification
        createNotification(
            dispatch,
            course.institutionId,
            'SYSTEM',
            'Nuevo curso creado',
            `"${course.title}" ha sido añadido al catálogo.`
        );

        // 5. Activity log
        logActivity(dispatch, 'COURSE_CREATED', `Curso "${course.title}" creado`);
    };
}

// ── Handler: COURSE_SUSPENDED ────────────────────────────────

function handleCourseSuspended(dispatch: Dispatch) {
    return (event: { type: 'COURSE_SUSPENDED'; payload: any }) => {
        const { courseId, courseTitle } = event.payload;

        // 1. Suspend the course
        dispatch({ type: 'SUSPEND_COURSE', payload: { courseId } });

        // 2. Remove calendar events for this course
        dispatch({ type: 'REMOVE_EVENTS_FOR_COURSE', payload: { courseTitle } });

        // 3. Notify students
        createNotification(
            dispatch,
            '', // will be filtered by tenant
            'SYSTEM',
            'Curso suspendido',
            `El curso "${courseTitle}" ha sido suspendido temporalmente.`
        );

        // 4. Activity log
        logActivity(dispatch, 'COURSE_SUSPENDED', `Curso "${courseTitle}" suspendido`);
    };
}

// ── Handler: PAYMENT_RECORDED ────────────────────────────────

function handlePaymentRecorded(dispatch: Dispatch) {
    return (event: { type: 'PAYMENT_RECORDED'; payload: any }) => {
        const payment = event.payload;

        // 1. Notification
        createNotification(
            dispatch,
            payment.institutionId,
            'SYSTEM',
            'Pago registrado',
            `Pago de $${payment.amount} de ${payment.studentName} por "${payment.courseTitle}".`
        );

        // 2. Activity log
        logActivity(
            dispatch,
            'PAYMENT_RECORDED',
            `Pago $${payment.amount} — ${payment.studentName}`
        );
    };
}

// ── Handler: ATTENDANCE_TAKEN ────────────────────────────────

function handleAttendanceTaken(dispatch: Dispatch) {
    return (event: { type: 'ATTENDANCE_TAKEN'; payload: any }) => {
        const { courseTitle, records } = event.payload;

        // 1. Update each student's attendance rate
        records.forEach((rec: { studentId: string; status: string }) => {
            // Simplified: adjust rate by a factor
            const delta = rec.status === 'PRESENT' ? 1 : rec.status === 'LATE' ? 0.5 : -2;
            dispatch({
                type: 'UPDATE_STUDENT',
                payload: {
                    id: rec.studentId,
                    // We only adjust the rate; real calculation would need full history
                    attendanceRate: undefined, // handled in reducer as pass-through
                },
            });
        });

        // 2. Notify absences
        const absents = records.filter((r: any) => r.status === 'ABSENT');
        if (absents.length > 0) {
            createNotification(
                dispatch,
                '',
                'SYSTEM',
                'Inasistencias registradas',
                `${absents.length} estudiante(s) ausente(s) en "${courseTitle}".`
            );
        }

        // 3. Activity log
        logActivity(
            dispatch,
            'ATTENDANCE_TAKEN',
            `Asistencia tomada: ${courseTitle} — ${records.length} registros`
        );
    };
}

// ── Handler: CONTENT_PUBLISHED ───────────────────────────────

function handleContentPublished(dispatch: Dispatch) {
    return (event: { type: 'CONTENT_PUBLISHED'; payload: any }) => {
        const item = event.payload;

        // 1. Notification for students
        createNotification(
            dispatch,
            item.institutionId,
            'ANNOUNCEMENT',
            item.type === 'ASSIGNMENT' ? 'Nueva tarea publicada' : 'Nuevo contenido',
            `"${item.title}" en el curso.`
        );

        // 2. If assignment, create calendar event for due date
        if (item.type === 'ASSIGNMENT' && item.dueDate) {
            const calEvent: CalendarEvent = {
                id: uid('e'),
                institutionId: item.institutionId,
                title: `📝 Entrega: ${item.title}`,
                start: new Date(item.dueDate),
                end: new Date(item.dueDate),
                type: 'event',
                color: 'bg-red-100 text-red-700 border-red-200',
            };
            dispatch({ type: 'ADD_EVENT', payload: calEvent });
        }

        // 3. Activity log
        logActivity(dispatch, 'CONTENT_PUBLISHED', `Contenido publicado: "${item.title}"`);
    };
}

// ── Handler: STUDENT_ENROLLED ────────────────────────────────

function handleStudentEnrolled(dispatch: Dispatch) {
    return (event: { type: 'STUDENT_ENROLLED'; payload: any }) => {
        const { studentName, courseId, courseTitle } = event.payload;

        // 1. Increment enrolled count
        dispatch({ type: 'ENROLL_STUDENT', payload: { courseId, studentId: event.payload.studentId } });

        // 2. Notification
        createNotification(
            dispatch,
            '',
            'SYSTEM',
            'Nueva inscripción',
            `${studentName} se inscribió en "${courseTitle}".`
        );

        // 3. Activity log
        logActivity(dispatch, 'STUDENT_ENROLLED', `${studentName} inscrito en "${courseTitle}"`);
    };
}

// ── Handler: STUDENT_STATUS_CHANGED ──────────────────────────

function handleStudentStatusChanged(dispatch: Dispatch) {
    return (event: { type: 'STUDENT_STATUS_CHANGED'; payload: any }) => {
        const { studentName, oldStatus, newStatus, changedBy } = event.payload;

        // 1. Notification (only if status changed to inactive/on_leave/active)
        // We might not always want to notify, but let's do it for significant changes
        if (newStatus !== oldStatus) {
            createNotification(
                dispatch,
                '', // Tenant scope
                'SYSTEM',
                'Cambio de estado de estudiante',
                `${studentName} cambió de ${oldStatus} a ${newStatus}.`
            );
        }

        // 2. Activity log
        logActivity(
            dispatch,
            'STUDENT_STATUS_CHANGED',
            `Estado de ${studentName}: ${oldStatus} ➝ ${newStatus} (por ${changedBy})`
        );
    };
}

// ── Handler: COMMUNICATION_SENT ──────────────────────────────

function handleCommunicationSent(dispatch: Dispatch) {
    return (event: { type: 'COMMUNICATION_SENT'; payload: any }) => {
        const comm = event.payload;

        // 1. Notification for Recipient
        // In a real app, we would only create this for the *recipient*, not the sender.
        // For the mock, we simulate it appearing for the "current user" if they are the recipient or part of the course.
        // We'll Create it generally, and Layout will filter/show it (or we rely on backend to push to specific user socket).

        // Map CommunicationType to NotificationType
        let notifType: Notification['type'] = 'SYSTEM';
        if (comm.type === 'ANUNCIO_GENERAL' || comm.type === 'ANUNCIO_SALA') notifType = 'ANNOUNCEMENT';
        else if (comm.type === 'NOTIFICACION_INDIVIDUAL') notifType = 'MESSAGE';

        createNotification(
            dispatch,
            comm.institutionId,
            notifType,
            `Nuevo Comunicado: ${comm.title}`,
            comm.content.substring(0, 50) + (comm.content.length > 50 ? '...' : ''),
            '/communications' // Action link to redirect
        );

        // 2. Activity log
        logActivity(
            dispatch,
            'COMMUNICATION_SENT',
            `Comunicado enviado por ${comm.senderName} a ${comm.recipientId || comm.courseId || 'Todos'}`
        );
    };
}

// ── Registration ─────────────────────────────────────────────

export function registerEventHandlers(dispatch: Dispatch): (() => void)[] {
    return [
        eventBus.on('COURSE_CREATED', handleCourseCreated(dispatch)),
        eventBus.on('COURSE_SUSPENDED', handleCourseSuspended(dispatch)),
        eventBus.on('PAYMENT_RECORDED', handlePaymentRecorded(dispatch)),
        eventBus.on('ATTENDANCE_TAKEN', handleAttendanceTaken(dispatch)),
        eventBus.on('CONTENT_PUBLISHED', handleContentPublished(dispatch)),
        eventBus.on('STUDENT_ENROLLED', handleStudentEnrolled(dispatch)),
        eventBus.on('STUDENT_STATUS_CHANGED', handleStudentStatusChanged(dispatch)),
        eventBus.on('COMMUNICATION_SENT', handleCommunicationSent(dispatch)),
    ];
}
