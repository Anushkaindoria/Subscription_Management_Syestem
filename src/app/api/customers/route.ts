import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateCustomerSchema } from "@/contracts/customer";
import { MOCK_CUSTOMERS } from "@/mocks/customers";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_CUSTOMERS, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, CreateCustomerSchema);
    const customer = { id: `cust_${Date.now()}`, ...body, createdAt: new Date().toISOString() };
    return ok(customer, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_CUSTOMER_FAILED", err.message, 400, err.fields);
  }
}
