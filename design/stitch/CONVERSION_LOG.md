# Stitch UI to Next.js Conversion Log

| Screen ID | Source File | Converted Page Path | Status | Notes on Unmapped Elements |
|---|---|---|---|---|
| `01-login` | `01-login/screen.png` | `/login` | `completed` | Converted to Next.js App Router with Zod validation, React Hook Form, password toggle, and Google SSO button. Split-brand layout with ambient glow. |
| `02-signup` | `02-signup/screen.png` | `/signup` | `completed` | Converted with real-time password policy checklist (> 8 chars, uppercase, lowercase, special char), company name, and Lucide icons. |
| `03-forgot-password` | `03-forgot-password/screen.png` | `/forgot-password` | `completed` | Converted with email validation, success notice feedback, and link back to login. |
| `04-reset-password` | `04-reset-password/screen.png` | `/reset-password` | `completed` | Converted with password strength rule checklist, confirmation matching, and token parameter handling. |
| `05-dashboard` | `05-dashboard/screen.png` | `/admin` | `completed` | Converted to DashboardOverview with 5 KPI cards in paise/INR, fast-forward time travel buttons, quick action triggers, and recent tables. |
| `06-products-list` | `06-products-list/screen.png` | `/admin/products` | `completed` | Converted with DataTable, price formatting in INR minor units, variant tags, and search/filter. |
| `07-product-editor` | `07-product-editor/screen.png` | `/admin/products/[id]` | `completed` | Converted with Zod form, variant price extra dynamic adder/remover, and tax code selector. |
| `08-plans-list` | `08-plans-list/screen.png` | `/admin/plans` | `completed` | Converted with billing intervals, auto-renew badges, self-service flags, and price chips. |
| `09-plan-editor` | `09-plan-editor/screen.png` | `/admin/plans/[id]` | `completed` | Converted with recurring period selector, price minor units input, and agreement lifecycle toggles. |
| `10-quotation-templates` | `10-quotation-templates/screen.png` | `/admin/templates` | `completed` | Converted with bundle cards, included product lines, and quotation generator modal. |
| `11-subscriptions-list` | `11-subscriptions-list/screen.png` | `/admin/subscriptions` | `completed` | Converted with status tabs (draft, confirmed, active, closed), search, and recurring total in INR. |
| `12-subscription-detail` | `12-subscription-detail/screen.png` | `/admin/subscriptions/[id]` | `completed` | Converted with visual Stepper, customer card, service lines table, and transition action modal buttons. |
| `13-customers-list` | `13-customers-list/screen.png` | `/admin/customers` | `completed` | Converted with customer directory, GSTIN tags, MRR rollups, and contact details. |
| `14-customer-detail` | `14-customer-detail/screen.png` | `/admin/customers/[id]` | `completed` | Converted with customer profile, rollups, related subscriptions table, invoices table, and invite modal. |
| `15-invoices-list` | `15-invoices-list/screen.png` | `/admin/invoices` | `completed` | Converted with status tabs (paid, confirmed, overdue), overdue warnings, and total INR amounts. |
| `16-invoice-detail` | `16-invoice-detail/screen.png` | `/admin/invoices/[id]` | `completed` | Converted with itemized billing table, GST split breakdown, audit calculation drawer, and PDF export. |
| `17-billing-run` | `17-billing-run/screen.png` | `/admin/billing` | `completed` | Converted with batch runner console, fast-forward target date picker, preview stats, and execution logs. |
| `18-payments` | `18-payments/screen.png` | `/admin/payments` | `completed` | Converted with payments ledger, payment method chips, and record manual payment modal. |
| `19-discounts` | `19-discounts/screen.png` | `/admin/discounts` | `completed` | Converted with coupon campaigns, usage progress bars, and create discount modal with fixed/percent modes. |
| `20-tax-rules` | `20-tax-rules/screen.png` | `/admin/taxes` | `completed` | Converted with GST tax rule ledger, intra-state (CGST+SGST) vs inter-state (IGST) split, and add rule modal. |
| `21-staff` | `21-staff/screen.png` | `/admin/staff` | `completed` | Converted with staff directory, role badges (ADMIN vs STAFF), active status toggles, and invite modal. |
| `22-reports` | `22-reports/screen.png` | `/admin/reports` | `completed` | Converted with MRR/ARR analytics, aging receivables distribution bars, and export options. |
| `23-ask-your-data` | `23-ask-your-data/screen.png` | `/admin/ask` | `completed` | Converted with natural language query console, suggested query chips, AST filter explanation, and tabular results. |
| `24-settings` | `24-settings/screen.png` | `/admin/settings` | `completed` | Converted with legal entity identity, GSTIN tax ID, sequence prefixes (INV/SUB), and dunning schedules. |
| `25-portal-home` | `25-portal-home/screen.png` | `/portal` | `completed` | Converted with customer welcome banner, unpaid invoice alert banner, KPI cards, and instant pay modal. |
| `26-portal-subscriptions` | `26-portal-subscriptions/screen.png` | `/portal/subscriptions` | `completed` | Converted with customer agreements list, term dates, included services, and status tabs. |
| `27-portal-subscription-detail` | `27-portal-subscription-detail/screen.png` | `/portal/subscriptions/[id]` | `completed` | Converted with visual Stepper, line item breakdown, self-service renewal, pause, and cancel modal. |
| `28-portal-invoices` | `28-portal-invoices/screen.png` | `/portal/invoices` | `completed` | Converted with tax invoices table, payment status filter, PDF download, and instant pay modal. |
| `29-portal-invoice-detail` | `29-portal-invoice-detail/screen.png` | `/portal/invoices/[id]` | `completed` | Converted with buyer/seller GST tax cards, itemized rates, GST calculation breakdown, and pay action. |
| `30-portal-profile` | `30-portal-profile/screen.png` | `/portal/profile` | `completed` | Converted with organization profile form and password change form with live security checklist. |
