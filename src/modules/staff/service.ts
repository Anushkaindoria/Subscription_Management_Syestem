/**
 * Staff Module Service
 * OWNER: Dev B (@devB)
 * Admin-only operations for managing internal staff accounts.
 *
 * Abhi database mein User.active / User.department nahi hain (Dev A ke schema ke baad).
 */

import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { StaffMemberDTO, CreateStaffMemberDTO, UpdateStaffMemberDTO } from "./schema";
import { staffRepo } from "./repo";
import { config } from "@/lib/config";
import { BusinessRuleError, ConflictError, NotFoundError } from "@/lib/errors";
import { authService } from "@/modules/auth";

type StaffRow = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

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

function toDto(u: StaffRow): StaffMemberDTO {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: "STAFF",
    active: true,
    createdAt: u.createdAt.toISOString(),
  };
}

export class StaffService {
  async listStaff(): Promise<StaffMemberDTO[]> {
    if (config.isMockApi) {
      return MOCK_STAFF;
    }
    return (await staffRepo.listStaff()).map(toDto);
  }

  async getStaffById(id: string): Promise<StaffMemberDTO> {
    if (config.isMockApi) {
      const staff = MOCK_STAFF.find((s) => s.id === id);
      if (!staff) throw new NotFoundError("Staff Member", id);
      return staff;
    }
    const user = await staffRepo.findById(id);
    if (!user) throw new NotFoundError("Staff Member", id);
    return toDto(user);
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

    const email = dto.email.trim().toLowerCase();
    if (await staffRepo.findByEmail(email)) {
      throw new ConflictError("An account with this email already exists.");
    }

    // Random password kisi ko dikhaya nahi jata; staff reset link se apna password set karta hai.
    const passwordHash = await hash(randomBytes(24).toString("base64url"), 10);
    const user = await staffRepo.createStaff({ name: dto.name.trim(), email, passwordHash });

    try {
      await authService.requestPasswordReset({ email });
    } catch (err) {
      console.warn("[staff] password link could not be sent:", err instanceof Error ? err.message : err);
    }
    return toDto(user);
  }

  async updateStaff(id: string, dto: UpdateStaffMemberDTO): Promise<StaffMemberDTO> {
    if (config.isMockApi) {
      const member = await this.getStaffById(id);
      if (dto.active !== undefined) member.active = dto.active;
      if (dto.department !== undefined) member.department = dto.department;
      if (dto.name !== undefined) member.name = dto.name;
      return member;
    }

    if (dto.active !== undefined || dto.department !== undefined) {
      throw new BusinessRuleError(
        "Changing active status or department is not supported yet (needs a schema update).",
      );
    }

    const existing = await staffRepo.findById(id);
    if (!existing) throw new NotFoundError("Staff Member", id);
    if (dto.name === undefined) return toDto(existing);

    return toDto(await staffRepo.updateName(id, dto.name.trim()));
  }
}

export const staffService = new StaffService();