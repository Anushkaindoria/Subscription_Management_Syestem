/**
 * RBAC Module Service
 * OWNER: Dev B (@devB)
 */

import { RoleType, RbacContext } from "@/contracts";
import { ForbiddenError } from "@/lib/errors";

// Sirf admin ke kaam
const ADMIN_ONLY = [
  "billing:execute",
  "discounts:manage",
  "taxes:manage",
  "staff:manage",
  "settings:manage",
];

// Admin + staff dono ke kaam
const STAFF_LEVEL = [
  "catalog:read",
  "catalog:write",
  "subscriptions:read",
  "subscriptions:write",
  "invoices:read",
  "invoices:write",
  "payments:record",
  "reports:view",
  "customers:read",
  "customers:write",
];

// Ek hi map, keys lowercase. Lookup mein role lowercase kiya jata hai (ADMIN bhi chalta hai).
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [...STAFF_LEVEL, ...ADMIN_ONLY],
  staff: [...STAFF_LEVEL],
  customer: ["catalog:read", "subscriptions:read", "invoices:read"],
};

export class RbacService {
  hasPermission(role: RoleType | string, permission: string): boolean {
    const permissions = ROLE_PERMISSIONS[String(role).toLowerCase()] ?? [];
    return permissions.includes(permission);
  }

  assertPermission(context: RbacContext, permission: string): void {
    if (!this.hasPermission(context.role, permission)) {
      throw new ForbiddenError(
        `Role '${context.role}' does not have required permission '${permission}'.`,
      );
    }
  }

  assertCustomerOwnership(context: RbacContext, targetCustomerId: string): void {
    const role = String(context.role).toLowerCase();
    if (role === "admin" || role === "staff") {
      return; // Admin aur staff kisi bhi customer ka record dekh sakte hain
    }
    if (context.customerId !== targetCustomerId) {
      throw new ForbiddenError("You may only access your own customer records.");
    }
  }
}

export const rbacService = new RbacService();
