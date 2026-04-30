# Roadmap

## Phases
- [x] **Phase 1: Auth & Verification** - End-to-end secure registration and login
- [x] **Phase 2: Dashboard & Onboarding** - MT5 linkage and user dashboard visualization
- [x] **Phase 3: Rebate Engine** - Automated trade processing and calculation
- [x] **Phase 4: Admin & Financials** - Withdrawal tickets and admin command center
- [x] **Phase 5: Advanced Security** - TOTP 2FA and security audits
- [ ] **Phase 6: Auth UI** - Login and Signup pages implementation

## Phase Details

### Phase 1: Auth & Verification
**Goal**: End-to-end secure registration and login.
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**Success Criteria** (what must be TRUE):
  1. User can register and receive a verification email
  2. User can login only after email verification (enforced by middleware)
  3. Session is managed securely via NextAuth v5
**Plans**: Completed

### Phase 2: Dashboard & Onboarding
**Goal**: MT5 account linkage (onboarding) and user dashboard visualization using mock data.
**Depends on**: Phase 1
**Requirements**: DASH-01, DASH-02, DASH-03, BROK-01, BROK-02
**Success Criteria** (what must be TRUE):
  1. User can view a dashboard with Recharts visualizations using mock data
  2. User can see Ledger summary cards (Total Earned, Available, Pending)
  3. User sees an amber pending banner if their account is unverified
  4. User can submit an MT5 account linkage request with IB mapping
**Plans**: Completed
**UI hint**: yes

### Phase 3: Rebate Engine
**Goal**: Automated trade processing.
**Depends on**: Phase 2
**Requirements**: REB-01, REB-02, REB-03, REB-04, REB-05
**Success Criteria** (what must be TRUE):
  1. System can ingest CSV/Excel trade logs
  2. System correctly calculates rebates using the 80% formula
  3. Ledger credits are aggregated without duplication
**Plans**: Completed

### Phase 4: Admin & Financials
**Goal**: Secure fund payouts and admin management.
**Depends on**: Phase 3
**Requirements**: FIN-01, FIN-02, ADMIN-01, ADMIN-02
**Success Criteria** (what must be TRUE):
  1. User can request a withdrawal via a ticket system
  2. Admin can process verification and withdrawal tickets
  3. Ledger reflects debits for approved withdrawals
**Plans**: Completed
**UI hint**: yes

### Phase 5: Advanced Security
**Goal**: Multi-factor authentication and infrastructure hardening.
**Depends on**: Phase 4
**Requirements**: AUTH-06, SEC-01
**Success Criteria** (what must be TRUE):
  1. User can enroll and verify TOTP (2FA) with encrypted storage.
  2. 2FA (TOTP or Backup Codes) is required for logins and high-risk actions (withdrawals).
  3. Users can recover account access via secure backup codes.
  4. Application is hardened with security headers and CSP.
**Plans**: Completed
**UI hint**: yes

### Phase 6: Auth UI
**Goal**: Implement secure and aesthetically consistent Login and Signup pages, including email verification.
**Depends on**: Phase 1
**Requirements**: AUTH-07, AUTH-08, AUTH-01
**Success Criteria** (what must be TRUE):
  1. User can register via the Signup page with validation errors displayed
  2. User can login via the Login page and be redirected to the dashboard
  3. User can verify their email via a dedicated verification page
  4. UI follows the dark theme aesthetic (#0A0A0F background, #12121A cards)
**Plans**:
- [x] 06-01-PLAN.md — Login and Signup pages
- [ ] 06-02-PLAN.md — Email verification page

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Auth & Verification | 3/3 | Completed | 2026-04-30 |
| 2. Dashboard & Onboarding | 4/4 | Completed | 2026-04-30 |
| 3. Rebate Engine | 3/3 | Completed | 2026-04-30 |
| 4. Admin & Financials | 4/4 | Completed | 2026-04-30 |
| 5. Advanced Security | 4/4 | Completed | 2026-04-30 |
| 6. Auth UI | 1/2 | In Progress | - |
