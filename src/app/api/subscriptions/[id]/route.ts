import { NextRequest } from "next/server";
import { ok, assertAuth, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id || s.number === params.id) || MOCK_SUBSCRIPTIONS[0];
    return ok(sub);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const sub = { ...(MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id) || MOCK_SUBSCRIPTIONS[0]) };
    return ok(sub);
  } catch (err) {
    return handleError(err);
  }
}
