import { NextRequest } from "next/server";
import { ok, handleError, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { ForgotPasswordRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, ForgotPasswordRequestSchema);
    return ok(await authService.requestPasswordReset(body));
  } catch (err) {
    return handleError(err);
  }
}
