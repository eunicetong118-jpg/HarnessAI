# Testing Patterns

**Analysis Date:** 2026-04-30

## Test Framework

**Runner:**
- Vitest (`vitest`) - Primary unit/integration runner.
- Jest (`jest`) - Also configured in `package.json`, but `test` script uses `vitest`.
- Playwright (`@playwright/test`) - E2E testing.

**Assertion Library:**
- Vitest `expect` (compatible with Jest).
- Playwright `expect` for E2E.

**Run Commands:**
```bash
npm test                # Run unit/integration tests (Vitest)
npm run test:ui         # Vitest UI mode
npm run test:e2e        # Playwright E2E tests
```

## Test File Organization

**Location:**
- Co-located: `__tests__` directories inside source folders (e.g., `services/__tests__/`, `lib/__tests__/`).
- Separate: Root `__tests__/` for higher-level tests and `tests/e2e/` for Playwright.

**Naming:**
- Unit/Integration: `*.test.ts` or `*.spec.ts`.
- E2E: `*.spec.ts`.

**Structure:**
```
[root]/
├── __tests__/
├── services/__tests__/
├── lib/__tests__/
└── tests/e2e/
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ServiceName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    it('should behave as expected', async () => {
      // test logic
    });
  });
});
```

**Patterns:**
- `describe` for grouping by service and method.
- `it`/`test` for individual test cases.
- `beforeEach` to reset mocks.

## Mocking

**Framework:** Vitest `vi`.

**Patterns:**
```typescript
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));
```

**What to Mock:**
- Database (`prisma`).
- External APIs/SDKs (`nodemailer`, `qrcode`).
- Security/Crypto functions (`bcryptjs`, `totp`).

**What NOT to Mock:**
- Pure utility functions unless they have side effects or are extremely slow.

## Fixtures and Factories

**Test Data:**
- Manual object creation in `beforeEach` or within test cases.
- `mock-data.ts` in `lib/` for shared test data.

**Location:**
- `lib/mock-data.ts`

## Coverage

**Requirements:** None explicitly enforced in `package.json`.

**View Coverage:**
```bash
vitest run --coverage
```

## Test Types

**Unit Tests:**
- Focus on individual service methods and utility logic.
- heavy use of mocking for dependencies.
- Locations: `services/__tests__/*.test.ts`, `lib/__tests__/*.test.ts`.

**Integration Tests:**
- Tests interacting with multiple modules or slightly larger scopes (e.g., `__tests__/api/`).

**E2E Tests:**
- Framework: Playwright.
- Scope: Full user flows (e.g., `tests/e2e/withdrawal-2fa.spec.ts`).
- Current state: Some tests are marked `.skip` awaiting environment setup.

## Common Patterns

**Async Testing:**
- Extensive use of `async/await` with `expect(...).resolves` or awaiting result and checking properties.

**Error Testing:**
```typescript
await expect(Service.method()).rejects.toThrow('Error message');
// OR
const result = await Service.method();
expect(result.success).toBe(false);
```

---

*Testing analysis: 2026-04-30*
