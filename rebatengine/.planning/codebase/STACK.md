# Technology Stack

**Analysis Date:** 2026-04-29

## Languages

**Primary:**
- TypeScript 5.x - Main application logic, components, and API routes in `src/`.

**Secondary:**
- SQL/Prisma Schema - Database schema definition in `prisma/schema.prisma`.

## Runtime

**Environment:**
- Node.js (implied by Next.js and package.json)

**Package Manager:**
- npm
- Lockfile: present (`package-lock.json`)

## Frameworks

**Core:**
- Next.js 14.2.3 - Full-stack React framework for frontend and API routes.
- React 18 - UI library.

**Testing:**
- Not detected (No testing frameworks found in `package.json`).

**Build/Dev:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework.
- PostCSS 8 - CSS transformation tool.
- ESLint 8 - Linting tool.
- TypeScript 5 - Static type checking.

## Key Dependencies

**Critical:**
- Prisma 7.8.0 - ORM for database access and management.
- Next-Auth 5.0.0-beta.31 - Authentication for Next.js.
- @prisma/client 7.8.0 - Auto-generated database client.

**Infrastructure:**
- bcrypt 6.0.0 - Password hashing.
- nodemailer 7.0.13 - Email sending service.
- otplib 13.4.0 - TOTP (2FA) implementation.
- xlsx 0.18.5 - Excel file processing.

## Configuration

**Environment:**
- Managed via `.env` file.
- `DATABASE_URL` is the primary configuration for database connection.

**Build:**
- `next.config.mjs`: Next.js configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.
- `postcss.config.mjs`: PostCSS configuration.
- `components.json`: Shadcn UI configuration.

## Platform Requirements

**Development:**
- Node.js and npm installed.
- PostgreSQL database (as per `prisma/schema.prisma`).

**Production:**
- Vercel (recommended for Next.js) or any Node.js compatible hosting.

---

*Stack analysis: 2026-04-29*
