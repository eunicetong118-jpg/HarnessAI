# TODOS

## Authentication
- **Shorten Action Tokens**: Reduced from 32 bytes to 16 bytes for better email compatibility. **Priority:** P1
- **Real Email Provider**: Replace `lib/email.ts` stub with Resend or SendGrid. **Priority:** P1
- **NextAuth Middleware Sync**: Ensure NextAuth session data includes `isEmailVerified` and `isDisabled` flags. **Priority:** P0

## Onboarding
- **MT5 Linkage UI**: Implement the `/onboarding` page with country mapping. **Priority:** P0

## Completed
- **BigInt Serialization**: Added global polyfill for BigInt JSON support. **Completed:** v1.20.0.0 (2026-04-30)
- **DB Performance**: Added indexes to `userId` fields in all relation models. **Completed:** v1.20.0.0 (2026-04-30)
- **Middleware Optimization**: Narrowed matcher to protected routes only. **Completed:** v1.20.0.0 (2026-04-30)
