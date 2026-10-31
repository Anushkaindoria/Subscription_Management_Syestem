# Invoices Module (`src/modules/invoices`)

**OWNER**: Dev A (`@devA`)  
**Domain**: Invoice State Machine, PDF Rendering Data & Dispatch

## Responsibilities
- Lifecycle management: `DRAFT` -> `CONFIRMED` -> `PAID` (or `VOID`, `OVERDUE`).
- Aggregation of taxable lines, applied discounts, and GST breakdown.
- Preparing structured PDF data for Dev C's printable template.
- Outbound invoice email notifications via Mailpit.

## Public API (`index.ts`)
Only import from this module via `@/modules/invoices`.
- `invoiceService.listInvoices(customerId?: string): Promise<InvoiceDTO[]>`
- `invoiceService.getInvoiceById(id: string): Promise<InvoiceDTO>`
- `invoiceService.transitionStatus(id: string, targetStatus: InvoiceStatusType): Promise<InvoiceDTO>`
- `invoiceService.getPdfData(id: string): Promise<InvoicePdfDataDTO>`
- `invoiceService.sendInvoiceEmail(id: string): Promise<{ success: boolean; recipient: string }>`

## TODOs for Dev A
1. [ ] Implement PDF generator using `@react-pdf/renderer` or HTML canvas.
2. [ ] Integrate with Mailpit SMTP to send attached PDF receipts on payment.
