import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { InstitutionTheme } from '../types';
import { useAuth } from './AuthContext';

// ── Defaults ──────────────────────────────────────────────────

const DEFAULT_THEME: InstitutionTheme = {
    institutionName: 'Edukatio',
    logoUrl: undefined,
    primaryColor: '#14b8a6',
    secondaryColor: '#0f766e',
};

// ── Context Type ──────────────────────────────────────────────

interface ThemeContextType {
    theme: InstitutionTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentInstitution } = useAuth();

    const theme: InstitutionTheme = useMemo(() => {
        if (!currentInstitution) return DEFAULT_THEME;
        return {
            institutionName: currentInstitution.name,
            logoUrl: currentInstitution.logoUrl,
            primaryColor: currentInstitution.primaryColor,
            secondaryColor: currentInstitution.secondaryColor,
        };
    }, [currentInstitution]);

    // Helper to convert Hex to HSL
    const hexToHSL = (H: string) => {
        let r = 0, g = 0, b = 0;
        if (H.length === 4) {
            r = parseInt("0x" + H[1] + H[1]);
            g = parseInt("0x" + H[2] + H[2]);
            b = parseInt("0x" + H[3] + H[3]);
        } else if (H.length === 7) {
            r = parseInt("0x" + H[1] + H[2]);
            g = parseInt("0x" + H[3] + H[4]);
            b = parseInt("0x" + H[5] + H[6]);
        }
        r /= 255; g /= 255; b /= 255;
        const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
        let h = 0, s = 0, l = 0;

        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);
        if (h < 0) h += 360;
        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        return { h, s, l };
    };

    // Inject CSS custom properties for dynamic theming
    useEffect(() => {
        const root = document.documentElement;

        const primary = hexToHSL(theme.primaryColor);
        root.style.setProperty('--primary-h', `${primary.h}`);
        root.style.setProperty('--primary-s', `${primary.s}%`);
        root.style.setProperty('--primary-l', `${primary.l}%`);

        const secondary = hexToHSL(theme.secondaryColor);
        root.style.setProperty('--secondary-h', `${secondary.h}`);
        root.style.setProperty('--secondary-s', `${secondary.s}%`);
        root.style.setProperty('--secondary-l', `${secondary.l}%`);

        // Legacy support if anything still uses these
        root.style.setProperty('--color-primary', theme.primaryColor);
        root.style.setProperty('--color-secondary', theme.secondaryColor);
    }, [theme]);

    const value = useMemo(() => ({ theme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// ── Hook ──────────────────────────────────────────────────────

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
