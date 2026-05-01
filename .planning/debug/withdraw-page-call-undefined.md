---
status: resolved
trigger: "Server Error: Cannot read properties of undefined (reading 'call') on /dashboard/withdraw"
created: 2026-04-30
updated: 2026-04-30
---

# Symptoms
- **Expected behavior**: Withdrawal page loads the form and history.
- **Actual behavior**: Server error 500 with stack trace pointing to `lib/utils.ts` and `components/ui/card.tsx`.
- **Error message**: `Error: Cannot read properties of undefined (reading 'call')`
- **Timeline**: Started immediately after refactoring `components/ui/card.tsx` to export named sub-components and using them in `WithdrawalForm`.
- **Reproduction**: Navigate to `/dashboard/withdraw`.

# Current Focus
- **hypothesis**: Temporal Dead Zone (TDZ) in `components/ui/card.tsx`. The `Card` component was using `CardHeader` and `CardTitle` in its definition, but they were defined later in the same file.
- **next_action**: Verify fix by checking if other components have similar issues.

# Evidence
- [2026-04-30] Initial report: `Cannot read properties of undefined (reading 'call')` is a classic Webpack/Babel error for circular deps or broken exports in ESM/CJS interop.
- [2026-04-30] Identified TDZ in `components/ui/card.tsx`: `Card` component used `CardHeader` and `CardTitle` before their declarations.
- [2026-04-30] Applied fix: Reordered `components/ui/card.tsx` to define sub-components before the main `Card` component.

# Eliminated
- Circular dependency: `lib/utils.ts` does not import `components/ui/card.tsx`.

## Resolution
**root_cause**: Temporal Dead Zone (TDZ) error in `components/ui/card.tsx`. The `Card` component was defined using `CardHeader` and `CardTitle` in its JSX, but those constants were defined later in the file. Webpack/Next.js encountered this as an `undefined` reference during module evaluation.
**fix**: Reordered definitions in `components/ui/card.tsx` so that `CardHeader`, `CardTitle`, etc., are defined before the `Card` component that references them.
