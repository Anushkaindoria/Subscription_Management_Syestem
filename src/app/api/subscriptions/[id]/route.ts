import { NextRequest } from "next/server";
import { ok, assertAuth, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { BusinessRuleError } from "@/lib/errors";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";
import { subscriptionLifecycle } from "@/modules/subscriptions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);

    if (process.env.MOCK_API !== "true") {
      return ok(await subscriptionLifecycle.getById(params.id));
    }

    const sub =
      MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id || s.number === params.id) ||
      MOCK_SUBSCRIPTIONS[0];
    return ok(sub);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);

    if (process.env.MOCK_API !== "true") {
      throw new BusinessRuleError("Editing a subscription is not supported yet.");
    }

    const sub = { ...(MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id) || MOCK_SUBSCRIPTIONS[0]) };
    return ok(sub);
  } catch (err) {
    return handleError(err);
  }
}