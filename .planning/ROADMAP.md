# Roadmap

## Phases
- [x] **Phase 1: Auth & Verification** - End-to-end secure registration and login
- [ ] **Phase 2: Dashboard & Onboarding** - MT5 linkage and user dashboard visualization
- [ ] **Phase 3: Rebate Engine** - Automated trade processing and calculation
- [ ] **Phase 4: Admin & Financials** - Withdrawal tickets and admin command center
- [ ] **Phase 5: Advanced Security** - TOTP 2FA and security audits

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
**Plans**: 4 plans
Plans:
- [ ] 02-01-PLAN.md — Config & Mocking
- [ ] 02-02-PLAN.md — Onboarding workflow
- [ ] 02-03-PLAN.md — Dashboard UI & Charts
- [ ] 02-04-PLAN.md — Guards & Polish
**UI hint**: yes

### Phase 3: Rebate Engine
**Goal**: Automated trade processing.
**Depends on**: Phase 2
**Requirements**: REB-01, REB-02, REB-03
**Success Criteria** (what must be TRUE):
  1. System can ingest CSV/Excel trade logs
  2. System correctly calculates rebates using the 80% formula
  3. Ledger credits are aggregated without duplication
**Plans**: TBD

### Phase 4: Admin & Financials
**Goal**: Secure fund payouts and admin management.
**Depends on**: Phase 3
**Requirements**: FIN-01, FIN-02, ADMIN-01, ADMIN-02
**Success Criteria** (what must be TRUE):
  1. User can request a withdrawal via a ticket system
  2. Admin can process verification and withdrawal tickets
  3. Ledger reflects debits for approved withdrawals
**Plans**: TBD
**UI hint**: yes

### Phase 5: Advanced Security
**Goal**: Secure fund payouts and infrastructure hardening.
**Depends on**: Phase 4
**Requirements**: AUTH-06, SEC-01
**Success Criteria** (what must be TRUE):
  1. User can enroll and verify TOTP (2FA)
  2. 2FA is required for high-risk actions (withdrawals)
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Auth & Verification | 3/3 | Completed | 2026-04-30 |
| 2. Dashboard & Onboarding | 0/4 | In Progress | - |
| 3. Rebate Engine | 0/0 | Not started | - |
| 4. Admin & Financials | 0/0 | Not started | - |
| 5. Advanced Security | 0/0 | Not started | - |
