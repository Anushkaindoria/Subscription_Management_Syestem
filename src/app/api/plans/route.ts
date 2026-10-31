import { NextRequest } from "next/server";
import { ok, assertAuth, paginate, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { CreatePlanSchema } from "@/contracts/plan";
import { MOCK_PLANS } from "@/mocks/plans";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_PLANS, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreatePlanSchema);
    const plan = { id: `plan_${Date.now()}`, ...body, createdAt: new Date().toISOString() };
    return ok(plan, 201);
  } catch (err) {
    return handleError(err);
  }
}
