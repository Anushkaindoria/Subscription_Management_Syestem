import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { BillingPreviewRequestSchema } from "@/contracts/billing";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, BillingPreviewRequestSchema);
    return ok({
      asOfDate: body.asOfDate || new Date().toISOString(),
      dueSubscriptionsCount: 2,
      projectedRevenueMinor: 1842000,
      items: [
        { subscriptionId: "sub_2026_0001", customerName: "Acme Retail Pvt Ltd", periodStart: "2026-11-01", periodEnd: "2026-11-30", amountMinor: 170000 },
        { subscriptionId: "sub_2026_0003", customerName: "Kiran Stores", periodStart: "2026-11-15", periodEnd: "2026-12-14", amountMinor: 150000 },
      ],
    });
  } catch (err: any) {
    return fail(err.code || "PREVIEW_FAILED", err.message, 400, err.fields);
  }
}
