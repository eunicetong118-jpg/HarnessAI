# Codebase Concerns

**Analysis Date:** 2026-04-30

## Tech Debt

**Prisma Transaction Handling:**
- Issue: `withdrawal.service.ts` uses `getBalance` inside a transaction, but `getBalance` uses the global `prisma` client instead of the transaction client (`tx`). This can lead to race conditions or reading stale data during high-concurrency withdrawal requests.
- Files: `services/withdrawal.service.ts`, `services/ledger.service.ts`
- Impact: Potential for double-spending or withdrawing more than the available balance if multiple requests are processed simultaneously.
- Fix approach: Refactor `getBalance` to optionally accept a Prisma transaction client or implement a separate version for use within transactions.

**Rebate Ingestion Performance:**
- Issue: `RebateService.ingestTrades` performs a database query for EVERY row in the uploaded file to validate the broker account.
- Files: `services/rebate.service.ts`
- Impact: Performance will degrade linearly with the number of rows (N queries for N rows). For large files, this will be extremely slow and could time out the request.
- Fix approach: Fetch all relevant broker accounts in a single query before processing the rows, or use a cached map of verified accounts.

**File-Based Cron Job:**
- Issue: The rebate processing cron job relies on local filesystem access (`data/pending-trades`) to find and archive files.
- Files: `app/api/cron/process-rebates/route.ts`
- Impact: This approach is not scalable in serverless environments (like Vercel) where the filesystem is ephemeral and not shared across instances.
- Fix approach: Move trade logs to an object storage service (e.g., AWS S3, Vercel Blob) and process them from there.

## Security Considerations

**Cron Endpoint Protection:**
- Risk: The cron endpoint is protected by a single `CRON_SECRET` in the header. If this secret is leaked, anyone can trigger rebate processing.
- Files: `app/api/cron/process-rebates/route.ts`
- Current mitigation: Basic Bearer token check.
- Recommendations: Implement IP whitelisting for cron providers (like Vercel Cron) and add rate limiting.

**Lack of Input Sanitization on File Upload:**
- Risk: `XLSX.read(buffer)` is used on user-provided buffers without explicit size limits or deep sanitization beyond Zod row validation.
- Files: `services/rebate.service.ts`, `app/api/admin/trades/upload/route.ts`
- Current mitigation: Zod validation for row contents.
- Recommendations: Implement file size limits at the route level and consider scanning for malicious spreadsheet formulas (CSV injection).

**Plaintext Comparison for Backup Codes:**
- Risk: While backup codes are hashed with bcrypt, `SecurityService.verifySecurityCode` iterates through all codes and performs `bcrypt.compare` in a loop.
- Files: `services/security.service.ts`
- Current mitigation: Codes are hashed.
- Recommendations: Ensure the number of backup codes is small to avoid timing attacks or high CPU usage during login.

## Performance Bottlenecks

**Batch Ledger Insertion:**
- Problem: `RebateService.processBatch` iterates through aggregated user amounts and performs a separate `tx.ledger.create` for each user.
- Files: `services/rebate.service.ts`
- Cause: Prisma's `createMany` does not return created records and has limitations with some adapters, leading to individual inserts.
- Improvement path: Use `createMany` if specific IDs are not needed for subsequent logic in the same transaction, or batch the inserts.

## Fragile Areas

**NextAuth Session Extensions:**
- Files: `lib/auth.config.ts`, `middleware.ts`, `app/api/admin/trades/upload/route.ts`
- Why fragile: Heavy reliance on casting to `any` for session/token properties (`(user as any).role`, `(req as any).auth`).
- Safe modification: Define proper TypeScript interfaces/module augmentations for `next-auth` to ensure type safety.
- Test coverage: Existing tests check some auth logic, but type-level errors are currently suppressed.

## Test Coverage Gaps

**Concurrency Testing:**
- What's not tested: Race conditions in withdrawal and ledger logic.
- Files: `services/withdrawal.service.ts`, `services/ledger.service.ts`
- Risk: Balance integrity issues under load.
- Priority: High

---

*Concerns audit: 2026-04-30*
