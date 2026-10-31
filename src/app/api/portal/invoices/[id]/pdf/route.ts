import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { findCustomerInvoice } from "@/app/api/_lib/portal-invoice-access";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    if (!isMock) {
      // PDF generation Dev A ka hai; yahan sirf ownership check + uska pdfUrl
      const real = await findCustomerInvoice(customerId, params.id);
      if (!real) return fail("NOT_FOUND", "Invoice not found", 404);
      return ok({
        pdfUrl: real.pdfUrl,
        invoiceNumber: real.invoiceNumber,
        downloadReady: true,
      });
    }

    const inv = MOCK_INVOICES.find((i) => (i.id === params.id || i.number === params.id) && i.customerId === customerId);
    if (!inv) return fail("NOT_FOUND", "Invoice not found", 404);
    return ok({
      pdfUrl: `/storage/invoices/${inv.number}.pdf`,
      invoiceNumber: inv.number,
      downloadReady: true,
    });
  } catch (err) {
    return handleError(err);
  }
}