# Rebate Portal — Folder Structure (V4)

> Next.js 14 · App Router · PostgreSQL · Prisma · Services Layer · Jest Unit Tests
> Based on V4 spec: ActionToken model, email verification flow, responsive layout, isDisabled/isEmailVerified middleware guards

---

## Legend

| Badge | Meaning |
|-------|---------|
| `[auth]` | Authentication & session logic |
| `[api]` | API route — thin layer, calls services only |
| `[ui]` | UI page or component |
| `[db]` | Database schema, seed, migrations |
| `[service]` | Business logic service |
| `[test]` | Unit test |
| `[admin]` | Admin-only feature |
| `[config]` | Configuration & constants |
| `[email]` | Email / SMTP related |

---

## Root

```
rebate-portal/
├── .env.example                         [config]  DATABASE_URL, NEXTAUTH_*, SMTP_*, WHATSAPP_BUSINESS_LINK, CRON_SECRET
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.ts                       [test]    ts-jest config with @/ path alias resolution
├── package.json
├── middleware.ts                        [auth]    Sequential guard: session → isDisabled → isEmailVerified → broker linked
└── vercel.json                          [config]  Cron schedule: daily 02:00 UTC
```

---

## Prisma — Database

```
prisma/
├── schema.prisma                        [db]      User, BrokerAccount, Ledger, Ticket, ActionToken, Notification
├── seed.ts                              [db]      Admin + Users A/B/C/D + sample ActionTokens + ledger history
└── migrations/
```

**Models in schema.prisma:**
- `User` — id, name, email, password?, role, isDisabled, isEmailVerified, totpSecret?, totpEnabled, lastLoginAttemptAt?, lastSuccessfulLoginAt?, createdAt, lastModifiedAt (@updatedAt)
- `BrokerAccount` — id, userId, mt5AccountNo, status, isActive, verifiedAt?, createdAt, lastModifiedAt
- `Ledger` — id, userId, amount (BigInt cents), type, category, referenceId? (@unique), createdAt, lastModifiedAt
- `Ticket` — id, userId, assigneeUserId?, type, status, content, metadata?, createdAt, lastModifiedAt, closedAt?
- `ActionToken` — id, userId, tokenType (EMAIL_VERIFICATION | PASSWORD_RESET), token (bcrypt hash), expiresAt, createdAt, consumedAt?
- `Notification` — id, userId, message, read, createdAt, lastModifiedAt

---

## App Router — Next.js 14

```
app/
├── layout.tsx                           [ui]      Root layout — fonts, global providers
├── page.tsx                             [ui]      Landing page — hero, 80% rebate CTA, responsive two-column
├── globals.css
│
├── (auth)/                              [auth]    Public auth group — no session required
│   ├── layout.tsx                                 Centered card layout for all auth pages
│   ├── login/
│   │   └── page.tsx                    [ui]      Reads ?error= param → shows toast (account_disabled / email_not_verified)
│   ├── signup/
│   │   └── page.tsx                    [ui]      Registration form → triggers email verification on submit
│   ├── forgot-password/
│   │   └── page.tsx                    [ui]      Request password reset link via SMTP
│   ├── reset-password/
│   │   └── page.tsx                    [ui]      New password form — token validated on page load
│   └── verify/
│       └── email/
│           └── page.tsx                [ui]      Handles ?token=&uid= — verifies ActionToken, sets isEmailVerified=true
│
├── (protected)/                         [auth]    Session-gated group
│   ├── layout.tsx                       [auth]    Guard order: 1) session 2) isDisabled 3) isEmailVerified → redirect /login?error=
│   │
│   ├── onboarding/                      [ui]      MT5 account linkage — one-pager
│   │   └── page.tsx
│   │
│   ├── dashboard/                       [ui]      Main portal — requires broker account linked
│   │   ├── layout.tsx                   [auth]    Checks BrokerAccount count → redirect /onboarding if 0
│   │   ├── page.tsx                     [ui]      Stats cards, chart, ledger table, ticket history
│   │   └── settings/
│   │       └── page.tsx                 [ui]      Profile update, password change, 2FA enrollment, email change
│   │
│   └── admin/                           [admin]   Admin portal
│       ├── layout.tsx                   [admin]   Checks role === ADMIN → redirect /dashboard if not
│       ├── page.tsx                     [admin]   Overview / dashboard
│       ├── tickets/
│       │   └── page.tsx                 [admin]   Ticket command center — Verifications | Withdrawals tabs, Claim + Complete
│       └── users/
│           └── page.tsx                 [admin]   User management — disable/enable, resend verification, balance view
│
└── api/                                 [api]     Thin layer — validates request, calls service, returns response
    ├── auth/
    │   ├── [...nextauth]/
    │   │   └── route.ts                 [auth]    NextAuth handler — Google, Apple, Facebook, Credentials
    │   ├── resend-verification/
    │   │   └── route.ts                 [email]   POST — user-triggered resend of verification email
    │   └── verify-email/
    │       └── route.ts                 [auth]    GET — validates ActionToken, sets isEmailVerified
    ├── cron/
    │   └── process-rebates/
    │       └── route.ts                 [api]     POST — Bearer CRON_SECRET guard → calls rebate.service
    ├── admin/
    │   ├── verify-accounts/
    │   │   └── route.ts                 [admin]   POST — CSV bulk MT5 verification → calls verification.service
    │   └── resend-verification/
    │       └── [userId]/
    │           └── route.ts             [admin]   POST — admin-triggered resend for any user
    ├── tickets/
    │   ├── route.ts                     [api]     GET list, POST create
    │   └── [id]/
    │       └── route.ts                 [api]     GET, PATCH (close / assign)
    ├── broker/
    │   └── link/
    │       └── route.ts                 [api]     POST — link MT5 account, create VERIFICATION ticket
    ├── withdrawal/
    │   └── route.ts                     [api]     POST — validate balance + TOTP → calls withdrawal.service
    └── notifications/
        └── route.ts                     [api]     GET unread, PATCH mark-read / mark-all-read
```

---

## Services — Business Logic Layer

> API routes call services. Services call Prisma. Nothing else calls Prisma directly.

```
services/
│
├── auth.service.ts                      [service]
│   # User registration: validates password complexity, hashes with bcrypt (cost 12), stores
│   # Login: bcrypt.compare() — never decrypt. Updates lastLoginAttemptAt and lastSuccessfulLoginAt
│   # Social login upsert: captures name + email from provider, idempotent
│   # Password reset: generates raw token, stores bcrypt hash as ActionToken (PASSWORD_RESET, 1h TTL)
│   # TOTP enrollment: generates secret, verifies OTP code via otplib before activating
│
├── actionToken.service.ts               [service]
│   # createToken(userId, type): generates raw token, hashes it, stores ActionToken with correct TTL
│   #   EMAIL_VERIFICATION → expiresAt = now + 24h
│   #   PASSWORD_RESET     → expiresAt = now + 1h
│   # consumeToken(userId, type, rawToken): finds unconsumed token, hashes incoming and compares,
│   #   checks expiresAt > now, sets consumedAt = now() on success
│   # invalidatePrior(userId, type): sets consumedAt = now() on all prior unconsumed tokens
│   #   (called before creating a new token to prevent stale links)
│   # Used by: auth.service (password reset), emailVerification.service
│
├── emailVerification.service.ts         [service] [email]
│   # sendVerificationEmail(userId, email): calls actionToken.service.createToken, builds JWT link,
│   #   sends via SMTP (Nodemailer). Link format: /auth/verify/email?token=RAW&uid=UUID
│   # verifyEmail(userId, rawToken): calls actionToken.service.consumeToken,
│   #   on success sets User.isEmailVerified = true
│   # resendVerification(userId): calls actionToken.service.invalidatePrior, then sendVerificationEmail
│   # Used by: registration flow, admin resend endpoint, user-triggered resend
│
├── broker.service.ts                    [service]
│   # linkAccount(userId, mt5AccountNo, countryCode): creates BrokerAccount (PENDING, isActive: true)
│   #   + creates VERIFICATION Ticket with metadata { mt5AccountNo, countryCode, ibUrl }
│   # hasLinkedAccount(userId): returns boolean — used by dashboard route guard
│   # getIbUrl(countryCode): looks up /config/ib-mapping.ts, returns { ibUrl, ibName }
│   # deactivateAccount(id): sets isActive = false (soft disable, preserves financial history)
│
├── ledger.service.ts                    [service]
│   # getBalance(userId): returns { totalRebate, totalWithdrawn, availableBalance } all in cents
│   # insertCredit(userId, amount, category, referenceId): creates CREDIT Ledger entry
│   # insertDebit(userId, amount, category, referenceId): creates DEBIT Ledger entry
│   # getHistory(userId, page, pageSize): paginated Ledger rows with running balance
│   # validateWithdrawalAmount(userId, amountCents): checks minimum threshold and available balance
│
├── rebate.service.ts                    [service]
│   # processBatch(fileBuffer): parses Excel/CSV via xlsx, normalises to trade rows
│   # For each trade: dedup check (referenceId), VERIFIED + isActive account check,
│   #   calculates volume × rebatePerLot × 0.80, converts to cents via Math.round
│   # Groups by userId, inserts one CREDIT per user: referenceId = "BATCH-{date}-{userId}"
│   # Returns { processed, skipped, errors[] }
│
├── withdrawal.service.ts                [service]
│   # requestWithdrawal(userId, amountCents, totpCode, metadata):
│   #   1. calls ledger.service.validateWithdrawalAmount
│   #   2. verifies TOTP code via otplib (rejects if 2FA not enrolled)
│   #   3. creates WITHDRAWAL Ticket with metadata { accountNo, amountCents }
│   #   4. calls ledger.service.insertDebit (pending admin confirmation)
│   # Returns created Ticket
│
├── ticket.service.ts                    [service]
│   # createTicket(userId, type, content, metadata): inserts with status PENDING, closedAt null
│   # closeTicket(id): sets status DONE, closedAt = now(), lastModifiedAt auto-updated
│   # assignTicket(id, adminUserId): sets assigneeUserId
│   # listPending(type?): returns PENDING tickets with joined user details (for admin view)
│   # listByUser(userId, page): paginated ticket history for dashboard
│
├── verification.service.ts              [service]
│   # processCsv(csvBuffer): parses MT5 account numbers from CSV
│   # For each number: finds PENDING BrokerAccount → sets VERIFIED + verifiedAt
│   #   closes associated VERIFICATION Ticket via ticket.service
│   #   queues notification via notification.service
│   # Returns { verified, notFound, alreadyVerified }
│
└── notification.service.ts              [service]
    # create(userId, message): inserts Notification with read = false
    # getUnread(userId): returns all unread notifications
    # getUnreadCount(userId): returns integer count for bell badge
    # markAsRead(id): sets read = true for single notification
    # markAllRead(userId): bulk update all unread → read for user
```

---

## Unit Tests — Services

> Mock Prisma via `jest-mock-extended`. Tests must not touch a real database.

```
__tests__/
└── services/
    │
    ├── auth.service.test.ts             [test]
    │   # Password hashed with bcrypt before storage (never plain)
    │   # bcrypt.compare() on login — not decryption
    │   # Invalid credentials return generic error (no user enumeration)
    │   # Duplicate email registration throws conflict error
    │   # Social login upsert idempotent (same email = update, not duplicate)
    │   # TOTP: valid code accepted, invalid rejected
    │
    ├── actionToken.service.test.ts      [test]
    │   # Token stored as bcrypt hash, not raw string
    │   # Expired token (expiresAt < now) rejected
    │   # Consumed token (consumedAt != null) rejected
    │   # Valid token sets consumedAt on first use (prevents reuse)
    │   # EMAIL_VERIFICATION TTL = 24h; PASSWORD_RESET TTL = 1h
    │   # Resend: prior tokens invalidated before new one created
    │
    ├── emailVerification.service.test.ts [test]
    │   # sendVerificationEmail calls createToken + sends email via SMTP
    │   # verifyEmail: valid token sets isEmailVerified = true
    │   # verifyEmail: expired token returns error, does not verify
    │   # resendVerification: invalidates old token, creates new, sends email
    │   # Admin resend path works for any userId
    │
    ├── broker.service.test.ts           [test]
    │   # linkAccount creates BrokerAccount (PENDING) + VERIFICATION Ticket
    │   # Duplicate MT5 number throws unique constraint error
    │   # getIbUrl returns correct URL for country code
    │   # hasLinkedAccount: false for new user, true after linking
    │   # isActive: false account excluded from rebate processing
    │
    ├── ledger.service.test.ts           [test]
    │   # availableBalance = sum(CREDIT) − sum(DEBIT) in cents
    │   # Balance = 0 for user with no entries
    │   # Minimum threshold rejects amounts below limit
    │   # Cent conversion: Math.round(value * 100)
    │   # Paginated history returns correct page size and offset
    │
    ├── rebate.service.test.ts           [test]
    │   # volume × rebatePerLot × 0.80 formula correct
    │   # Existing referenceId skipped (dedup)
    │   # Unverified MT5 account skipped
    │   # isActive: false account skipped
    │   # Multiple trades per user aggregated into one CREDIT
    │   # Batch summary: processed / skipped / errors counts correct
    │
    ├── withdrawal.service.test.ts       [test]
    │   # Amount below threshold → validation error
    │   # Amount exceeding balance → validation error
    │   # Invalid TOTP code → blocked
    │   # 2FA not enrolled → blocked entirely
    │   # Success: creates WITHDRAWAL Ticket + DEBIT Ledger entry in cents
    │
    ├── ticket.service.test.ts           [test]
    │   # Created ticket: status PENDING, closedAt null
    │   # closeTicket: sets closedAt timestamp + status DONE
    │   # assignTicket: sets assigneeUserId correctly
    │   # Filter by status returns correct subset
    │   # Admin list includes joined user details (name, email)
    │
    ├── verification.service.test.ts     [test]
    │   # Matched MT5 numbers → BrokerAccount.status = VERIFIED
    │   # Unmatched → counted as notFound
    │   # Already VERIFIED → counted as alreadyVerified, no duplicate write
    │   # VERIFICATION Ticket closed on match
    │   # Notification queued per verified user
    │
    └── notification.service.test.ts     [test]
        # Created notification has read: false
        # getUnreadCount returns correct integer
        # markAsRead updates only target record
        # markAllRead clears all unread for user only
```

---

## Components

```
components/
│
├── ui/                                  [ui]      shadcn/ui base components
│   ├── button.tsx
│   ├── modal.tsx                                  Desktop: centered; Mobile: bottom sheet
│   ├── badge.tsx
│   ├── table.tsx                                  Horizontally scrollable on mobile, sticky first col
│   ├── input.tsx
│   ├── toast.tsx                                  Reads ?error= / ?success= query params
│   ├── skeleton.tsx                               Loading skeletons for all async content
│   └── bottom-sheet.tsx                           Mobile-only full-screen sheet wrapper
│
├── auth/                                [auth]
│   ├── LoginForm.tsx                              Handles ?error= param → displays inline error banner
│   ├── SignupForm.tsx                             On success → shows "check your email" confirmation
│   ├── SocialButtons.tsx                          Google / Apple / Facebook OAuth triggers
│   └── ResetPasswordForm.tsx
│
├── dashboard/                           [ui]
│   ├── StatsCards.tsx                             Responsive: 1-col mobile / 3-col desktop
│   ├── RebateChart.tsx                            Sparkline (mobile) / full AreaChart (desktop)
│   ├── LedgerTable.tsx                            Paginated, scrollable on mobile
│   ├── TicketTable.tsx
│   ├── WithdrawalModal.tsx                        Bottom sheet on mobile / modal on desktop
│   ├── AccountStatusBadge.tsx                     PENDING (amber pulse) / VERIFIED (green check)
│   ├── MilestoneAnimation.tsx                     Lottie confetti — triggers on milestone crossing
│   └── ShareButton.tsx                            html-to-image → rebate-results-{date}.jpg
│
├── onboarding/                          [ui]
│   ├── CountrySelector.tsx                        Dropdown → maps to IB URL via ib-mapping.ts
│   └── MT5Form.tsx                                Numeric input, min 5 digits, inline validation
│
├── admin/                               [admin]
│   ├── TicketCommandCenter.tsx                    Tabs: Verifications | Withdrawals
│   ├── TicketRow.tsx                              Claim button (sets assigneeUserId) + Complete button
│   └── UserTable.tsx                              Disable toggle, resend verification action
│
├── landing/                             [ui]
│   ├── HeroSection.tsx                            Responsive: stacked (mobile) / two-column (desktop)
│   └── CTAButtons.tsx                             Login + Get Started, 80% rebate headline
│
└── shared/                              [ui]
    ├── Navbar.tsx                                 Desktop: left sidebar / Mobile: bottom tab bar
    ├── WhatsAppButton.tsx                         Fixed bottom-right, links to WHATSAPP_BUSINESS_LINK
    ├── NotificationBell.tsx                       Unread count badge, mark-as-read on click
    └── ReferralModal.tsx                          "Coming Soon" modal with email capture
```

---

## Lib — Infrastructure Clients

```
lib/
├── prisma.ts                            [db]      Prisma client singleton (prevents connection pool exhaustion)
├── auth.ts                              [auth]    NextAuth v5 config — providers, session callbacks, JWT strategy
├── email.ts                             [email]   Nodemailer SMTP transport — configured from SMTP_* env vars
│                                                  Exports: sendMail(to, subject, html)
└── totp.ts                              [auth]    otplib helpers — generateSecret(), verifyToken(secret, code)
```

---

## Config — Constants & Mappings

```
config/
├── site.ts                              [config]  HERO_IMAGE_URL, APP_NAME, MIN_WITHDRAWAL_CENTS, BASE_URL
├── ib-mapping.ts                        [config]  { countryCode, ibUrl, ibName }[] — country → IB URL lookup
└── milestones.ts                        [config]  [100, 500, 1000, 5000] USD milestone values for animations
```

---

## Types

```
types/
├── next-auth.d.ts                                 Extends Session with role, isDisabled, isEmailVerified
└── index.ts                                       Shared domain types: BalanceSummary, BatchResult, etc.
```

---

## Hooks

```
hooks/
├── useBalance.ts                                  SWR/fetch hook for balance stats (dashboard)
├── useNotifications.ts                            Polling hook for unread notifications + mark-read actions
└── use2FA.ts                                      TOTP enrollment state — QR code generation, verify step
```

---

## Data

```
data/
└── pending-trades/                      [db]      Drop directory for Excel/CSV files consumed by cron job
```

---

## Full Tree (compact)

```
rebate-portal/
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.ts
├── package.json
├── middleware.ts
├── vercel.json
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify/email/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── settings/page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── tickets/page.tsx
│   │       └── users/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── auth/resend-verification/route.ts
│       ├── auth/verify-email/route.ts
│       ├── cron/process-rebates/route.ts
│       ├── admin/verify-accounts/route.ts
│       ├── admin/resend-verification/[userId]/route.ts
│       ├── tickets/route.ts
│       ├── tickets/[id]/route.ts
│       ├── broker/link/route.ts
│       ├── withdrawal/route.ts
│       └── notifications/route.ts
│
├── services/
│   ├── auth.service.ts
│   ├── actionToken.service.ts
│   ├── emailVerification.service.ts
│   ├── broker.service.ts
│   ├── ledger.service.ts
│   ├── rebate.service.ts
│   ├── withdrawal.service.ts
│   ├── ticket.service.ts
│   ├── verification.service.ts
│   └── notification.service.ts
│
├── __tests__/
│   └── services/
│       ├── auth.service.test.ts
│       ├── actionToken.service.test.ts
│       ├── emailVerification.service.test.ts
│       ├── broker.service.test.ts
│       ├── ledger.service.test.ts
│       ├── rebate.service.test.ts
│       ├── withdrawal.service.test.ts
│       ├── ticket.service.test.ts
│       ├── verification.service.test.ts
│       └── notification.service.test.ts
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── modal.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── input.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   └── bottom-sheet.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── SocialButtons.tsx
│   │   └── ResetPasswordForm.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── RebateChart.tsx
│   │   ├── LedgerTable.tsx
│   │   ├── TicketTable.tsx
│   │   ├── WithdrawalModal.tsx
│   │   ├── AccountStatusBadge.tsx
│   │   ├── MilestoneAnimation.tsx
│   │   └── ShareButton.tsx
│   ├── onboarding/
│   │   ├── CountrySelector.tsx
│   │   └── MT5Form.tsx
│   ├── admin/
│   │   ├── TicketCommandCenter.tsx
│   │   ├── TicketRow.tsx
│   │   └── UserTable.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   └── CTAButtons.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── WhatsAppButton.tsx
│       ├── NotificationBell.tsx
│       └── ReferralModal.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── email.ts
│   └── totp.ts
│
├── config/
│   ├── site.ts
│   ├── ib-mapping.ts
│   └── milestones.ts
│
├── types/
│   ├── next-auth.d.ts
│   └── index.ts
│
├── hooks/
│   ├── useBalance.ts
│   ├── useNotifications.ts
│   └── use2FA.ts
│
└── data/
    └── pending-trades/
```

---

## Key Changes from V3 → V4

| Area | Change |
|------|--------|
| `services/actionToken.service.ts` | New service — handles token creation, consumption, expiry, invalidation for both email verification and password reset flows |
| `services/emailVerification.service.ts` | New service — extracted from auth.service; owns the full send → verify → resend lifecycle |
| `app/(auth)/verify/email/page.tsx` | New route — handles incoming verification link `?token=&uid=` |
| `app/api/auth/resend-verification/route.ts` | New endpoint — user-triggered resend |
| `app/api/admin/resend-verification/[userId]/route.ts` | New endpoint — admin-triggered resend for any user |
| `middleware.ts` | Sequential 3-step guard: session → isDisabled → isEmailVerified (redirects to `/login?error=` with specific code) |
| `components/ui/bottom-sheet.tsx` | New — mobile full-screen sheet for WithdrawalModal and other overlays |
| `components/ui/skeleton.tsx` | New — skeleton loaders for all async content |
| `lib/email.ts` | Nodemailer SMTP transport (replaces Resend from V3) |
| `__tests__/services/actionToken.service.test.ts` | New test file — covers hash storage, expiry, consumption, invalidation |
| `__tests__/services/emailVerification.service.test.ts` | New test file — covers send, verify, resend, admin resend paths |
| Schema: `ActionToken` model | New — unified token model for EMAIL_VERIFICATION and PASSWORD_RESET with bcrypt-hashed token field |
| Schema: `User` | Added isDisabled, isEmailVerified, lastLoginAttemptAt, lastSuccessfulLoginAt, lastModifiedAt |
| Schema: `BrokerAccount` | Added isActive, lastModifiedAt |
| Schema: `Ledger` | Added lastModifiedAt |
| Schema: `Ticket` | Added assigneeUserId, lastModifiedAt |
| Schema: `Notification` | Added lastModifiedAt |
| Seed: Users C + D | New seed users for email-not-verified and account-disabled middleware test paths |
