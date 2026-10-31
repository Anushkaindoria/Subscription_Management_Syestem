import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({ config: { isMockApi: false } }));
vi.mock("@/modules/auth", () => ({
  authService: { requestPasswordReset: vi.fn() },
}));
vi.mock("../repo", () => ({
  staffRepo: {
    listStaff: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    createStaff: vi.fn(),
    updateName: vi.fn(),
  },
}));

import { authService } from "@/modules/auth";
import { staffRepo } from "../repo";
import { staffService } from "../service";
import { BusinessRuleError, ConflictError, NotFoundError } from "@/lib/errors";

const repo = vi.mocked(staffRepo);
const auth = vi.mocked(authService);

function user(overrides: Record<string, unknown> = {}) {
  return {
    id: "usr_1",
    name: "Aman Verma",
    email: "aman.verma@loopos.local",
    role: "STAFF",
    createdAt: new Date("2026-01-10T00:00:00.000Z"),
    ...overrides,
  };
}

describe("staff (real)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates a staff user with a hashed random password and sends a reset link", async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.createStaff.mockResolvedValue(user() as never);
    auth.requestPasswordReset.mockResolvedValue({ message: "sent" } as never);

    const dto = await staffService.createStaff({ name: " Aman Verma ", email: " Aman.Verma@LoopOS.local " });

    const arg = repo.createStaff.mock.calls[0][0];
    expect(arg.email).toBe("aman.verma@loopos.local");
    expect(arg.name).toBe("Aman Verma");
    expect(arg.passwordHash.startsWith("$2")).toBe(true);
    expect(auth.requestPasswordReset).toHaveBeenCalledWith({ email: "aman.verma@loopos.local" });
    expect(dto.role).toBe("STAFF");
  });

  it("rejects a duplicate email", async () => {
    repo.findByEmail.mockResolvedValue(user() as never);
    await expect(
      staffService.createStaff({ name: "Aman", email: "aman.verma@loopos.local" }),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(repo.createStaff).not.toHaveBeenCalled();
  });

  it("still creates the user when the reset email fails", async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.createStaff.mockResolvedValue(user() as never);
    auth.requestPasswordReset.mockRejectedValue(new Error("smtp down"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const dto = await staffService.createStaff({ name: "Aman", email: "aman.verma@loopos.local" });
    expect(dto.id).toBe("usr_1");
    warn.mockRestore();
  });

  it("does not support active or department changes yet", async () => {
    await expect(staffService.updateStaff("usr_1", { active: false })).rejects.toBeInstanceOf(
      BusinessRuleError,
    );
    await expect(
      staffService.updateStaff("usr_1", { department: "Billing" }),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.updateName).not.toHaveBeenCalled();
  });

  it("updates the name", async () => {
    repo.findById.mockResolvedValue(user() as never);
    repo.updateName.mockResolvedValue(user({ name: "Aman V" }) as never);
    const dto = await staffService.updateStaff("usr_1", { name: " Aman V " });
    expect(repo.updateName).toHaveBeenCalledWith("usr_1", "Aman V");
    expect(dto.name).toBe("Aman V");
  });

  it("gives not found for an unknown staff member", async () => {
    repo.findById.mockResolvedValue(null);
    await expect(staffService.getStaffById("nope")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("lists staff from the database", async () => {
    repo.listStaff.mockResolvedValue([user(), user({ id: "usr_2" })] as never);
    const list = await staffService.listStaff();
    expect(list).toHaveLength(2);
    expect(list[0].active).toBe(true);
  });
});