import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";
import { subscriptionLifecycle } from "@/modules/subscriptions";

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
      const { items } = await subscriptionLifecycle.list({ customerId, page: 1, pageSize: 100 });
      return ok(paginate(items, page, pageSize));
    }

    const subs = MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customerId);
    return ok(paginate(subs, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}