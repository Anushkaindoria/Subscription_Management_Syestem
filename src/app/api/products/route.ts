import { NextRequest } from "next/server";
import { ok, assertAuth, paginate, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { CreateProductSchema } from "@/contracts/product";
import { MOCK_PRODUCTS } from "@/mocks/products";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff", "customer"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_PRODUCTS, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateProductSchema);
    const product = { id: `prod_${Date.now()}`, ...body, createdAt: new Date().toISOString() };
    return ok(product, 201);
  } catch (err) {
    return handleError(err);
  }
}
