import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({ runId: params.id, retriedCount: 0, successfulCount: 0 });
  } catch (err: any) {
    return fail(err.code || "RETRY_FAILED", err.message, 400);
  }
}
