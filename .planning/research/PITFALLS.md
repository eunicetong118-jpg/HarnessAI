# Domain Pitfalls

**Domain:** Brokerage Rebate Portal
**Researched:** 2026-04-29

## Critical Pitfalls

### Pitfall 1: Floating Point Math for Finance
**What goes wrong:** Using `Float` or `Double` for balances leads to rounding errors (e.g., $0.1 + $0.2 = $0.30000000000000004).
**Prevention:** Store values as `BigInt` or `Int` in cents ($1.00 = 100).
**Detection:** Mismatched ledger totals vs. aggregate credits/debits.

### Pitfall 2: Token Exposure
**What goes wrong:** Storing email verification or password reset tokens in plain text.
**Prevention:** Hash tokens using `bcrypt` before storing. Compare the raw token from the URL against the stored hash.

## Moderate Pitfalls

### Pitfall 1: Middleware Infinite Loops
**What goes wrong:** Redirecting to a path that is also caught by the middleware guard, creating a loop.
**Prevention:** Use explicit matchers and exclude static assets/api routes where appropriate.

### Pitfall 2: Double-Processing Rebates
**What goes wrong:** Cron job running twice or failing halfway, causing duplicate credits.
**Prevention:** Use `unique` constraints on `referenceId` (TradeID) in the Ledger table to enforce DB-level deduplication.

## Minor Pitfalls

### Pitfall 1: 2FA Lockout
**What goes wrong:** Users lose access to their TOTP device and cannot withdraw.
**Prevention:** Implement recovery codes or an admin "Disable 2FA" override (high security).

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Rebate Engine | CSV Injection / Malformed Data | Strict parsing and validation in the Service layer. |
| Withdrawals | Race conditions on balance check | Use database transactions and "check then act" patterns. |
| Auth | NextAuth Beta breaking changes | Pin version in `package.json` and monitor migration guides. |

## Sources

- `wiki/rebate-portal-v4.md`
- `prisma/schema.prisma`
- Common Fintech Best Practices
