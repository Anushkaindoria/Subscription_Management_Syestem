import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateStaffSchema } from "@/contracts/staff";
import { MOCK_STAFF_MEMBERS } from "@/mocks/users";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateStaffSchema);
    const staff = { ...(MOCK_STAFF_MEMBERS.find((s) => s.id === params.id) || MOCK_STAFF_MEMBERS[0]), ...body };
    return ok(staff);
  } catch (err: any) {
    return fail(err.code || "UPDATE_STAFF_FAILED", err.message, err.status || 400, err.fields);
  }
}
