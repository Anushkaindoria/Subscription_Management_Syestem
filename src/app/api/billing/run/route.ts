import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { BillingRunRequestSchema } from "@/contracts/billing";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, BillingRunRequestSchema);
    return ok({
      runId: `brun_${Date.now()}`,
      asOfDate: body.asOfDate || new Date().toISOString(),
      dryRun: body.dryRun,
      subscriptionsEvaluated: 5,
      invoicesGenerated: body.dryRun ? 0 : 2,
      invoicesSkipped: 3,
      failedCount: 0,
      totalBilledMinor: 1842000,
      status: "COMPLETED",
    });
  } catch (err: any) {
    return fail(err.code || "BILLING_RUN_FAILED", err.message, 400, err.fields);
  }
}
