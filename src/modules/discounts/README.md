# Discounts Module (`src/modules/discounts`)

**OWNER**: Dev A (`@devA`)  
**Domain**: Coupons, Promotional Discounts & Atomic Usage Limits

## Responsibilities
- Validate discount coupons against start/end dates and minimum order values.
- Calculate percentage (in basis points) and fixed deductions.
- Atomic concurrency-safe usage incrementing to strictly prevent overselling beyond `maxUsageLimit`.

## Public API (`index.ts`)
Only import from this module via `@/modules/discounts`.
- `discountService.validateAndCalculate(dto: ValidateDiscountDTO): Promise<DiscountApplicationResultDTO>`
- `discountService.consumeDiscountAtomic(discountId: string): Promise<boolean>`

## TODOs for Dev A
1. [ ] Add support for first-order-only customer eligibility checks.
2. [ ] Support product-specific vs. entire-cart discount restrictions.
