# Tax Module (`src/modules/tax`)

**OWNER**: Dev A (`@devA`)  
**Domain**: Tax Rules, GST Component Split & Compliance

## Responsibilities
- Configure tax schedules and percentage rates in Basis Points (`1800 bps = 18.00%`).
- Dual-rate Indian GST breakdown:
  - **Intra-state**: 50/50 split between `CGST` and `SGST`.
  - **Inter-state / Export**: 100% `IGST`.
- Enforce integer-only rounding via `@/lib/money`.

## Public API (`index.ts`)
Only import from this module via `@/modules/tax`.
- `taxService.getTaxRules(): Promise<TaxRuleDTO[]>`
- `taxService.calculateTax(dto: CalculateTaxDTO): Promise<TaxBreakdownDTO>`

## TODOs for Dev A
1. [ ] Add reverse-charge and tax exemption certificate verification.
2. [ ] Support jurisdiction-based tax rules by customer shipping/billing state code.
