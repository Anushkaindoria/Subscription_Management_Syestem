/**
 * Shared Infrastructure: Integer Minor Units Money Library
 * OWNER: Dev A (@devA)
 *
 * CRITICAL RULE: NEVER use JavaScript floating points for financial arithmetic.
 * All amounts are integers in minor units (cents / paise).
 * 1 USD = 100 cents | 10.50 USD = 1050 cents.
 * Rates are expressed in Basis Points (bps): 18.00% = 1800 bps | 1 bps = 0.01%.
 */

export const BPS_DIVISOR = 10000;

export const Money = {
  /**
   * Converts a major unit decimal string or float into minor units (integer cents).
   * e.g. 19.99 -> 1999
   */
  toMinorUnits(majorAmount: number | string): number {
    const num = typeof majorAmount === "string" ? parseFloat(majorAmount) : majorAmount;
    if (isNaN(num)) {
      throw new Error(`Invalid monetary amount: ${majorAmount}`);
    }
    return Math.round(num * 100);
  },

  /**
   * Converts minor units into human decimal representation.
   * e.g. 1999 -> 19.99
   */
  toMajorUnits(minorAmount: number): number {
    return minorAmount / 100;
  },

  /**
   * Formats minor units into standard currency display.
   * e.g. 1999 -> "$19.99"
   */
  format(minorAmount: number, currency = "USD", locale = "en-US"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(minorAmount / 100);
  },

  /**
   * Calculates basis points percentage with deterministic half-up rounding.
   * baseMinor: integer minor units
   * bps: integer basis points (e.g. 1800 for 18%)
   */
  multiplyBasisPoints(baseMinor: number, bps: number): number {
    return Math.round((baseMinor * bps) / BPS_DIVISOR);
  },

  /**
   * Calculates GST breakdown (CGST + SGST or IGST) based on basis points.
   */
  calculateGst(
    taxableAmountMinor: number,
    cgstBps = 0,
    sgstBps = 0,
    igstBps = 0,
  ): {
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    totalTaxAmount: number;
  } {
    const cgstAmount = this.multiplyBasisPoints(taxableAmountMinor, cgstBps);
    const sgstAmount = this.multiplyBasisPoints(taxableAmountMinor, sgstBps);
    const igstAmount = this.multiplyBasisPoints(taxableAmountMinor, igstBps);
    const totalTaxAmount = cgstAmount + sgstAmount + igstAmount;

    return { cgstAmount, sgstAmount, igstAmount, totalTaxAmount };
  },

  /**
   * Applies either percentage (in bps) or fixed discount in minor units.
   */
  applyDiscount(
    subtotalMinor: number,
    discountType: "PERCENTAGE" | "FIXED",
    discountValue: number,
  ): {
    discountAmount: number;
    netAmount: number;
  } {
    let discountAmount = 0;
    if (discountType === "PERCENTAGE") {
      discountAmount = this.multiplyBasisPoints(subtotalMinor, discountValue);
    } else {
      discountAmount = discountValue;
    }

    // Discount cannot exceed subtotal
    discountAmount = Math.min(discountAmount, subtotalMinor);
    const netAmount = Math.max(0, subtotalMinor - discountAmount);

    return { discountAmount, netAmount };
  },
};
