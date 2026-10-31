import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({
      collectedThisMonthMinor: 245630000,
      methods: [
        { method: "bank_transfer", totalMinor: 140000000, count: 62 },
        { method: "upi", totalMinor: 85630000, count: 210 },
        { method: "card", totalMinor: 20000000, count: 45 },
      ],
    });
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
