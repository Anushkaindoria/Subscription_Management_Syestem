# Settings Module (`src/modules/settings`)

**OWNER**: Dev A (`@devA`)  
**Domain**: Organization Profile, Prefixes, Payment Terms & Schedules

## Responsibilities
- Company profile, registered tax identifier (GSTIN), and invoice header configurations.
- Document sequence prefixes (`INV-`, `SUB-`).
- Default payment terms and automated dunning/reminder schedules.

## Public API (`index.ts`)
Only import from this module via `@/modules/settings`.
- `settingsService.getSettings(): Promise<SystemSettingsDTO>`
- `settingsService.updateSettings(dto: UpdateSystemSettingsDTO): Promise<SystemSettingsDTO>`

## TODOs for Dev A
1. [ ] Back settings with a dedicated database table or Redis cache.
2. [ ] Add audit trail of setting updates.
