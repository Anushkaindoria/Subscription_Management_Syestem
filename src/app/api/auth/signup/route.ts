import { NextRequest } from "next/server";
import { ok, handleError, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { SignupRequestSchema } from "@/contracts/auth";
import { authService, SESSION_COOKIE, sessionCookieOptions } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, SignupRequestSchema);
    const session = await authService.signup(body);
    const res = ok(session, 201);
    res.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions());
    return res;
  } catch (err) {
    return handleError(err);
  }
}
