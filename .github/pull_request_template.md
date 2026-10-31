## Summary of Changes
<!-- Provide a 1-2 sentence description of what this PR introduces. -->

## Route IDs & Stitch Screens Touched
<!-- Specify which of the 30 route IDs (from src/contracts/routes.ts) were added or modified -->
- Route IDs touched: 
- Stitch screens converted: [ ] Yes [ ] No (screen ID: ________)

## Contract & Module Changes
- Contract changed? [ ] Yes [ ] No (file: `src/contracts/________.ts`)
- Module ownership:
  - [ ] Dev A (`billing` | `tax` | `discounts` | `invoices` | `reports` | `ask` | `settings` | `lib`)
  - [ ] Dev B (`auth` | `rbac` | `catalog` | `subscriptions` | `payments` | `customers` | `staff`)
  - [ ] Dev C (`src/app` | `src/components` | `src/config` | `design/stitch`)

## Pre-Merge Verification Checklist
- [ ] **make check passed**: Ran `make check` (lint, typecheck, check-routes, check-api, tests) cleanly.
- [ ] **MOCK_API tested?**: Verified that mock fixtures and delays respond properly with `MOCK_API=true`.
- [ ] **RBAC test added?**: Added or updated role-based access / ownership tests under `tests/`.
- [ ] **No Import Boundary Violations**: UI and route handlers do not import Prisma or repo files directly.
- [ ] **Zero-Float Money Rule**: All financial amounts are integer minor units (paise) via `@/lib/money` or `@/lib/format`.
- [ ] **Time-Travel Clock Rule**: Injected time using `clock.now()` instead of naked `new Date()`.
- [ ] **Owner Sign-off**: Reviewed and approved by the assigned path owner.
