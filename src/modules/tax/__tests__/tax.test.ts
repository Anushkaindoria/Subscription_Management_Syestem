import { describe, it, expect } from "vitest";
import { taxService } from "../service";

describe("Tax Module", () => {
  it("calculates intra-state GST split (CGST + SGST)", async () => {
    // $100.00 subtotal with 18% GST intra-state -> 9% CGST ($9.00) + 9% SGST ($9.00)
    const result = await taxService.calculateTax({
      taxableAmountMinor: 10000,
      taxRuleId: "tax_gst_18",
      isInterState: false,
    });

    expect(result.cgstAmountMinor).toBe(900);
    expect(result.sgstAmountMinor).toBe(900);
    expect(result.igstAmountMinor).toBe(0);
    expect(result.totalTaxAmountMinor).toBe(1800);
  });

  it("calculates inter-state GST (100% IGST)", async () => {
    const result = await taxService.calculateTax({
      taxableAmountMinor: 10000,
      taxRuleId: "tax_gst_18",
      isInterState: true,
    });

    expect(result.cgstAmountMinor).toBe(0);
    expect(result.sgstAmountMinor).toBe(0);
    expect(result.igstAmountMinor).toBe(1800);
    expect(result.totalTaxAmountMinor).toBe(1800);
  });
});
