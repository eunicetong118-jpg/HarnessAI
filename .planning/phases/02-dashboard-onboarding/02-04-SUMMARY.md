---
phase: 02-dashboard-onboarding
plan: 04
subsystem: dashboard
tags: [middleware, animations, feedback]
dependency_graph:
  requires: ["02-02", "02-03"]
  provides: ["DASH-03", "BROK-02"]
  affects: [dashboard]
tech_stack:
  added: [lottie-react]
  patterns: [guard-in-layout, client-side-trigger]
key_files:
  created:
    - components/dashboard/pending-banner.tsx
    - components/dashboard/milestone-celebration.tsx
    - components/dashboard/milestone-trigger.tsx
  modified:
    - app/(protected)/dashboard/layout.tsx
    - app/(protected)/dashboard/page.tsx
    - services/broker.service.ts
decisions:
  - Performing redirect check in DashboardLayout instead of middleware to avoid Edge runtime limitations with Prisma.
  - Using localStorage to persist milestone celebration state to ensure it only plays once.
metrics:
  duration: 15m
  completed_date: "2026-04-30"
---

# Phase 02 Plan 04: Dashboard Guards & Feedback Summary

## Substantive One-liner
Implemented secure dashboard access guards, status notifications, and milestone celebration animations.

## Key Changes

### 1. Dashboard Guards
- Updated `DashboardLayout` to fetch the user's linked broker accounts.
- If no accounts are found, the user is redirected to `/onboarding`.
- This ensures users cannot access the dashboard until they have at least initiated the MT5 linking process.

### 2. Status Notifications
- Created `PendingBanner` component to notify users when their account is still under review.
- Added logic to `DashboardLayout` to detect `PENDING` accounts and conditionally render the banner.

### 3. Milestone Celebrations
- Integrated `lottie-react` for high-quality animations.
- Created `MilestoneCelebration` and `MilestoneTrigger` components.
- Milestone detection logic compares `totalEarned` balance against thresholds defined in `config/milestones.ts`.
- State is persisted in `localStorage` to prevent duplicate animations for the same milestone.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Middleware vs Layout Guards**
- **Found during:** Task 1
- **Issue:** Prisma access in `middleware.ts` is problematic due to Edge runtime constraints (unless using Prisma Accelerate or specific configurations).
- **Fix:** Moved the account check logic to `app/(protected)/dashboard/layout.tsx`. This is a standard Next.js pattern for database-backed guards.
- **Files modified:** `app/(protected)/dashboard/layout.tsx`, `middleware.ts` (unchanged)
- **Commit:** f9f4d62

## Self-Check: PASSED
- [x] Users without accounts redirected to onboarding
- [x] Pending banner visible for pending accounts
- [x] Lottie animations trigger on milestones
- [x] Individual commits for tasks
- [x] SUMMARY.md created

## Known Stubs
None. All components are wired to real data (session user and ledger balance).
