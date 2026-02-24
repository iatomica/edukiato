/**
 * Course Type Config Registry — Data-Driven Strategy Pattern
 *
 * Each course type is fully described by a CourseTypeConfig object.
 * Components and handlers use getCourseTypeConfig() to resolve the
 * effective config for any course (base + per-course overrides).
 *
 * To add a new type: add an entry here. No if/else needed anywhere.
 */

import type { CourseType, CourseTypeConfig, Course } from '../types';

// ── Built-in Type Definitions ────────────────────────────────

const REGULAR: CourseTypeConfig = {
    id: 'REGULAR',
    label: { es: 'Curso Regular', en: 'Regular Course' },
    icon: '📚',
    color: 'indigo',
    attendance: { mode: 'MANDATORY', minRate: 70 },
    evaluation: { mode: 'GRADES', hasGrades: true, hasProject: false },
    schedule: { mode: 'RECURRENT', recurrent: true },
    certificate: { autoGenerate: false, manualAllowed: true },
};

const WORKSHOP: CourseTypeConfig = {
    id: 'WORKSHOP',
    label: { es: 'Taller Práctico', en: 'Workshop' },
    icon: '🔧',
    color: 'amber',
    attendance: { mode: 'FLEXIBLE', minRate: null },
    evaluation: { mode: 'PROJECT', hasGrades: false, hasProject: true },
    schedule: { mode: 'FIXED', recurrent: false },
    certificate: { autoGenerate: false, manualAllowed: true },
};

const SEMINAR: CourseTypeConfig = {
    id: 'SEMINAR',
    label: { es: 'Seminario', en: 'Seminar' },
    icon: '🎤',
    color: 'emerald',
    attendance: { mode: 'NONE', minRate: null },
    evaluation: { mode: 'NONE', hasGrades: false, hasProject: false },
    schedule: { mode: 'SINGLE', recurrent: false },
    certificate: { autoGenerate: true, manualAllowed: false },
};

// ── Registry ────────────────────────────────────────────────

export const COURSE_TYPE_REGISTRY: Record<CourseType, CourseTypeConfig> = {
    REGULAR,
    WORKSHOP,
    SEMINAR,
};

/** All available course types as an array (for <select> dropdowns, etc.) */
export const COURSE_TYPES: CourseTypeConfig[] = Object.values(COURSE_TYPE_REGISTRY);

// ── Resolution ──────────────────────────────────────────────

/**
 * Resolve the effective config for a course by merging the base type
 * config with any per-course overrides.
 */
export function getCourseTypeConfig(course: Course): CourseTypeConfig {
    const base = COURSE_TYPE_REGISTRY[course.courseType] ?? REGULAR;
    if (!course.typeConfigOverrides) return base;

    return {
        ...base,
        attendance: { ...base.attendance, ...course.typeConfigOverrides.attendance },
        evaluation: { ...base.evaluation, ...course.typeConfigOverrides.evaluation },
        schedule: { ...base.schedule, ...course.typeConfigOverrides.schedule },
        certificate: { ...base.certificate, ...course.typeConfigOverrides.certificate },
    };
}

// ── Validation ──────────────────────────────────────────────

export interface CourseValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Validate a course against the rules defined by its type config.
 * Returns validation errors (empty array = valid).
 */
export function validateCourseByType(course: Course): CourseValidationResult {
    const config = getCourseTypeConfig(course);
    const errors: string[] = [];

    // Schedule validation
    if (config.schedule.mode === 'SINGLE' && !course.schedule) {
        errors.push('Seminars require a date/time for the event.');
    }

    // Capacity validation — seminars typically have no hard cap, but if set, enforce
    if (course.capacity < 1) {
        errors.push('Capacity must be at least 1.');
    }

    // Attendance validation
    if (config.attendance.mode === 'MANDATORY' && config.attendance.minRate !== null) {
        if (config.attendance.minRate < 0 || config.attendance.minRate > 100) {
            errors.push('Minimum attendance rate must be between 0 and 100.');
        }
    }

    return { valid: errors.length === 0, errors };
}

// ── Calendar Mapping ────────────────────────────────────────

/** Map a CourseType to the CalendarEvent 'type' field */
export function courseTypeToCalendarType(courseType: CourseType): 'class' | 'workshop' | 'event' {
    switch (courseType) {
        case 'WORKSHOP': return 'workshop';
        case 'SEMINAR': return 'event';
        default: return 'class';
    }
}

/** Map a CourseType to a calendar event color class */
export function courseTypeToCalendarColor(courseType: CourseType): string {
    switch (courseType) {
        case 'WORKSHOP': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'SEMINAR': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        default: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    }
}
