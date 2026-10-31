import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateProfileSchema } from "@/contracts/auth";
import { MOCK_CUSTOMERS } from "@/mocks/customers";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customer = MOCK_CUSTOMERS.find((c) => c.id === (user.customerId || "cust_acme_retail")) || MOCK_CUSTOMERS[0];
    return ok({ user, customer });
  } catch (err: any) {
    return fail(err.code || "UNAUTHORIZED", err.message, err.status || 401);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const body = await parseAndValidate(req, UpdateProfileSchema);
    return ok({ message: "Profile updated successfully", updatedFields: Object.keys(body) });
  } catch (err: any) {
    return fail(err.code || "PROFILE_UPDATE_FAILED", err.message, 400, err.fields);
  }
}
