import { NextRequest } from "next/server";
import { ok, fail, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { ForgotPasswordRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, ForgotPasswordRequestSchema);
    const res = await authService.requestPasswordReset(body);
    return ok(res);
  } catch (err: any) {
    return fail("FORGOT_PASSWORD_FAILED", err.message, 400, err.fields);
  }
}
