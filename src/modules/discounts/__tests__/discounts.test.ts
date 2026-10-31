import { describe, it, expect } from "vitest";
import { discountService } from "../service";

describe("Discounts Module", () => {
  it("applies percentage discount correctly", async () => {
    // $100.00 subtotal with SAVE20 (20%) -> $20.00 discount, $80.00 net
    const result = await discountService.validateAndCalculate({
      code: "SAVE20",
      orderSubtotalMinor: 10000,
    });

    expect(result.isValid).toBe(true);
    expect(result.discountAmountMinor).toBe(2000);
    expect(result.netAmountMinor).toBe(8000);
  });

  it("rejects exhausted coupons", async () => {
    const result = await discountService.validateAndCalculate({
      code: "SAVE15USD",
      orderSubtotalMinor: 10000,
    });

    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toContain("exhausted");
  });
});
