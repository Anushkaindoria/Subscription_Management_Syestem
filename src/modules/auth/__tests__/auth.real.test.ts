import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import type { NextRequest } from "next/server";

type FakeUser = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  customerId: string | null;
};

// Fake in-memory database (real PostgreSQL ki jarurat nahi)
const store = vi.hoisted(() => ({ users: [] as FakeUser[], mails: [] as string[] }));

vi.mock("@/lib/config", () => ({
  config: { isMockApi: false, isProduction: false, port: 3000, jwtSecret: "x", databaseUrl: "" },
}));

vi.mock("../repo", () => ({
  authRepo: {
    findByEmail: async (email: string) =>
      store.users.find((u) => u.email === email.trim().toLowerCase()) ?? null,
    findById: async (id: string) => store.users.find((u) => u.id === id) ?? null,
    createUserWithCustomer: async (d: { email: string; passwordHash: string; name: string }) => {
      const n = store.users.length + 1;
      const user: FakeUser = {
        id: "usr_" + n,
        email: d.email.trim().toLowerCase(),
        passwordHash: d.passwordHash,
        name: d.name,
        role: "CUSTOMER",
        customerId: "cust_" + n,
      };
      store.users.push(user);
      return user;
    },
    updatePassword: async (id: string, hash: string) => {
      const u = store.users.find((x) => x.id === id);
      if (u) u.passwordHash = hash;
    },
  },
}));

vi.mock("../mailer", () => ({
  sendMail: async (_to: string, _subject: string, text: string) => {
    store.mails.push(text);
  },
}));

import { authService } from "../service";
import { signSession, verifySession } from "../session";
import { SignupRequestSchema } from "@/contracts/auth";
import { assertAuth, AuthError } from "@/app/api/_lib/handler";
import { UnauthorizedError, ConflictError, ValidationError } from "@/lib/errors";

const good = { name: "Hiya Kothari", email: "hiya@example.com", password: "Abcdefg1!" };
let prevMock: string | undefined;

beforeAll(() => {
  prevMock = process.env.MOCK_API;
  process.env.MOCK_API = "false";
  process.env.AUTH_SECRET = "test-secret-".padEnd(40, "x");
});

afterAll(() => {
  if (prevMock === undefined) delete process.env.MOCK_API;
  else process.env.MOCK_API = prevMock;
});

beforeEach(() => {
  store.users.length = 0;
  store.mails.length = 0;
});

function fakeReq(opts: { cookie?: string; bearer?: string } = {}) {
  return {
    headers: {
      get: (n: string) =>
        n.toLowerCase() === "authorization" && opts.bearer ? "Bearer " + opts.bearer : null,
    },
    cookies: {
      get: (n: string) => (n === "loopos_session" && opts.cookie ? { value: opts.cookie } : undefined),
    },
  } as unknown as NextRequest;
}

function statusOf(fn: () => unknown): number | null {
  try {
    fn();
    return null;
  } catch (e) {
    return e instanceof AuthError ? e.status : -1;
  }
}

function tokenFor(role: "admin" | "staff" | "customer") {
  return signSession({ userId: "u1", email: "a@b.com", name: "Test", role, customerId: null });
}

describe("Auth (real mode, fake DB)", () => {
  it("password: 8 chars rejected, 9 chars accepted", () => {
    const eight = SignupRequestSchema.safeParse({ ...good, password: "Abcdef1!" });
    const nine = SignupRequestSchema.safeParse({ ...good, password: "Abcdefg1!" });
    expect(eight.success).toBe(false);
    expect(nine.success).toBe(true);
  });

  it("signup with role 'admin' in body still creates a customer", async () => {
    const parsed = SignupRequestSchema.parse({ ...good, role: "admin" });
    expect("role" in parsed).toBe(false); // schema extra field hata deta hai
    const session = await authService.signup(parsed);
    expect(session.user.role).toBe("customer");
    expect(session.user.customerId).toBeTruthy(); // linked Customer bana
  });

  it("signup stores a bcrypt hash and lowercase email", async () => {
    await authService.signup({ ...good, email: "Hiya@Example.com" });
    expect(store.users[0].email).toBe("hiya@example.com");
    expect(store.users[0].passwordHash).not.toContain("Abcdefg1!");
    expect(store.users[0].passwordHash.startsWith("$2")).toBe(true);
  });

  it("duplicate email is rejected (case-insensitive)", async () => {
    await authService.signup(good);
    await expect(authService.signup({ ...good, email: "HIYA@example.com" })).rejects.toBeInstanceOf(ConflictError);
  });

  it("login: correct password works, token is verifiable", async () => {
    await authService.signup(good);
    const s = await authService.login({ email: good.email, password: good.password });
    const payload = verifySession(s.token);
    expect(payload?.role).toBe("customer");
    expect(payload?.email).toBe("hiya@example.com");
  });

  it("login: wrong password and unknown email give the same error", async () => {
    await authService.signup(good);
    const wrong = await authService.login({ email: good.email, password: "Wrong@12345" }).catch((e) => e);
    const unknown = await authService.login({ email: "nobody@example.com", password: "Abcdefg1!" }).catch((e) => e);
    expect(wrong).toBeInstanceOf(UnauthorizedError);
    expect(unknown).toBeInstanceOf(UnauthorizedError);
    expect(wrong.message).toBe(unknown.message);
  });

  it("password reset token works only once", async () => {
    await authService.signup(good);
    await authService.requestPasswordReset({ email: good.email });
    const token = /token=([^\s]+)/.exec(store.mails[0])?.[1] ?? "";
    expect(token).not.toBe("");

    const first = await authService.confirmPasswordReset({ token, newPassword: "NewPass@123" });
    expect(first.success).toBe(true);
    await expect(authService.confirmPasswordReset({ token, newPassword: "Another@123" })).rejects.toBeInstanceOf(ValidationError);

    await expect(authService.login({ email: good.email, password: good.password })).rejects.toBeInstanceOf(UnauthorizedError);
    const s = await authService.login({ email: good.email, password: "NewPass@123" });
    expect(s.user.email).toBe("hiya@example.com");
  });

  it("reset request for unknown email sends nothing but looks the same", async () => {
    const r = await authService.requestPasswordReset({ email: "nobody@example.com" });
    expect(r.message).toContain("If an account exists");
    expect(store.mails.length).toBe(0);
  });
});

describe("assertAuth: 401 / 403 (real mode)", () => {
  it("no token gives 401", () => {
    expect(statusOf(() => assertAuth(fakeReq()))).toBe(401);
  });

  it("random Bearer token gives 401 (purani admin hole band)", () => {
    expect(statusOf(() => assertAuth(fakeReq({ bearer: "anything" })))).toBe(401);
  });

  it("tampered signature gives 401", () => {
    // Signature ka PEHLA character badlo: us par poore 6 bits lagte hain, to signature hamesha badalta hai.
    // (Aakhri character kabhi-kabhi same bytes deta tha, isliye test flaky tha.)
    const [h, b, s] = tokenFor("admin").split(".");
    const first = s[0] === "A" ? "B" : "A";
    const bad = [h, b, first + s.slice(1)].join(".");
    expect(statusOf(() => assertAuth(fakeReq({ cookie: bad })))).toBe(401);
  });

  it("customer token edited to admin role gives 401", () => {
    const [h, b, s] = tokenFor("customer").split(".");
    const p = JSON.parse(Buffer.from(b, "base64url").toString());
    p.role = "admin";
    const forged = [h, Buffer.from(JSON.stringify(p)).toString("base64url"), s].join(".");
    expect(statusOf(() => assertAuth(fakeReq({ cookie: forged })))).toBe(401);
  });

  it("customer on admin-only route gives 403", () => {
    expect(statusOf(() => assertAuth(fakeReq({ cookie: tokenFor("customer") }), ["admin"]))).toBe(403);
  });

  it("staff on admin-only route gives 403, admin is allowed", () => {
    expect(statusOf(() => assertAuth(fakeReq({ cookie: tokenFor("staff") }), ["admin"]))).toBe(403);
    expect(statusOf(() => assertAuth(fakeReq({ cookie: tokenFor("admin") }), ["admin"]))).toBeNull();
  });

  it("valid token via Bearer header also works", () => {
    expect(statusOf(() => assertAuth(fakeReq({ bearer: tokenFor("staff") }), ["admin", "staff"]))).toBeNull();
  });
});