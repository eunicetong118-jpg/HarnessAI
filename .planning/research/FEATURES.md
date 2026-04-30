# Feature Landscape

**Domain:** Brokerage Rebate Portal
**Researched:** 2026-04-29

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Credentials Auth | Standard access | Medium | Includes bcrypt hashing and session management. |
| Email Verification | Security / Bot prevention | Low | Implemented via ActionTokens. |
| Dashboard Overview | Seeing earnings | Medium | Requires Ledger and Recharts integration. |
| MT5 Linkage | Earning rebates | Medium | User submits MT5 number for admin approval. |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Automated Rebate Engine | Daily payouts without delays | High | Cron job parsing trade logs. |
| 2FA Withdrawals | High security for funds | Medium | TOTP via otplib mandatory for debits. |
| Admin Ticket System | Transparent verification | Medium | Human-in-the-loop for approvals. |
| Sequential Guards | Tiered access (Verified -> 2FA) | Medium | Middleware-level security. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Direct MT5 API write | Security risk | Read-only parsing of trade reports. |
| Internal Messaging | Scope creep | Email notifications and Ticket comments. |
| Crypto Wallets | Regulatory complexity | Standard bank/broker withdrawals. |

## Feature Dependencies

```
Auth -> Email Verification -> Dashboard
MT5 Linkage -> Admin Approval -> Rebate Eligibility
Rebate Processing -> Ledger Credit -> Withdrawal Request
Withdrawal Request -> 2FA -> Admin Approval -> Ledger Debit
```

## MVP Recommendation

Prioritize:
1. **Secure Auth Flow:** Signup, Login, Email Verification.
2. **Onboarding:** MT5 account submission.
3. **Basic Ledger:** Showing pending/earned credits.
4. **Admin Approval:** Simple ticket interface to verify MT5 accounts.

Defer: **2FA and Withdrawals** (can be implemented once rebates are actively accumulating).

## Sources

- `wiki/rebate-portal-v4.md`
- `prisma/schema.prisma`
