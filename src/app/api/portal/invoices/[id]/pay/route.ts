import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { PortalPayInvoiceSchema } from "@/contracts/portal";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const inv = MOCK_INVOICES.find((i) => i.id === params.id && i.customerId === customerId);
    if (!inv) return fail("NOT_FOUND", "Invoice not found", 404);

    const body = await parseAndValidate(req, PortalPayInvoiceSchema);
    return ok({
      paymentId: `pay_${Date.now()}`,
      invoiceId: inv.id,
      amountPaid: body.amount,
      method: body.method,
      status: "SUCCEEDED",
      invoiceStatus: "paid",
      remainingBalanceMinor: 0,
    });
  } catch (err: any) {
    return fail(err.code || "PAYMENT_FAILED", err.message, 400, err.fields);
  }
}
