# Requirements

## 1. Authentication & Security (In Progress)
- [x] ActionToken service (hashes, TTL).
- [x] EmailVerification service (link generation, mailing).
- [x] Middleware guards (isLoggedIn -> isDisabled -> isEmailVerified).
- [x] Connect services to Registration API.
- [x] NextAuth v5 Configuration.
- [ ] Verify Email API endpoint.
- [ ] Password Reset flow.
- [ ] 2FA (TOTP) enrollment and verification.

## 2. Dashboard & Onboarding
- [x] Dashboard layout with Recharts (mock data).
- [x] Ledger summary cards (Total Earned, Available, Pending).
- [x] Amber pending banner for unverified accounts.
- [x] MT5 Account Linkage UI with IB mapping.
- [x] MT5 Validation workflow (Admin Ticket).
- [x] Broker Account status management.

## 3. Rebate Engine (Phase 3)
- [x] REB-01: CSV/Excel Trade Ingest.
- [x] REB-02: ReferenceID Deduplication.
- [x] REB-03: 80% Formula Calculation.
- [x] REB-04: Ledger Credit aggregation.
- [x] REB-05: Cron & Admin API Integration.

## 4. Financials
- [ ] Ledger Debit for withdrawals.
- [ ] Withdrawal Ticket system.
- [ ] Balance calculation service.

## 5. Admin Command Center
- [ ] User/Account management.
- [ ] Ticket processing (Verification/Withdrawal).
- [ ] Bulk MT5 validation.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 (Token Service) | Phase 1 | Completed |
| AUTH-02 (Email Service) | Phase 1 | Completed |
| AUTH-03 (Middleware) | Phase 1 | Completed |
| AUTH-04 (NextAuth Config) | Phase 1 | Completed |
| AUTH-05 (Registration API) | Phase 1 | Completed |
| DASH-01 (Recharts Layout) | Phase 2 | Completed |
| DASH-02 (Ledger Cards) | Phase 2 | Completed |
| DASH-03 (Pending Banner) | Phase 2 | Completed |
| BROK-01 (MT5 Linkage UI) | Phase 2 | Completed |
| BROK-02 (MT5 Validation) | Phase 2 | Completed |
| REB-01 (Trade Ingest) | Phase 3 | Completed |
| REB-02 (Deduplication) | Phase 3 | Completed |
| REB-03 (80% Formula) | Phase 3 | Completed |
| REB-04 (Ledger Credit) | Phase 3 | Completed |
| REB-05 (API Integration) | Phase 3 | Completed |
