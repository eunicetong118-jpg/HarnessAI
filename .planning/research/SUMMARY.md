# Research Summary: Rebate Portal (V4)

**Domain:** Fintech / Brokerage Rebate Portal
**Researched:** 2026-04-29
**Overall confidence:** HIGH

## Executive Summary

The Rebate Portal (V4) is a high-performance system designed to automate the distribution of trading rebates to users. It leverages Next.js 14 and NextAuth v5 for a modern, secure web experience. The system architecture emphasizes security and data integrity, using a layered service pattern to isolate business logic from API and UI layers.

Key focus areas are Authentication, automated Rebate Processing via Cron jobs, and a Ticket-based manual verification system for high-stakes actions like account linking and withdrawals. The use of BigInt for financial transactions in the Ledger ensures precision by storing values in cents.

## Key Findings

**Stack:** Next.js 14 (App Router), Prisma ORM, PostgreSQL, NextAuth.js v5 (Beta), and Nodemailer.
**Architecture:** Layered Service Pattern (API -> Service -> Prisma) with sequential middleware guards for multi-stage security.
**Critical pitfall:** Financial precision errors are mitigated by using `BigInt` (cents) instead of floats.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Auth & Identity Foundation** - (In Progress)
   - Addresses: Credentials login, Email verification via ActionTokens, Sequential middleware.
   - Avoids: Unauthorized access to the dashboard.

2. **Broker Onboarding & Linkage** - (Next)
   - Addresses: MT5 account linkage, country-based IB mapping.
   - Rationale: Users cannot earn rebates without linked accounts.

3. **Rebate Engine & Ledger**
   - Addresses: Daily cron processing, trade deduplication, rebate calculation (80% formula).
   - Rationale: Core value proposition of the portal.

4. **Admin Command Center**
   - Addresses: Ticket management for verifications and approvals.
   - Rationale: Enables human-in-the-loop for high-risk operations.

5. **Advanced Security & Withdrawals**
   - Addresses: TOTP (2FA), withdrawal request workflow.
   - Rationale: Mandatory for financial safety but depends on a stable ledger.

**Phase ordering rationale:**
- Foundation must be solid (Auth) before processing funds.
- Onboarding is a prerequisite for generating any data for the rebate engine.
- Withdrawals are the final step in the user lifecycle.

**Research flags for phases:**
- Phase 3 (Rebate Engine): Requires robust error handling for CSV parsing and deduplication logic.
- Phase 5 (Withdrawals): Needs careful implementation of TOTP to prevent lockout and secure financial transactions.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Explicitly defined in `package.json` and wiki. |
| Features | HIGH | Detailed in `rebate-portal-v4.md` and `schema.prisma`. |
| Architecture | HIGH | Service pattern and middleware already implemented and tested. |
| Pitfalls | MEDIUM | Based on common fintech patterns and schema observations (BigInt). |

## Gaps to Address

- **MT5 Integration details:** The specific API or method for MT5 validation needs confirmation (current docs mention manual verification tickets).
- **Email Provider:** SMTP is mentioned, but specific provider configuration/production limits are unknown.
- **2FA Recovery:** No explicit mention of recovery codes for TOTP in the current schema.
