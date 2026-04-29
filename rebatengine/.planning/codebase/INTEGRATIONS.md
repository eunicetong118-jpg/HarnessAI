# External Integrations

**Analysis Date:** 2026-04-29

## APIs & External Services

**Email:**
- Nodemailer - Used for sending emails (e.g., verification, password reset).
  - SDK/Client: `nodemailer`
  - Auth: Configuration expected in `.env` (e.g., `SMTP_HOST`, `SMTP_USER`).

**Broker Integration (MT5):**
- Mentioned in `prisma/schema.prisma` (`mt5AccountNo`), suggesting integration with MetaTrader 5 or similar brokerage platforms for rebate tracking.

## Data Storage

**Databases:**
- PostgreSQL
  - Connection: `DATABASE_URL` in `.env`
  - Client: Prisma (`@prisma/client`)

**File Storage:**
- Not explicitly configured in `package.json`, likely local or Vercel-native.

**Caching:**
- None detected.

## Authentication & Identity

**Auth Provider:**
- Next-Auth (v5 Beta)
  - Implementation: JWT or Database sessions with Prisma adapter (`@auth/prisma-adapter`). Supports social logins (implied by `password` being nullable in `User` model).

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- Standard console logging or Next.js defaults.

## CI/CD & Deployment

**Hosting:**
- Vercel (implied by `public/vercel.svg` and Next.js usage).

**CI Pipeline:**
- None detected in root (no `.github/workflows`).

## Environment Configuration

**Required env vars:**
- `DATABASE_URL`: Connection string for PostgreSQL.
- `AUTH_SECRET`: (Likely required by Next-Auth).

**Secrets location:**
- `.env` file (local development).

## Webhooks & Callbacks

**Incoming:**
- `/api/auth/*`: Next-Auth callback endpoints.

**Outgoing:**
- Not detected.

---

*Integration audit: 2026-04-29*
