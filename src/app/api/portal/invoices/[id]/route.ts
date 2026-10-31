import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { findCustomerInvoice } from "@/app/api/_lib/portal-invoice-access";
import { toPortalInvoice } from "@/app/api/_lib/portal-invoice-mapper";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    if (!isMock) {
      // Dusre customer ka invoice yahan 404 deta hai (ownership check)
      const real = await findCustomerInvoice(customerId, params.id);
      if (!real) return fail("NOT_FOUND", "Invoice not found", 404);
      return ok(toPortalInvoice(real, customerId));
    }

    const inv = MOCK_INVOICES.find((i) => (i.id === params.id || i.number === params.id) && i.customerId === customerId);
    if (!inv) return fail("NOT_FOUND", "Invoice not found", 404);
    return ok(inv);
  } catch (err) {
    return handleError(err);
  }
}