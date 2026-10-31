# Staff Module (`src/modules/staff`)

**OWNER**: Dev B (`@devB`)  
**Domain**: Internal Staff Management & Admin Delegation

## Responsibilities
- Staff member creation, activation/deactivation, and department assignment.
- Role binding strictly to `Role.STAFF`.
- Admin-only access guards enforced across all endpoints.

## Public API (`index.ts`)
Only import from this module via `@/modules/staff`.
- `staffService.listStaff(): Promise<StaffMemberDTO[]>`
- `staffService.getStaffById(id: string): Promise<StaffMemberDTO>`
- `staffService.createStaff(dto: CreateStaffMemberDTO): Promise<StaffMemberDTO>`
- `staffService.updateStaff(id: string, dto: UpdateStaffMemberDTO): Promise<StaffMemberDTO>`

## TODOs for Dev B
1. [ ] Implement invitation email with single-use password creation token.
2. [ ] Integrate with audit logging for staff deactivation events.
