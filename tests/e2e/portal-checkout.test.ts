import { describe, it, expect } from "vitest";
import { catalogService } from "@/modules/catalog";
import { discountService } from "@/modules/discounts";
import { taxService } from "@/modules/tax";

describe("E2E: Customer Portal Catalog & Checkout Calculation", () => {
  it("calculates checkout price with discount coupon and GST", async () => {
    // 1. Fetch products and plans
    const products = await catalogService.getProducts();
    const plans = await catalogService.getPlans();
    expect(products.length).toBeGreaterThan(0);
    expect(plans.length).toBeGreaterThan(0);

    // 2. Select plan: $99.00 (9900 minor units)
    const basePrice = 9900;

    // 3. Apply promotional discount SAVE20 (20%)
    const discount = await discountService.validateAndCalculate({
      code: "SAVE20",
      orderSubtotalMinor: basePrice,
    });
    expect(discount.isValid).toBe(true);
    expect(discount.discountAmountMinor).toBe(1980); // 20% of 9900 = 1980
    expect(discount.netAmountMinor).toBe(7920); // 9900 - 1980 = 7920

    // 4. Calculate 18% GST on net amount
    const tax = await taxService.calculateTax({
      taxableAmountMinor: discount.netAmountMinor,
      taxRuleId: "tax_gst_18",
      isInterState: false,
    });
    // 18% of 7920 = 1426 (rounded)
    expect(tax.totalTaxAmountMinor).toBe(1426);
    expect(tax.cgstAmountMinor).toBe(713);
    expect(tax.sgstAmountMinor).toBe(713);

    // Final total = 7920 + 1426 = 9346 ($93.46)
    const grandTotal = discount.netAmountMinor + tax.totalTaxAmountMinor;
    expect(grandTotal).toBe(9346);
  });
});
