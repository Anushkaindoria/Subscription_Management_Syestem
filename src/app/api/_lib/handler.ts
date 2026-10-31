import { NextResponse, NextRequest } from "next/server";
import { ZodSchema, ZodError } from "zod";
import { Role } from "@/contracts/enums";
import { SessionUser } from "@/contracts/auth";
import { MOCK_ADMIN_USER } from "@/mocks/users";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      data,
      error: null,
    },
    { status },
  );
}

export function fail(
  code: string,
  message: string,
  status = 400,
  fields?: Record<string, string>,
) {
  return NextResponse.json(
    {
      data: null,
      error: {
        code,
        message,
        fields,
      },
    },
    { status },
  );
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 25,
): {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return {
    items: paginatedItems,
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

export function getSession(req: NextRequest): SessionUser | null {
  const authHeader = req.headers.get("authorization");
  const cookieRole = req.cookies.get("session_role")?.value;
  const cookieCustId = req.cookies.get("session_customer_id")?.value;

  if (process.env.MOCK_API === "true") {
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

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // In production, parse and verify signed JWT
    return MOCK_ADMIN_USER;
  }

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

export class ValidationError extends Error {
  constructor(public readonly fields: Record<string, string>) {
    super("Request payload validation failed.");
  }
}
