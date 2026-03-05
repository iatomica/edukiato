import { AnimatedAvatar } from '@/components/AnimatedAvatar';
import { UserRole } from '@/types';
import React from 'react';

interface UserAvatarProps {
    name: string;
    role?: UserRole | string;
    className?: string; // Custom sizing classes
    fallbackAvatarUrl?: string; // In case we want to force img in future
}

// Deterministic gender assignment based on name length or specific char for students
const determineGender = (name: string): 'MASCULINO' | 'FEMENINO' => {
    if (!name) return 'MASCULINO';
    // Rough heuristic: names ending in 'a' or first vowel is 'a' slightly skew female, 
    // but a deterministic string code is safer to avoid changing mid-session.
    let charSum = 0;
    for (let i = 0; i < name.length; i++) {
        charSum += name.charCodeAt(i);
    }
    return charSum % 2 === 0 ? 'FEMENINO' : 'MASCULINO';
};

// Exract "Ricardo Gregorio" -> "RG"
const getInitials = (name: string): string => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, role, className = "w-10 h-10" }) => {
    // If it's a student (or a generic child without a specific system role like Niño), show cartoon
    const isChild = role === 'ESTUDIANTE' || role === 'NINO' || role === 'STUDENT' || !role;

    if (isChild) {
        const gender = determineGender(name);
        return <AnimatedAvatar gender={gender} className={`rounded-full shadow-sm ring-1 ring-white/50 ${className}`} />;
    }

    // Otherwise, for Adults (Teachers, Admins, Parents), show Initials
    const initials = getInitials(name);

    // Fallback pastel colors based on initials to make them look distinct
    const colors = [
        'bg-blue-100 text-blue-700 border-blue-200',
        'bg-emerald-100 text-emerald-700 border-emerald-200',
        'bg-violet-100 text-violet-700 border-violet-200',
        'bg-rose-100 text-rose-700 border-rose-200',
        'bg-amber-100 text-amber-700 border-amber-200',
        'bg-cyan-100 text-cyan-700 border-cyan-200',
    ];

    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
    const colorClass = colors[colorIndex];

    return (
        <div
            className={`flex items-center justify-center font-bold tracking-tight rounded-full border shadow-sm ${colorClass} ${className}`}
            title={name}
        >
            <span style={{ fontSize: '70%' }} className="leading-none">{initials}</span>
        </div>
    );
};
