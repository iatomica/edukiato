/**
 * useTenantData — Institution-Scoped Data Access
 *
 * Reads from AppStateContext (centralized state) and filters
 * by the active institution. This is the ONLY hook components
 * should use to access entity data.
 */

import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';

export function useTenantData() {
    const { currentInstitution } = useAuth();
    const { state, dispatch, emitEvent } = useAppState();
    const institutionId = currentInstitution?.id ?? null;

    const courses = useMemo(
        () => (institutionId ? state.courses.filter(c => c.institutionId === institutionId) : []),
        [institutionId, state.courses]
    );

    const students = useMemo(
        () => (institutionId ? state.students.filter(s => s.institutionId === institutionId) : []),
        [institutionId, state.students]
    );

    const events = useMemo(
        () => (institutionId ? state.events.filter(e => e.institutionId === institutionId) : []),
        [institutionId, state.events]
    );

    const feed = useMemo(
        () => (institutionId ? state.feed.filter(f => f.institutionId === institutionId) : []),
        [institutionId, state.feed]
    );

    const notifications = useMemo(
        () => (institutionId ? state.notifications.filter(n => n.institutionId === institutionId) : []),
        [institutionId, state.notifications]
    );

    const conversations = useMemo(
        () => (institutionId ? state.conversations.filter(c => c.institutionId === institutionId) : []),
        [institutionId, state.conversations]
    );

    const communications = useMemo(
        () => (institutionId ? state.communications.filter(c => c.institutionId === institutionId) : []),
        [institutionId, state.communications]
    );

    const payments = useMemo(
        () => (institutionId ? state.payments.filter(p => p.institutionId === institutionId) : []),
        [institutionId, state.payments]
    );

    const activityLog = useMemo(
        () => state.activityLog.slice(0, 20),
        [state.activityLog]
    );

    // Revenue data computed from live payments
    const revenueData = useMemo(() => {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        return months.map((name, i) => {
            const monthPayments = payments.filter(p => {
                const d = new Date(p.paidDate || p.dueDate);
                return d.getMonth() === i && p.status === 'PAID';
            });
            return { name, value: monthPayments.reduce((sum, p) => sum + p.amount, 0) };
        });
    }, [payments]);

    // Attendance data computed from students
    const attendanceData = useMemo(() => {
        if (students.length === 0) return [];

        // Categories based on attendance rate
        const presentCount = students.filter(s => s.attendanceRate >= 90).length;
        const lateCount = students.filter(s => s.attendanceRate >= 80 && s.attendanceRate < 90).length;
        const absentCount = students.filter(s => s.attendanceRate < 80).length;

        return [
            { name: 'Presente', value: presentCount, fill: '#10b981' }, // Green
            { name: 'Tarde', value: lateCount, fill: '#f59e0b' },     // Orange
            { name: 'Ausente', value: absentCount, fill: '#f43f5e' }, // Red
        ];
    }, [students]);

    return {
        institutionId,
        courses,
        students,
        events,
        feed,
        notifications,
        conversations,
        payments,
        activityLog,
        revenueData,
        attendanceData,
        dispatch,
        emitEvent,
        communications,
    };
}
