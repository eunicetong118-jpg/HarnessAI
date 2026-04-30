# Technology Stack

**Project:** Rebate Portal (V4)
**Researched:** 2026-04-29

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 14.2.0 | Full-stack Framework | App Router support, Server Components, and seamless NextAuth integration. |

### Database
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| PostgreSQL | - | Primary Database | Relational integrity for ledgers and users. |
| Prisma | 7.8.0+ | ORM | Type-safe database access and easy migrations. |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| NextAuth.js | 5.0.0-beta.15 | Authentication | Modern Auth with sequential middleware support. |
| Nodemailer | 6.9.13 | Email Delivery | Reliable SMTP transport for verification and resets. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| bcrypt | 5.1.1 | Password Hashing | Storing user passwords and ActionTokens securely. |
| otplib | 12.0.1 | 2FA (TOTP) | Generating and verifying 2FA codes for withdrawals. |
| xlsx | 0.18.5 | Data Parsing | Processing trade reports from brokers. |
| framer-motion | 11.0.28 | UI Animation | Smooth transitions and feedback in the dashboard. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Auth | NextAuth v5 | Clerk/Auth0 | NextAuth allows self-hosting and full control over user data/DB. |
| ORM | Prisma | Drizzle | Prisma is already established in the current scaffold. |
| Email | SMTP | SendGrid/Resend | SMTP is more generic; specific provider can be swapped via env vars. |

## Installation

```bash
# Core
npm install next@14.2.0 next-auth@5.0.0-beta.15 @prisma/client

# Dev dependencies
npm install -D prisma typescript @types/node
```

## Sources

- `package.json`
- `wiki/rebate-portal-v4.md`
- `prisma/schema.prisma`
