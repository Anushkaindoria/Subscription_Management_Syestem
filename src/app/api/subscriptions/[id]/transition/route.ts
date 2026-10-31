import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { SubscriptionTransitionSchema } from "@/contracts/subscription";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, SubscriptionTransitionSchema);
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id) || MOCK_SUBSCRIPTIONS[0];

    const actionToStatus: Record<string, string> = {
      send_quotation: "quotation",
      confirm: "confirmed",
      activate: "active",
      pause: "active",
      resume: "active",
      renew: "active",
      close: "closed",
    };

    const nextStatus = actionToStatus[body.action] || sub.status;
    return ok({ ...sub, status: nextStatus, lastAction: body.action });
  } catch (err: any) {
    return fail(err.code || "TRANSITION_FAILED", err.message, 400, err.fields);
  }
}
