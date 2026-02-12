/**
 * EventBus — Typed Pub/Sub for Cross-Module Integration
 *
 * Components dispatch events, handlers produce side-effects.
 * All events are typed for compile-time safety.
 */

import { Course, CalendarEvent, FeedItem, Payment, Notification, Conversation } from '../types';

// ── Event Definitions ────────────────────────────────────────

export interface AttendanceRecord {
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

export type AppEvent =
    | { type: 'COURSE_CREATED'; payload: Course }
    | { type: 'COURSE_UPDATED'; payload: Course }
    | { type: 'COURSE_SUSPENDED'; payload: { courseId: string; courseTitle: string } }
    | { type: 'STUDENT_ENROLLED'; payload: { studentId: string; studentName: string; courseId: string; courseTitle: string } }
    | {
        type: 'STUDENT_STATUS_CHANGED'; payload: {
            studentId: string;
            studentName: string;
            oldStatus: string;
            newStatus: string;
            changedBy: string;
            reason?: string;
        }
    }
    | { type: 'STUDENT_UNENROLLED'; payload: { studentId: string; courseId: string } }
    | { type: 'PAYMENT_RECORDED'; payload: Payment }
    | { type: 'ATTENDANCE_TAKEN'; payload: { eventId: string; courseTitle: string; records: AttendanceRecord[] } }
    | { type: 'CONTENT_PUBLISHED'; payload: FeedItem }
    | { type: 'ASSIGNMENT_GRADED'; payload: { studentId: string; courseTitle: string; grade: number } }
    | { type: 'NOTIFICATION_CREATED'; payload: Notification }
    | { type: 'INSTITUTION_UPDATED'; payload: { institutionId: string } };

export type AppEventType = AppEvent['type'];

// ── Event Bus ────────────────────────────────────────────────

type Handler<T extends AppEventType> = (
    event: Extract<AppEvent, { type: T }>
) => void;

class EventBusImpl {
    private handlers: Map<AppEventType, Set<Handler<any>>> = new Map();

    on<T extends AppEventType>(type: T, handler: Handler<T>): () => void {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set());
        }
        this.handlers.get(type)!.add(handler);

        // Return unsubscribe function
        return () => {
            this.handlers.get(type)?.delete(handler);
        };
    }

    emit<T extends AppEventType>(event: Extract<AppEvent, { type: T }>): void {
        const typeHandlers = this.handlers.get(event.type);
        if (typeHandlers) {
            typeHandlers.forEach(handler => {
                try {
                    handler(event);
                } catch (err) {
                    console.error(`[EventBus] Error in handler for ${event.type}:`, err);
                }
            });
        }
    }

    /** Remove all handlers (useful for cleanup) */
    clear(): void {
        this.handlers.clear();
    }
}

// Singleton instance
export const eventBus = new EventBusImpl();
