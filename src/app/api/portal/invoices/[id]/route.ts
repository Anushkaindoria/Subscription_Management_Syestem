import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const inv = MOCK_INVOICES.find((i) => (i.id === params.id || i.number === params.id) && i.customerId === customerId);
    if (!inv) return fail("NOT_FOUND", "Invoice not found", 404);
    return ok(inv);
  } catch (err) {
    return handleError(err);
  }
}
