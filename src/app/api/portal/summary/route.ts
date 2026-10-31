import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
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
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
