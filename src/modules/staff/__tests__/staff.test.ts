import { describe, it, expect } from "vitest";
import { staffService } from "../service";

describe("Staff Module", () => {
  it("lists staff members (Aman Verma, Neha Kapoor)", async () => {
    const staff = await staffService.listStaff();
    expect(staff.length).toBeGreaterThanOrEqual(2);
    expect(staff.some((s) => s.name === "Aman Verma")).toBe(true);
    expect(staff.some((s) => s.name === "Neha Kapoor")).toBe(true);
  });

  it("can toggle active status", async () => {
    const updated = await staffService.updateStaff("usr_staff_aman", { active: false });
    expect(updated.active).toBe(false);
    // restore
    await staffService.updateStaff("usr_staff_aman", { active: true });
  });
});
