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

        case 'UPDATE_STUDENT':
            return {
                ...state,
                students: state.students.map(s =>
                    s.id === action.payload.id ? { ...s, ...action.payload } : s
                ),
            };

        case 'ADD_EVENT':
            return { ...state, events: [...state.events, action.payload] };

        case 'UPDATE_EVENT':
            return {
                ...state,
                events: state.events.map(e =>
                    e.id === action.payload.id ? { ...e, ...action.payload } as CalendarEvent : e
                ),
            };

        case 'DELETE_EVENT':
            return {
                ...state,
                events: state.events.filter(e => e.id !== action.payload.id),
            };

        case 'REMOVE_EVENTS_FOR_COURSE':
            return {
                ...state,
                events: state.events.filter(e => !e.title.includes(action.payload.courseTitle)),
            };

        case 'ADD_FEED_ITEM':
            return { ...state, feed: [action.payload, ...state.feed] };

        case 'ADD_PAYMENT':
            return { ...state, payments: [action.payload, ...state.payments] };

        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [action.payload, ...state.notifications] };

        case 'ADD_CONVERSATION':
            return { ...state, conversations: [...state.conversations, action.payload] };

        case 'ADD_COMMUNICATION':
            return { ...state, communications: [action.payload, ...state.communications] };

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
                    // Start with mock data base (since we haven't implemented all backend APIs yet)
                    let baseData: Partial<AppState> = {
                        courses: MOCK_COURSES,
                        aulas: MOCK_AULAS,
                        ninos: MOCK_NINOS,
                        students: MOCK_STUDENTS,
                        events: MOCK_EVENTS,
                        feed: MOCK_FEED,
                        payments: MOCK_PAYMENTS,
                        notifications: MOCK_NOTIFICATIONS,
                        conversations: MOCK_CONVERSATIONS,
                        communications: MOCK_COMMUNICATIONS,
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
