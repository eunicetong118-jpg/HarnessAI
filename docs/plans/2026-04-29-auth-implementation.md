# Auth & Verification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal**: Build Credentials authentication with sequential middleware guards and secure email verification.

**Architecture**: Layered service pattern (Auth -> Email -> Token) to isolate business logic.

**Tech Stack**: Next.js 14, NextAuth v5, Prisma v7, Nodemailer, bcrypt.

---

### Task 1: ActionToken Service

**Files**:
- Create: `services/actionToken.service.ts`
- Test: `__tests__/services/actionToken.service.test.ts`

**Step 1: Write failing test for token creation**

```typescript
// __tests__/services/actionToken.service.test.ts
import { createToken } from '@/services/actionToken.service';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

jest.mock('@/lib/prisma', () => ({
  actionToken: { create: jest.fn() }
}));

describe('ActionToken Service', () => {
  it('hashes token and stores with TTL', async () => {
    const userId = 'user-1';
    await createToken(userId, 'EMAIL_VERIFICATION');
    expect(prisma.actionToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId,
          token: expect.any(String),
          expiresAt: expect.any(Date)
        })
      })
    );
  });
});
```

**Step 2: Run test to verify failure**

Run: `npm test __tests__/services/actionToken.service.test.ts`
Expected: FAIL (Cannot find module)

**Step 3: Write minimal implementation**

```typescript
// services/actionToken.service.ts
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export async function createToken(userId: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET') {
  const rawToken = randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(rawToken, 12);
  const ttl = type === 'EMAIL_VERIFICATION' ? 24 : 1;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + ttl);

  await prisma.actionToken.create({
    data: {
        userId,
        tokenType: type,
        token: hash,
        expiresAt
    }
  });
  return rawToken;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test __tests__/services/actionToken.service.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add services/actionToken.service.ts __tests__/services/actionToken.service.test.ts
git commit -m "feat: add actionToken service"
```

---

### Task 2: Email Verification Service

**Files**:
- Create: `services/emailVerification.service.ts`
- Test: `__tests__/services/emailVerification.service.test.ts`

**Step 1: Write failing test for sending email**

```typescript
// __tests__/services/emailVerification.service.test.ts
import { sendVerificationEmail } from '@/services/emailVerification.service';
import { sendMail } from '@/lib/email';

jest.mock('@/lib/email', () => ({ sendMail: jest.fn() }));

describe('EmailVerification Service', () => {
  it('calls sendMail with correct link', async () => {
    await sendVerificationEmail('user-1', 'test@example.com');
    expect(sendMail).toHaveBeenCalledWith(
      'test@example.com',
      'Verify your email',
      expect.stringContaining('/auth/verify/email?token=')
    );
  });
});
```

**Step 2: Write minimal implementation**

```typescript
// services/emailVerification.service.ts
import { createToken } from './actionToken.service';
import { sendMail } from '@/lib/email';

export async function sendVerificationEmail(userId: string, email: string) {
  const token = await createToken(userId, 'EMAIL_VERIFICATION');
  const url = `${process.env.NEXTAUTH_URL}/auth/verify/email?token=${token}&uid=${userId}`;
  await sendMail(email, 'Verify your email', `Click here: ${url}`);
}
```

**Step 3: Commit**

```bash
git add services/emailVerification.service.ts __tests__/services/emailVerification.service.test.ts
git commit -m "feat: add emailVerification service"
```

---

### Task 3: Sequential Middleware

**Files**:
- Create: `middleware.ts`

**Step 1: Write minimal implementation**

```typescript
// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isProtected = nextUrl.pathname.startsWith("/dashboard");

  if (isProtected) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (session.user.isDisabled) return NextResponse.redirect(new URL("/login?error=account_disabled", nextUrl));
    if (!session.user.isEmailVerified) return NextResponse.redirect(new URL("/login?error=email_not_verified", nextUrl));
  }
  return NextResponse.next();
});
```

**Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: implement sequential middleware guards"
```
