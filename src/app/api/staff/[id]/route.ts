import { NextRequest } from "next/server";
import {
  ok,
  assertAuth,
  applyMockDelay,
  parseAndValidate,
  handleError,
} from "@/app/api/_lib/handler";
import { UpdateStaffSchema } from "@/contracts/staff";
import { MOCK_STAFF_MEMBERS } from "@/mocks/users";
import { staffService, type StaffMemberDTO } from "@/modules/staff";

function toContract(m: StaffMemberDTO) {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    role: "staff" as const,
    active: m.active,
    department: m.department,
    createdAt: m.createdAt,
  };
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateStaffSchema);

    if (process.env.MOCK_API !== "true") {
      return ok(toContract(await staffService.updateStaff(params.id, body)));
    }

    const staff = {
      ...(MOCK_STAFF_MEMBERS.find((s) => s.id === params.id) || MOCK_STAFF_MEMBERS[0]),
      ...body,
    };
    return ok(staff);
  } catch (err) {
    return handleError(err);
  }
}