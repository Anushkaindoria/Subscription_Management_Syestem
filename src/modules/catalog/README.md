# Catalog Module (`src/modules/catalog`)

**OWNER**: Dev B (`@devB`)  
**Domain**: Products, Variants, Pricing Plans & Quotation Templates

## Responsibilities
- Catalog of billable products and add-on feature tiers.
- Variant price increments (`priceExtra` integer minor units).
- Recurring billing intervals (`MONTHLY`, `QUARTERLY`, `ANNUALLY`).
- Quotation templates bundling multiple products and predefined discount lines.

## Public API (`index.ts`)
Only import from this module via `@/modules/catalog`.
- `catalogService.getProducts(): Promise<ProductDTO[]>`
- `catalogService.getPlans(): Promise<PlanDTO[]>`
- `catalogService.getQuotationTemplates(): Promise<QuotationTemplateDTO[]>`

## TODOs for Dev B
1. [ ] Implement CRUD route handlers for admin product management.
2. [ ] Add inventory / availability checks if physical add-ons are modeled.
