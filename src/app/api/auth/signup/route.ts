import { NextRequest } from "next/server";
import { ok, fail, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { SignupRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, SignupRequestSchema);
    const session = await authService.signup(body);
    return ok(session, 201);
  } catch (err: any) {
    return fail("SIGNUP_FAILED", err.message || "Signup failed", 400, err.fields);
  }
}
