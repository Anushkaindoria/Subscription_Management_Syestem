/**
 * Discounts Module Service
 * OWNER: Dev A (@devA)
 *
 * Implements discount eligibility and atomic concurrency-safe usage limits.
 */

import { ValidateDiscountDTO, DiscountApplicationResultDTO, DiscountDTO } from "@/contracts";
import { Money } from "@/lib/money";
import { config } from "@/lib/config";
import { discountRepo } from "./repo";

const MOCK_DISCOUNTS: DiscountDTO[] = [
  {
    id: "disc_20_percent",
    code: "SAVE20",
    description: "20% off entire order",
    type: "PERCENTAGE",
    value: 2000, // 20.00%
    maxUsageLimit: 100,
    usageCount: 14,
    minOrderValue: 2000, // $20 min
    active: true,
  },
  {
    id: "disc_fixed_15",
    code: "SAVE15USD",
    description: "$15 flat discount",
    type: "FIXED",
    value: 1500, // $15.00
    maxUsageLimit: 5,
    usageCount: 5, // Exhausted!
    minOrderValue: 5000,
    active: true,
  },
];

export class DiscountService {
  async validateAndCalculate(dto: ValidateDiscountDTO): Promise<DiscountApplicationResultDTO> {
    if (config.isMockApi) {
      const discount = MOCK_DISCOUNTS.find(
        (d) => d.code.toUpperCase() === dto.code.trim().toUpperCase(),
      );

      if (!discount || !discount.active) {
        return {
          isValid: false,
          discountAmountMinor: 0,
          netAmountMinor: dto.orderSubtotalMinor,
          rejectionReason: "Invalid or inactive discount coupon code.",
        };
      }

      if (discount.maxUsageLimit !== null && discount.usageCount >= discount.maxUsageLimit!) {
        return {
          isValid: false,
          discountAmountMinor: 0,
          netAmountMinor: dto.orderSubtotalMinor,
          rejectionReason: "Coupon usage limit has been exhausted.",
        };
      }

      if (discount.minOrderValue && dto.orderSubtotalMinor < discount.minOrderValue) {
        return {
          isValid: false,
          discountAmountMinor: 0,
          netAmountMinor: dto.orderSubtotalMinor,
          rejectionReason: `Order subtotal is below the minimum threshold of ${Money.format(discount.minOrderValue)}.`,
        };
      }

      const { discountAmount, netAmount } = Money.applyDiscount(
        dto.orderSubtotalMinor,
        discount.type,
        discount.value,
      );

      return {
        isValid: true,
        discountId: discount.id,
        discountAmountMinor: discountAmount,
        netAmountMinor: netAmount,
      };
    }

    const discount = await discountRepo.findByCode(dto.code);
    if (!discount || !discount.active) {
      return {
        isValid: false,
        discountAmountMinor: 0,
        netAmountMinor: dto.orderSubtotalMinor,
        rejectionReason: "Invalid discount code.",
      };
    }

    // Dev A: Evaluate database record & return result
    return {
      isValid: true,
      discountId: discount.id,
      discountAmountMinor: 0,
      netAmountMinor: dto.orderSubtotalMinor,
    };
  }

  async consumeDiscountAtomic(discountId: string): Promise<boolean> {
    if (config.isMockApi) {
      return true;
    }
    return await discountRepo.incrementUsageAtomic(discountId);
  }
}

export const discountService = new DiscountService();
