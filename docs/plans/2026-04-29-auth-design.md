# Design: Authentication & Email Verification (V4)

**Date**: 2026-04-29
**Status**: Approved

## Overview
Implementation of the core authentication lifecycle for the Rebate Portal, focusing on Credentials-first with a decoupled service layer for identity, token management, and email verification.

## Architecture
Using **Layered Services** approach:
- `auth.service.ts`: User lifecycle (registration, login via bcrypt cost 12, 2FA state).
- `actionToken.service.ts`: Generic secure token vault. Stores bcrypt hashes of random tokens with TTL.
- `emailVerification.service.ts`: Orchestrator for sending/verifying registration links via Nodemailer.

## Data Flow
1. **Registration**:
   - UI captures user details.
   - `auth.service` hashes password and creates `User`.
   - `emailVerification.service` generates a raw token, hashes it via `actionToken.service`, and dispatches email.
2. **Verification**:
   - User clicks `NEXTAUTH_URL/auth/verify/email?token=RAW&uid=UUID`.
   - Page verifies `ActionToken` (hash match + expiry check).
   - `User.isEmailVerified` set to `true`.
3. **Session Guard**:
   - `middleware.ts` executes sequential checks: `Session` -> `isDisabled` -> `isEmailVerified`.

## Security
- No plain text passwords or action tokens in DB.
- Rate limiting on auth endpoints (via Next.js/Middleware).
- Secure random token generation for links.

## Success Criteria
- [ ] User can register with valid credentials.
- [ ] User cannot login without verifying email (redirected to `/login?error=email_not_verified`).
- [ ] Verification link works once and expires after 24h.
- [ ] Disabled users are blocked regardless of verification status.
