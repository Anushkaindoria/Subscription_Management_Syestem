import { NextRequest } from "next/server";
import { ok, fail, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { LoginRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, LoginRequestSchema);
    const session = await authService.login(body);
    const res = ok(session);

    // Set cookies so middleware and browser recognize authenticated session
    res.cookies.set("session_token", session.token, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    res.cookies.set("session_role", session.user.role, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    if (session.user.customerId) {
      res.cookies.set("session_customer_id", session.user.customerId, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch (err: any) {
    return fail("LOGIN_FAILED", err.message || "Invalid credentials", 401, err.fields);
  }
}
