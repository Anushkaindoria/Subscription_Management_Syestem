# Auth Module (`src/modules/auth`)

**OWNER**: Dev B (`@devB`)  
**Domain**: Identity, Credentials & Password Security

## Responsibilities
- User registration and login flows.
- Password complexity enforcement (strict policy: 9+ chars, 1 uppercase, 1 lowercase, 1 special symbol).
- Secure password hashing and token generation.
- Password reset token generation and delivery via Mailpit SMTP.

## Public API (`index.ts`)
Only import from this module via `@/modules/auth`.
- `authService.login(dto: LoginDTO): Promise<AuthSession>`
- `authService.signup(dto: SignupDTO): Promise<AuthSession>`
- `authService.requestPasswordReset(dto: ResetPasswordRequestDTO): Promise<{ message: string }>`
- `authService.confirmPasswordReset(dto: ResetPasswordConfirmDTO): Promise<{ success: boolean }>`

## TODOs for Dev B
1. [ ] Install `bcryptjs` or `@node-rs/bcrypt` and replace dummy hash strings.
2. [ ] Integrate `jose` or `jsonwebtoken` for signed session tokens.
3. [ ] Connect password reset token generation with Mailpit SMTP transporter.
4. [ ] Implement rate-limiting on failed login attempts.
