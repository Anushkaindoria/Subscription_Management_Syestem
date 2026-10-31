# Customers Module (`src/modules/customers`)

**OWNER**: Dev B (`@devB`)  
**Domain**: Customer Directory, GSTIN Compliance, Portal Invites & Rollups

## Responsibilities
- Customer records, corporate tax IDs (GSTIN validation) and multi-tenant scoping.
- Customer portal invitation links with secure token dispatch.
- Per-customer executive rollups: active agreement count, current MRR, and overdue invoices.

## Public API (`index.ts`)
Only import from this module via `@/modules/customers`.
- `customerService.listCustomers(): Promise<CustomerDTO[]>`
- `customerService.getCustomerById(id: string): Promise<CustomerDTO>`
- `customerService.getCustomerRollup(id: string): Promise<CustomerRollup>`
- `customerService.createCustomer(dto: CreateCustomerDTO): Promise<CustomerDTO>`
- `customerService.updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<CustomerDTO>`
- `customerService.sendPortalInvite(id: string): Promise<{ success: boolean; inviteUrl: string }>`

## TODOs for Dev B
1. [ ] Implement Indian GSTIN 15-character checksum algorithm validation.
2. [ ] Emit customer created event for audit logging.
