# Architecture

**Analysis Date:** 2026-04-30

## Pattern Overview

**Overall:** Layered Architecture with Next.js App Router

**Key Characteristics:**
- Separation of concerns between UI, API routes, business logic (services), and data access.
- React Server Components (RSC) by default for pages and layouts.
- Centralized business logic in a dedicated service layer.

## Layers

**Presentation Layer:**
- Purpose: Renders the user interface and handles client-side interaction.
- Location: `app/` and `components/`
- Contains: Next.js pages, layouts, and reusable React components.
- Depends on: `services/`, `lib/`, `hooks/`
- Used by: End users

**API Layer:**
- Purpose: Handles HTTP requests, input validation, and orchestration.
- Location: `app/api/`
- Contains: Next.js Route Handlers.
- Depends on: `services/`, `lib/`
- Used by: Frontend components and external clients

**Service Layer:**
- Purpose: Encapsulates business logic and domain rules.
- Location: `services/`
- Contains: Service classes (e.g., `RebateService`, `WithdrawalService`) with static methods.
- Depends on: `lib/prisma.ts`, `types/`
- Used by: API routes and Server Components

**Data Access Layer:**
- Purpose: Manages database interactions.
- Location: `prisma/` and `generated/prisma/`
- Contains: Prisma schema and generated client.
- Depends on: PostgreSQL database
- Used by: `services/`

## Data Flow

**Standard Request Flow:**

1. User interacts with a component in `app/` or `components/`.
2. Component triggers a fetch to an API route in `app/api/` (or calls a Server Action).
3. API route validates the request (e.g., using Zod) and calls a method in `services/`.
4. Service performs business logic and interacts with the database via `lib/prisma.ts`.
5. Service returns results to the API route.
6. API route sends a JSON response back to the component.

**State Management:**
- Server-side state: Managed by Next.js (cache, revalidation) and Prisma.
- Client-side state: Managed by React hooks and context providers in `components/providers/`.

## Key Abstractions

**Service Classes:**
- Purpose: Group related business logic for a specific domain entity.
- Examples: `services/rebate.service.ts`, `services/withdrawal.service.ts`
- Pattern: Static service class / Singleton.

**Prisma Client:**
- Purpose: Type-safe database client.
- Examples: `lib/prisma.ts`
- Pattern: Data Mapper / ORM.

## Entry Points

**Web Frontend:**
- Location: `app/page.tsx`
- Triggers: User visiting the root URL.
- Responsibilities: Rendering the landing page or redirecting to the dashboard.

**Authentication:**
- Location: `app/api/auth/[...nextauth]/route.ts`
- Triggers: Login/Logout actions.
- Responsibilities: Handling OAuth and Credentials-based authentication via NextAuth.js.

**Middleware:**
- Location: `middleware.ts`
- Triggers: Every request (filtered by matcher).
- Responsibilities: Authentication checks, role-based authorization, and 2FA enforcement.

## Error Handling

**Strategy:** Exception-based error handling with HTTP-status-aware responses in API routes.

**Patterns:**
- Try-catch blocks in Route Handlers to catch service-layer errors and return appropriate `NextResponse` with status codes.
- Zod validation for incoming request bodies to catch schema errors early.

## Cross-Cutting Concerns

**Logging:** Standard console logging (likely to be expanded).
**Validation:** Zod schemas for input validation (found in API routes and services).
**Authentication:** NextAuth.js (Auth.js) integrated with Prisma adapter.

---

*Architecture analysis: 2026-04-30*
