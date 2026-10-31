import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { listCustomerInvoices } from "@/app/api/_lib/portal-invoice-access";
import { toPortalInvoice } from "@/app/api/_lib/portal-invoice-mapper";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);

    if (!isMock) {
      const list = await listCustomerInvoices(customerId);
      return ok(paginate(list.map((i) => toPortalInvoice(i, customerId)), page, pageSize));
    }

    const invs = MOCK_INVOICES.filter((i) => i.customerId === customerId);
    return ok(paginate(invs, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}