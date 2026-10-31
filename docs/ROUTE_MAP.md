# LoopOS Route Map & Screen Registry

> **Single Source of Truth**: Synchronized directly with `src/contracts/routes.ts` (`ROUTES`).  
> Aligns Google Stitch UI designs (30 screens) with Next.js App Router and backend domain modules.

| # | Stitch Screen | Route Path | Role Required | API Prefix | Domain Module | UI Owner | Backend Owner | MVP |
|---|---|---|---|---|---|---|---|---|
| 01 | `01-login` | `/login` | `public` | `/api/auth` | `auth` | Dev C | Dev B | Yes |
| 02 | `02-signup` | `/signup` | `public` | `/api/auth` | `auth` | Dev C | Dev B | Yes |
| 03 | `03-forgot-password` | `/forgot-password` | `public` | `/api/auth` | `auth` | Dev C | Dev B | Yes |
| 04 | `04-reset-password` | `/reset-password` | `public` | `/api/auth` | `auth` | Dev C | Dev B | Yes |
| 05 | `05-dashboard` | `/admin` | `staff_or_admin` | `/api/reports` | `reports` | Dev C | Dev A | Yes |
| 06 | `06-products-list` | `/admin/products` | `staff_or_admin` | `/api/products` | `catalog` | Dev C | Dev B | Yes |
| 07 | `07-product-editor` | `/admin/products/[id]` | `admin` | `/api/products` | `catalog` | Dev C | Dev B | Yes |
| 08 | `08-plans-list` | `/admin/plans` | `staff_or_admin` | `/api/plans` | `catalog` | Dev C | Dev B | Yes |
| 09 | `09-plan-editor` | `/admin/plans/[id]` | `admin` | `/api/plans` | `catalog` | Dev C | Dev B | Yes |
| 10 | `10-quotation-templates` | `/admin/templates` | `staff_or_admin` | `/api/templates` | `catalog` | Dev C | Dev B | Yes |
| 11 | `11-subscriptions-list` | `/admin/subscriptions` | `staff_or_admin` | `/api/subscriptions` | `subscriptions` | Dev C | Dev B | Yes |
| 12 | `12-subscription-detail` | `/admin/subscriptions/[id]` | `staff_or_admin` | `/api/subscriptions` | `subscriptions` | Dev C | Dev B | Yes |
| 13 | `13-customers-list` | `/admin/customers` | `staff_or_admin` | `/api/customers` | `customers` | Dev C | Dev B | No |
| 14 | `14-customer-detail` | `/admin/customers/[id]` | `staff_or_admin` | `/api/customers` | `customers` | Dev C | Dev B | No |
| 15 | `15-invoices-list` | `/admin/invoices` | `staff_or_admin` | `/api/invoices` | `invoices` | Dev C | Dev A | Yes |
| 16 | `16-invoice-detail` | `/admin/invoices/[id]` | `staff_or_admin` | `/api/invoices` | `invoices` | Dev C | Dev A | Yes |
| 17 | `17-billing-run` | `/admin/billing` | `staff_or_admin` | `/api/billing` | `billing` | Dev C | Dev A | Yes |
| 18 | `18-payments` | `/admin/payments` | `staff_or_admin` | `/api/payments` | `payments` | Dev C | Dev B | Yes |
| 19 | `19-discounts` | `/admin/discounts` | `admin` | `/api/discounts` | `discounts` | Dev C | Dev A | Yes |
| 20 | `20-tax-rules` | `/admin/taxes` | `admin` | `/api/taxes` | `tax` | Dev C | Dev A | Yes |
| 21 | `21-staff` | `/admin/staff` | `admin` | `/api/staff` | `staff` | Dev C | Dev B | Yes |
| 22 | `22-reports` | `/admin/reports` | `staff_or_admin` | `/api/reports` | `reports` | Dev C | Dev A | Yes |
| 23 | `23-ask-your-data` | `/admin/ask` | `staff_or_admin` | `/api/ask` | `ask` | Dev C | Dev A | No |
| 24 | `24-settings` | `/admin/settings` | `admin` | `/api/settings` | `settings` | Dev C | Dev A | No |
| 25 | `25-portal-home` | `/portal` | `customer` | `/api/portal` | `subscriptions` | Dev C | Dev B | Yes |
| 26 | `26-portal-subscriptions` | `/portal/subscriptions` | `customer` | `/api/portal` | `subscriptions` | Dev C | Dev B | Yes |
| 27 | `27-portal-subscription-detail` | `/portal/subscriptions/[id]` | `customer` | `/api/portal` | `subscriptions` | Dev C | Dev B | Yes |
| 28 | `28-portal-invoices` | `/portal/invoices` | `customer` | `/api/portal` | `invoices` | Dev C | Dev A | Yes |
| 29 | `29-portal-invoice-detail` | `/portal/invoices/[id]` | `customer` | `/api/portal` | `invoices` | Dev C | Dev A | Yes |
| 30 | `30-portal-profile` | `/portal/profile` | `customer` | `/api/portal` | `auth` | Dev C | Dev B | No |
