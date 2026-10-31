import { NextRequest } from "next/server";
import { ok, handleError, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay(150);
    return ok(assertAuth(req));
  } catch (err) {
    return handleError(err);
  }
}
