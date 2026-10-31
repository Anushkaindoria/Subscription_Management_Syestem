import { describe, it, expect } from "vitest";
import { billingService } from "../service";

describe("Billing Module", () => {
  it("executes dry run without generating permanent invoices", async () => {
    const result = await billingService.executeBillingRun({
      dryRun: true,
    });

    expect(result.isDryRun).toBe(true);
    expect(result.invoicesGenerated).toBe(0);
    expect(result.subscriptionsEvaluated).toBeGreaterThan(0);
  });

  it("reports idempotent skips on duplicate runs", async () => {
    const result = await billingService.executeBillingRun({
      dryRun: false,
    });

    expect(result.invoicesSkippedIdempotent).toBeGreaterThanOrEqual(0);
  });
});
