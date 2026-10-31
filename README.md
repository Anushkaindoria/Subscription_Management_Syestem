# LoopOS - Subscription Management System

> **A High-Velocity Modular Monolith for Predictable SaaS Recurring Billing, Tax Compliance, and Customer Self-Service.**

LoopOS is architected as a single deployable web application backed by PostgreSQL, enforcing strict, decoupled domain boundaries. Three specialized engineers build simultaneously in parallel with zero file collision.

---

## 🚀 Setup in 5 Commands

Get up and running locally in under two minutes:

```bash
# 1. Clone the repository
git clone https://github.com/Anushkaindoria/Subscription_Management_Syestem.git loopos && cd loopos

# 2. Copy environment configuration
cp .env.example .env

# 3. Spin up PostgreSQL and Mailpit email sandbox
docker compose up -d

# 4. Install dependencies and generate Prisma client
npm install && npx prisma generate

# 5. Run architectural guardrails and launch dev server
make check && npm run dev
```

Visit the application at:
- **Web App Gateway**: [http://localhost:3000](http://localhost:3000)
- **Admin Console**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Customer Portal**: [http://localhost:3000/portal](http://localhost:3000/portal)
- **Mailpit Web UI**: [http://localhost:8025](http://localhost:8025)

---

## 🏛️ The 3-Layer Architecture Rule

Every user action strictly traverses this unidirectional flow:

```
[Google Stitch Design]
         │
         ▼
1. Frontend Page (src/app/**) ──── OWNER: Dev C
   - Renders design-system primitives (@/components/ui)
   - Fetches data via typed client (@/lib/api-client)
   - Never touches Prisma or backend repos directly!
         │
         ▼
2. API Route Handler (src/app/api/**) ──── OWNER: Dev A or Dev B
   - Thin wrapper: validates request body using Zod contract (@/contracts/*)
   - Asserts role permissions & customer tenant ownership via RBAC guard
   - Invokes domain service method from module public API (@/modules/<domain>)
         │
         ▼
3. Module Service & Repository (src/modules/<domain>/*) ──── OWNER: Dev A or Dev B
   - Pure business logic & state machines (clock.now(), Money integer math)
   - Data access strictly via private repo.ts querying PostgreSQL via Prisma
```

---

## 🔄 Parallel Integration Order

To keep all 3 developers moving without blocking each other:

1. **Phase 1: Contracts First**  
   Dev A & B finalize Zod schemas and TypeScript types in `src/contracts/*.ts` and enums in `src/contracts/enums.ts`.
2. **Phase 2: Mocks Second (`MOCK_API=true`)**  
   Dev C builds the 30 Stitch UI screens against typed fixtures in `src/mocks/*` with simulated 300ms network latency. No database connection required.
3. **Phase 3: Real Logic Third**  
   Dev A and B implement real Prisma queries, GST splits, and billing state machines inside their respective `src/modules/*` domains.
4. **Phase 4: Feature-by-Feature Toggle**  
   Flip `MOCK_API=false` per feature as database integrations are verified with `make test`.

---

## 📋 Suggested Screen Build Order

1. **Screen 01 & 02: Login & Signup** (`/login`, `/signup`) - Auth session establishment and password boundary rules.
2. **Screen 05: Executive Dashboard** (`/admin`) - KPI cards, MRR, outstanding receivables, fast-forward time-travel trigger.
3. **Screen 11 & 12: Subscriptions List & Detail** (`/admin/subscriptions`, `/admin/subscriptions/[id]`) - Agreement lifecycle FSM (`Draft` → `Quotation` → `Confirmed` → `Active` → `Closed`).
4. **Screen 15 & 16: Invoices List & Detail** (`/admin/invoices`, `/admin/invoices/[id]`) - GST breakdown, line item trace, PDF preview.
5. **Screen 17: Billing Run Console** (`/admin/billing`) - Catch-up billing batch execution, idempotent deduplication preview.
6. **Screen 18: Payments Ledger** (`/admin/payments`) - Multi-mode payment recording (Bank Transfer, UPI, Card, Cash, Cheque) and auto-reconciliation.
7. **Screens 06–10: Catalog & Pricing** (`/admin/products`, `/admin/plans`, `/admin/templates`) - Variant price increments and quotation bundles.
8. **Screens 13, 14, 19, 20, 21, 24: Rules & Admin** - Customer management, coupon limits, tax rates, staff, system settings.
9. **Screens 25–30: Customer Self-Service Portal** (`/portal/**`) - Tenant-scoped agreements, invoice downloads, and digital payment receipts.

---

## 👥 Who Edits What & Conflict Hotspots

| Developer | Primary Domains | Paths Owned | Sole-Editor Invariants |
| :--- | :--- | :--- | :--- |
| **Dev A**<br>`@devA` | **Billing, Invoicing, Tax, Discounts, Reports, Ask, Settings, Lib** | `prisma/schema.prisma`<br>`prisma/seed/seed-billing.ts`<br>`prisma/seed/seed-bulk.ts`<br>`src/modules/{billing,tax,discounts,invoices,reports,ask,settings}/`<br>`src/lib/`<br>`src/app/api/{invoices,billing,discounts,taxes,reports,ask,settings}/` | **Only Dev A edits `prisma/schema.prisma` and migrations.** Other devs request fields via PR. |
| **Dev B**<br>`@devB` | **Auth, RBAC, Catalog, Subscriptions, Payments, Customers, Staff** | `prisma/seed/seed-catalog.ts`<br>`src/modules/{auth,rbac,catalog,subscriptions,payments,customers,staff}/`<br>`src/app/api/{auth,products,plans,templates,subscriptions,customers,payments,staff}/` | Backend owners expose API endpoints and contracts; they never modify navigation or layout files. |
| **Dev C**<br>`@devC` | **Frontend UI, Layouts, Design System & Stitch** | `src/app/(public)/`<br>`src/app/(admin)/`<br>`src/app/(portal)/`<br>`src/components/`<br>`src/config/`<br>`src/mocks/`<br>`design/stitch/` | **Only Dev C edits `globals.css`, navigation configs, and page layouts.** |

### Conflict Mitigation Hotspots
1. **Database Schema (`prisma/schema.prisma`)**: Sole editor is Dev A. Dev B & C post schema needs in team chat; Dev A commits within 30 min. Never edit existing migrations.
2. **Navigation & Layouts**: Sole editor is Dev C. Backend devs expose data, not menu items.
3. **Shared Contracts (`src/contracts/`)**: Isolated one file per domain (e.g. `customer.ts`, `invoice.ts`). Devs only modify their assigned domain contract.
4. **Dependencies (`package.json`)**: Announce in team chat before adding external packages.

---

## 🛡️ Guardrails: Run `make check`

Before opening any PR, run:

```bash
make check
```

This runs 5 automated checks in sequence:
1. `npm run lint`: Verifies strict import boundaries (UI and API routes never import Prisma or repos directly).
2. `npm run typecheck`: Strict TypeScript compilation across all routes and contracts.
3. `npm run check:routes`: Verifies that all 30 screens have corresponding pages, modules, CODEOWNERS entries, and Stitch folders.
4. `npm run check:api`: Verifies that all 53 API routes exist and contain zero architectural boundary leaks.
5. `npm run test`: Executes unit tests, contract drift tests (Prisma enums == `src/contracts/enums.ts`), and RBAC tests.
