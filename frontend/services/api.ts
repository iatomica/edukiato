/**
 * API Service Layer
 * 
 * Currently uses mock data as fallback (Decision D6 from architecture plan).
 * When backend is connected, replace mock implementations with fetch calls.
 * 
 * All data-fetching functions accept tenant context where applicable,
 * preparing for real multi-tenant API calls.
 */

import { User, UserRole, UserInstitution, Course, Message, AcademicReport } from '../types';
import { MOCK_COURSES, MOCK_PAYMENTS, INST_VINCULOS, MOCK_AULAS, MOCK_NINOS, MOCK_MESSAGES } from './mockData';

// ── Config ────────────────────────────────────────────────────

const API_BASE = '/api';
const USE_MOCK = false; // Toggle to false when backend is connected

// ── Mock Data for Auth ────────────────────────────────────────

const MOCK_INSTITUTIONS: UserInstitution[] = [
    {
        institutionId: 'inst-vinculos',
        institutionName: 'Vínculos de Libertad',
        institutionSlug: 'vinculos-de-libertad',
        role: 'ADMIN_INSTITUCION',
        logoUrl: 'https://picsum.photos/seed/vinculos/200',
        primaryColor: '#0ea5e9', // Lighter blue
        secondaryColor: '#0369a1',
    }
];

interface MockUser {
    emailPattern: string;
    user: Omit<User, 'institutions'>;
    institutions: UserInstitution[];
}

const teachers = [
    'Fiorela Sotelo', 'Antonela Michelena', 'Romina Engel', 'Romina Alvarenga',
    'Stefania Bah', 'Nellida Figueroa', 'Camila Linares'
].map((name, i) => {
    const first = name.split(' ')[0].toLowerCase();
    const pattern = first === 'romina' ? `romina.${name.split(' ')[1].toLowerCase()}` : first;
    return {
        emailPattern: pattern,
        user: {
            id: `u_teach_${i}`,
            name: name,
            email: `${pattern}@vinculos.edu`,
            role: 'DOCENTE' as UserRole,
            avatar: `https://picsum.photos/seed/${pattern}/200`,
        },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'DOCENTE' as UserRole }],
    };
});

const especiales = [
    'Leonardo Videla', 'Gabriel Silva', 'Sol Duarte', 'Huerta'
].map((name, i) => {
    const pattern = name.split(' ')[0].toLowerCase();
    return {
        emailPattern: pattern,
        user: {
            id: `u_esp_${i}`,
            name: `${name} (Profesor Especial)`,
            email: `${pattern}@vinculos.edu`,
            role: 'ESPECIALES' as UserRole,
            avatar: `https://picsum.photos/seed/${pattern}esp/200`,
        },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'ESPECIALES' as UserRole }],
    };
});

const defaultMockUsers: MockUser[] = [
    // Dueñas (SUPER_ADMIN)
    {
        emailPattern: 'seila',
        user: { id: 'u_seila', name: 'Seila Ayala', email: 'seila@vinculos.edu', role: 'SUPER_ADMIN', avatar: 'https://picsum.photos/seed/seila/200' },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'SUPER_ADMIN' as UserRole }]
    },
    {
        emailPattern: 'romina.ayala',
        user: { id: 'u_rayala', name: 'Romina Ayala', email: 'romina.ayala@vinculos.edu', role: 'SUPER_ADMIN', avatar: 'https://picsum.photos/seed/rayala/200' },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'SUPER_ADMIN' as UserRole }]
    },
    // Admin / Directivos
    {
        emailPattern: 'directora',
        user: { id: 'u_dir', name: 'Directora', email: 'directora@vinculos.edu', role: 'ADMIN_INSTITUCION', avatar: 'https://picsum.photos/seed/dir/200' },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'ADMIN_INSTITUCION' as UserRole }]
    },
    {
        emailPattern: 'secretaria',
        user: { id: 'u_sec', name: 'Secretaria', email: 'secretaria@vinculos.edu', role: 'ADMIN_INSTITUCION', avatar: 'https://picsum.photos/seed/sec/200' },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'ADMIN_INSTITUCION' as UserRole }]
    },
    // Docentes (Maestras)
    ...teachers,
    // Especiales
    ...especiales,
    // Padres Tester
    {
        emailPattern: 'padre.perez',
        user: { id: 'p_perez', name: 'Familia Pérez (Padre de Martín y Emma)', email: 'padre.perez@vinculos.edu', role: 'PADRE', avatar: 'https://picsum.photos/seed/perez/200' },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'PADRE' as UserRole }]
    },
    {
        emailPattern: 'padre.gomez',
        user: { id: 'p_gomez', name: 'Familia Gómez (Padre de Lucía)', email: 'padre.gomez@vinculos.edu', role: 'PADRE', avatar: 'https://picsum.photos/seed/gomez/200' },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'PADRE' as UserRole }]
    },
    {
        emailPattern: 'padre.diaz',
        user: { id: 'p_diaz', name: 'Familia Díaz (Padre de Tomás)', email: 'padre.diaz@vinculos.edu', role: 'PADRE', avatar: 'https://picsum.photos/seed/diaz/200' },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'PADRE' as UserRole }]
    },
    // Alumno Tester
    {
        emailPattern: 'martin',
        user: { id: 's1', name: 'Martín Pérez', email: 'martin@familia.com', role: 'ESTUDIANTE', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' },
        institutions: [{ ...MOCK_INSTITUTIONS[0], role: 'ESTUDIANTE' as UserRole }]
    },
    // Unknown Test Admin fallbacks
    {
        emailPattern: '', // Default catch-all for unknown testers
        user: { id: 'a0eebc99-9c0b-4ef8-bb6d-unknown', name: 'Usuario Administrador', email: 'test@vinculos.edu', role: 'ADMIN_INSTITUCION', avatar: 'https://picsum.photos/seed/admin/200' },
        institutions: MOCK_INSTITUTIONS,
    },
];

const storedUsers = typeof window !== 'undefined' ? localStorage.getItem('MOCK_USERS') : null;
let MOCK_USERS: MockUser[] = storedUsers ? JSON.parse(storedUsers) : defaultMockUsers;

// ── Auth API ──────────────────────────────────────────────────

export const authApi = {
    login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const found = MOCK_USERS.find(u => u.user.email.toLowerCase() === email.toLowerCase())
                || MOCK_USERS.find(u => email.toLowerCase().includes(u.emailPattern))
                || MOCK_USERS[MOCK_USERS.length - 1]; // Fallback to student

            // Password validation for Institutional users
            const isInstitutional = ['SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE', 'ESPECIALES'].includes(found.user.role);
            if (isInstitutional && _password !== 'vinculos') {
                throw new Error('Credenciales inválidas');
            }

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
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: _password }),
            });

            if (!response.ok) {
                throw new Error('Fallback to mock'); // Forzamos el fallback local
            }

            const data = await response.json();
            const found = MOCK_USERS.find(u => u.user.email.toLowerCase() === email.toLowerCase())
                || MOCK_USERS.find(u => email.toLowerCase().includes(u.emailPattern))
                || MOCK_USERS[MOCK_USERS.length - 1]; // Fallback to student institutions for demo

            // Password validation for Institutional users on API success too
            const isInstitutional = ['SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE', 'ESPECIALES'].includes(found.user.role);
            if (isInstitutional && _password !== 'vinculos') {
                throw new Error('Credenciales inválidas');
            }

            const user: User = {
                id: data.user?.id || 'unknown',
                name: data.user?.full_name || data.user?.name || found.user.name,
                email: data.user?.email || email,
                role: data.user?.role || found.user.role,
                avatar: data.user?.avatar || found.user.avatar,
                institutions: found.institutions,
            };

            return {
                user,
                token: data.access_token || data.token || `mock-jwt-${user.id}-${Date.now()}`,
            };
        } catch (error: any) {
            // Si el backend real falla o no existe, usamos la validación Mock al 100%
            if (error.message === 'Credenciales inválidas') {
                throw error; // Propagar error de contraseña institucional si falló
            }

            console.warn("Falling back to MOCK login validation.", error.message);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const found = MOCK_USERS.find(u => u.user.email.toLowerCase() === email.toLowerCase())
                || MOCK_USERS.find(u => email.toLowerCase().includes(u.emailPattern));

            if (!found) {
                throw new Error('Usuario no encontrado o credenciales inválidas');
            }

            // Password validation for Institutional users
            const isInstitutional = ['SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE', 'ESPECIALES'].includes(found.user.role);
            if (isInstitutional && _password !== 'vinculos') {
                throw new Error('Credenciales inválidas');
            }

            const user: User = {
                ...found.user,
                institutions: found.institutions,
            };

            return {
                user,
                token: `mock-jwt-${user.id}-${Date.now()}`,
            };
        }
    },
};

// ── Institutions API ──────────────────────────────────────────

export const institutionsApi = {
    getAll: async (token: string): Promise<UserInstitution[]> => {
        const response = await fetch(`${API_BASE}/institutions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching institutions');
        const data = await response.json();
        // Map backend institution objects to UserInstitution type expected by frontend
        return data.map((inst: any) => ({
            institutionId: inst.id,
            institutionName: inst.name,
            institutionSlug: inst.slug,
            role: 'ADMIN_INSTITUCION', // Temporarily hardcoded until we fetch from user_institution_roles
            logoUrl: inst.logoUrl,
            primaryColor: inst.primaryColor,
            secondaryColor: inst.secondaryColor
        }));
    },
    create: async (data: Partial<UserInstitution>, token: string): Promise<UserInstitution> => {
        const response = await fetch(`${API_BASE}/institutions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.institutionName,
                slug: data.institutionName?.toLowerCase().replace(/\s+/g, '-'),
                primaryColor: data.primaryColor || '#14b8a6',
                secondaryColor: data.secondaryColor || '#0f766e',
                logoUrl: data.logoUrl
            })
        });
        if (!response.ok) throw new Error('Error creating institution');
        const inst = await response.json();
        return {
            institutionId: inst.id,
            institutionName: inst.name,
            institutionSlug: inst.slug,
            role: 'ADMIN_INSTITUCION',
            logoUrl: inst.logoUrl,
            primaryColor: inst.primaryColor,
            secondaryColor: inst.secondaryColor
        };
    }, // Changed semicolon to comma
}; // Closed institutionsApi object

// ── Users API ─────────────────────────────────────────────────

export const usersApi = {
    getAll: async (institutionId: string, token: string): Promise<User[]> => {
        try {
            const response = await fetch(`${API_BASE}/users?institutionId=${institutionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching users');
            const data = await response.json();
            if (data && data.length > 0) return data;
            return MOCK_USERS.map(m => m.user);
        } catch (error) {
            console.warn("Falling back to MOCK_USERS for users directory.");
            return MOCK_USERS.map(m => m.user);
        }
    },

    create: async (data: Partial<User>, institutionId: string, token: string): Promise<User> => {
        try {
            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    role: data.role || 'ESTUDIANTE',
                    institutionId: institutionId
                })
            });
            if (!response.ok) throw new Error('Error creating user');
            return await response.json();
        } catch (error) {
            console.warn("Mocking user creation fallback.");
            const newUser: User = {
                id: `new_user_${Date.now()}`,
                name: data.name || 'Nuevo Usuario',
                email: data.email || 'nuevo@ejemplo.com',
                role: data.role as UserRole || 'DOCENTE',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'N U')}`
            };
            MOCK_USERS.push({
                emailPattern: newUser.email,
                user: newUser,
                institutions: [{ ...MOCK_INSTITUTIONS[0], role: newUser.role }]
            });
            if (typeof window !== 'undefined') localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
            return newUser;
        }
    },

    update: async (userId: string, data: Partial<User>, token: string): Promise<User> => {
        try {
            const response = await fetch(`${API_BASE}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error updating user');
            return await response.json();
        } catch (error) {
            console.warn("Mocking user update fallback.");
            const mockIndex = MOCK_USERS.findIndex(m => m.user.id === userId);
            if (mockIndex >= 0) {
                MOCK_USERS[mockIndex].user = { ...MOCK_USERS[mockIndex].user, ...data };
                if (data.role) {
                    MOCK_USERS[mockIndex].institutions[0].role = data.role;
                }
                if (typeof window !== 'undefined') localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
                return MOCK_USERS[mockIndex].user;
            }
            throw new Error("Usuario no encontrado en los datos de prueba");
        }
    },

    resetPassword: async (userId: string, token: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE}/users/${userId}/reset-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error resetting password');
            return await response.json();
        } catch (error) {
            console.warn("Mocking password reset fallback.");
            const user = MOCK_USERS.find(m => m.user.id === userId);
            if (!user) throw new Error("Usuario no encontrado");
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                success: true,
                message: `Se ha enviado un correo de recuperación a ${user.user.email}`
            };
        }
    }
};

// ── Courses API ───────────────────────────────────────────────

export const coursesApi = {
    getAll: async (institutionId: string, token: string): Promise<Course[]> => {
        const response = await fetch(`${API_BASE}/courses?institutionId=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching courses');
        const data = await response.json();
        return data.map((c: any) => ({
            id: c.id,
            institutionId: c.institutionId || institutionId,
            courseType: c.courseType || 'REGULAR',
            title: c.title,
            instructor: c.instructor?.name || c.instructor || 'TBD',
            schedule: c.schedule || 'TBD',
            enrolled: c.enrolledCount || 0,
            capacity: c.capacity || 15,
            image: c.image || 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&q=80&w=800',
            tags: c.tags || [],
            nextSession: c.nextSession?.date || 'TBD',
            description: c.description
        }));
    },

    create: async (data: Partial<Course>, token: string): Promise<Course> => {
        const response = await fetch(`${API_BASE}/courses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error creating course');
        const c = await response.json();
        return {
            id: c.id,
            institutionId: c.institutionId || data.institutionId,
            courseType: c.courseType || 'REGULAR',
            title: c.title,
            instructor: c.instructor?.name || c.instructor || 'TBD',
            schedule: c.schedule || 'TBD',
            enrolled: c.enrolledCount || 0,
            capacity: c.capacity || 15,
            image: c.image || 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&q=80&w=800',
            tags: c.tags || [],
            nextSession: c.nextSession?.date || 'TBD',
            description: c.description
        };
    }
};

// ── Messages API ──────────────────────────────────────────────

export const messagesApi = {
    getMessages: async (userId: string, targetUserId: string, token: string): Promise<Message[]> => {
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 300));

        // Enforce the same key regardless of who is sender/receiver
        const chatId = [userId, targetUserId].sort().join('|');
        return MOCK_MESSAGES[chatId] || [];
    },

    sendMessage: async (senderId: string, recipientId: string, content: string, token: string, file?: Message['file']): Promise<Message> => {
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 300));

        const chatId = [senderId, recipientId].sort().join('|');

        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId,
            content,
            timestamp: new Date(),
            isRead: false,
            ...(file && { file })
        };

        if (!MOCK_MESSAGES[chatId]) {
            MOCK_MESSAGES[chatId] = [];
        }

        MOCK_MESSAGES[chatId].push(newMessage);
        if (typeof window !== 'undefined') localStorage.setItem('MOCK_MESSAGES', JSON.stringify(MOCK_MESSAGES));
        return newMessage;
    },

    getConversations: async (userId: string, token: string): Promise<{ contactId: string, lastMessage: Message }[]> => {
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 300));

        const conversations: { contactId: string, lastMessage: Message }[] = [];

        for (const [chatId, messages] of Object.entries(MOCK_MESSAGES)) {
            if (chatId.includes(userId) && messages.length > 0) {
                // chatId format is "id1|id2", get the other id
                const ids = chatId.split('|');
                const contactId = ids[0] === userId ? ids[1] : ids[0];
                const lastMessage = messages[messages.length - 1];
                conversations.push({ contactId, lastMessage });
            }
        }

        // Sort by most recent message
        return conversations.sort((a, b) =>
            new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
        );
    }
};

// ── Reports API ───────────────────────────────────────────────

const storedReports = typeof window !== 'undefined' ? localStorage.getItem('MOCK_REPORTS') : null;
let MOCK_REPORTS: AcademicReport[] = storedReports ? JSON.parse(storedReports) : [];

export const reportsApi = {
    create: async (studentId: string, title: string, content: string, token: string): Promise<{ message: string, report: AcademicReport }> => {
        try {
            const response = await fetch(`${API_BASE}/reports/student/${studentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error creando informe');
            }
            return response.json();
        } catch (error: any) {
            console.warn('Backend unavailable, using mock data for reports...', error.message);
            // Fallback to Mock / LocalStorage
            let uploaderId = 'u_dir'; // default fallback
            try {
                const parts = token.split('-');
                if (parts.length > 2) uploaderId = parts[2];
            } catch (e) { }

            const newReport: AcademicReport = {
                id: `mock-report-${Date.now()}`,
                studentId,
                uploaderId,
                title,
                content,
                createdAt: new Date().toISOString()
            };
            MOCK_REPORTS.push(newReport);
            if (typeof window !== 'undefined') {
                localStorage.setItem('MOCK_REPORTS', JSON.stringify(MOCK_REPORTS));
            }
            return { message: 'Informe guardado (Mock)', report: newReport };
        }
    },
    getByStudent: async (studentId: string, token: string): Promise<AcademicReport[]> => {
        try {
            const response = await fetch(`${API_BASE}/reports/student/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error al cargar informes');
            return response.json();
        } catch (error: any) {
            console.warn('Backend unavailable, using mock reports...', error.message);
            return MOCK_REPORTS
                .filter(r => r.studentId === studentId)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }
};
