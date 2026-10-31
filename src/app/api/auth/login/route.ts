import { NextRequest } from "next/server";
import { ok, fail, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { LoginRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, LoginRequestSchema);
    const session = await authService.login(body);
    return ok(session);
  } catch (err: any) {
    return fail("LOGIN_FAILED", err.message || "Invalid credentials", 401, err.fields);
  }
}
