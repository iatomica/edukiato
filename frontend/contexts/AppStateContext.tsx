/**
 * AppStateContext — Centralized State Management
 *
 * Single source of truth for all entity data.
 * Components read from here, dispatch AppEvents for writes.
 * Side-effects (cross-module) are handled by eventHandlers.ts.
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import {
    Course, Student, CalendarEvent, FeedItem,
    Payment, Notification, Conversation, OnboardingProgress, Communication, Aula, Nino,
} from '../types';
import { useAuth } from './AuthContext';
import { AppEvent, eventBus } from '../services/eventBus';
import { registerEventHandlers } from '../services/eventHandlers';
import { coursesApi, usersApi } from '../services/api';
import { MOCK_COURSES, MOCK_FEED, MOCK_PAYMENTS, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS, MOCK_COMMUNICATIONS, MOCK_STUDENTS, MOCK_EVENTS, MOCK_AULAS, MOCK_NINOS } from '../services/mockData';

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
    onboarding: OnboardingProgress;
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
    | { type: 'UPDATE_STUDENT'; payload: Partial<Student> & { id: string } }
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
    | { type: 'UPDATE_AULA'; payload: Partial<Aula> & { id: string } }
    | { type: 'COMPLETE_ONBOARDING_STEP'; payload: string }
    | { type: 'DISMISS_ONBOARDING' };

// ── Reducer ──────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'HYDRATE_STATE':
            return { ...state, ...action.payload };

        case 'ADD_COURSE':
            return { ...state, courses: [...state.courses, action.payload] };

        // ... existing cases ...

        case 'COMPLETE_ONBOARDING_STEP':
            if (state.onboarding.completedSteps.includes(action.payload)) return state;
            return {
                ...state,
                onboarding: {
                    ...state.onboarding,
                    completedSteps: [...state.onboarding.completedSteps, action.payload],
                },
            };

        case 'DISMISS_ONBOARDING':
            return {
                ...state,
                onboarding: { ...state.onboarding, isDismissed: true },
            };

        case 'UPDATE_COURSE':
            return {
                ...state,
                courses: state.courses.map(c =>
                    c.id === action.payload.id ? action.payload : c
                ),
            };

        case 'UPDATE_AULA': {
            const updatedAulas = state.aulas.map(a =>
                a.id === action.payload.id ? { ...a, ...action.payload } : a
            );
            try { localStorage.setItem('MOCK_AULAS', JSON.stringify(updatedAulas)); } catch (e) { }
            return {
                ...state,
                aulas: updatedAulas,
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
            try { localStorage.setItem('MOCK_NINOS', JSON.stringify(newNinos)); } catch (e) { }
            return { ...state, ninos: newNinos };
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
            try { localStorage.setItem('MOCK_EVENTS', JSON.stringify(newEventsList)); } catch (e) { }
            return { ...state, events: newEventsList };
        }

        case 'UPDATE_EVENT': {
            const updatedEvents = state.events.map(e =>
                e.id === action.payload.id ? { ...e, ...action.payload } as CalendarEvent : e
            );
            try { localStorage.setItem('MOCK_EVENTS', JSON.stringify(updatedEvents)); } catch (e) { }
            return {
                ...state,
                events: updatedEvents,
            };
        }

        case 'DELETE_EVENT': {
            const reducedEvents = state.events.filter(e => e.id !== action.payload.id);
            try { localStorage.setItem('MOCK_EVENTS', JSON.stringify(reducedEvents)); } catch (e) { }
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
            try { localStorage.setItem('MOCK_NOTIFICATIONS', JSON.stringify(newNotifs)); } catch (e) { }
            return { ...state, notifications: newNotifs };
        }

        case 'ADD_CONVERSATION':
            return { ...state, conversations: [...state.conversations, action.payload] };

        case 'ADD_COMMUNICATION': {
            const newComms = [action.payload, ...state.communications];
            try { localStorage.setItem('MOCK_COMMUNICATIONS', JSON.stringify(newComms)); } catch (e) { }
            return { ...state, communications: newComms };
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
    onboarding: { completedSteps: [], isDismissed: false },
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
    const { token, isAuthenticated, currentInstitution } = useAuth();

    // Fetch real data when authenticated
    useEffect(() => {
        if (isAuthenticated && token) {
            const hydrateAppData = async () => {
                try {
                    // Parse local storage dynamically to get the latest (to prevent soft-logout staleness)
                    const storedComms = localStorage.getItem('MOCK_COMMUNICATIONS');
                    const storedNotifs = localStorage.getItem('MOCK_NOTIFICATIONS');
                    const storedNinos = localStorage.getItem('MOCK_NINOS');
                    const storedAulas = localStorage.getItem('MOCK_AULAS');

                    const storedEvents = localStorage.getItem('MOCK_EVENTS');

                    let baseData: Partial<AppState> = {
                        courses: MOCK_COURSES,
                        aulas: storedAulas ? JSON.parse(storedAulas) : MOCK_AULAS,
                        ninos: storedNinos ? JSON.parse(storedNinos) : MOCK_NINOS,
                        students: MOCK_STUDENTS,
                        events: storedEvents ? JSON.parse(storedEvents).map((e: any) => ({
                            ...e,
                            start: new Date(e.start),
                            end: new Date(e.end)
                        })) : MOCK_EVENTS,
                        feed: MOCK_FEED,
                        payments: MOCK_PAYMENTS,
                        notifications: storedNotifs ? JSON.parse(storedNotifs) : MOCK_NOTIFICATIONS,
                        conversations: MOCK_CONVERSATIONS,
                        communications: storedComms ? JSON.parse(storedComms) : MOCK_COMMUNICATIONS,
                    };

                    // Fetch courses
                    // To fetch properly we'd want the first institution ID if current is not yet selected
                    // The AppProvider doesn't know the selected inst yet directly, so we'll fetch all or just rely on the first
                    // Alternatively, we use a separate effect for tenant-specific data

                    dispatch({ type: 'HYDRATE_STATE', payload: baseData });
                } catch (error) {
                    console.error("Hydration Error:", error);
                }
            };

            hydrateAppData();
        }
    }, [isAuthenticated, token, dispatch]);

    // Fetch tenant-specific data when institution changes
    useEffect(() => {
        if (isAuthenticated && token && currentInstitution) {
            const fetchTenantData = async () => {
                try {
                    const [fetchedCourses, fetchedUsers] = await Promise.all([
                        coursesApi.getAll(currentInstitution.id, token).catch(() => []),
                        usersApi.getAll(currentInstitution.id, token).catch(() => [])
                    ]);

                    if (fetchedCourses.length > 0 || fetchedUsers.length > 0) {
                        dispatch({
                            type: 'HYDRATE_STATE',
                            payload: {
                                courses: fetchedCourses.length > 0 ? fetchedCourses : state.courses,
                                students: fetchedUsers.length > 0 ? fetchedUsers.map((u: any) => ({
                                    id: u.id,
                                    institutionId: currentInstitution.id,
                                    name: u.name,
                                    email: u.email,
                                    program: 'General',
                                    status: 'active',
                                    avatar: u.avatar,
                                    attendanceRate: 100,
                                    role: u.role
                                })) as Student[] : state.students
                            }
                        });
                    }
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
