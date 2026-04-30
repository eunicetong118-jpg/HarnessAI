# Phase 04: Admin & Financials - Research

**Researched:** 2026-04-30
**Domain:** Financial Ledger Management, Admin Ticket Workflow, RBAC Security
**Confidence:** HIGH

## Summary

This research phase defines the implementation strategy for the Withdrawal flow, Ledger balance management, and the Admin Ticket Command Center. The system utilizes a double-entry-lite ledger system (CREDIT/DEBIT) with BigInt precision to handle financial transactions. Administrative functions are secured via NextAuth v5 Role-Based Access Control (RBAC) and integrated into a manual ticket processing workflow.

**Primary recommendation:** Use a transaction-safe withdrawal flow that creates an immediate Ledger DEBIT and a linked Withdrawal Ticket, ensuring funds are "locked" while approval is pending.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Withdrawal Request | API / Backend | Browser / Client | Balance validation and ledger entry creation must happen server-side for security. |
| Balance Calculation | API / Backend | — | Financial calculations must be authoritative on the server using BigInt. |
| Ticket Management | API / Backend | Browser / Client | State transitions and side effects (like verifying accounts) must be enforced on the server. |
| Admin Access Control | API / Backend | — | Route and action protection enforced via NextAuth session roles. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prisma | 6.x | DB Operations | Native support for BigInt and Transactions. [VERIFIED: prisma/schema.prisma] |
| NextAuth | 5.0 (Beta) | RBAC | Role-based sessions already configured in `lib/auth.ts`. [VERIFIED: lib/auth.ts] |
| Next.js | 14/15 | Framework | App Router and Server Actions for efficient Admin UI. [VERIFIED: next.config.mjs] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| Zod | 3.x | Validation | Input validation for withdrawal amounts and ticket actions. [VERIFIED: services/rebate.service.ts] |
| Lucide React | Latest | UI Icons | Consistent iconography for ticket types and statuses. [ASSUMED] |

**Installation:**
```bash
npm install zod lucide-react
```

## Architecture Patterns

### Withdrawal Flow (Lock-and-Resolve)
1. **Request:** User submits withdrawal amount.
2. **Validate:** Server checks `available_balance >= amount`.
3. **Lock:** Create `Ledger` entry (`DEBIT`, `WITHDRAWAL`) and a `Ticket` (`WITHDRAWAL`, `PENDING`).
4. **Audit:** The `DEBIT` entry's `referenceId` points to the `Ticket.id`.
5. **Resolve:**
   - If Admin **Completes**: Ticket status becomes `DONE`.
   - If Admin **Rejects**: Ticket status becomes `DONE`, and a new `Ledger` entry (`CREDIT`, `REVERSAL`) is created to refund the user.

### Ticket State Machine
- **PENDING (Unassigned):** `assigneeUserId === null`. Visible to all admins.
- **CLAIMED (Pending):** `assigneeUserId === adminId`. Only assigned admin should resolve.
- **DONE:** `closedAt` is set. Immutable history.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Currency Math | Floating point math | BigInt (Cents) | Avoid precision errors common in USD calculations ($0.1 + $0.2 !== $0.3). |
| Role Checks | Manual session parsing in every page | Middleware + Admin Layout | Centralized security prevents accidental leaks. |
| CSV Parsing | Custom regex | `xlsx` or `papaparse` | Handles edge cases, encoding, and complex sheet structures. [VERIFIED: services/rebate.service.ts] |

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | `Ledger` entries from Phase 3 | Ensure balance calculation includes existing `CREDIT` entries. |
| Live service config | None | N/A |
| OS-registered state | None | N/A |
| Secrets/env vars | None | N/A |
| Build artifacts | None | N/A |

## Common Pitfalls

### Pitfall 1: BigInt Serialization
**What goes wrong:** `JSON.stringify` and Next.js Server Actions fail to serialize `BigInt`.
**How to avoid:** Convert `BigInt` to `String` (or `Number` if < 2^53) before returning from actions. Use a `toJSON` polyfill or manual mapping. [CITED: WebSearch findings]

### Pitfall 2: Withdrawal Race Conditions
**What goes wrong:** User submits two withdrawal requests simultaneously, bypassing balance check.
**How to avoid:** Wrap the balance check and DEBIT creation in a `prisma.$transaction` with appropriate isolation.

## Code Examples

### Withdrawal Creation (Server Action)
```typescript
// Source: Recommended Pattern
export async function createWithdrawal(userId: string, amountCents: bigint) {
  return await prisma.$transaction(async (tx) => {
    const balance = await getBalance(tx, userId); // Adapted to use transaction
    if (balance.available < amountCents) throw new Error("Insufficient funds");

    const ticket = await tx.ticket.create({
      data: {
        userId,
        type: 'WITHDRAWAL',
        content: `Withdrawal request for ${amountCents / 100n} USD`,
        metadata: { amountCents: amountCents.toString() }
      }
    });

    await tx.ledger.create({
      data: {
        userId,
        amount: amountCents,
        type: 'DEBIT',
        category: 'WITHDRAWAL',
        referenceId: ticket.id
      }
    });

    return ticket;
  });
}
```

### Ticket Resolution (Admin)
```typescript
// Source: Recommended Pattern
export async function resolveVerification(ticketId: string, adminId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { user: true }
  });

  if (ticket.type === 'VERIFICATION') {
    const { mt5AccountNo } = ticket.metadata as any;
    await prisma.brokerAccount.update({
      where: { mt5AccountNo },
      data: { status: 'VERIFIED', verifiedAt: new Date() }
    });
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: 'DONE', closedAt: new Date(), assigneeUserId: adminId }
  });
}
```

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PostgreSQL | Data Persistence | ✓ | 15+ | — |
| Prisma | ORM | ✓ | 6.x | — |
| NextAuth v5 | Security | ✓ | 5.0.0-beta | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest / Jest |
| Config file | `jest.config.ts` |
| Quick run command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command |
|--------|----------|-----------|-------------------|
| FIN-01 | Ledger Debit for withdrawals | Unit | `npm test ledger.service.test.ts` |
| ADM-01 | Admin Gate Enforcement | Integration | `npm test admin.gate.test.ts` |
| ADM-02 | Ticket State Transitions | Unit | `npm test ticket.service.test.ts` |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | NextAuth v5 session validation. |
| V4 Access Control | yes | `role === ADMIN` check in middleware and layouts. |
| V5 Input Validation | yes | Zod schemas for amounts and ticket IDs. |
| V13 API Security | yes | Server Actions for all state-changing operations. |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Balance Overdraw | Tampering | Transactional balance check + debit. |
| Unauthorized Admin Access | Spoofing | Role-based middleware guards. |
| Double Processing | Tampering | Unique `referenceId` on Ledger and Status checks on Tickets. |

## Sources

### Primary (HIGH confidence)
- `prisma/schema.prisma` - Database model verification.
- `lib/auth.ts` - NextAuth configuration verification.
- `services/ledger.service.ts` - Existing financial logic.

### Secondary (MEDIUM confidence)
- NextAuth v5 Documentation - RBAC patterns.
- Prisma Documentation - BigInt handling.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `lucide-react` is preferred icon library | Standard Stack | UI consistency only. |
| A2 | Manual payout for withdrawals is acceptable | Architecture | Need to automate if volume is high. |
| A3 | Withdrawal REJECT requires a Ledger REVERSAL | Architecture | Audit trail will be incomplete otherwise. |

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Core libraries already in place.
- Architecture: HIGH - Follows standard financial and ticketing patterns.
- Pitfalls: HIGH - Common issues with BigInt and concurrency addressed.

**Research date:** 2026-04-30
**Valid until:** 2026-05-30
