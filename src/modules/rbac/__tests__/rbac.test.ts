import { describe, it, expect } from "vitest";
import { rbacService } from "../service";
import { ForbiddenError } from "@/lib/errors";

describe("RBAC Module", () => {
  it("allows admin full permissions", () => {
    expect(rbacService.hasPermission("ADMIN", "billing:execute")).toBe(true);
    expect(rbacService.hasPermission("ADMIN", "invoices:write")).toBe(true);
  });

  it("denies customer billing execution permissions", () => {
    expect(rbacService.hasPermission("CUSTOMER", "billing:execute")).toBe(false);
    expect(() =>
      rbacService.assertPermission(
        { userId: "u1", role: "CUSTOMER", customerId: "c1" },
        "billing:execute",
      ),
    ).toThrow(ForbiddenError);
  });

  it("enforces customer ownership checks", () => {
    // Can access own records
    expect(() =>
      rbacService.assertCustomerOwnership(
        { userId: "u1", role: "CUSTOMER", customerId: "c1" },
        "c1",
      ),
    ).not.toThrow();

    // Blocked from accessing other's records
    expect(() =>
      rbacService.assertCustomerOwnership(
        { userId: "u1", role: "CUSTOMER", customerId: "c1" },
        "c2",
      ),
    ).toThrow(ForbiddenError);
  });
});
