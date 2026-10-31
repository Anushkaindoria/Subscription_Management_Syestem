import { describe, it, expect } from "vitest";
import { rbacService } from "../service";
import { ForbiddenError } from "@/lib/errors";

describe("RBAC: admin-only permissions", () => {
  const adminOnly = ["discounts:manage", "taxes:manage", "staff:manage", "settings:manage", "billing:execute"];

  it("admin has every admin-only permission", () => {
    for (const p of adminOnly) expect(rbacService.hasPermission("admin", p)).toBe(true);
  });

  it("staff is denied every admin-only permission", () => {
    for (const p of adminOnly) expect(rbacService.hasPermission("staff", p)).toBe(false);
  });

  it("customer is denied admin-only and customer-management permissions", () => {
    for (const p of [...adminOnly, "customers:read", "customers:write", "payments:record"]) {
      expect(rbacService.hasPermission("customer", p)).toBe(false);
    }
  });

  it("staff can manage customers and record payments", () => {
    expect(rbacService.hasPermission("staff", "customers:write")).toBe(true);
    expect(rbacService.hasPermission("staff", "payments:record")).toBe(true);
  });

  it("role check is case-insensitive and unknown role gets nothing", () => {
    expect(rbacService.hasPermission("ADMIN", "staff:manage")).toBe(true);
    expect(rbacService.hasPermission("hacker", "catalog:read")).toBe(false);
  });

  it("assertPermission throws ForbiddenError for staff on discounts", () => {
    expect(() =>
      rbacService.assertPermission({ userId: "u2", role: "staff" }, "discounts:manage"),
    ).toThrow(ForbiddenError);
  });

  it("admin and staff can access any customer record", () => {
    expect(() => rbacService.assertCustomerOwnership({ userId: "u1", role: "staff" }, "c9")).not.toThrow();
    expect(() => rbacService.assertCustomerOwnership({ userId: "u1", role: "admin" }, "c9")).not.toThrow();
  });
});
