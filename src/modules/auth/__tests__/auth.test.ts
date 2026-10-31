import { describe, it, expect } from "vitest";
import { authService } from "../service";
import { SignupSchema } from "../schema";

describe("Auth Module", () => {
  it("enforces password policy (at least 9 chars, upper, lower, special)", () => {
    // Valid password
    const valid = SignupSchema.safeParse({
      email: "test@example.com",
      name: "Test User",
      password: "Password123!",
    });
    expect(valid.success).toBe(true);

    // Invalid: too short
    const short = SignupSchema.safeParse({
      email: "test@example.com",
      name: "Test User",
      password: "P1!",
    });
    expect(short.success).toBe(false);

    // Invalid: no uppercase
    const noUpper = SignupSchema.safeParse({
      email: "test@example.com",
      name: "Test User",
      password: "password123!",
    });
    expect(noUpper.success).toBe(false);

    // Invalid: no special char
    const noSpecial = SignupSchema.safeParse({
      email: "test@example.com",
      name: "Test User",
      password: "Password123",
    });
    expect(noSpecial.success).toBe(false);
  });

  it("returns mock session in mock mode", async () => {
    const session = await authService.login({
      email: "admin@loopos.local",
      password: "Password123!",
    });
    expect(session.user.role.toLowerCase()).toBe("admin");
    expect(session.token).toBeDefined();
  });
});
