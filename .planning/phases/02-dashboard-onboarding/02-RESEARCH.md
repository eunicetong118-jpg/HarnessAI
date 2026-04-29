# Phase 2: Dashboard & Onboarding - Research

**Researched:** 2026-04-30
**Domain:** Fintech Dashboard, MT5 Account Linking, Data Visualization
**Confidence:** HIGH

## Summary
Phase 2 implements the core user journey after registration. This includes a one-page onboarding workflow to link an MT5 trading account and a comprehensive dashboard for tracking rebates and withdrawals. The phase leverages **Recharts** for visual analytics and **Lottie** for milestone celebrations. Account verification is handled through an internal **Ticket** system, bridging the gap between user submission and admin validation.

**Primary recommendation:** Use a unified `dashboard-layout` that handles the persistent "Pending Verification" banner and the onboarding redirect logic via Next.js Middleware.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| MT5 Account Linking | API / Backend | Browser | Validates input (Zod) and creates `BrokerAccount` + `Ticket` records. |
| IB URL Mapping | Config / Static | Browser | Look up broker registration links based on user country selection. |
| Earnings Analytics | API / Backend | Browser | Aggregates `Ledger` entries; Recharts renders the time-series data. |
| Milestone Celebrations | Browser | — | Triggers Lottie animations when `Available Balance` crosses thresholds. |
| Transaction History | API / Backend | Browser | Paginated server-side fetch from the `Ledger` table. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Recharts | 2.12.5 | Data Visualization | Standard for React; supports AreaCharts and ResponsiveContainers. |
| Lottie React | 2.4.0 | Milestone Animations | High-quality vector animations for "confetti" moments. |
| Framer Motion | 11.0.28 | UI Transitions | Smooth page transitions and card hover states. |
| Lucide React | 0.368.0 | Iconography | Tree-shakable icons consistent with shadcn/ui. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| html-to-image | 1.11.11 | Share Results | Capturing stats cards as JPG for social sharing. |
| Zod | 4.3.6 | Schema Validation | Validating MT5 account numbers and country codes. |
| clsx / tailwind-merge | 2.x | CSS Composition | Standard shadcn pattern for dynamic class names. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Chart.js | Recharts is more "React-native" with declarative components. |
| Lottie | Canvas Confetti | Lottie allows for more complex, branded milestone animations. |

**Installation:**
```bash
# Existing packages already verified in package.json
# Need to add shadcn components
npx shadcn-ui@latest add card button input select table badge toast
```

**Version verification:**
Verified `recharts` (^2.12.5) and `lottie-react` (^2.4.0) are present in `package.json`. [VERIFIED: package.json]

## Architecture Patterns

### System Architecture Diagram
```
[User] -> [Middleware] -> [Onboarding Check] --(0 accounts)--> [/onboarding]
           |                                  --(>0 accounts)--> [/dashboard]
           |
[Dashboard View]
   |--> [Stats Summary] (Server Component: Fetch Balance)
   |--> [Accumulation Chart] (Client Component: Recharts + Mock Data)
   |--> [Ledger Table] (Server Component: Paginated Ledger)
   |--> [Verification Banner] (Conditional Header based on BrokerAccount status)
```

### Recommended Project Structure
```
app/(protected)/
├── onboarding/        # Onboarding one-pager
├── dashboard/         # Main dashboard view
│   ├── page.tsx
│   ├── layout.tsx     # Handles banners and shared nav
│   └── loading.tsx    # Skeleton loaders
config/
├── ib-mapping.ts      # Country to IB URL mapping [NEW]
└── milestones.ts      # Reward thresholds [NEW]
lib/
└── mock-data.ts       # Chart data generators [NEW]
```

### Pattern 1: Onboarding Redirect Guard
**What:** Middleware logic that forces users to `/onboarding` if they have no linked accounts.
**When to use:** On all `(protected)` routes except settings and onboarding itself.
**Example:**
```typescript
// middleware.ts logic
const accountCount = await db.brokerAccount.count({ where: { userId: session.user.id } });
if (accountCount === 0 && !pathname.startsWith('/onboarding')) {
  return Response.redirect(new URL('/onboarding', nextUrl));
}
```

### Anti-Patterns to Avoid
- **Floating Point Math:** Never use `float` for currency. Always use `BigInt` (cents) as defined in the Prisma schema.
- **Client-Side Data Aggregation:** Don't fetch thousands of ledger rows and sum them in the browser. Use SQL `SUM()` or Prisma `aggregate`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Data Visualization | Custom SVG paths | Recharts | Handles scaling, tooltips, and responsiveness out of the box. |
| Currency Formatting | `$` + `value.toFixed(2)` | `Intl.NumberFormat` | Handles locale-aware currency symbols and rounding correctly. |
| Share Capture | Canvas `drawImage` | `html-to-image` | High-fidelity DOM to Image conversion with CSS support. |

## Common Pitfalls

### Pitfall 1: BigInt Serialization
**What goes wrong:** JSON.stringify (used in Server Actions or API routes) fails on `BigInt`.
**Why it happens:** JavaScript's standard JSON spec does not support BigInt.
**How to avoid:** Convert to strings or numbers (if < 2^53) before passing to client components.
```typescript
const serializedLedger = ledger.map(item => ({
  ...item,
  amount: Number(item.amount) / 100 // Convert cents to USD number
}));
```

### Pitfall 2: Recharts Hydration Mismatch
**What goes wrong:** "Text content does not match" or layout shifts.
**Why it happens:** Recharts calculates dimensions on mount, which differs between server and client.
**How to avoid:** Wrap charts in a `ResponsiveContainer` and ensure they only render after mount or use `ssr: false` dynamic imports.

## Code Examples

### IB Mapping Configuration
```typescript
// Source: PROJECT_SPEC [ASSUMED]
export const IB_MAPPING = [
  { countryCode: 'ID', ibUrl: 'https://broker.com/reg?id=123', ibName: 'Monolith Global' },
  { countryCode: 'MY', ibUrl: 'https://broker.com/reg?id=456', ibName: 'Monolith SE Asia' },
  // ...
];
```

### Dashboard Accumulation Data Structure
```typescript
// Structure for Recharts AreaChart
export const mockChartData = [
  { date: '2024-01', rebate: 450, withdrawn: 0 },
  { date: '2024-02', rebate: 890, withdrawn: 400 },
  { date: '2024-03', rebate: 1250, withdrawn: 400 },
];
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Polling MT5 API | Admin Verification Ticket | Standard | Reduces API load; ensures human audit trail for linking. |
| PNG Icons | Lucide React (SVG) | 2023+ | Sharpness at all scales; smaller bundle size via tree-shaking. |
| Manual Confetti | Lottie React | 2022+ | Professional motion design without heavy JS animation logic. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Admin verification is manual via Tickets | Summary | If auto-verification is required, MT5 API integration is needed. |
| A2 | IB Mapping is static config based | IB Mapping | If mapping changes frequently, it should move to the DB. |
| A3 | Mock data is acceptable for charts | Dashboard | If live MT5 streaming is required, WebSocket setup is needed. |

## Open Questions

1. **MT5 Server Validation:** Do we need to validate the MT5 Account Number format (e.g., length, prefix) beyond "numeric only"?
2. **Multiple Accounts:** Can a user link more than one MT5 account? The UI implies "one-pager", but the DB schema supports many-to-one.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PostgreSQL | Data Storage | ✓ | — | — |
| Recharts | Analytics | ✓ | 2.12.5 | — |
| Lottie React | Celebrations | ✓ | 2.4.0 | — |
| html-to-image| Sharing | ✓ | 1.11.11 | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest + ts-jest |
| Config file | `jest.config.ts` |
| Quick run command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DASH-01 | Chart Rendering | Unit | `npm test` | ❌ Wave 0 |
| DASH-02 | Balance Calculation | Unit | `npm test __tests__/services/ledger.test.ts` | ❌ Wave 0 |
| BROK-01 | IB Mapping Lookup | Unit | `npm test __tests__/services/broker.test.ts` | ❌ Wave 0 |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | Yes | Zod schema for MT5 account numbers (preventing injection). |
| V12 File Upload | No | (N/A for this phase, unless KYC is added). |
| V4 Access Control | Yes | Middleware guards for onboarding state. |

### Known Threat Patterns for Next.js

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Insecure ID Access | Information Disclosure | Ensure `userId` check on all `Ledger` and `BrokerAccount` queries. |
| Double Submission | Denial of Service | Disable UI buttons during in-flight linking/withdrawal requests. |

## Sources

### Primary (HIGH confidence)
- `package.json` - Confirmed dependencies (Recharts, Lottie).
- `prisma/schema.prisma` - Confirmed data models (`BrokerAccount`, `Ledger`, `Ticket`).
- `raw/Cashback website requirement/prompt_v4.md` - Confirmed visual tokens and logic.

### Secondary (MEDIUM confidence)
- `Next.js 14 Docs` - Best practices for Middleware and Server Components.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified in `package.json`.
- Architecture: HIGH - Defined in project specifications.
- Pitfalls: HIGH - Common Next.js/Financial app issues.

**Research date:** 2026-04-30
**Valid until:** 2026-05-30
