import { describe, it, expect } from "vitest";
import { addPeriods } from "@/lib/billing-period";

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe("addPeriods", () => {
  it("monthly: 31 Jan 2026 -> 28 Feb 2026, and n=2 -> 31 Mar 2026", () => {
    const anchor = d("2026-01-31");
    expect(addPeriods(anchor, "MONTHLY", 1).toISOString()).toBe(d("2026-02-28").toISOString());
    expect(addPeriods(anchor, "MONTHLY", 2).toISOString()).toBe(d("2026-03-31").toISOString());
  });

  it("monthly: 31 Jan 2028 -> 29 Feb 2028 (leap year)", () => {
    expect(addPeriods(d("2028-01-31"), "MONTHLY", 1).toISOString()).toBe(d("2028-02-29").toISOString());
  });

  it("weekly: adds 7 days", () => {
    expect(addPeriods(d("2026-10-31"), "WEEKLY", 1).toISOString()).toBe(d("2026-11-07").toISOString());
  });

  it("daily: adds 1 day", () => {
    expect(addPeriods(d("2026-10-31"), "DAILY", 1).toISOString()).toBe(d("2026-11-01").toISOString());
  });

  it("annually: 29 Feb 2028 -> 28 Feb 2029", () => {
    expect(addPeriods(d("2028-02-29"), "ANNUALLY", 1).toISOString()).toBe(d("2029-02-28").toISOString());
  });
});