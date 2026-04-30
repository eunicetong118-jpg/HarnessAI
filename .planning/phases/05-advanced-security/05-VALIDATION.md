# Phase 05: Advanced Security - Validation Plan

This document tracks the validation criteria for Phase 05.

## TOTP Enrollment
- [ ] User can generate a 2FA secret and see a QR code.
- [ ] 2FA secrets are encrypted in the database immediately upon enrollment start.
- [ ] User can verify a TOTP code to enable 2FA.
- [ ] QR DataURL is generated on the server and raw secret is never exposed to the client.

## Withdrawal Guard
- [ ] Withdrawals require a valid TOTP token if 2FA is enabled.
- [ ] Withdrawal tickets are blocked if 2FA is not verified (if applicable).

## Login 2FA
- [ ] Users with 2FA enabled are prompted for a TOTP token after password verification.
- [ ] Session is only established after successful TOTP verification.

## Backup Codes
- [ ] User can generate backup codes.
- [ ] Backup codes are stored as hashes (like passwords).
- [ ] Backup codes can be used to bypass TOTP once.

## Infrastructure Hardening
- [ ] ENCRYPTION_KEY is required and must be 32 bytes (64 hex chars).
- [ ] Vitest is configured and running unit/integration tests.
- [ ] Playwright is configured for E2E tests.
