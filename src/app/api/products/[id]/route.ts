import { NextRequest } from "next/server";
import { ok, assertAuth, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { UpdateProductSchema } from "@/contracts/product";
import { MOCK_PRODUCTS } from "@/mocks/products";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const product = MOCK_PRODUCTS.find((p) => p.id === params.id) || MOCK_PRODUCTS[0];
    return ok(product);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateProductSchema);
    const product = { ...(MOCK_PRODUCTS.find((p) => p.id === params.id) || MOCK_PRODUCTS[0]), ...body };
    return ok(product);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
