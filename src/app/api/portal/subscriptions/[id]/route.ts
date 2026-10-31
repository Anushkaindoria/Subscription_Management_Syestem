import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";
import { subscriptionLifecycle } from "@/modules/subscriptions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    if (!isMock) {
      // Dusre customer ki subscription par 404 aata hai (ownership check)
      return ok(await subscriptionLifecycle.getById(params.id, { customerId }));
    }

    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id && s.customerId === customerId);
    if (!sub) return fail("NOT_FOUND", "Subscription not found", 404);
    return ok(sub);
  } catch (err) {
    return handleError(err);
  }
}