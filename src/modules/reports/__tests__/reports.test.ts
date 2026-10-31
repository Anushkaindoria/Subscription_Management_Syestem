import { describe, it, expect } from "vitest";
import { reportService } from "../service";

describe("Reports Module", () => {
  it("delivers executive dashboard metrics under 2000ms", async () => {
    const startTime = Date.now();
    const metrics = await reportService.getDashboardMetrics();
    const executionDuration = Date.now() - startTime;

    expect(metrics.activeSubscriptionsCount).toBeGreaterThan(0);
    expect(metrics.monthlyRecurringRevenueMinor).toBeGreaterThan(0);
    expect(executionDuration).toBeLessThan(2000);
  });

  it("returns overdue invoice breakdown", async () => {
    const outstanding = await reportService.getOutstandingReport();
    expect(outstanding.totalOutstandingMinor).toBeGreaterThan(0);
    expect(outstanding.items.length).toBeGreaterThan(0);
  });
});
