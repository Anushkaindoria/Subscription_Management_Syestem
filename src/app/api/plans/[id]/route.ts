import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdatePlanSchema } from "@/contracts/plan";
import { MOCK_PLANS } from "@/mocks/plans";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const plan = MOCK_PLANS.find((p) => p.id === params.id) || MOCK_PLANS[0];
    return ok(plan);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdatePlanSchema);
    const plan = { ...(MOCK_PLANS.find((p) => p.id === params.id) || MOCK_PLANS[0]), ...body };
    return ok(plan);
  } catch (err: any) {
    return fail(err.code || "UPDATE_PLAN_FAILED", err.message, err.status || 400, err.fields);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_PLAN_FAILED", err.message, err.status || 400);
  }
}
