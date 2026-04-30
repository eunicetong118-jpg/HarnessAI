# Architecture Patterns

**Domain:** Brokerage Rebate Portal
**Researched:** 2026-04-29

## Recommended Architecture

The system follows a **Layered Service Pattern** to ensure business logic is decoupled from the delivery layer (API/Web).

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Next.js App Router | Routing, UI, Server Components | Services, Client Hooks |
| Services Layer | Business Logic (Auth, Rebates, Ledger) | Prisma, Mailer, External APIs |
| Middleware | Security Gates, Session Validation | NextAuth, Next Response |
| Prisma ORM | Data Access, Type Safety | PostgreSQL |

### Data Flow

1. **Auth:** User logs in -> Middleware checks `isEmailVerified` -> Access granted to `/dashboard`.
2. **Rebate:** Cron Job -> Reads External Logs -> Service validates `BrokerAccount` -> Service creates `Ledger` entry.
3. **Withdrawal:** User requests -> Ticket created -> Admin approves -> Ledger debit created.

## Patterns to Follow

### Pattern 1: ActionTokens for Secure Verification
Tokens are hashed before storage to prevent exposure if the DB is compromised.
**Example:**
```typescript
// services/actionToken.service.ts
const rawToken = randomBytes(32).toString('hex');
const hash = await bcrypt.hash(rawToken, 12);
await prisma.actionToken.create({ data: { token: hash, ... } });
```

### Pattern 2: Financial Precision via Cents
Avoid floating-point errors by using `BigInt` or integers to store monetary values in the smallest unit.
**Example:**
```prisma
model Ledger {
  amount BigInt // Stored in cents
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Logic in API Routes
Avoid writing database queries or complex logic directly in `route.ts`.
**Instead:** Call a dedicated Service function.

### Anti-Pattern 2: Unprotected Financial Routes
Never trust the client for withdrawal amounts or account IDs.
**Instead:** Always re-verify ownership and balance in the Service layer before execution.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Rebate Processing | Single cron job | Parallel processing | Distributed queue (BullMQ) |
| Ledger Queries | Standard indexing | Optimized aggregations | Read replicas for reporting |

## Sources

- `wiki/rebate-portal-v4.md`
- `docs/plans/2026-04-29-auth-implementation.md`
- `prisma/schema.prisma`
