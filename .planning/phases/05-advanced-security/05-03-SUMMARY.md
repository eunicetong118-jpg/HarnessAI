---
phase: 05-advanced-security
plan: 03
subsystem: Security
tags: [2FA, backup-codes, security-headers, CSP, next-auth]
requirements: [AUTH-06, SEC-01]
tech-stack: [Next.js, NextAuth v5, otplib, bcryptjs, CSP]
key-files: [services/security.service.ts, middleware.ts, next.config.mjs, app/auth/2fa/page.tsx, components/dashboard/settings/BackupCodes.tsx]
metrics:
  duration: 45m
  tasks: 3
  files_modified: 10
---

# Phase 5 Plan 3: 2FA Recovery & Hardening Summary

Implemented recovery mechanisms for 2FA, integrated the multi-step login flow into NextAuth, and hardened the application with security headers and a Content Security Policy.

## Key Changes

### 2FA Recovery (Backup Codes)
- **Hashed Storage**: Backup codes are now hashed using `bcryptjs` before being stored in the database, ensuring they cannot be leaked from a database compromise.
- **Service Logic**: Implemented `regenerateBackupCodes` and updated `verifySecurityCode` to handle hashed backup code verification and consumption.
- **UI Component**: Created `BackupCodes.tsx` which allows users to view, download (as TXT), and regenerate their recovery codes.

### NextAuth 2FA Integration
- **Session Tracking**: Updated NextAuth configuration to track `totpEnabled` and `twoFactorVerified` in the JWT and session.
- **Middleware Guard**: Implemented a mandatory redirect to `/auth/2fa` for any user who has TOTP enabled but hasn't verified it in the current session.
- **Challenge Page**: Created `/auth/2fa` page that prompts for a TOTP or backup code and updates the session using `useSession().update()` upon success.
- **Global Provider**: Added `SessionProvider` to the root layout to support client-side session state updates.

### Infrastructure Hardening
- **Security Headers**: Configured `next.config.mjs` with HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), and Referrer-Policy.
- **Content Security Policy (CSP)**: Implemented a nonce-based CSP in `middleware.ts` to mitigate XSS attacks.
- **Route Protection**: Enhanced middleware to protect both `/dashboard` and `/admin` routes.

## Deviations from Plan

### Rule 1 - Security Enhancement
- **Hashed Backup Codes**: The plan mentioned hashing backup codes, but I ensured the implementation uses `bcrypt.compare` to verify them against stored hashes rather than direct string comparison, which was the previous (unsecure) stub.

### Rule 3 - Infrastructure Fix
- **SessionProvider**: Added `SessionProvider` to the root layout which was not explicitly in the plan but is required for `useSession().update()` to work on the 2FA challenge page.

## Verification Results

### Automated Tests
- `services/security.service.test.ts`: PASSED (8 tests)
  - Verified hashed backup code generation.
  - Verified TOTP verification.
  - Verified backup code consumption and removal.

### Manual Verification Steps (documented for QA)
1. Enable 2FA in Dashboard Settings.
2. Observe 10 backup codes being displayed.
3. Log out and log back in.
4. Verify redirection to `/auth/2fa`.
5. Enter a valid TOTP code → success redirection to dashboard.
6. Repeat login, enter a backup code → success redirection to dashboard.
7. Verify backup code is consumed and cannot be used again.
8. Check Response Headers for CSP and Security Headers.

## Known Stubs
- None. All security logic is fully implemented with real hashing and verification.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: authentication | middleware.ts | Enforces 2FA check before allowing access to protected routes |
| threat_flag: content-security-policy | middleware.ts | Nonce-based CSP implemented for XSS protection |

## Self-Check: PASSED
- [x] All tasks executed.
- [x] Each task committed.
- [x] SUMMARY.md created.
- [x] STATE.md updated.
- [x] Final metadata commit made.
