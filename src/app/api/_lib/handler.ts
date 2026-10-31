import { NextResponse, NextRequest } from "next/server";
import { ZodSchema, ZodError } from "zod";
import { Role } from "@/contracts/enums";
import { SessionUser } from "@/contracts/auth";
import { MOCK_ADMIN_USER } from "@/mocks/users";
import { AppError } from "@/lib/errors";
import { SESSION_COOKIE, verifySession } from "@/modules/auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

export function fail(
  code: string,
  message: string,
  status = 400,
  fields?: Record<string, string>,
) {
  return NextResponse.json(
    { data: null, error: { code, message, fields } },
    { status },
  );
}

export function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function applyMockDelay(ms = 300): Promise<void> {
  if (process.env.MOCK_API === "true") {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Token cookie se ya "Authorization: Bearer <token>" se aata hai
function readToken(req: NextRequest): string | null {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookie) return cookie;
  const header = req.headers.get("authorization");
  if (header && header.startsWith("Bearer ")) return header.slice(7).trim();
  return null;
}

export function getSession(req: NextRequest): SessionUser | null {
  // 1) Asli signed token (hamesha pehle check hota hai)
  const s = verifySession(readToken(req));
  if (s) {
    return {
      id: s.userId,
      name: s.name,
      email: s.email,
      role: s.role,
      customerId: s.customerId,
    };
  }

  // 2) Sirf MOCK_API=true mein purana mock behaviour (prototype ke liye)
  if (process.env.MOCK_API === "true") {
    const cookieRole = req.cookies.get("session_role")?.value;
    const cookieCustId = req.cookies.get("session_customer_id")?.value;
    if (cookieRole === "customer") {
      return {
        id: "usr_mock_customer",
        name: "Acme Retail Admin",
        email: "billing@acmeretail.in",
        role: "customer",
        customerId: cookieCustId || "cust_acme_retail",
      };
    }
    if (cookieRole === "staff") {
      return {
        id: "usr_staff_aman",
        name: "Aman Verma",
        email: "aman.verma@loopos.local",
        role: "staff",
        customerId: null,
      };
    }
    return MOCK_ADMIN_USER;
  }

  // 3) Real mode mein token nahi/galat = login nahi (purani Bearer hole band)
  return null;
}

export function assertAuth(
  req: NextRequest,
  allowedRoles?: Role[],
): SessionUser {
  const session = getSession(req);
  if (!session) {
    throw new AuthError("UNAUTHORIZED", "Authentication required", 401);
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new AuthError(
      "FORBIDDEN",
      `Role '${session.role}' is not authorized to access this resource.`,
      403,
    );
  }
  return session;
}

export class AuthError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 403,
  ) {
    super(message);
  }
}

export class ValidationError extends Error {
  constructor(public readonly fields: Record<string, string>) {
    super("Request payload validation failed.");
  }
}

export async function parseAndValidate<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
): Promise<T> {
  try {
    const json = await req.json().catch(() => ({}));
    return schema.parse(json);
  } catch (err) {
    if (err instanceof ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of err.issues) {
        fields[issue.path.join(".")] = issue.message;
      }
      throw new ValidationError(fields);
    }
    throw err;
  }
}

// Routes ke catch block mein use hoga: sahi status code, err.message leak nahi
export function handleError(err: unknown) {
  if (err instanceof AuthError) return fail(err.code, err.message, err.status);
  if (err instanceof ValidationError)
    return fail("VALIDATION_ERROR", err.message, 400, err.fields);
  if (err instanceof AppError)
    return fail(err.code, err.message, err.statusCode);
  console.error(err);
  return fail("INTERNAL_SERVER_ERROR", "Something went wrong.", 500);
}