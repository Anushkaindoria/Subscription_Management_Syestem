import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_REPORT_SUMMARY } from "@/mocks/reports";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok(MOCK_REPORT_SUMMARY);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
