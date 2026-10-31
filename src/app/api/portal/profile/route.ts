import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { UpdateProfileSchema } from "@/contracts/auth";
import { BusinessRuleError } from "@/lib/errors";
import { MOCK_CUSTOMERS } from "@/mocks/customers";
import { customerService } from "@/modules/customers";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    if (!isMock) {
      const customer = await customerService.getCustomerById(customerId);
      return ok({ user, customer });
    }

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId) || MOCK_CUSTOMERS[0];
    return ok({ user, customer });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const isMock = process.env.MOCK_API === "true";
    const customerId = isMock ? user.customerId || "cust_acme_retail" : user.customerId;
    if (!customerId) return fail("FORBIDDEN", "No customer linked to this account", 403);

    const body = await parseAndValidate(req, UpdateProfileSchema);

    if (!isMock) {
      if (body.email !== undefined || body.currentPassword !== undefined || body.newPassword !== undefined) {
        throw new BusinessRuleError(
          "Changing email or password from the portal is not supported yet. Use password reset.",
        );
      }
      // Sirf name/phone/company badlega; baaki fields wahi rehte hain
      const current = await customerService.getCustomerById(customerId);
      const customer = await customerService.updateCustomer(customerId, {
        name: body.name ?? current.name,
        phone: body.phone ?? current.phone ?? undefined,
        company: body.company ?? current.company ?? undefined,
        address: current.address ?? undefined,
        taxId: current.taxId ?? undefined,
      });
      return ok({ message: "Profile updated successfully", updatedFields: Object.keys(body), customer });
    }

    return ok({ message: "Profile updated successfully", updatedFields: Object.keys(body) });
  } catch (err) {
    return handleError(err);
  }
}