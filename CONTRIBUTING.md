# LoopOS Engineering & Contribution Guidelines

Welcome to the LoopOS hackathon codebase. We operate as a high-velocity **Modular Monolith**. Three developers work simultaneously in the same repo without stepping on each other's toes by adhering to strict boundaries, contract-first design, and rigorous Git hygiene.

---

## 1. Team Ownership & Responsibilities ("Who Edits What")

| Developer | Domain | Paths Owned | Invariants & Hotspots |
| :--- | :--- | :--- | :--- |
| **Dev A** (`@devA`) | **Billing, Data, Tax, Discounts, Invoices, Reports, Ask, Settings, Lib** | `prisma/schema.prisma`<br>`prisma/seed/seed-billing.ts`<br>`prisma/seed/seed-bulk.ts`<br>`src/modules/{billing,tax,discounts,invoices,reports,ask,settings}/`<br>`src/lib/`<br>`src/app/api/{invoices,billing,discounts,taxes,reports,ask,settings}/` | **Sole Editor of `prisma/schema.prisma` and migrations.** Other devs request fields via PR. |
| **Dev B** (`@devB`) | **Auth, RBAC, Catalog, Subscriptions, Payments, Customers, Staff** | `prisma/seed/seed-catalog.ts`<br>`src/modules/{auth,rbac,catalog,subscriptions,payments,customers,staff}/`<br>`src/app/api/{auth,products,plans,templates,subscriptions,customers,payments,staff}/` | Backend owners expose API endpoints and contracts; they never modify navigation or layout files. |
| **Dev C** (`@devC`) | **Frontend UI, Layouts, Design System & Stitch** | `src/app/(public)/`<br>`src/app/(admin)/`<br>`src/app/(portal)/`<br>`src/components/`<br>`src/config/`<br>`src/mocks/`<br>`design/stitch/` | **Sole Editor of `globals.css`, navigation configs, and page layouts.** |

---

## 2. The 3-Layer Architecture Rule

Every feature follows this strict unidirectional flow:

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

## 3. Parallel Integration Order

To keep all 3 developers moving rapidly without blocking each other:

1. **Phase 1: Contracts First**  
   Dev A & B finalize Zod schemas and TypeScript types in `src/contracts/*.ts` and enums in `src/contracts/enums.ts`.
2. **Phase 2: Mocks Second (`MOCK_API=true`)**  
   Dev C builds the 30 Stitch UI screens against typed fixtures in `src/mocks/*` with simulated 300ms network latency. No database connection required.
3. **Phase 3: Real Logic Third**  
   Dev A and B implement real Prisma queries, GST splits, and billing state machines inside their respective `src/modules/*` domains.
4. **Phase 4: Feature-by-Feature Toggle**  
   Flip `MOCK_API=false` per feature as database integrations are verified with `make test`.

---

## 4. Suggested Screen Build Order

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

## 5. Conflict Hotspots & Mitigation Protocol

Merge conflicts destroy momentum. Follow these non-negotiable protocols:

### A. Database Schema (`prisma/schema.prisma` & migrations)
- **Sole Editor**: **Only Dev A** edits `prisma/schema.prisma` and generates migrations.
- **Change Request Protocol**: If Dev B or C needs a new model or field:
  1. Post the field specification in the team chat / PR description.
  2. Dev A implements the schema change and migration within **30 minutes**.
  3. Dev A pushes to `main`, and B/C pull immediately.
- **Migration Rule**: **Never edit an existing migration file.** Always create a new sequential migration.

### B. Navigation & Layouts
- **Sole Editor**: **Only Dev C** edits layout and navigation files (`src/app/**/layout.tsx`, `src/config/navigation.ts`, `globals.css`).
- Backend developers (A and B) expose data via contracts and API routes; they do **not** add menu items or modify navigation bars.

### C. Shared Contracts (`src/contracts/`)
- Contracts are isolated: **one file per domain** (e.g., `contracts/customer.ts`, `contracts/invoice.ts`).
- Devs only modify their assigned domain contract. If changes affect other domains, request approval via PR.
- Keep schemas strictly typed using Zod with runtime and static parity.

### D. Package Dependencies (`package.json`)
- Before running `npm install <package>`, announce the package in the team chat.
- Prefer existing utilities in `src/lib/` before adding external dependencies.

---

## 6. Git & Branching Strategy

- **`main` is protected and always demo-ready.** Direct pushes to `main` are blocked.
- **Branch Naming**: Prefix branches with your assigned developer letter:
  - `a/<feature-name>` (e.g., `a/billing-engine-idempotency`)
  - `b/<feature-name>` (e.g., `b/subscription-state-machine`)
  - `c/<feature-name>` (e.g., `c/customer-portal-subscriptions`)
- **Cadence**: Keep branches small and short-lived. Aim to merge into `main` **at least every 2 hours**.
- **Rebase Before PR**: Always rebase on latest `main` before opening or merging a PR:
  ```bash
  git checkout main
  git pull origin main
  git checkout <your-branch>
  git rebase main
  ```
- **Review & Merge**: At least **one peer review** is required. Use **Squash and Merge** to keep the `main` history clean and bisect-friendly.
- **6-Hour Integration Checkpoint**:
  - Every 6 hours, all developers stop feature work, merge current PRs to `main`, and run:
    ```bash
    make seed && make test && make test-e2e
    ```
  - Verify that the end-to-end demo flow runs cleanly.

---

## 7. Architectural Invariants (Enforced by ESLint & Code Review)

1. **Import Boundaries**:
   - Other modules may **only** be imported via their root index:
     ```typescript
     // ✅ ALLOWED
     import { BillingService } from "@/modules/billing";

     // ❌ FORBIDDEN (Blocked by ESLint)
     import { generateInvoices } from "@/modules/billing/service";
     import { billingRepo } from "@/modules/billing/repo";
     ```
   - UI code (`src/app/`, `src/components/`) must **NEVER** import from Prisma or any module `repo.ts`.
2. **Zero-Float Money Rule**:
   - Floating-point arithmetic (`0.1 + 0.2 !== 0.3`) causes billing catastrophes.
   - All monetary amounts are stored and calculated as **integer minor units** (paise or cents) using `@/lib/money`.
3. **Time-Travel Clock Rule**:
   - Business logic must **NEVER** call `new Date()` directly.
   - Always inject the current time using `@/lib/clock`:
     ```typescript
     import { clock } from "@/lib/clock";
     const today = clock.now();
     ```
4. **Thin Route Handlers**:
   - API route handlers (`src/app/api/**/route.ts`) must contain **zero business logic**.
   - Responsibilities: validate input via Zod contracts -> check RBAC -> invoke module service -> return standardized JSON response.

---

## 8. Guardrails: Run `make check`

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
