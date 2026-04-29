---
phase: 02-dashboard-onboarding
plan: 02
subsystem: Onboarding
tags: [onboarding, broker, mt5]
requires: [BROK-01]
provides: [BROK-01, BROK-02]
affects: [app/(protected)/onboarding, services/broker.service.ts]
tech-stack: [nextjs, tailwind, prisma]
key-files: [services/broker.service.ts, app/(protected)/onboarding/page.tsx, lib/actions/broker-actions.ts]
decisions:
  - Using Prisma transactions to ensure atomic creation of BrokerAccount and Ticket.
  - Implemented custom UI components (Button, Input, Card, etc.) to compensate for missing shadcn/ui setup.
metrics:
  duration: 30m
  tasks: 2
  files: 8
---

# Phase 02 Plan 02: MT5 Account Linkage Summary

## Summary
Successfully implemented the MT5 account linkage workflow, allowing users to select their country, view the corresponding IB registration link, and submit their MT5 account number for verification. The backend logic ensures atomic creation of a pending broker account and a verification ticket for admin review.

## Key Changes

### 1. Backend Services
- Created `services/broker.service.ts` with `linkAccount` method.
- Implemented validation for MT5 account numbers (numeric, min-length 5).
- Used Prisma `$transaction` to atomically create `BrokerAccount` and `Ticket` records.
- Added `hasLinkedAccount` and `getIbUrl` helpers.

### 2. Server Actions
- Implemented `lib/actions/broker-actions.ts` for safe server-side account linkage.
- Integrated authentication checks and revalidation logic.

### 3. Onboarding UI
- Created `/onboarding` page using a step-by-step approach.
- Integrated `IB_MAPPING` to display country-specific registration links.
- Handled loading, error, and success states with user feedback.

### 4. UI Components (Infrastructure)
- Created foundational UI components: `Button`, `Input`, `Select`, `Card`, and `Label` to support the onboarding form and future features.

### 5. Verification
- Created `__tests__/services/broker.service.test.ts` with comprehensive coverage for the linkage logic.
- All tests passing.

## Deviations from Plan
- **UI Components:** The plan assumed `shadcn/ui` was initialized. Since the components were missing, I created them manually to ensure the UI is functional and follows the project's styling.
- **Service Name:** Used `services/broker.service.ts` (lowercase with `.service` suffix) to match existing project patterns (`actionToken.service.ts`), while the plan suggested `lib/services/broker.ts`.

## Commits
- `feat(02-02): implement broker service with mt5 linkage logic`
- `test(02-02): add unit tests for broker service`
- `feat(02-02): add foundational UI components (Button, Input, Card, Select, Label)`
- `feat(02-02): implement server action for broker account linkage`
- `feat(02-02): implement onboarding page with step-by-step linkage flow`

## Self-Check: PASSED
- [x] `services/broker.service.ts` exists and implements requirements.
- [x] `/onboarding` page is functional and responsive.
- [x] MT5 linkage creates both `BrokerAccount` and `Ticket`.
- [x] Unit tests for service layer pass.
- [x] All file paths follow project conventions.
