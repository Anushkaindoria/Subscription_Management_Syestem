import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateDiscountSchema } from "@/contracts/discount";
import { MOCK_DISCOUNTS } from "@/mocks/discounts";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_DISCOUNTS, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "FORBIDDEN", err.message, err.status || 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateDiscountSchema);
    const discount = { id: `disc_${Date.now()}`, ...body, usedCount: 0, createdAt: new Date().toISOString() };
    return ok(discount, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_DISCOUNT_FAILED", err.message, err.status || 400, err.fields);
  }
}
