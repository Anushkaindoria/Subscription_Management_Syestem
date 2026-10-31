# Billing Module (`src/modules/billing`)

**OWNER**: Dev A (`@devA`)  
**Domain**: Billing Scheduler, Catch-Up Cycles & Idempotent Invoicing

## Responsibilities
- Periodic automated billing engine runner (scheduled cron or API endpoint).
- Idempotent invoice creation backed by the unique database constraint:
  `UNIQUE(subscriptionId, periodStart, periodEnd)`.
- Catch-up billing for overdue / lapsed agreement periods.
- Dry-run billing simulations that preview upcoming cashflow without mutations.

## Public API (`index.ts`)
Only import from this module via `@/modules/billing`.
- `billingService.executeBillingRun(dto: BillingRunRequestDTO): Promise<BillingRunResultDTO>`

## TODOs for Dev A
1. [ ] Wire `scripts/run-billing.ts` to call this service from the CLI.
2. [ ] Add transaction locks during billing batch execution to prevent race conditions.
3. [ ] Integrate with `clock.ts` to support seamless time-travel billing demos.
