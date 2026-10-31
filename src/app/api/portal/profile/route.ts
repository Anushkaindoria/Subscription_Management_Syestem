import { NextRequest } from "next/server";
import { ok, assertAuth, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { UpdateProfileSchema } from "@/contracts/auth";
import { MOCK_CUSTOMERS } from "@/mocks/customers";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customer = MOCK_CUSTOMERS.find((c) => c.id === (user.customerId || "cust_acme_retail")) || MOCK_CUSTOMERS[0];
    return ok({ user, customer });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const body = await parseAndValidate(req, UpdateProfileSchema);
    return ok({ message: "Profile updated successfully", updatedFields: Object.keys(body) });
  } catch (err) {
    return handleError(err);
  }
}
