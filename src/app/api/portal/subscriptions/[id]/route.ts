import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id && s.customerId === customerId);
    if (!sub) return fail("NOT_FOUND", "Subscription not found", 404);
    return ok(sub);
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}
