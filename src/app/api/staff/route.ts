import { NextRequest } from "next/server";
import {
  ok,
  assertAuth,
  paginate,
  applyMockDelay,
  parseAndValidate,
  handleError,
} from "@/app/api/_lib/handler";
import { CreateStaffSchema } from "@/contracts/staff";
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

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);

    if (process.env.MOCK_API !== "true") {
      const items = (await staffService.listStaff()).map(toContract);
      return ok(paginate(items, page, pageSize));
    }

    return ok(paginate(MOCK_STAFF_MEMBERS, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateStaffSchema);

    if (process.env.MOCK_API !== "true") {
      return ok(toContract(await staffService.createStaff(body)), 201);
    }

    const staff = {
      id: `usr_staff_${Date.now()}`,
      ...body,
      role: "staff" as const,
      active: true,
      createdAt: new Date().toISOString(),
    };
    return ok(staff, 201);
  } catch (err) {
    return handleError(err);
  }
}