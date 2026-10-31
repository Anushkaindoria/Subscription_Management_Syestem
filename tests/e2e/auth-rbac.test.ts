import { describe, it, expect } from "vitest";
import { authService } from "@/modules/auth";
import { rbacService } from "@/modules/rbac";
import { ForbiddenError } from "@/lib/errors";

describe("E2E: Authentication & RBAC Negative Tests", () => {
  it("authenticates admin and verifies administrative execution privileges", async () => {
    const session = await authService.login({
      email: "admin@loopos.local",
      password: "Password123!",
    });

    expect(session.user.role.toLowerCase()).toBe("admin");
    expect(() =>
      rbacService.assertPermission(
        { userId: session.user.id, role: session.user.role },
        "billing:execute",
      ),
    ).not.toThrow();
  });

  it("blocks customers from executing billing runs (RBAC negative test)", async () => {
    const session = await authService.login({
      email: "billing@acmecorp.com",
      password: "Password123!",
    });

    expect(session.user.role.toLowerCase()).toBe("customer");
    expect(() =>
      rbacService.assertPermission(
        { userId: session.user.id, role: session.user.role, customerId: session.user.customerId || undefined },
        "billing:execute",
      ),
    ).toThrow(ForbiddenError);
  });
});
