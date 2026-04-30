# Coding Conventions

**Analysis Date:** 2026-04-30

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `AdminSidebar.tsx`, `Sidebar.tsx`)
- Services: camelCase with `.service.ts` suffix (e.g., `actionToken.service.ts`, `admin.service.ts`)
- Utilities/Lib: kebab-case or camelCase (e.g., `auth.config.ts`, `mock-data.ts`)
- App Router Pages: `page.tsx`, `layout.tsx` (Next.js convention)

**Functions:**
- Service methods: camelCase (e.g., `createToken`, `validateToken`)
- React components: PascalCase (e.g., `LoginPage`)
- Event handlers: camelCase prefixed with `handle` (e.g., `handleSubmit`)

**Variables:**
- State: camelCase (e.g., `isLoading`, `error`)
- Constants: UPPER_SNAKE_CASE for global constants, camelCase for local.

**Types:**
- Interfaces/Types: PascalCase. Often co-located or in `types/` directory.

## Code Style

**Formatting:**
- Prettier is detected in `package.json`.
- Standard indent: 2 spaces.
- Semi-colons: Used.

**Linting:**
- ESLint (Next.js default) and `next lint` script.
- TypeScript for type safety.

## Import Organization

**Order:**
1. React/Next.js core imports (`react`, `next/link`, etc.)
2. Third-party libraries (`next-auth/react`, `bcryptjs`, etc.)
3. Internal aliases (`@/components/...`, `@/lib/...`, `@/services/...`)
4. Styles (CSS)

**Path Aliases:**
- `@/*` points to `src/` or project root as configured in `tsconfig.json`.

## Error Handling

**Patterns:**
- Services: Throw errors with descriptive messages or return result objects with `success: boolean` and `error?: string`.
- Components: Use `useState` to track error messages (e.g., `setError`) and display in UI banners.
- API/Server: Next.js standard error handling in Route Handlers.

## Logging

**Framework:** `console`

**Patterns:**
- Basic `console.error` for caught exceptions.
- No dedicated logging library detected in `package.json`.

## Comments

**When to Comment:**
- Complexity: Explaining non-obvious logic (e.g., TTL calculation in `actionToken.service.ts`).
- TODOs: Marking unfinished work (detected in some files).

**JSDoc/TSDoc:**
- Light usage observed for complex service functions.

## Function Design

**Size:**
- Preference for small, focused functions in services and components.

**Parameters:**
- Explicit typing for all parameters.
- Use of destructured objects for multiple optional parameters.

**Return Values:**
- Services: Promisified results, often returning objects like `{ success: boolean, error?: string }`.

## Module Design

**Exports:**
- Default exports for React components and pages.
- Named exports for service functions and utilities.

**Barrel Files:**
- Not heavily used; imports are typically direct from files.

---

*Convention analysis: 2026-04-30*
