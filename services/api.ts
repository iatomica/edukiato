/**
 * API Service Layer
 * 
 * Currently uses mock data as fallback (Decision D6 from architecture plan).
 * When backend is connected, replace mock implementations with fetch calls.
 * 
 * All data-fetching functions accept tenant context where applicable,
 * preparing for real multi-tenant API calls.
 */

import { User, UserRole, UserInstitution } from '../types';

// ── Config ────────────────────────────────────────────────────

const API_BASE = '/api';
const USE_MOCK = true; // Toggle to false when backend is connected

// ── Mock Data for Auth ────────────────────────────────────────

const MOCK_INSTITUTIONS: UserInstitution[] = [
    {
        institutionId: 'inst-001',
        institutionName: 'Instituto de Arte Contemporáneo',
        institutionSlug: 'arte-contemporaneo',
        role: 'ADMIN_INSTITUCION',
        logoUrl: 'https://picsum.photos/seed/inst1/200',
        primaryColor: '#7c3aed', // Violet
        secondaryColor: '#5b21b6',
    },
    {
        institutionId: 'inst-002',
        institutionName: 'Escuela de Música Moderna',
        institutionSlug: 'musica-moderna',
        role: 'DOCENTE',
        logoUrl: 'https://picsum.photos/seed/inst2/200',
        primaryColor: '#059669', // Emerald
        secondaryColor: '#065f46',
    },
];

interface MockUser {
    emailPattern: string;
    user: Omit<User, 'institutions'>;
    institutions: UserInstitution[];
}

const MOCK_USERS: MockUser[] = [
    {
        emailPattern: 'admin',
        user: {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            name: 'Alex Rivera',
            email: 'admin@edukiato.edu',
            role: 'ADMIN_INSTITUCION',
            avatar: 'https://picsum.photos/seed/alex/200',
        },
        institutions: MOCK_INSTITUTIONS,
    },
    {
        emailPattern: 'elena',
        user: {
            id: 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11',
            name: 'Elena Fisher',
            email: 'elena@edukiato.edu',
            role: 'DOCENTE',
            avatar: 'https://picsum.photos/seed/elena/200',
        },
        institutions: [
            {
                institutionId: 'inst-001',
                institutionName: 'Instituto de Arte Contemporáneo',
                institutionSlug: 'arte-contemporaneo',
                role: 'DOCENTE',
                logoUrl: 'https://picsum.photos/seed/inst1/200',
                primaryColor: '#7c3aed', // Violet
                secondaryColor: '#5b21b6',
            },
        ],
    },
    {
        emailPattern: '', // Default catch-all for students
        user: {
            id: 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11',
            name: 'Sofía Chen',
            email: 'sofia@student.com',
            role: 'ESTUDIANTE',
            avatar: 'https://picsum.photos/seed/sofia/200',
        },
        institutions: [
            {
                institutionId: 'inst-001',
                institutionName: 'Instituto de Arte Contemporáneo',
                institutionSlug: 'arte-contemporaneo',
                role: 'ESTUDIANTE',
                logoUrl: 'https://picsum.photos/seed/inst1/200',
                primaryColor: '#7c3aed', // Violet
                secondaryColor: '#5b21b6',
            },
        ],
    },
];

// ── Auth API ──────────────────────────────────────────────────

export const authApi = {
    login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const found = MOCK_USERS.find(u => email.toLowerCase().includes(u.emailPattern))
                || MOCK_USERS[MOCK_USERS.length - 1]; // Fallback to student

            const user: User = {
                ...found.user,
                institutions: found.institutions,
            };

            return {
                user,
                token: `mock-jwt-${user.id}-${Date.now()}`,
            };
        }

        // Real API call (future)
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: _password }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error de autenticación');
        }

        return response.json();
    },
};
