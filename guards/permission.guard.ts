/**
 * Permission Guard — Backend Middleware Pattern
 *
 * Ready to use when the NestJS backend is connected.
 * This file defines reusable guard factories for route-level
 * permission enforcement.
 *
 * Usage (NestJS):
 *   @UseGuards(AuthGuard, PermissionGuard('manage', 'financial'))
 *   @Get('payments')
 *   async listPayments() { ... }
 *
 * Usage (Express middleware):
 *   app.get('/api/payments',
 *     authMiddleware,
 *     requirePermission('manage', 'financial'),
 *     paymentController.list
 *   );
 */

import {
    PermissionAction,
    PermissionResource,
    UserRole,
    resolveRolePermissions,
    PermissionOverride,
} from '../types';

// ── Core Check (shared between NestJS and Express) ───────────

export function hasPermission(
    role: UserRole,
    action: PermissionAction,
    resource: PermissionResource,
    overrides?: PermissionOverride[]
): boolean {
    let rules = resolveRolePermissions(role);

    // Apply institution-level overrides if provided
    if (overrides && overrides.length > 0) {
        const roleOverrides = overrides.filter(o => o.role === role);

        // Add grants
        roleOverrides.forEach(o => {
            if (o.grant) rules = [...rules, ...o.grant];
        });

        // Build deny set
        const denySet = new Set<string>();
        roleOverrides.forEach(o => {
            if (o.deny) {
                o.deny.forEach(d => {
                    const actions = Array.isArray(d.action) ? d.action : [d.action];
                    actions.forEach(a => denySet.add(`${a}:${d.resource}`));
                });
            }
        });

        // Check deny
        if (denySet.has(`${action}:${resource}`)) return false;
    }

    return rules.some(rule => {
        if (rule.resource !== resource) return false;
        if (rule.action === 'manage') return true;
        if (action === 'manage') return false;
        if (Array.isArray(rule.action)) return rule.action.includes(action);
        return rule.action === action;
    });
}

// ── NestJS Guard Factory ─────────────────────────────────────
// Uncomment when NestJS is connected:
//
// import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
//
// export const PERMISSION_KEY = 'required_permission';
//
// export const RequirePermission = (action: PermissionAction, resource: PermissionResource) =>
//   SetMetadata(PERMISSION_KEY, { action, resource });
//
// @Injectable()
// export class PermissionGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//
//   canActivate(context: ExecutionContext): boolean {
//     const required = this.reflector.get<{ action: PermissionAction; resource: PermissionResource }>(
//       PERMISSION_KEY, context.getHandler()
//     );
//     if (!required) return true;
//
//     const request = context.switchToHttp().getRequest();
//     const user = request.user; // Set by AuthGuard
//     const institutionOverrides = request.institution?.permissionOverrides;
//
//     return hasPermission(user.role, required.action, required.resource, institutionOverrides);
//   }
// }

// ── Express Middleware Factory ────────────────────────────────
// Uncomment when Express/standalone backend is used:
//
// export function requirePermission(action: PermissionAction, resource: PermissionResource) {
//   return (req: any, res: any, next: any) => {
//     const role = req.user?.role;
//     const overrides = req.institution?.permissionOverrides;
//
//     if (!role || !hasPermission(role, action, resource, overrides)) {
//       return res.status(403).json({
//         error: 'Forbidden',
//         message: `Missing permission: ${action} on ${resource}`,
//       });
//     }
//     next();
//   };
// }

// ── Tenant Scoping Middleware ─────────────────────────────────
// Ensures all queries are scoped to the user's active institution.
// Uncomment when backend is connected:
//
// export function requireInstitutionScope() {
//   return (req: any, res: any, next: any) => {
//     const institutionId = req.headers['x-institution-id'];
//     if (!institutionId) {
//       return res.status(400).json({
//         error: 'Bad Request',
//         message: 'x-institution-id header is required',
//       });
//     }
//
//     // Verify user belongs to this institution
//     const userInstitutions = req.user?.institutions || [];
//     const membership = userInstitutions.find(i => i.institutionId === institutionId);
//     if (!membership) {
//       return res.status(403).json({
//         error: 'Forbidden',
//         message: 'User does not belong to this institution',
//       });
//     }
//
//     // Attach to request for downstream use
//     req.institutionId = institutionId;
//     req.institutionRole = membership.role;
//     next();
//   };
// }
