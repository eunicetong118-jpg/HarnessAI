---
phase: 05-advanced-security
plan: 02
subsystem: Security
tags: [2fa, withdrawal, totp, backup-codes, vitest]
requires: [SEC-01]
provides: [withdrawal-2fa-guard]
metrics:
  duration: 25m
  tasks: 3
  files: 8
---

# Phase 05 Plan 02: Withdrawal 2FA Guard Summary

## Objective
Integrated 2FA verification (TOTP and Backup Codes) into the withdrawal flow to prevent unauthorized fund movement.

## Key Changes

### Security Service
- **Multi-Code Verification:** Implemented `verifySecurityCode` in `SecurityService` which supports both 6-digit TOTP tokens and 8-character backup codes.
- **Backup Codes:** Implemented backup code generation during 2FA enablement and consumption (one-time use) during verification.

### Withdrawal Flow
- **Service Guard:** Updated `createWithdrawal` in `withdrawal.service.ts` to require and verify a security code if 2FA is enabled for the user.
- **API Route:** Updated `/api/withdrawal` to handle `securityCode` in the request body and return specific error codes (`2FA_REQUIRED`, `INVALID_2FA_CODE`).
- **UI Challenge:** Created `TwoFactorChallenge` component and integrated it into `WithdrawalForm` to intercept withdrawal requests when 2FA is active.

### Testing
- **Unit Tests:** Updated `security.service.test.ts` and `withdrawal.service.test.ts` to verify 2FA guard logic using Vitest.
- **E2E Tests:** Added a Playwright E2E test skeleton in `tests/e2e/withdrawal-2fa.spec.ts` for future automated flow verification.

## Deviations from Plan
- **File Renaming:** The plan referenced `components/dashboard/WithdrawalModal.tsx`, but the actual component was `components/dashboard/WithdrawalForm.tsx`. Updated the latter.
- **Backup Code Generation:** Added `generateBackupCodes` to `lib/totp.ts` to support the requirement of providing backup codes upon 2FA enablement.

## Known Stubs
- **E2E Tests:** The Playwright tests are currently skipped as they require a more complex authentication setup/seeding that is out of scope for this atomic task.

## Threat Flags
| Flag | File | Description |
|------|------|-------------|
| threat_flag: auth-bypass-risk | `services/withdrawal.service.ts` | Enforces 2FA check before ledger debit. |
| threat_flag: data-leak-risk | `services/security.service.ts` | Handles backup code consumption and TOTP verification. |

## Self-Check: PASSED
- [x] Security service supports TOTP and Backup Codes
- [x] Withdrawal service enforces 2FA guard
- [x] UI prompts for 2FA when required
- [x] Unit tests pass for both services
- [x] API route correctly communicates 2FA requirements
