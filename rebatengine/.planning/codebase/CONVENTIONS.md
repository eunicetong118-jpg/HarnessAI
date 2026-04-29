# Coding Conventions

**Analysis Date:** 2026-04-29

## Naming Patterns

**Files:**
- App Router pages/layouts: `page.tsx`, `layout.tsx`, `route.ts` (Next.js standards).
- Components: PascalCase for component files (e.g., `Button.tsx`).
- Utilities/Services: camelCase for helper files (e.g., `utils.ts`).

**Functions:**
- React Components: PascalCase (e.g., `export default function Home()`).
- Helper functions: camelCase (e.g., `export function cn(...)`).

**Variables:**
- General: camelCase.
- Constants: UPPER_SNAKE_CASE (if any, though none explicitly seen in samples).

**Types:**
- Interfaces/Types: PascalCase (e.g., `type ClassValue`).

## Code Style

**Formatting:**
- Likely Prettier (standard for Next.js), though no `.prettierrc` was found.
- Indentation: 2 spaces (observed in `layout.tsx` and `page.tsx`).

**Linting:**
- Tool: ESLint.
- Config: `eslint-config-next` (from `package.json`).
- Command: `next lint`.

## Import Organization

**Order:**
1. React/Next.js core imports (e.g., `import type { Metadata } from "next";`).
2. External libraries (e.g., `import { Inter } from "next/font/google";`).
3. Internal path aliases (e.g., `import { cn } from "@/lib/utils";`).
4. Styles (e.g., `import "./globals.css";`).

**Path Aliases:**
- `@/`: Points to `src/` (configured in `tsconfig.json`).

## Error Handling

**Patterns:**
- No explicit global error handling pattern observed yet (standard Next.js `error.tsx` would be expected).
- Prisma schema uses `BigInt` for financial data to avoid floating-point errors (e.g., `src/prisma/schema.prisma`).

## Logging

**Framework:** `console`
- No specialized logging library detected in `package.json`.

**Patterns:**
- Not explicitly observed in the current skeleton code.

## Comments

**When to Comment:**
- Prisma schema includes comments explaining field purposes (e.g., `// Stored in cents to prevent floating-point errors`).

**JSDoc/TSDoc:**
- Minimal usage in boilerplate code.

## Function Design

**Size:** Small, focused functions (e.g., `cn` utility in `src/lib/utils.ts`).

**Parameters:** Use of TypeScript types for parameter validation.

**Return Values:** Explicit return types when using Next.js Metadata or React components.

## Module Design

**Exports:**
- Default exports for Next.js pages and layouts.
- Named exports for utilities and UI components (e.g., `export { Button }` in `src/components/ui/button.tsx`).

**Barrel Files:**
- Not heavily used in the current structure.

---

*Convention analysis: 2026-04-29*
