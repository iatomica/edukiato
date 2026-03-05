/**
 * AppStateContext — Centralized State Management
 *
 * Single source of truth for all entity data.
 * Components read from here, dispatch AppEvents for writes.
 * Side-effects (cross-module) are handled by eventHandlers.ts.
 */

import { useAuth } from '@/contexts/AuthContext';
import { coursesApi, usersApi, messagesApi, communicationsApi, aulasApi, ninosApi, eventsApi } from '@/services/api';
import { AppEvent, eventBus } from '@/services/eventBus';
import { registerEventHandlers } from '@/services/eventHandlers';
import {
    Course, Student, CalendarEvent, FeedItem,
    Payment, Notification, Conversation, Communication, Aula, Nino,
} from '@/types';
import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';

// ── State Shape ──────────────────────────────────────────────

export interface AppState {
    courses: Course[];
    aulas: Aula[];
    ninos: Nino[];
    students: Student[];
    events: CalendarEvent[];
    feed: FeedItem[];
    payments: Payment[];
    notifications: Notification[];
    conversations: Conversation[];
    communications: Communication[];
    /** Recent system events log for Dashboard activity feed */
    activityLog: ActivityEntry[];
}

export interface ActivityEntry {
    id: string;
    type: AppEvent['type'];
    message: string;
    timestamp: Date;
}

// ── Action Types ─────────────────────────────────────────────

type AppAction =
    | { type: 'HYDRATE_STATE'; payload: Partial<AppState> }
    | { type: 'ADD_COURSE'; payload: Course }
    | { type: 'UPDATE_COURSE'; payload: Course }
    | { type: 'SUSPEND_COURSE'; payload: { courseId: string } }
    | { type: 'ADD_STUDENT'; payload: Student }
    | { type: 'ADD_NINO'; payload: Nino }
    | { type: 'UPDATE_NINO'; payload: Nino }
    | { type: 'UPDATE_STUDENT'; payload: Partial<Student> & { id: string } }
    | { type: 'MARK_COMMUNICATIONS_READ'; payload: { userId: string } }
    | { type: 'MARK_NOTIFICATIONS_READ'; payload: { userId: string } }
    | { type: 'ADD_EVENT'; payload: CalendarEvent }
    | { type: 'UPDATE_EVENT'; payload: Partial<CalendarEvent> & { id: string } }
    | { type: 'DELETE_EVENT'; payload: { id: string } }
    | { type: 'REMOVE_EVENTS_FOR_COURSE'; payload: { courseTitle: string } }
    | { type: 'ADD_FEED_ITEM'; payload: FeedItem }
    | { type: 'ADD_PAYMENT'; payload: Payment }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'ADD_CONVERSATION'; payload: Conversation }
    | { type: 'ADD_COMMUNICATION'; payload: Communication }
    | { type: 'UPDATE_CONVERSATION'; payload: Partial<Conversation> & { id: string } }
    | { type: 'LOG_ACTIVITY'; payload: ActivityEntry }
    | { type: 'ENROLL_STUDENT'; payload: { courseId: string; studentId: string } }
    | { type: 'ADD_AULA'; payload: Aula }
    | { type: 'UPDATE_AULA'; payload: Partial<Aula> & { id: string } }
    | { type: 'DELETE_AULA'; payload: { id: string } };

// ── Reducer ──────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'HYDRATE_STATE':
            return { ...state, ...action.payload };

        case 'ADD_COURSE':
            return { ...state, courses: [...state.courses, action.payload] };

        // ... existing cases ...

        case 'UPDATE_COURSE':
            return {
                ...state,
                courses: state.courses.map(c =>
                    c.id === action.payload.id ? action.payload : c
                ),
            };

        case 'ADD_AULA': {
            const newAulasList = [...state.aulas, action.payload];

            return {
                ...state,
                aulas: newAulasList,
            };
        }

        case 'UPDATE_AULA': {
            const updatedAulas = state.aulas.map(a =>
                a.id === action.payload.id ? { ...a, ...action.payload } : a
            );

            return {
                ...state,
                aulas: updatedAulas,
            };
        }

        case 'DELETE_AULA': {
            const reducedAulas = state.aulas.filter(a => a.id !== action.payload.id);
            const updatedNinos = state.ninos.map(n =>
                n.aulaId === action.payload.id ? { ...n, aulaId: '' } : n
            );



            return {
                ...state,
                aulas: reducedAulas,
                ninos: updatedNinos
            };
        }

        case 'SUSPEND_COURSE':
            return {
                ...state,
                courses: state.courses.map(c =>
                    c.id === action.payload.courseId
                        ? { ...c, tags: [...c.tags.filter(t => t !== 'Activo'), 'Suspendido'] }
                        : c
                ),
            };

        case 'ADD_STUDENT':
            return { ...state, students: [...state.students, action.payload] };

        case 'ADD_NINO': {
            const newNinos = [...state.ninos, action.payload];

            return { ...state, ninos: newNinos };
        }

        case 'UPDATE_NINO': {
            const updatedNinos = state.ninos.map((n) =>
                n.id === action.payload.id ? { ...n, ...action.payload } : n,
            );

            return { ...state, ninos: updatedNinos };
        }

        case 'UPDATE_STUDENT':
            return {
                ...state,
                students: state.students.map(s =>
                    s.id === action.payload.id ? { ...s, ...action.payload } : s
                ),
            };

        case 'ADD_EVENT': {
            const newEventsList = [...state.events, action.payload];

            return { ...state, events: newEventsList };
        }

        case 'UPDATE_EVENT': {
            const updatedEvents = state.events.map(e =>
                e.id === action.payload.id ? { ...e, ...action.payload } as CalendarEvent : e
            );

            return {
                ...state,
                events: updatedEvents,
            };
        }

        case 'DELETE_EVENT': {
            const reducedEvents = state.events.filter(e => e.id !== action.payload.id);

            return {
                ...state,
                events: reducedEvents,
            };
        }

        case 'REMOVE_EVENTS_FOR_COURSE':
            return {
                ...state,
                events: state.events.filter(e => !e.title.includes(action.payload.courseTitle)),
            };

        case 'ADD_FEED_ITEM':
            return { ...state, feed: [action.payload, ...state.feed] };

        case 'ADD_PAYMENT':
            return { ...state, payments: [action.payload, ...state.payments] };

        case 'ADD_NOTIFICATION': {
            const newNotifs = [action.payload, ...state.notifications];

            return { ...state, notifications: newNotifs };
        }

        case 'ADD_CONVERSATION':
            return { ...state, conversations: [...state.conversations, action.payload] };

        case 'ADD_COMMUNICATION': {
            const newComms = [action.payload, ...state.communications];

            return { ...state, communications: newComms };
        }

        case 'MARK_COMMUNICATIONS_READ': {
            const updatedComms = state.communications.map(c => {
                // If unread, and it's directed either globally (no recipient) or specifically to user
                if (!c.isRead && (!c.recipientId || c.recipientId === action.payload.userId)) {
                    return { ...c, isRead: true };
                }
                return c;
            });

            return { ...state, communications: updatedComms };
        }

        case 'MARK_NOTIFICATIONS_READ': {
            const updatedNotifs = state.notifications.map(n => {
                // Mark all as read for the mock simulation
                if (!n.isRead) {
                    return { ...n, isRead: true };
                }
                return n;
            });

            return { ...state, notifications: updatedNotifs };
        }

        case 'UPDATE_CONVERSATION':
            return {
                ...state,
                conversations: state.conversations.map(c =>
                    c.id === action.payload.id ? { ...c, ...action.payload } : c
                ),
            };

        case 'LOG_ACTIVITY':
            return {
                ...state,
                activityLog: [action.payload, ...state.activityLog].slice(0, 50),
            };

        case 'ENROLL_STUDENT':
            return {
                ...state,
                courses: state.courses.map(c =>
                    c.id === action.payload.courseId
                        ? { ...c, enrolled: c.enrolled + 1 }
                        : c
                ),
            };

        default:
            return state;
    }
}

// ── Initial State ────────────────────────────────────────────

const initialState: AppState = {
    courses: [],
    aulas: [],
    ninos: [],
    students: [],
    events: [],
    feed: [],
    payments: [],
    notifications: [],
    conversations: [],
    communications: [],
    activityLog: [],
};

// ── Context ──────────────────────────────────────────────────

interface AppStateContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    /** Emit an AppEvent — triggers side-effects and updates state */
    emitEvent: (event: AppEvent) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { token, isAuthenticated, currentInstitution, user } = useAuth();

    // Initialize state when authenticated
    useEffect(() => {
        if (isAuthenticated && token) {
            dispatch({
                type: 'HYDRATE_STATE',
                payload: {
                    courses: [],
                    aulas: [],
                    ninos: [],
                    students: [],
                    events: [],
                    feed: [],
                    payments: [],
                    notifications: [],
                    conversations: [],
                    communications: [],
                },
            });
        }
    }, [isAuthenticated, token, dispatch]);

    // Fetch tenant-specific data when institution changes
    useEffect(() => {
        if (isAuthenticated && token && currentInstitution) {
            const fetchTenantData = async () => {
                try {
                    const [fetchedCourses, fetchedUsers, fetchedCommunications, fetchedAulas, fetchedNinos, fetchedEvents] = await Promise.all([
                        coursesApi.getAll(currentInstitution.id, token).catch(() => []),
                        usersApi.getAll(currentInstitution.id, token).catch(() => []),
                        communicationsApi.getAll(currentInstitution.id, token).catch(() => []),
                        aulasApi.getAll(currentInstitution.id, token).catch(() => []),
                        ninosApi.getAll(currentInstitution.id, token).catch(() => []),
                        eventsApi.getAll(currentInstitution.id, token).catch(() => []),
                    ]);

                    dispatch({
                        type: 'HYDRATE_STATE',
                        payload: {
                            courses: fetchedCourses,
                            students: fetchedUsers.map((u: any) => ({
                                id: u.id,
                                institutionId: currentInstitution.id,
                                name: u.name,
                                email: u.email,
                                program: 'General',
                                status: 'active',
                                avatar: u.avatar,
                                attendanceRate: 100,
                                role: u.role
                            })) as Student[],
                            communications: fetchedCommunications,
                            aulas: fetchedAulas,
                            ninos: fetchedNinos,
                            events: fetchedEvents,
                        }
                    });
                } catch (error) {
                    console.error("Error fetching tenant data:", error);
                }
            };
            fetchTenantData();
        }
    }, [currentInstitution, isAuthenticated, token]);

    // Register event handlers on mount
    useEffect(() => {
        const unsubscribers = registerEventHandlers(dispatch);
        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, [dispatch]);

    // Real-time conversation sync with backend polling
    useEffect(() => {
        if (!isAuthenticated || !token || !currentInstitution || !user) return;

        const syncConversations = async () => {
            try {
                const result = await messagesApi.getConversations(user.id, token);
                const mappedConvs = result.map(c => ({
                    id: c.contactId, // Quick proxy for conversation ID
                    institutionId: currentInstitution.id,
                    name: 'Contact',
                    type: 'DIRECT' as any,
                    lastMessage: c.lastMessage as any,
                    lastMessageTime: c.lastMessage.timestamp,
                    unreadCount: c.unreadCount,
                    participants: [user.id, c.contactId]
                }));
                // We use standard React dispatch to softly replace conversations without refreshing everything
                dispatch({ type: 'HYDRATE_STATE', payload: { conversations: mappedConvs } });
            } catch (err) { }
        };

        const interval = setInterval(syncConversations, 5000);

        syncConversations();

        return () => {
            clearInterval(interval);
        };
    }, [isAuthenticated, token, currentInstitution, user]);

    const emitEvent = useCallback((event: AppEvent) => {
        eventBus.emit(event);
    }, []);

    return (
        <AppStateContext.Provider value={{ state, dispatch, emitEvent }}>
            {children}
        </AppStateContext.Provider>
    );
};

// ── Hook ──────────────────────────────────────────────────────

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};
