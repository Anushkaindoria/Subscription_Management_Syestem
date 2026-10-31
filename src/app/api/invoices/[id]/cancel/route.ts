import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const invoice = MOCK_INVOICES.find((i) => i.id === params.id) || MOCK_INVOICES[0];
    return ok({ ...invoice, status: "cancelled" });
  } catch (err: any) {
    return fail(err.code || "CANCEL_FAILED", err.message, 400);
  }
}
