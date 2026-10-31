# RBAC Module (`src/modules/rbac`)

**OWNER**: Dev B (`@devB`)  
**Domain**: Roles, Permissions & Data Scoping

## Responsibilities
- Define system roles: `ADMIN`, `STAFF`, `CUSTOMER`.
- Enforce capability-based permission checks across API route handlers.
- Verify customer ownership guards to prevent cross-tenant data leakage.

## Public API (`index.ts`)
Only import from this module via `@/modules/rbac`.
- `rbacService.hasPermission(role: RoleType, permission: Permission): boolean`
- `rbacService.assertPermission(context: RbacContext, permission: Permission): void`
- `rbacService.assertCustomerOwnership(context: RbacContext, targetCustomerId: string): void`

## TODOs for Dev B
1. [ ] Wrap route handlers with an ergonomic `withRbac(permission, handler)` middleware.
2. [ ] Add caching for user role lookups to minimize DB hits on high-volume routes.
