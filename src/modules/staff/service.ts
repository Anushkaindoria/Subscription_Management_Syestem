/**
 * Staff Module Service
 * OWNER: Dev B (@devB)
 * Admin-only operations for managing internal staff accounts.
 */

import { StaffMemberDTO, CreateStaffMemberDTO, UpdateStaffMemberDTO } from "./schema";
import { config } from "@/lib/config";
import { NotFoundError } from "@/lib/errors";

const MOCK_STAFF: StaffMemberDTO[] = [
  {
    id: "usr_staff_aman",
    name: "Aman Verma",
    email: "aman.verma@loopos.local",
    role: "STAFF",
    active: true,
    department: "Customer Operations",
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "usr_staff_neha",
    name: "Neha Kapoor",
    email: "neha.kapoor@loopos.local",
    role: "STAFF",
    active: true,
    department: "Billing & Collections",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

export class StaffService {
  async listStaff(): Promise<StaffMemberDTO[]> {
    if (config.isMockApi) {
      return MOCK_STAFF;
    }
    return MOCK_STAFF;
  }

  async getStaffById(id: string): Promise<StaffMemberDTO> {
    const staff = MOCK_STAFF.find((s) => s.id === id);
    if (!staff) throw new NotFoundError("Staff Member", id);
    return staff;
  }

  async createStaff(dto: CreateStaffMemberDTO): Promise<StaffMemberDTO> {
    if (config.isMockApi) {
      const created: StaffMemberDTO = {
        id: `usr_staff_${Date.now()}`,
        name: dto.name,
        email: dto.email,
        role: "STAFF",
        active: true,
        department: dto.department || "Operations",
        createdAt: new Date().toISOString(),
      };
      MOCK_STAFF.push(created);
      return created;
    }
    return MOCK_STAFF[0];
  }

  async updateStaff(id: string, dto: UpdateStaffMemberDTO): Promise<StaffMemberDTO> {
    const member = await this.getStaffById(id);
    if (dto.active !== undefined) member.active = dto.active;
    if (dto.department !== undefined) member.department = dto.department;
    if (dto.name !== undefined) member.name = dto.name;
    return member;
  }
}

export const staffService = new StaffService();
