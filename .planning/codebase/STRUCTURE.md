# Codebase Structure

**Analysis Date:** 2026-04-30

## Directory Layout

```
[project-root]/
├── app/                # Next.js App Router (pages and layouts)
│   ├── (auth)/         # Auth-related route group
│   ├── (protected)/    # Protected-related route group
│   └── api/            # Next.js Route Handlers (API)
├── components/         # Reusable React components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard feature components
│   ├── ui/             # Shadcn/UI base components
│   └── shared/         # Shared/Common components
├── services/           # Business logic layer
├── lib/                # Shared utilities and client initializations
├── prisma/             # Prisma schema and migrations
├── generated/          # Generated code (Prisma client)
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── config/             # Application configuration files
├── public/             # Static assets
├── __tests__/          # Vitest/Jest unit and integration tests
└── tests/              # E2E tests (Playwright)
```

## Directory Purposes

**app/:**
- Purpose: Contains the routing logic and page structures for the Next.js application.
- Contains: `page.tsx`, `layout.tsx`, `route.ts`, and subdirectories for routes.
- Key files: `app/layout.tsx`, `app/page.tsx`.

**components/:**
- Purpose: House all React components organized by feature or role.
- Contains: `.tsx` and `.ts` files for UI components.
- Key files: `components/ui/` (base components).

**services/:**
- Purpose: Centralizes business logic and database interactions to keep API routes thin.
- Contains: Service classes or function collections.
- Key files: `services/rebate.service.ts`, `services/withdrawal.service.ts`.

**lib/:**
- Purpose: Shared utilities, helper functions, and instances of external clients.
- Contains: Utility functions, authentication config, and Prisma client instance.
- Key files: `lib/prisma.ts`, `lib/auth.ts`, `lib/utils.ts`.

**prisma/:**
- Purpose: Database configuration and schema definition.
- Contains: `schema.prisma`.

**__tests__/:**
- Purpose: Unit and integration tests for services, API routes, and components.
- Contains: Vitest/Jest test files (`.test.ts`, `.spec.tsx`).

## Key File Locations

**Entry Points:**
- `app/page.tsx`: Application landing page.
- `app/layout.tsx`: Root layout shared across the app.
- `middleware.ts`: Global middleware for auth and redirection.

**Configuration:**
- `next.config.mjs`: Next.js configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `prisma/schema.prisma`: Database schema definition.

**Core Logic:**
- `services/`: Primary location for business logic.
- `lib/auth.ts`: Authentication logic and providers.

**Testing:**
- `__tests__/`: Location for unit and integration tests.
- `tests/`: Location for E2E tests.

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `Button.tsx`).
- Routes: `page.tsx` or `route.ts` within directory-based routing.
- Services: camelCase with `.service.ts` suffix (e.g., `rebate.service.ts`).
- Utilities: camelCase (e.g., `utils.ts`).

**Directories:**
- Feature directories: lowercase or kebab-case (e.g., `dashboard`, `verify-accounts`).

## Where to Add New Code

**New Feature:**
- Route: Create a new directory in `app/` with `page.tsx`.
- Components: Create a subdirectory in `components/` for feature-specific components.
- Logic: Add a new service in `services/`.
- Tests: Add tests in `__tests__/`.

**New Component/Module:**
- Shared UI: `components/ui/`.
- Feature-specific: `components/[feature]/`.

**Utilities:**
- Shared helpers: `lib/`.

## Special Directories

**generated/:**
- Purpose: Contains the generated Prisma client.
- Generated: Yes
- Committed: Yes (as configured in this project)

**rebatengine/:**
- Purpose: Appears to be a legacy directory or a separate build output.
- Generated: No
- Committed: Yes

**Frontend components/:**
- Purpose: Storage for RTF files containing component code/templates.
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-04-30*
