import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { PortalTransitionSchema } from "@/contracts/portal";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";
import { subscriptionLifecycle } from "@/modules/subscriptions";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    if (!isMock) {
      // Pehle ownership check, phir transition (pause/renew abhi "not supported yet")
      await subscriptionLifecycle.getById(params.id, { customerId });
      const body = await parseAndValidate(req, PortalTransitionSchema);
      return ok(await subscriptionLifecycle.transition(params.id, body.action));
    }

    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id && s.customerId === customerId);
    if (!sub) return fail("NOT_FOUND", "Subscription not found", 404);

    const body = await parseAndValidate(req, PortalTransitionSchema);
    // Action allowed only if plan flags permit (e.g. pausable, renewable)
    const nextStatus = body.action === "close" ? "closed" : sub.status;
    return ok({ ...sub, status: nextStatus, actionApplied: body.action });
  } catch (err) {
    return handleError(err);
  }
}