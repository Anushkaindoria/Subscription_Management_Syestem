import { NextRequest } from "next/server";
import {
  ok,
  assertAuth,
  applyMockDelay,
  parseAndValidate,
  handleError,
} from "@/app/api/_lib/handler";
import { UpdateCustomerSchema } from "@/contracts/customer";
import { MOCK_CUSTOMERS } from "@/mocks/customers";
import { customerService } from "@/modules/customers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);

    if (process.env.MOCK_API !== "true") {
      return ok(await customerService.getCustomerById(params.id));
    }

    const customer = MOCK_CUSTOMERS.find((c) => c.id === params.id) || MOCK_CUSTOMERS[0];
    return ok(customer);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, UpdateCustomerSchema);

    if (process.env.MOCK_API !== "true") {
      return ok(await customerService.updateCustomer(params.id, body));
    }

    const customer = {
      ...(MOCK_CUSTOMERS.find((c) => c.id === params.id) || MOCK_CUSTOMERS[0]),
      ...body,
    };
    return ok(customer);
  } catch (err) {
    return handleError(err);
  }
}