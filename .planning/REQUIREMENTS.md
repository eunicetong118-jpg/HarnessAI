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
- [ ] Dashboard layout with Recharts (mock data).
- [ ] Ledger summary cards (Total Earned, Available, Pending).
- [ ] Amber pending banner for unverified accounts.
- [ ] MT5 Account Linkage UI with IB mapping.
- [ ] MT5 Validation workflow (Admin Ticket).
- [ ] Broker Account status management.

## 3. Rebate Engine
- [ ] CSV/Excel Trade Ingest.
- [ ] ReferenceID Deduplication.
- [ ] 80% Formula Calculation.
- [ ] Ledger Credit aggregation.

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
| DASH-01 (Recharts Layout) | Phase 2 | Pending |
| DASH-02 (Ledger Cards) | Phase 2 | Pending |
| DASH-03 (Pending Banner) | Phase 2 | Pending |
| BROK-01 (MT5 Linkage UI) | Phase 2 | Pending |
| BROK-02 (MT5 Validation) | Phase 2 | Pending |
