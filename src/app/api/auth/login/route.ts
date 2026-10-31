
import { NextRequest } from "next/server";
import {
  ok,
  handleError,
  applyMockDelay,
  parseAndValidate,
} from "@/app/api/_lib/handler";
import { LoginRequestSchema } from "@/contracts/auth";
import {
  authService,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();

    const body = await parseAndValidate(req, LoginRequestSchema);
    const session = await authService.login(body);

    const res = ok(session);

    // Secure authentication cookie.
    res.cookies.set(
      SESSION_COOKIE,
      session.token,
      sessionCookieOptions()
    );

    // Role and customer context for frontend integration.
    res.cookies.set("session_role", session.user.role, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });

    if (session.user.customerId) {
      res.cookies.set(
        "session_customer_id",
        session.user.customerId,
        {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === "production",
        }
      );
    }

    return res;
  } catch (err) {
    return handleError(err);
  }
}
