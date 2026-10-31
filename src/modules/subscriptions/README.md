# Subscriptions Module (`src/modules/subscriptions`)

**OWNER**: Dev B (`@devB`)  
**Domain**: Subscription Lifecycle State Machine & Recurring Agreements

## Responsibilities
- Subscription creation from customer checkout or quotation templates.
- Strict lifecycle state machine enforcement:
  `DRAFT` -> `QUOTATION` -> `CONFIRMED` -> `ACTIVE` -> `CLOSED`.
- Auto-renewal intervals (`MONTHLY`, `QUARTERLY`, `ANNUALLY`).
- Next billing date computation based on agreement start date and interval.

## Public API (`index.ts`)
Only import from this module via `@/modules/subscriptions`.
- `subscriptionService.listSubscriptions(customerId?: string): Promise<SubscriptionDTO[]>`
- `subscriptionService.getSubscriptionById(id: string): Promise<SubscriptionDTO>`
- `subscriptionService.createSubscription(dto: CreateSubscriptionDTO): Promise<SubscriptionDTO>`
- `subscriptionService.transitionStatus(id: string, targetStatus: SubscriptionStatusType): Promise<SubscriptionDTO>`

## TODOs for Dev B
1. [ ] Implement database transactions when creating subscriptions with lines.
2. [ ] Emit lifecycle transition events to notify the billing engine when a subscription transitions to `ACTIVE`.
3. [ ] Implement prorated line adjustments for mid-cycle plan upgrades.
