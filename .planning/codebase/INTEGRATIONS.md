# External Integrations

**Analysis Date:** 2026-04-30

## APIs & External Services

**Email:**
- SMTP - Used for sending verification and transactional emails.
  - SDK/Client: `nodemailer` (Package installed, implementation stubbed in `lib/email.ts`).
  - Auth: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` env vars.

**Social / Auth:**
- OAuth Providers - Google, Facebook, Apple (Configuration slots present in `.env.example`).
  - Client: `next-auth`.

**Messaging:**
- WhatsApp - Direct link integration.
  - Link: `WHATSAPP_BUSINESS_LINK` env var.

## Data Storage

**Databases:**
- PostgreSQL
  - Connection: `DATABASE_URL` env var.
  - Client: Prisma ORM (`@prisma/client`).

**File Storage:**
- Local filesystem or memory (No dedicated cloud storage provider like S3 detected).

**Caching:**
- None detected (Next.js default fetch cache used).

## Authentication & Identity

**Auth Provider:**
- Next-Auth (Auth.js)
  - Implementation: JWT strategy with Credentials provider (Email/Password) and Prisma adapter.
  - 2FA: TOTP implementation using `otplib` and `qrcode`.

## Monitoring & Observability

**Error Tracking:**
- Not detected.

**Logs:**
- Console-based logging.

## CI/CD & Deployment

**Hosting:**
- Vercel (Likely, given Next.js project type).

**CI Pipeline:**
- None detected (No `.github/workflows` or equivalent).

## Environment Configuration

**Required env vars:**
- `DATABASE_URL`: Prisma connection string.
- `NEXTAUTH_SECRET`: Auth.js session encryption.
- `NEXTAUTH_URL`: Canonical URL for auth redirects.
- `SMTP_*`: Credentials for email service.

**Secrets location:**
- `.env` (Excluded from git).

## Webhooks & Callbacks

**Incoming:**
- Auth callbacks: `/api/auth/callback/[provider]`.

**Outgoing:**
- None detected.

---

*Integration audit: 2026-04-30*
