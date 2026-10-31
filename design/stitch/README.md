# Google Stitch Design Asset Directory

This directory stores exported screen designs, layout frames, and component sheets exported from Google Stitch.

## Naming & Folder Convention
All exported screen assets must be saved under `desktop/<stitchScreen>` and `mobile/<stitchScreen>` using the exact kebab-case identifier defined in `src/contracts/routes.ts`:
- Format: `<two-digit-number>-<kebab-screen-name>`
- Examples: `01-login`, `05-dashboard`, `11-subscriptions-list`, `25-portal-home`.

## ⚠️ Architectural Invariant
Design files are **reference-only artifacts**.
Application code (`src/`) must **NEVER** import from `design/`. This is strictly enforced via `tsconfig.json` and `.eslintrc.json`.
