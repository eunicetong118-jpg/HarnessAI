# Codebase Structure

**Analysis Date:** 2026-04-29

## Directory Layout

```
rebatengine/
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── src/
    ├── app/            # Next.js App Router (Routes and Pages)
    │   ├── api/        # Backend API endpoints
    │   ├── auth/       # Auth-related UI (verification)
    │   ├── dashboard/  # User/Admin dashboard
    │   └── ...         # Feature-specific routes (login, signup, onboarding)
    ├── components/     # React components
    │   └── ui/         # Shadcn UI reusable components
    ├── lib/            # Shared utilities
    └── services/       # Business logic layer
```

## Directory Purposes

**prisma/:**
- Purpose: Database configuration and schema definitions
- Contains: Prisma schema, migration files
- Key files: `prisma/schema.prisma`, `prisma.config.ts`

**src/app/:**
- Purpose: Application routing and page structure
- Contains: Layouts, pages, and API routes
- Key files: `src/app/layout.tsx`, `src/app/page.tsx`

**src/components/ui/:**
- Purpose: Atomic UI components
- Contains: Buttons, dialogs, tables, etc.
- Key files: `src/components/ui/button.tsx`, `src/components/ui/table.tsx`

**src/services/:**
- Purpose: Decoupled business logic
- Contains: Service classes or functions for core operations (ledger, tickets, users)

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Application landing page
- `src/app/api/auth/[...nextauth]`: Auth entry point

**Configuration:**
- `package.json`: Dependencies and scripts
- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS theme/styling
- `tsconfig.json`: TypeScript configuration

**Core Logic:**
- `prisma/schema.prisma`: Data model definition
- `src/lib/utils.ts`: Tailwind merge and clsx helpers

**Testing:**
- Not detected (No test files found in initial scan)

## Naming Conventions

**Files:**
- React Components: PascalCase (e.g., `Button.tsx`) or kebab-case for UI (`alert-dialog.tsx`)
- Next.js Special Files: lowercase (e.g., `layout.tsx`, `page.tsx`)
- Utilities/Services: camelCase or lowercase

**Directories:**
- Feature folders: kebab-case

## Where to Add New Code

**New Feature:**
- Primary code: `src/app/[feature-name]/`
- Business Logic: `src/services/[feature-service].ts`

**New Component/Module:**
- Implementation: `src/components/[Component].tsx`
- UI Primitive: `src/components/ui/`

**Utilities:**
- Shared helpers: `src/lib/`

## Special Directories

**node_modules/:**
- Purpose: External dependencies
- Generated: Yes
- Committed: No

**.planning/:**
- Purpose: GSD codebase mapping and project planning
- Generated: Yes
- Committed: Yes

---

*Structure analysis: 2026-04-29*
