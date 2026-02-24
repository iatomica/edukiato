import React, { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';
import {
    PermissionAction,
    PermissionResource,
    PermissionRule,
    PermissionOverride,
    UserRole,
    resolveRolePermissions,
} from '../types';
import { useAuth } from './AuthContext';

// ── Context Type ──────────────────────────────────────────────

interface PermissionsContextType {
    /** Check a single permission */
    can: (action: PermissionAction, resource: PermissionResource) => boolean;
    /** True if ANY of the checks pass */
    canAny: (checks: Array<{ action: PermissionAction; resource: PermissionResource }>) => boolean;
    /** True only if ALL checks pass */
    canAll: (checks: Array<{ action: PermissionAction; resource: PermissionResource }>) => boolean;
    /** Current active role */
    role: UserRole | null;
    /** Full resolved permission list (for debugging / admin panels) */
    getEffectivePermissions: () => PermissionRule[];
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// ── Core Permission Check ────────────────────────────────────

function matchesRule(
    rules: PermissionRule[],
    action: PermissionAction,
    resource: PermissionResource
): boolean {
    return rules.some(rule => {
        if (rule.resource !== resource) return false;

        // 'manage' in the rule grants every action on that resource
        if (rule.action === 'manage') return true;
        // Requesting 'manage' but rule is specific → no match
        if (action === 'manage') return false;

        if (Array.isArray(rule.action)) {
            return rule.action.includes(action);
        }
        return rule.action === action;
    });
}

// ── Effective Permissions (hierarchy + overrides) ─────────────

function buildEffectivePermissions(
    role: UserRole,
    overrides?: PermissionOverride[]
): PermissionRule[] {
    // 1. Walk the hierarchy to collect inherited + own permissions
    const baseRules = resolveRolePermissions(role);

    if (!overrides || overrides.length === 0) return baseRules;

    // 2. Apply institution-level grants
    const roleOverrides = overrides.filter(o => o.role === role);
    const granted: PermissionRule[] = [];
    roleOverrides.forEach(o => {
        if (o.grant) granted.push(...o.grant);
    });

    // 3. Combine base + granted
    const combined = [...baseRules, ...granted];

    // 4. Build deny set for fast lookup
    const denySet = new Set<string>();
    roleOverrides.forEach(o => {
        if (o.deny) {
            o.deny.forEach(d => {
                const actions = Array.isArray(d.action) ? d.action : [d.action];
                actions.forEach(a => denySet.add(`${a}:${d.resource}`));
            });
        }
    });

    if (denySet.size === 0) return combined;

    // 5. Filter out denied permissions
    return combined.filter(rule => {
        const actions = Array.isArray(rule.action) ? rule.action : [rule.action];
        // Keep the rule only if NONE of its actions are denied
        return !actions.some(a => denySet.has(`${a}:${rule.resource}`));
    });
}

// ── Provider ──────────────────────────────────────────────────

export const PermissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, currentInstitution } = useAuth();
    const role = user?.role ?? null;
    const overrides = currentInstitution?.permissionOverrides;

    // Build the full effective permission set once per role/institution change
    const effectivePermissions = useMemo(() => {
        if (!role) return [];
        return buildEffectivePermissions(role, overrides);
    }, [role, overrides]);

    const can = useCallback((action: PermissionAction, resource: PermissionResource): boolean => {
        return matchesRule(effectivePermissions, action, resource);
    }, [effectivePermissions]);

    const canAny = useCallback((checks: Array<{ action: PermissionAction; resource: PermissionResource }>): boolean => {
        return checks.some(check => matchesRule(effectivePermissions, check.action, check.resource));
    }, [effectivePermissions]);

    const canAll = useCallback((checks: Array<{ action: PermissionAction; resource: PermissionResource }>): boolean => {
        return checks.every(check => matchesRule(effectivePermissions, check.action, check.resource));
    }, [effectivePermissions]);

    const getEffectivePermissions = useCallback(() => effectivePermissions, [effectivePermissions]);

    const value = useMemo(() => ({
        can,
        canAny,
        canAll,
        role,
        getEffectivePermissions,
    }), [can, canAny, canAll, role, getEffectivePermissions]);

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
};

// ── Hook ──────────────────────────────────────────────────────

export const usePermissions = () => {
    const context = useContext(PermissionsContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionsProvider');
    }
    return context;
};

// ── PermissionGate Component ─────────────────────────────────
// Declarative permission-gated rendering:
//
//   <PermissionGate action="manage" resource="financial">
//     <FinancialsLink />
//   </PermissionGate>

interface PermissionGateProps {
    action: PermissionAction;
    resource: PermissionResource;
    fallback?: ReactNode;
    children: ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
    action,
    resource,
    fallback = null,
    children,
}) => {
    const { can } = usePermissions();
    return <>{can(action, resource) ? children : fallback}</>;
};
