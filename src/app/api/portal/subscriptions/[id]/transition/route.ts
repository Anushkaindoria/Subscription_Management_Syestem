import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { PortalTransitionSchema } from "@/contracts/portal";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id && s.customerId === customerId);
    if (!sub) return fail("NOT_FOUND", "Subscription not found", 404);

    const body = await parseAndValidate(req, PortalTransitionSchema);
    // Action allowed only if plan flags permit (e.g. pausable, renewable)
    const nextStatus = body.action === "close" ? "closed" : sub.status;
    return ok({ ...sub, status: nextStatus, actionApplied: body.action });
  } catch (err: any) {
    return fail(err.code || "TRANSITION_FAILED", err.message, 400, err.fields);
  }
}
