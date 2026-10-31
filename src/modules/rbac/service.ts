/**
 * RBAC Module Service
 * OWNER: Dev B (@devB)
 */

import { RoleType, Permission, RbacContext } from "@/contracts";
import { ForbiddenError } from "@/lib/errors";

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    "catalog:read",
    "catalog:write",
    "subscriptions:read",
    "subscriptions:write",
    "billing:execute",
    "invoices:read",
    "invoices:write",
    "payments:record",
    "reports:view",
  ],
  staff: [
    "catalog:read",
    "catalog:write",
    "subscriptions:read",
    "subscriptions:write",
    "invoices:read",
    "invoices:write",
    "payments:record",
    "reports:view",
  ],
  customer: [
    "catalog:read",
    "subscriptions:read",
    "invoices:read",
  ],
  ADMIN: [
    "catalog:read",
    "catalog:write",
    "subscriptions:read",
    "subscriptions:write",
    "billing:execute",
    "invoices:read",
    "invoices:write",
    "payments:record",
    "reports:view",
  ],
  STAFF: [
    "catalog:read",
    "catalog:write",
    "subscriptions:read",
    "subscriptions:write",
    "invoices:read",
    "invoices:write",
    "payments:record",
    "reports:view",
  ],
  CUSTOMER: [
    "catalog:read",
    "subscriptions:read",
    "invoices:read",
  ],
};

export class RbacService {
  hasPermission(role: RoleType, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[String(role).toLowerCase()] || [];
    return permissions.includes(permission);
  }

  assertPermission(context: RbacContext, permission: Permission): void {
    if (!this.hasPermission(context.role, permission)) {
      throw new ForbiddenError(
        `Role '${context.role}' does not have required permission '${permission}'.`,
      );
    }
  }

  assertCustomerOwnership(context: RbacContext, targetCustomerId: string): void {
    const roleUpper = String(context.role).toUpperCase();
    if (roleUpper === "ADMIN" || roleUpper === "STAFF") {
      return; // Admins and staff can access any customer's records
    }
    if (context.customerId !== targetCustomerId) {
      throw new ForbiddenError("You may only access your own customer records.");
    }
  }
}

export const rbacService = new RbacService();
