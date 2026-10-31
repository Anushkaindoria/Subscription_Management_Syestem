import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateDiscountSchema } from "@/contracts/discount";
import { MOCK_DISCOUNTS } from "@/mocks/discounts";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const discount = MOCK_DISCOUNTS.find((d) => d.id === params.id) || MOCK_DISCOUNTS[0];
    return ok(discount);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, err.status || 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateDiscountSchema);
    const discount = { ...(MOCK_DISCOUNTS.find((d) => d.id === params.id) || MOCK_DISCOUNTS[0]), ...body };
    return ok(discount);
  } catch (err: any) {
    return fail(err.code || "UPDATE_DISCOUNT_FAILED", err.message, err.status || 400, err.fields);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_FAILED", err.message, err.status || 400);
  }
}
