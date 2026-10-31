import { NextRequest } from "next/server";
import { ok, handleError, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { ResetPasswordRequestSchema } from "@/contracts/auth";
import { authService } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    const body = await parseAndValidate(req, ResetPasswordRequestSchema);
    return ok(await authService.confirmPasswordReset(body));
  } catch (err) {
    return handleError(err);
  }
}
