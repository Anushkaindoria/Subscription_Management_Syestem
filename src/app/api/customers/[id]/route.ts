import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateCustomerSchema } from "@/contracts/customer";
import { MOCK_CUSTOMERS } from "@/mocks/customers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const customer = MOCK_CUSTOMERS.find((c) => c.id === params.id) || MOCK_CUSTOMERS[0];
    return ok(customer);
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, UpdateCustomerSchema);
    const customer = { ...(MOCK_CUSTOMERS.find((c) => c.id === params.id) || MOCK_CUSTOMERS[0]), ...body };
    return ok(customer);
  } catch (err: any) {
    return fail(err.code || "UPDATE_CUSTOMER_FAILED", err.message, 400, err.fields);
  }
}
