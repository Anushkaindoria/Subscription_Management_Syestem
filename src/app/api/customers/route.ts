import { NextRequest } from "next/server";
import {
  ok,
  assertAuth,
  paginate,
  applyMockDelay,
  parseAndValidate,
  handleError,
} from "@/app/api/_lib/handler";
import { CreateCustomerSchema } from "@/contracts/customer";
import { MOCK_CUSTOMERS } from "@/mocks/customers";
import { customerService } from "@/modules/customers";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);

    if (process.env.MOCK_API !== "true") {
      const q = req.nextUrl.searchParams.get("q") ?? undefined;
      return ok(await customerService.listPage({ q, page, pageSize }));
    }

    return ok(paginate(MOCK_CUSTOMERS, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, CreateCustomerSchema);

    if (process.env.MOCK_API !== "true") {
      return ok(await customerService.createCustomer(body), 201);
    }

    const customer = { id: `cust_${Date.now()}`, ...body, createdAt: new Date().toISOString() };
    return ok(customer, 201);
  } catch (err) {
    return handleError(err);
  }
}