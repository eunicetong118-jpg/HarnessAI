# Technology Stack

**Analysis Date:** 2026-04-30

## Languages

**Primary:**
- TypeScript 5.x - Used throughout the application for both frontend and backend logic.

**Secondary:**
- JavaScript - Used in configuration files (e.g., `postcss.config.js`).
- SQL - Underlying language for PostgreSQL database queries (via Prisma).

## Runtime

**Environment:**
- Node.js - Server-side runtime for Next.js.

**Package Manager:**
- npm - Used for dependency management.
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- Next.js 14.2.0 - Full-stack React framework.
- React 18 - UI library.

**Testing:**
- Vitest - Unit and integration testing runner.
- Playwright - End-to-end testing framework.
- Jest - Also present in configuration, likely for specific test suites.
- React Testing Library - Component testing.

**Build/Dev:**
- Tailwind CSS - Utility-first CSS framework.
- PostCSS - CSS transformation.
- TypeScript - Static typing.

## Key Dependencies

**Critical:**
- Prisma - ORM for database access and migrations.
- Next-Auth (Auth.js) 5.0.0-beta.15 - Authentication and session management.
- Zod - Schema validation for APIs and forms.

**Infrastructure:**
- @prisma/adapter-pg - PostgreSQL adapter for Prisma.
- bcryptjs - Password hashing.
- otplib - TOTP (2FA) implementation.

## Configuration

**Environment:**
- `.env` based configuration (documented in `.env.example`).
- `NEXTAUTH_SECRET`, `DATABASE_URL` are required.

**Build:**
- `next.config.mjs`: Next.js configuration.
- `tailwind.config.ts`: Tailwind configuration.
- `tsconfig.json`: TypeScript configuration.
- `prisma/schema.prisma`: Database schema and generator config.

## Platform Requirements

**Development:**
- Node.js 18+ (implied by Next.js 14).
- PostgreSQL database instance.

**Production:**
- Vercel or any Node.js compatible hosting environment.

---

*Stack analysis: 2026-04-30*
