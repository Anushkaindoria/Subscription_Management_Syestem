import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_REVENUE_TIME_SERIES } from "@/mocks/reports";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok(MOCK_REVENUE_TIME_SERIES);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
