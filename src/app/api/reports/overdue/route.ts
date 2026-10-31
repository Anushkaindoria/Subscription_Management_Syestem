import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_OVERDUE_INVOICES } from "@/mocks/reports";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok(MOCK_OVERDUE_INVOICES);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
