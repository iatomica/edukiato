import { authApi } from '@/services/api';
import { User, Institution, UserInstitution, AuthState } from '@/types';
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ── Context Type ──────────────────────────────────────────────

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (newData: Partial<User>) => void;
    completePasswordChange: (newPassword: string) => Promise<void>;
    selectInstitution: (institution: UserInstitution) => void;
    clearInstitution: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hydrate from backend via token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('edukatio_token');
        const storedInstitution = localStorage.getItem('edukatio_institution');

        if (storedToken) {
            setToken(storedToken);
            if (storedInstitution) {
                try {
                    setCurrentInstitution(JSON.parse(storedInstitution));
                } catch (e) { }
            }

            authApi.getMe(storedToken).then(u => {
                setUser(u);
            }).catch((e) => {
                console.warn("Sessión expirada", e);
                localStorage.removeItem('edukatio_token');
                localStorage.removeItem('edukatio_institution');
                setToken(null);
                setUser(null);
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authApi.login(email, password);
            setUser(result.user);
            setToken(result.token);
            localStorage.setItem('edukatio_token', result.token);
        } catch (err: any) {
            setError(err.message || 'Error de autenticación');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setCurrentInstitution(null);
        localStorage.removeItem('edukatio_token');
        localStorage.removeItem('edukatio_institution');
    }, []);

    const updateUser = useCallback((newData: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            return { ...prev, ...newData };
        });
    }, []);

    const completePasswordChange = useCallback(async (newPassword: string) => {
        if (!user) throw new Error("No hay usuario autenticado.");
        setIsLoading(true);
        setError(null);
        try {
            await authApi.setInitialPassword(user.id, newPassword);
            updateUser({ requiresPasswordChange: false });
        } catch (err: any) {
            setError(err.message || 'Error al cambiar la contraseña');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [user, updateUser]);

    const selectInstitution = useCallback((inst: UserInstitution) => {
        const institution: Institution = {
            id: inst.institutionId,
            name: inst.institutionName,
            slug: inst.institutionSlug,
            logoUrl: inst.logoUrl,
            primaryColor: inst.primaryColor || '#14b8a6',
            secondaryColor: inst.secondaryColor || '#0f766e',
            plan: 'PRO',
            isActive: true,
            permissionOverrides: (inst as any).permissionOverrides,
        };

        // Update user's active role based on selected institution
        setUser(prev => prev ? { ...prev, role: inst.role } : null);
        setCurrentInstitution(institution);
        localStorage.setItem('edukatio_institution', JSON.stringify(institution));
    }, []);

    const clearInstitution = useCallback(() => {
        setCurrentInstitution(null);
        localStorage.removeItem('edukatio_institution');
    }, []);

    const value: AuthContextType = {
        user,
        token,
        currentInstitution,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        login,
        logout,
        updateUser,
        completePasswordChange,
        selectInstitution,
        clearInstitution,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ── Hook ──────────────────────────────────────────────────────

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
