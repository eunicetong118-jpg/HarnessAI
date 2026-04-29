# Codebase Concerns

**Analysis Date:** 2026-04-29

## Tech Debt

**Incomplete Implementation:**
- Issue: The project appears to be a skeleton or "bootstrap" state. While `package.json` and `prisma/schema.prisma` define a robust architecture (NextAuth, Services layer, BigInt ledger), the actual implementation files in `src/app` and `src/services` are missing or contain only boilerplate code.
- Files: `src/app/`, `src/services/`, `src/app/api/`
- Impact: The application is currently non-functional despite having a complex schema and dependency list.
- Fix approach: Implement the services and API routes defined in the project requirement documents (`raw/Cashback website requirement/folder-structure-v4.md`).

**Service Layer Abstraction:**
- Issue: The architecture specifies that "API routes call services. Services call Prisma. Nothing else calls Prisma directly," but the `src/services` directory is currently empty.
- Files: `src/services/`
- Impact: Risk of business logic leaking into API routes or UI components if not strictly enforced during implementation.
- Fix approach: Create the service classes as defined in the architectural plan.

## Known Bugs

**Empty API Routes:**
- Symptoms: API directories like `src/app/api/auth/signup` exist but contain no `route.ts` files.
- Files: `src/app/api/auth/signup/`, `src/app/api/auth/[...nextauth]/`
- Trigger: Any attempt to call these endpoints will result in a 404.
- Workaround: None; requires implementation.

## Security Considerations

**ActionToken Hashing:**
- Risk: The schema mentions storing tokens as bcrypt hashes. If implemented incorrectly (e.g., storing raw tokens), it poses a significant security risk for password resets and email verification.
- Files: `prisma/schema.prisma` (ActionToken model)
- Current mitigation: Model documentation specifies bcrypt hashing.
- Recommendations: Ensure `actionToken.service.ts` (when implemented) strictly follows the hashing requirement.

**Social Login Passwords:**
- Risk: `User.password` is nullable to accommodate social logins. Improper handling could allow account takeover if a user attempts to set a password on a social-only account without verification.
- Files: `prisma/schema.prisma`
- Current mitigation: Field is nullable.
- Recommendations: Implement strict checks in `auth.service.ts` to prevent password setting/guessing on social-linked accounts.

## Performance Bottlenecks

**Prisma Client Singleton:**
- Problem: Risk of connection pool exhaustion in Next.js dev mode/serverless environments if the Prisma client is not handled as a singleton.
- Files: `lib/prisma.ts` (currently missing)
- Cause: Multiple instances of PrismaClient being created on hot reloads.
- Improvement path: Implement the standard Prisma singleton pattern for Next.js.

## Fragile Areas

**Ledger Calculations:**
- Files: `prisma/schema.prisma` (Ledger model)
- Why fragile: Financial calculations using `BigInt` (cents) require careful handling to avoid precision issues during display or API conversion.
- Safe modification: Use a dedicated `ledger.service.ts` for all balance calculations.
- Test coverage: Zero (tests are missing).

## Missing Critical Features

**Middleware Guards:**
- Problem: The requirement for sequential guards (session → isDisabled → isEmailVerified) is documented but `middleware.ts` is missing from the root of `rebatengine`.
- Blocks: Security enforcement across protected routes.

## Test Coverage Gaps

**Missing Test Suite:**
- What's not tested: The entire business logic (Services, API, Auth).
- Files: `__tests__/` (directory missing)
- Risk: Regression in financial logic (rebate calculations) or security bypasses.
- Priority: High

---

*Concerns audit: 2026-04-29*
