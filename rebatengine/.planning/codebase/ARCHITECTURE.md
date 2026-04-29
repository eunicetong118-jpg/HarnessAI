# Architecture

**Analysis Date:** 2026-04-29

## Pattern Overview

**Overall:** Next.js App Router Architecture with Prisma ORM

**Key Characteristics:**
- Full-stack React framework (Next.js 14)
- Schema-first database management with Prisma
- Component-based UI using Shadcn UI (Radix UI)
- Centralized Authentication with NextAuth.js

## Layers

**Presentation Layer:**
- Purpose: Handles UI and routing
- Location: `src/app/` and `src/components/`
- Contains: React Server/Client Components, Tailwind CSS styles
- Depends on: `src/services/`, `src/lib/`
- Used by: End users

**Service Layer:**
- Purpose: Business logic and data orchestration
- Location: `src/services/`
- Contains: Business logic (placeholder directories created)
- Depends on: `src/generated/prisma`
- Used by: `src/app/api/` and Server Components

**Data Access Layer:**
- Purpose: Database schema and client generation
- Location: `prisma/`
- Contains: `schema.prisma`
- Depends on: PostgreSQL (configured in `.env`)
- Used by: Service Layer

## Data Flow

**Standard Request Flow:**

1. Client interacts with a component in `src/app/`
2. Server Components or API Routes (`src/app/api/`) handle the request
3. Business logic is executed via Service Layer (intended pattern)
4. Prisma Client interacts with PostgreSQL
5. Response is returned to the UI

**State Management:**
- Server-side state handled by Next.js and Prisma
- Client-side state handled by React hooks (intended)

## Key Abstractions

**Database Models:**
- Purpose: Defines the core entities of the system (User, Ledger, Ticket, BrokerAccount)
- Examples: `prisma/schema.prisma`
- Pattern: Active Record / Data Mapper (Prisma)

**UI Components:**
- Purpose: Reusable atomic design elements
- Examples: `src/components/ui/button.tsx`, `src/components/ui/dialog.tsx`
- Pattern: Shadcn UI / Radix UI primitives

## Entry Points

**Web Application:**
- Location: `src/app/page.tsx`
- Triggers: User navigation to root URL
- Responsibilities: Main landing page

**API Authentication:**
- Location: `src/app/api/auth/[...nextauth]`
- Triggers: Auth requests (login, callback, session)
- Responsibilities: Handles authentication flow using NextAuth

## Error Handling

**Strategy:** Standard Next.js error boundaries and Prisma error handling

**Patterns:**
- `error.tsx` in `src/app/` (intended)
- Database level constraints (e.g., unique indices in `schema.prisma`)

## Cross-Cutting Concerns

**Logging:** Standard console logging (observed in typical Next.js setups)
**Validation:** Likely handled via Zod or similar (standard with Shadcn/Next.js)
**Authentication:** Managed by NextAuth.js in `src/app/api/auth/`

---

*Architecture analysis: 2026-04-29*
