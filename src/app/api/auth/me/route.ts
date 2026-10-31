import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay(150);
    const user = assertAuth(req);
    return ok(user);
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
