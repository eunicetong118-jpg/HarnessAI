# Technical Specification & Implementation Prompt
## Monolith Brokerage Rebate Portal — Claude Code Build Directive (V4)

---

## SECTION 0: EXECUTION ORDER (Follow strictly)

Build in this sequence. Do not skip ahead:
1. Project scaffold + DB schema + env config
2. Authentication system (all providers) + email verification flow
3. Onboarding route guard + one-pager
4. Dashboard + Ledger UI
5. Rebate cron job + deduplication logic
6. Withdrawal flow + 2FA
7. Admin portal
8. Secondary features (share, WhatsApp, referral stub)

---

## SECTION 1: TECH STACK (Explicit — no inference)

```
Framework:      Next.js 14 (App Router)
Database:       PostgreSQL via Prisma ORM
Auth:           NextAuth.js v5 (Google, Apple, Facebook + Credentials)
Styling:        Tailwind CSS + shadcn/ui components
Charts:         Recharts
Animations:     Lottie React (milestones), Framer Motion (transitions)
2FA:            TOTP via otplib + QR code enrollment (Google Authenticator compatible)
Cron Jobs:      node-cron (self-hosted) or Vercel Cron (if deploying to Vercel)
Image Export:   html-to-image library
File Parsing:   xlsx library (for Excel/CSV ingestion)
Email:          Nodemailer with SMTP (configure via env vars)
Deployment:     Vercel (configure vercel.json for cron) or Docker-ready if self-hosted
```

Environment variables to scaffold in `.env.example`:
```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
APPLE_CLIENT_ID, APPLE_CLIENT_SECRET
FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
WHATSAPP_BUSINESS_LINK
CRON_SECRET
# Maintenance & Security Kill Switch
MAINTENANCE_MODE_ENABLED=false  # Global kill switch (true/false)
MAINTENANCE_BYPASS_USER=admin_dev
MAINTENANCE_BYPASS_PASS=P@ssw0rd123!
```

---

## SECTION 2: DATABASE SCHEMA

Implement this Prisma schema exactly:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role          { USER ADMIN }
enum Status        { PENDING VERIFIED }
enum EntryType     { CREDIT DEBIT }
enum Category      { REBATE WITHDRAWAL FEE }
enum TicketType    { WITHDRAWAL VERIFICATION }
enum TicketStatus  { PENDING DONE }
enum ActionTokenType { EMAIL_VERIFICATION PASSWORD_RESET }

model User {
  id                     String          @id @default(uuid())
  name                   String
  email                  String          @unique
  password               String?         // Nullable: social login users have no password
  role                   Role            @default(USER)
  isDisabled             Boolean         @default(false)   // Security: disable user account
  isEmailVerified        Boolean         @default(false)   // Must verify before accessing portal
  totpSecret             String?         // 2FA secret (null until enrolled)
  totpEnabled            Boolean         @default(false)
  lastLoginAttemptAt     DateTime?       // Trace: timestamp of most recent login attempt
  lastSuccessfulLoginAt  DateTime?       // Trace: timestamp of last successful login
  createdAt              DateTime        @default(now())
  lastModifiedAt         DateTime        @updatedAt
  accounts               BrokerAccount[]
  ledger                 Ledger[]
  tickets                Ticket[]
  actionTokens           ActionToken[]
  notifications          Notification[]
}

model BrokerAccount {
  id             String    @id @default(uuid())
  userId         String
  mt5AccountNo   String    @unique
  status         Status    @default(PENDING)
  isActive       Boolean   @default(true)   // Soft-disable without deleting the record
  verifiedAt     DateTime?
  createdAt      DateTime  @default(now())
  lastModifiedAt DateTime  @updatedAt
  user           User      @relation(fields: [userId], references: [id])
}

model Ledger {
  id             String      @id @default(uuid())
  userId         String
  amount         BigInt      // Stored in cents to prevent floating-point errors
  type           EntryType
  category       Category
  referenceId    String?     @unique  // TradeID for dedup; @unique enforces DB-level prevention
  createdAt      DateTime    @default(now())
  lastModifiedAt DateTime    @updatedAt
  user           User        @relation(fields: [userId], references: [id])
}

model Ticket {
  id             String        @id @default(uuid())
  userId         String
  assigneeUserId String?       // Admin/agent handling this ticket (nullable until assigned)
  type           TicketType
  status         TicketStatus  @default(PENDING)
  content        String
  metadata       Json?
  createdAt      DateTime      @default(now())
  lastModifiedAt DateTime      @updatedAt
  closedAt       DateTime?     // Null until resolved — do NOT default to now()
  user           User          @relation(fields: [userId], references: [id])
}

model ActionToken {
  id          String          @id @default(uuid())
  userId      String
  tokenType   ActionTokenType
  token       String          // Store as bcrypt hash — never plain text
  expiresAt   DateTime        // EMAIL_VERIFICATION: 24h; PASSWORD_RESET: 1h
  createdAt   DateTime        @default(now())
  consumedAt  DateTime?       // Null until used; set on first valid consumption
  user        User            @relation(fields: [userId], references: [id])
}

model Notification {
  id             String    @id @default(uuid())
  userId         String
  message        String
  read           Boolean   @default(false)
  createdAt      DateTime  @default(now())
  lastModifiedAt DateTime  @updatedAt
  user           User      @relation(fields: [userId], references: [id])
}
```

### Schema Notes
- `lastModifiedAt` uses `@updatedAt` on all models — Prisma updates this automatically on every write
- `Ticket.closedAt` is null by default — setting it to `now()` by default would corrupt audit trail
- `Ticket.assigneeUserId` is nullable; populate it when an admin claims a ticket
- `ActionToken.token` must be stored as a bcrypt hash — never store raw tokens in the database
- `Ledger.referenceId` has `@unique` to enforce DB-level deduplication (not just app-level)
- `User.password` is nullable to support OAuth-only users
- `BrokerAccount.isActive` enables soft-disabling an account without deleting financial history
- `User.isDisabled` is the security kill-switch; checked on every authenticated request

---

## SECTION 3: VISUAL DESIGN SYSTEM

**Aesthetic**: High-contrast dark theme. Sharp borders. Premium feel. Fully responsive.

### Color Tokens (define in `tailwind.config.js`)
```
--color-bg:        #0A0A0F   (near-black background)
--color-surface:   #12121A   (card/panel surface)
--color-border:    #2A2A3D   (sharp component borders)
--color-accent:    #7C3AED   (primary violet — CTAs, highlights)
--color-accent-2:  #06B6D4   (cyan — secondary highlights, charts)
--color-success:   #10B981   (green — verified status)
--color-warning:   #F59E0B   (amber — pending status)
--color-danger:    #EF4444   (red — errors, debit entries)
--color-text:      #F1F5F9   (primary text)
--color-muted:     #64748B   (secondary text)
```

### Responsive Layout Requirements
Implement a **mobile-first responsive layout** across all pages:

```
Breakpoints (Tailwind defaults):
  sm:   640px   — single column, stacked navigation
  md:   768px   — tablet layout, collapsible sidebar
  lg:   1024px  — desktop layout, full sidebar visible
  xl:   1280px  — wide desktop, expanded content area
```

**Mobile-specific rules**:
- Navigation: bottom tab bar on mobile (`sm`), left sidebar on desktop (`lg+`)
- Stats cards: single column stack on mobile, 3-column grid on desktop
- Ledger/ticket tables: horizontally scrollable on mobile with sticky first column
- Withdrawal modal: full-screen bottom sheet on mobile, centered modal on desktop
- Chart: simplified sparkline on mobile, full AreaChart on desktop
- All touch targets minimum 44×44px (WCAG AA)
- No hover-only interactions — all actions must be tap-accessible

### Landing Page
- Full-viewport hero section
- Mobile: stacked layout (image top, copy + CTAs below)
- Desktop: two-column split (copy left, image right)
- Right side: high-quality placeholder image slot. Source stored as `HERO_IMAGE_URL` constant in `/config/site.ts` — never hardcode into component
- Prominent "80% Rebate" headline as primary CTA throughout

### Status Bubbles
- PENDING:  Amber pill badge with pulsing dot animation
- VERIFIED: Green pill badge with static checkmark icon

---

## SECTION 4: AUTHENTICATION & USER LIFECYCLE

**Providers**: Google, Apple, Facebook (capture name + email), Credentials

### Password Security
- **Only bcrypt-hashed passwords are stored in the database** — never plaintext, never reversible encryption
- Hash with minimum cost factor of 12: `bcrypt.hash(password, 12)`
- On login, compare with `bcrypt.compare()` — never decrypt

### Password Complexity Rules (enforce on both client + server)
```
Minimum 8 characters
At least one uppercase letter
At least one lowercase letter
At least one number
Regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
```

### Middleware Authentication Logic

/** * NEW MIDDLEWARE LOGIC (Insert at top of flow)
 * 1. Global Kill Switch Check:
 * - If MAINTENANCE_MODE_ENABLED === 'true':
 * - Check for 'Bypass' header or cookie containing hashed MAINTENANCE_BYPASS_USER:PASS
 * - If no bypass -> Redirect all requests to /maintenance
 * - Exception: /maintenance and /api/auth routes remain accessible
 * * 2. Proceed to existing Auth/Disabled/Verification checks...
 */

On every request to `(protected)/*`, the middleware must check these conditions **in order**:

```
1. Is there a valid session?
   NO  → redirect to /login
   YES → continue

2. Is User.isDisabled === true?
   YES → redirect to /login?error=account_disabled
         UI shows: "Your account has been disabled. Please contact support."
   NO  → continue

3. Is User.isEmailVerified === false?
   YES → redirect to /login?error=email_not_verified
         UI shows: "Please verify your email address before logging in.
                    Didn't receive the email? [Resend verification]"
   NO  → continue to destination
```

The login page must read the `?error=` query param on mount and display the appropriate error toast/banner.

### Email Verification Flow
1. User completes registration
2. System generates a secure random token, hashes it with bcrypt, stores as `ActionToken` with:
   - `tokenType: EMAIL_VERIFICATION`
   - `expiresAt: now + 24 hours`
3. Send email via SMTP (Nodemailer) with verification link:
   `{NEXTAUTH_URL}/auth/verify/email?token={rawToken}&uid={userId}`
4. User clicks link → `GET /auth/verify/email`:
   - Look up ActionToken by `userId` where `tokenType = EMAIL_VERIFICATION` and `consumedAt IS NULL`
   - Hash the incoming `token` and compare to stored hash
   - Check `expiresAt > now` — if expired: show error "Link expired" with [Resend Verification] button
   - If valid: set `User.isEmailVerified = true`, set `ActionToken.consumedAt = now()`
   - Redirect to `/login?success=email_verified`
   - UI shows: "Email verified successfully. You can now log in."
5. If link is expired: user can request a new one via the resend endpoint:
   - `POST /api/auth/resend-verification` — invalidates old tokens (set consumedAt), creates new ActionToken

### Password Reset Flow
1. User requests reset → generate raw token, hash it, store `ActionToken` with:
   - `tokenType: PASSWORD_RESET`
   - `expiresAt: now + 1 hour`
2. Send email via SMTP with reset link: `/auth/reset-password?token={rawToken}&uid={userId}`
3. Token validates on page load — expired/invalid tokens show error state immediately
4. Form requires "New Password" + "Confirm Password" with same complexity rules
5. On success: set `ActionToken.consumedAt = now()`, hash new password, store, redirect to `/login`

### Profile Management (`/settings`)
- Update name, email (triggers new email verification if changed), password
- 2FA enrollment section: show QR code + manual entry key + verification input

---

## SECTION 5: ONBOARDING & ROUTE GUARD

### Middleware Logic (`middleware.ts`)
On every authenticated + verified request to `/dashboard/*` and `/settings/*`:
- Query `BrokerAccount` count for session user
- If count === 0: redirect to `/onboarding`
- If count > 0 and status === PENDING: allow access but show persistent amber banner

### One-Pager (`/onboarding`) — Three sections on a single scroll

**Section 1 — Country of Residence**:
- Dropdown of countries
- Selection maps to IB URL via config object in `/config/ib-mapping.ts`
- Structure: `{ countryCode: string, ibUrl: string, ibName: string }[]`
- Show mapped broker name as confirmation text below dropdown

**Section 2 — MT5 Account Number**:
- Text input, numeric only, min 5 digits
- Inline validation, clear error states

**Section 3 — Submit**:
- Button: "Link My Account & Start Earning"
- On submit:
  1. Create `BrokerAccount` record (status: PENDING, isActive: true)
  2. Create `Ticket` (type: VERIFICATION, metadata: `{ mt5AccountNo, countryCode, ibUrl }`)
  3. Redirect to `/dashboard` with success toast

---

## SECTION 6: DASHBOARD & LEDGER UI

> This is an authenticated page. All data is fetched server-side with session validation. Unauthenticated requests are intercepted by middleware before reaching this page.

### Stats Cards (top row)
- Total Rebate Earned  (sum of CREDIT/REBATE entries)
- Total Withdrawn       (sum of DEBIT/WITHDRAWAL entries)
- Available Balance     (Total Rebate − Total Withdrawn)
- All values fetched server-side, displayed in USD with `Intl.NumberFormat`
- BigInt → display: divide by 100, format with 2 decimal places

### Chart
- Recharts `AreaChart` showing rebate accumulation over time (monthly grouping)
- Two lines: Rebate Earned vs Withdrawn
- Mobile: simplified sparkline; Desktop: full labelled chart

### Milestone Animations
- Define milestones in `/config/milestones.ts`: `[100, 500, 1000, 5000]` (USD values)
- On dashboard load, compare available balance against milestones
- If a new milestone crossed since last login: trigger Lottie confetti animation
- Store `lastMilestoneSeen` in User record to prevent repeat triggers

### Ledger Table
- Columns: Date | Type | Category | Amount | Reference ID | Running Balance
- CREDIT rows: green amount; DEBIT rows: red amount
- Pagination: 20 rows per page
- Mobile: horizontally scrollable, sticky Date column

### Withdrawal Button
- Disabled if `totpEnabled === false` (prompt to enable 2FA first)
- Disabled if `availableBalance < minimumThreshold` (tooltip with reason)
- On click: open `WithdrawalModal`

### WithdrawalModal Flow
1. Input: amount + destination account details
2. Validate amount server-side against available balance
3. Trigger 2FA verification step (TOTP input)
4. On success: create Withdrawal Ticket, insert DEBIT Ledger entry, show success state
5. Mobile: renders as full-screen bottom sheet

### Ticket History Table
- Columns: Date | Type | Status | Details
- Status pills: PENDING (amber) / DONE (green)

### Floating Elements
- WhatsApp icon (bottom-right, fixed): links to `WHATSAPP_BUSINESS_LINK` env var
- Share button: uses `html-to-image` to capture stats card section → download as JPG

---

## SECTION 7: AUTOMATED REBATE CRON JOB

**Endpoint**: `POST /api/cron/process-rebates`
**Security**: Validate `Authorization: Bearer {CRON_SECRET}` header — reject all other callers
**Schedule**: Daily at 02:00 UTC

### Pipeline
1. Accept Excel/CSV file upload OR read from `/data/pending-trades/` directory
2. Parse using `xlsx` library → normalize to:
   `{ tradeId: string, mt5AccountNo: string, volume: number, rebatePerLot: number }`
3. For each trade:
   - a. Check Ledger for existing `referenceId === tradeId` → **SKIP** if found (deduplication)
   - b. Find `BrokerAccount` by `mt5AccountNo` where `status === VERIFIED` AND `isActive === true` → **SKIP** if not found
   - c. Calculate rebate: `volume × rebatePerLot × 0.80`
   - d. Convert to cents: `Math.round(rebate × 100)`
4. Group by `userId`, sum cent amounts
5. Insert one Ledger CREDIT per user per run:
   `{ userId, amount, type: CREDIT, category: REBATE, referenceId: "BATCH-{date}-{userId}" }`
6. Return JSON summary: `{ processed: N, skipped: N, errors: [] }`

### Error Handling
- Wrap entire pipeline in try/catch; on failure log and return 500 with details
- Individual trade errors must not abort the whole batch — collect and report at end

---

## SECTION 8: ADMIN PORTAL (`/admin`)

**Access Control**: Middleware checks `session.user.role === ADMIN`; redirect to `/dashboard` if not

### Ticket Command Center
- Two tabs: **Verifications** | **Withdrawals**
- Each ticket shows: User name/email, MT5 account, amount (withdrawals), assignee, created date
- **Claim** button: sets `Ticket.assigneeUserId = currentAdminId`
- **Complete** button → confirmation modal:
  - VERIFICATION: set `BrokerAccount.status = VERIFIED`, `Ticket.status = DONE`, `Ticket.closedAt = now()`, trigger in-app notification
  - WITHDRAWAL: set `Ticket.status = DONE`, `Ticket.closedAt = now()`, confirm DEBIT Ledger entry, trigger in-app notification

### Bulk MT5 Verification API
```
POST /api/admin/verify-accounts
Body: CSV file stream of verified MT5 numbers from IB portal
Auth: Admin session OR Bearer token for agent (OpenClaw/Hermes) integration
```
Logic:
- Parse CSV → extract `mt5AccountNo` values
- For each: find matching PENDING `BrokerAccount` → flip to VERIFIED
- Close associated VERIFICATION Ticket
- Queue in-app notifications for affected users

Response: `{ verified: N, notFound: N, alreadyVerified: N }`

### User Management
- Table of all users with role, account status, email verified status, disabled status, balance
- **Disable/Enable User** toggle: sets `User.isDisabled`
- **Manually Resend Email Verification**: admin can trigger `POST /api/admin/resend-verification/{userId}` to send a fresh verification email for any unverified user. Creates new `ActionToken` (invalidates prior ones) and sends via SMTP.
- Ability to manually trigger MT5 verification for a specific account number

---

## SECTION 9: SECONDARY FEATURES

### Share Feature
- "Share My Results" button on dashboard
- Captures stats card div using `html-to-image` → JPG download
- Filename: `rebate-results-{date}.jpg`

### Referral Stub (MVP2 placeholder)
- Nav item: "Refer a Friend"
- Opens modal: "Coming Soon" with email capture input
- Store in `ReferralInterest` table: `{ id, email, userId, createdAt }`

### In-App Notifications
- Bell icon in navbar with unread count badge
- Triggers: account verified, withdrawal completed, new rebate credited
- Mark-as-read on click; mark-all-read option

---

## SECTION 10: ERROR STATES & EDGE CASES

Every user-facing form must handle and display:
- Network/server errors (500): "Something went wrong. Please try again."
- Validation errors (400): field-level inline messages
- Auth errors (401/403): redirect to login with `?error=` param
- Empty states: all tables must have a designed empty state

### Loading States
- All async operations show skeleton loaders or spinners
- Disable submit buttons during in-flight requests to prevent double-submission

---

## SECTION 11: TESTING & SEED DATA

### Unit Tests — Services (`__tests__/services/`)

Create a unit test file for every service. Mock Prisma using `jest-mock-extended` or `@prisma/client` manual mocks — tests must not touch a real database.

**`auth.service.test.ts`**
- Password is hashed with bcrypt before storage (never stored plain)
- `bcrypt.compare()` used on login — not decryption
- Invalid credentials return generic error (no user enumeration)
- Reset token is stored as hash, not raw value
- Reset token expiry check rejects expired tokens
- TOTP code validation accepts valid code, rejects invalid
- Duplicate email registration throws conflict error
- Social login upsert is idempotent (same email = update, not duplicate)

**`broker.service.test.ts`**
- MT5 linkage creates BrokerAccount + VERIFICATION Ticket correctly
- Duplicate MT5 number throws unique constraint error
- IB URL lookup returns correct URL for given country code
- `hasLinkedAccount()` returns false for new user, true after linking
- Inactive broker account (`isActive: false`) is excluded from rebate processing

**`ledger.service.test.ts`**
- Available balance = sum(CREDIT) − sum(DEBIT) in cents
- Balance correctly returns 0 for user with no entries
- Minimum withdrawal threshold rejects amounts below limit
- Cent conversion: `Math.round(value * 100)` applied correctly
- Paginated history returns correct page size and offset

**`rebate.service.test.ts`**
- `volume × rebatePerLot × 0.80` formula produces correct cent value
- Trade with existing `referenceId` in Ledger is skipped (dedup)
- Trade for unverified MT5 account is skipped
- Trade for inactive MT5 account is skipped
- Multiple trades for same user are aggregated into single CREDIT
- Batch summary counts `processed`, `skipped`, `errors` correctly

**`withdrawal.service.test.ts`**
- Amount below minimum threshold returns validation error
- Amount exceeding available balance returns validation error
- Invalid TOTP code blocks withdrawal
- Successful path creates WITHDRAWAL Ticket with correct metadata
- Successful path inserts DEBIT Ledger entry in cents
- 2FA not enrolled blocks withdrawal entirely

**`ticket.service.test.ts`**
- Ticket created with correct `type`, `status: PENDING`, null `closedAt`
- Closing ticket sets `closedAt` to current timestamp and `status: DONE`
- Assigning ticket sets `assigneeUserId` correctly
- Filter by status returns correct subset
- Admin list query includes joined user details (name, email)

**`verification.service.test.ts`**
- Matched MT5 numbers flip `BrokerAccount.status` to VERIFIED
- Unmatched numbers are counted as `notFound`
- Already-VERIFIED accounts counted as `alreadyVerified` (no duplicate update)
- Associated VERIFICATION Ticket is closed on successful match
- In-app notification is queued for each verified user

**`notification.service.test.ts`**
- Created notification has `read: false` by default
- `getUnreadCount()` returns correct count
- `markAsRead(id)` updates only the target record
- `markAllRead(userId)` clears all unread for the user only

**`actionToken.service.test.ts`**
- Token is stored as bcrypt hash (not raw string)
- Expired token (`expiresAt < now`) is rejected
- Consumed token (`consumedAt != null`) is rejected
- Valid token sets `consumedAt` on first use (prevents reuse)
- `EMAIL_VERIFICATION` token: expiry is 24h from creation
- `PASSWORD_RESET` token: expiry is 1h from creation
- Resend flow: prior tokens for same user + type are invalidated before new one is created

### Seed Data (`/prisma/seed.ts`)

Generate the following:

```
1 ADMIN user
   email: admin@portal.dev | password: Admin1234 (hashed)
   isEmailVerified: true | isDisabled: false

3 USER accounts:

  User A — "Full Experience"
    isEmailVerified: true | VERIFIED broker account | isActive: true
    Ledger entries spanning 6 months (for chart testing)
    Balance crosses at least one milestone (for animation testing)
    2 closed tickets (one VERIFICATION, one WITHDRAWAL)

  User B — "Pending Onboarding"
    isEmailVerified: true | PENDING broker account
    Tests onboarding redirect flow
    No ledger entries (tests empty state)

  User C — "Unverified Email"
    isEmailVerified: false
    Tests email verification wall in middleware

  User D — "Disabled Account"
    isEmailVerified: true | isDisabled: true
    Tests disabled account block in middleware

Sample ActionTokens:
  - One unconsumed EMAIL_VERIFICATION token for User C
  - One expired PASSWORD_RESET token for User A (for expiry test)
```
SECTION 12: SYSTEM UTILITIES
A. Global Maintenance Kill Switch
Implement a global "Kill Switch" that can take the entire portal offline for emergency updates:

	Trigger: Controlled by MAINTENANCE_MODE_ENABLED env variable.

	Behavior: When true, any request to a non-public route (except /api/auth) redirects to a /maintenance page.

	Emergency Bypass: If the flag is on, developers can still access the site by providing the MAINTENANCE_BYPASS_USER and MAINTENANCE_BYPASS_PASS via a basic auth popup or a hidden /login/admin-bypass route.

	UI: The /maintenance page should display: "The portal is currently undergoing scheduled maintenance. We will be back shortly." with a link to the WhatsApp support.

B. Nodemailer Implementation
Use Nodemailer for all system emails (Verification, Password Reset, Withdrawal Alerts).

	Transporter: Configure using SMTP_* environment variables.

	Security: Must use pool: true for bulk rebate notifications and secure: true for port 465 or starttls for 587.

	Templates:

		Use React-Email or MJML to generate responsive HTML templates.

		All emails must include the Monolith Brokerage branding and a footer with the physical address/disclaimer.

	Error Handling: Log SMTP failures to a dedicated EmailLog table (optional) or console to prevent silent failures in the verification flow.
