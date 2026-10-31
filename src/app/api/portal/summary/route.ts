import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { listCustomerInvoices } from "@/app/api/_lib/portal-invoice-access";
import { isOutstanding, toPortalInvoice } from "@/app/api/_lib/portal-invoice-mapper";
import { MOCK_INVOICES } from "@/mocks/invoices";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";
import { subscriptionLifecycle } from "@/modules/subscriptions";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    if (!isMock) {
      const [{ items }, invoices] = await Promise.all([
        subscriptionLifecycle.list({ customerId, page: 1, pageSize: 100 }),
        listCustomerInvoices(customerId),
      ]);
      const active = items.filter((s) => s.status === "active");
      const portalInvoices = invoices.map((i) => toPortalInvoice(i, customerId));
      const outstanding = portalInvoices.filter(isOutstanding);
      return ok({
        customerId,
        customerName: user.name,
        activeSubscriptionsCount: active.length,
        totalMonthlySpendMinor: active.reduce((sum, s) => sum + (s.totalRecurringMinor ?? 0), 0),
        outstandingInvoicesCount: outstanding.length,
        totalOutstandingMinor: outstanding.reduce((sum, i) => sum + i.balanceMinor, 0),
        recentInvoices: portalInvoices.slice(0, 5),
        subscriptions: items,
      });
    }

    const subs = MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customerId);
    const invs = MOCK_INVOICES.filter((i) => i.customerId === customerId);

    return ok({
      customerId,
      customerName: user.name,
      activeSubscriptionsCount: subs.filter((s) => s.status === "active").length,
      totalMonthlySpendMinor: 170000,
      outstandingInvoicesCount: invs.filter((i) => i.balanceMinor > 0).length,
      totalOutstandingMinor: 200600,
      recentInvoices: invs,
      subscriptions: subs,
    });
  } catch (err) {
    return handleError(err);
  }
}