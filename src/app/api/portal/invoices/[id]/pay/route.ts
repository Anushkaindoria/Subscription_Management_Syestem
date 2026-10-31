import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { findCustomerInvoice } from "@/app/api/_lib/portal-invoice-access";
import { PortalPayInvoiceSchema } from "@/contracts/portal";
import { MOCK_INVOICES } from "@/mocks/invoices";
import { paymentService } from "@/modules/payments";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    if (!isMock) {
      // Pehle ownership, phir payment (rules paymentService mein hain: sirf Confirmed, overpay reject)
      const real = await findCustomerInvoice(customerId, params.id);
      if (!real) return fail("NOT_FOUND", "Invoice not found", 404);

      const body = await parseAndValidate(req, PortalPayInvoiceSchema);
      const receipt = await paymentService.recordPayment({
        invoiceId: real.id,
        amount: body.amount,
        method: body.method,
        note: body.note,
      });
      return ok({
        paymentId: receipt.payment.id,
        invoiceId: real.id,
        amountPaid: receipt.payment.amount,
        method: receipt.payment.method,
        status: receipt.payment.status,
        invoiceStatus: receipt.invoiceFullyPaid ? "paid" : "confirmed",
        remainingBalanceMinor: receipt.remainingBalanceMinor,
      });
    }

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
  } catch (err) {
    return handleError(err);
  }
}