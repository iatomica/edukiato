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
    Payment, Notification, Conversation, OnboardingProgress,
} from '../types';
import {
    MOCK_COURSES, MOCK_STUDENTS, MOCK_EVENTS, MOCK_FEED,
    MOCK_PAYMENTS, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS,
} from '../services/mockData';
import { AppEvent, eventBus } from '../services/eventBus';
import { registerEventHandlers } from '../services/eventHandlers';

// ── State Shape ──────────────────────────────────────────────

export interface AppState {
    courses: Course[];
    students: Student[];
    events: CalendarEvent[];
    feed: FeedItem[];
    payments: Payment[];
    notifications: Notification[];
    conversations: Conversation[];
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
    | { type: 'ADD_COURSE'; payload: Course }
    | { type: 'UPDATE_COURSE'; payload: Course }
    | { type: 'SUSPEND_COURSE'; payload: { courseId: string } }
    | { type: 'ADD_STUDENT'; payload: Student }
    | { type: 'UPDATE_STUDENT'; payload: Partial<Student> & { id: string } }
    | { type: 'ADD_EVENT'; payload: CalendarEvent }
    | { type: 'REMOVE_EVENTS_FOR_COURSE'; payload: { courseTitle: string } }
    | { type: 'ADD_FEED_ITEM'; payload: FeedItem }
    | { type: 'ADD_PAYMENT'; payload: Payment }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'ADD_CONVERSATION'; payload: Conversation }
    | { type: 'UPDATE_CONVERSATION'; payload: Partial<Conversation> & { id: string } }
    | { type: 'LOG_ACTIVITY'; payload: ActivityEntry }
    | { type: 'ENROLL_STUDENT'; payload: { courseId: string; studentId: string } }
    | { type: 'COMPLETE_ONBOARDING_STEP'; payload: string }
    | { type: 'DISMISS_ONBOARDING' };

// ── Reducer ──────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
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
    courses: MOCK_COURSES,
    students: MOCK_STUDENTS,
    events: MOCK_EVENTS,
    feed: MOCK_FEED,
    payments: MOCK_PAYMENTS,
    notifications: MOCK_NOTIFICATIONS,
    conversations: MOCK_CONVERSATIONS,
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
