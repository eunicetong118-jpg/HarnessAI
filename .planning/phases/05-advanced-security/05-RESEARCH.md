# Phase 5: Advanced Security - Research

**Researched:** 2026-04-30
**Domain:** TOTP 2FA, QR Codes, Security Middleware, Secret Management, Infrastructure Hardening
**Confidence:** HIGH

## Summary

This research phase defines the implementation strategy for Phase 5 (Advanced Security). The primary focus is on implementing **TOTP 2FA** for users and integrating it into high-risk actions (Withdrawals), while also hardening the overall infrastructure through security headers, CSP, and encrypted storage of sensitive credentials.

**Primary recommendation:** Use `otplib` (authenticator) for TOTP management and `qrcode` for enrollment. Encrypt all `totpSecret` values at rest using **AES-256-GCM** before storing them in the database.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| 2FA Secret Generation | API / Backend | — | Secrets must never be generated on the client. |
| QR Code Generation | API / Backend | — | Secure URI generation happens on server; QR can be rendered on server to avoid leaking URI. |
| 2FA Verification | API / Backend | — | Verification logic must be server-side to prevent bypass. |
| High-Risk Challenge UI | Browser / Client | — | The client must prompt for 2FA when high-risk actions are initiated. |
| Encryption at Rest | Database / Storage | API / Backend | Application-level encryption ensures secrets are encrypted before hitting the database. |
| Security Headers | CDN / Static | Frontend Server | Headers should be set at the edge or server response level. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `otplib` | 12.0.1+ | TOTP logic | Industry standard for Node.js; Google Authenticator compatible. |
| `qrcode` | 1.5.x | QR Code generation | Robust, supports various outputs (DataURL, SVG). |
| `crypto` | Built-in | Encryption | Native Node.js module for AES-256-GCM encryption. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `zod` | 3.x | Input Validation | Validating 2FA codes and security-sensitive inputs. |
| `next-auth` | 5.0.0-beta.15 | Session management | Already used; needs update to include 2FA flags in JWT/Session. |
| `vitest` | Latest | Unit/Integration testing | Faster, Vite-native alternative to Jest. |
| `@playwright/test`| Latest | E2E testing | Modern, robust browser automation for security flows. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `otplib` | `speakeasy` | `otplib` is more actively maintained and has better TypeScript support. |
| `crypto` (native) | `prisma-field-encryption` | Native `crypto` avoids extra dependency and gives full control over IV/Tag storage. |
| `Jest` | `Vitest` | `Vitest` provides better ESM support and is significantly faster in Next.js environments. |

**Installation:**
```bash
npm install qrcode otplib
npm install -D @types/qrcode vitest @playwright/test
```

## Architecture Patterns

### Recommended Project Structure
```
lib/
├── security/
│   ├── totp.ts       # otplib wrappers
│   └── crypto.ts     # AES-256-GCM utils
services/
├── security.service.ts # 2FA enrollment & verification logic
components/
├── security/
│   ├── TwoFactorEnrollment.tsx
│   └── TwoFactorChallenge.tsx
```

### Pattern 1: Encrypted Field Storage (AES-256-GCM)
**What:** Encrypt sensitive fields (like `totpSecret`) at the application level before saving to the DB.
**When to use:** Any field that, if leaked, would compromise user account security.
**Example:**
```typescript
// Source: https://github.com/Vitu-77/prisma-field-encryption (manual implementation)
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}
```

### Pattern 2: High-Risk Action Guard (Server-Side)
**What:** Server Actions or Services for high-risk operations (e.g., `createWithdrawal`) must check if 2FA is enabled and verify the provided code.
**When to use:** Withdrawals, password changes, critical settings updates.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TOTP Logic | Custom HMAC/Time logic | `otplib` | Edge cases like clock drift and standard compliance are hard to get right. |
| Encryption | Custom XOR or old ciphers | `AES-256-GCM` | GCM provides authenticated encryption, preventing tampering. |
| QR Generation | Manual Canvas drawing | `qrcode` | Handles encoding details and error correction levels automatically. |

## Common Pitfalls

### Pitfall 1: Leaking TOTP Secret via QR URI
**What goes wrong:** Generating the QR code URL on the client or passing the raw secret in the URL.
**How to avoid:** Generate the QR DataURL on the server and pass ONLY the image data to the client.

### Pitfall 2: Clock Drift
**What goes wrong:** User's device clock is slightly off, causing valid codes to be rejected.
**How to avoid:** Use `otplib`'s `window` option (e.g., `window: 1`) to allow codes from ±30 seconds. [VERIFIED: otplib docs]

### Pitfall 3: Replay Attacks
**What goes wrong:** A valid 2FA code is used multiple times within its 30s window.
**How to avoid:** (Optional but recommended) Track the last used 2FA timestamp/code for the user and reject if already used.

## Code Examples

### TOTP Enrollment (Server Action)
```typescript
// lib/security/totp.ts
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

export async function generateTOTPSetup(email: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, 'Monolith Portal', secret);
  const qrCodeUrl = await toDataURL(otpauth);
  return { secret, qrCodeUrl };
}
```

### Security Headers (`next.config.mjs`)
```javascript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Plaintext secret storage | Encrypted storage (AES-GCM) | 2024+ | Protects against DB leaks. |
| SMS 2FA | TOTP (Authenticator Apps) | 2022+ | Immune to SIM swapping. |
| SMS/Email 2FA | Passkeys (WebAuthn) | 2024+ | Phishing resistant; baseline for 2026. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `otplib` v12 is sufficient for 2026 requirements. | Standard Stack | Low; v13 is better but v12 is functional. |
| A2 | User prefers TOTP over Passkeys for MVP. | Summary | Medium; Passkeys are more secure but TOTP is easier to implement first. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `otplib` | 2FA Logic | ✓ | 12.0.1 | — |
| `qrcode` | Enrollment | ✗ | — | Install via npm |
| `vitest` | Testing | ✗ | — | Install via npm |
| `playwright`| E2E Testing | ✗ | — | Install via npm |
| `PostgreSQL` | Storage | ✓ | 16.x | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Unit/Integration | Vitest |
| End-to-End | Playwright |
| Config files | `vitest.config.ts`, `playwright.config.ts` |
| Quick run command | `npm test` (mapped to vitest), `npx playwright test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-06 | 2FA Enrollment | Unit | `npx vitest run services/security.service.ts` | ❌ Wave 0 |
| AUTH-06 | 2FA Verification | Unit | `npx vitest run services/security.service.ts` | ❌ Wave 0 |
| SEC-01 | Withdrawal 2FA Guard | Integration | `npx vitest run services/withdrawal.service.test.ts` | ❌ Wave 0 |
| SEC-02 | Login 2FA Protection| E2E | `npx playwright test tests/e2e/auth-2fa.spec.ts` | ❌ Wave 0 |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | TOTP (MFA), Password complexity. |
| V3 Session Management | Yes | NextAuth JWT security, secure cookies. |
| V4 Access Control | Yes | Middleware guards. |
| V5 Input Validation | Yes | Zod schemas for all actions. |
| V6 Cryptography | Yes | AES-256-GCM for secrets at rest. |

### Known Threat Patterns for Next.js

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS | Tampering | Content Security Policy (CSP), React auto-escaping. |
| CSRF | Spoofing | NextAuth CSRF protection (Next.js 14+ default). |
| Clickjacking | Information Disclosure | `X-Frame-Options: DENY`. |
| Brute Force | Spoofing | Rate limiting on auth endpoints. |

## Sources

### Primary (HIGH confidence)
- [otplib npm](https://www.npmjs.com/package/otplib) - Checked version and features.
- [Next.js Security Docs](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy) - Verified CSP patterns. [CITED: nextjs.org]
- [Vitest Docs](https://vitest.dev/guide/) - Verified configuration and migration.
- [Playwright Docs](https://playwright.dev/docs/intro) - Verified E2E setup for Next.js.

### Secondary (MEDIUM confidence)
- [Prisma Field Encryption Guide](https://www.npmjs.com/package/prisma-field-encryption) - Verified encryption patterns.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Libraries are industry standard.
- Architecture: HIGH - Pattern follows Next.js App Router and NextAuth best practices.
- Pitfalls: HIGH - Common 2FA pitfalls are well-documented.

**Research date:** 2026-04-30
**Valid until:** 2026-05-30
