import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok([
      {
        id: "brun_1001",
        asOfDate: "2026-10-01T00:00:00Z",
        dryRun: false,
        subscriptionsEvaluated: 1284,
        invoicesGenerated: 1284,
        invoicesSkipped: 0,
        failedCount: 0,
        totalBilledMinor: 186400000,
        executedAt: "2026-10-01T00:02:14Z",
        status: "COMPLETED",
      },
    ]);
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, 500);
  }
}
