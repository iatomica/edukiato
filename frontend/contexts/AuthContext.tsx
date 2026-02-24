import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Institution, UserInstitution, AuthState } from '../types';
import { authApi } from '../services/api';

// ── Context Type ──────────────────────────────────────────────

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
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

    // Hydrate from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('edukatio_token');
        const storedUser = localStorage.getItem('edukatio_user');
        const storedInstitution = localStorage.getItem('edukatio_institution');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                if (storedInstitution) {
                    setCurrentInstitution(JSON.parse(storedInstitution));
                }
            } catch (e) {
                console.error('Failed to hydrate auth state', e);
                localStorage.removeItem('edukatio_token');
                localStorage.removeItem('edukatio_user');
                localStorage.removeItem('edukatio_institution');
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authApi.login(email, password);
            setUser(result.user);
            setToken(result.token);
            localStorage.setItem('edukatio_token', result.token);
            localStorage.setItem('edukatio_user', JSON.stringify(result.user));
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
        localStorage.removeItem('edukatio_user');
        localStorage.removeItem('edukatio_institution');
    }, []);

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
