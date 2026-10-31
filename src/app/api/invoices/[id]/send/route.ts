import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({ invoiceId: params.id, sent: true, recipient: "billing@acmeretail.in" });
  } catch (err: any) {
    return fail(err.code || "SEND_FAILED", err.message, 400);
  }
}
