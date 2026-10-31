import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({
      totalActive: 1284,
      byPlan: [
        { plan: "Starter Monthly", count: 840, mrrMinor: 125916000 },
        { plan: "Business Yearly", count: 444, mrrMinor: 60484000 },
      ],
    });
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
