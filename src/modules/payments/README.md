# Payments Module (`src/modules/payments`)

**OWNER**: Dev B (`@devB`)  
**Domain**: Payment Recording & Invoice Reconciliation

## Responsibilities
- Record payments against invoices across multiple payment methods (`CREDIT_CARD`, `BANK_TRANSFER`, `CASH`, `UPI`).
- Transition associated invoice status to `PAID` when fully paid.
- Maintain idempotent payment records and transaction reference audit logs.

## Public API (`index.ts`)
Only import from this module via `@/modules/payments`.
- `paymentService.recordPayment(dto: RecordPaymentDTO): Promise<PaymentReceipt>`

## TODOs for Dev B
1. [ ] Support partial invoice payments and outstanding balance calculation.
2. [ ] Integrate webhook receiver for payment gateways (e.g. Stripe / Razorpay).
3. [ ] Emit invoice paid event to trigger receipt generation.
