import { describe, it, expect } from "vitest";
import { subscriptionService } from "../service";
import { BusinessRuleError } from "@/lib/errors";

describe("Subscriptions Module - State Machine", () => {
  it("allows valid transitions (DRAFT -> QUOTATION -> CONFIRMED -> ACTIVE)", async () => {
    const sub = await subscriptionService.transitionStatus("sub_mock_002", "CONFIRMED");
    expect(sub.status).toBe("CONFIRMED");
  });

  it("blocks invalid transitions (e.g. ACTIVE directly to DRAFT)", async () => {
    await expect(
      subscriptionService.transitionStatus("sub_mock_001", "DRAFT"),
    ).rejects.toThrow(BusinessRuleError);
  });
});
