# Rebate Portal (V4)

## Overview
A high-performance brokerage rebate portal built with Next.js 14 (App Router), Prisma, and PostgreSQL. It features automated rebate processing, 2FA-secured withdrawals, and a comprehensive admin command center.

## Core Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (Google, Apple, Facebook, Credentials)
- **Email**: Nodemailer (SMTP)
- **Security**: 2FA (TOTP via otplib), bcrypt hashing (cost 12), Sequential Middleware guards
- **UI**: Tailwind CSS, shadcn/ui, Recharts, Lottie React, Framer Motion

## Key Domain Entities
- **User**: Authentication, roles, security status (isDisabled, isEmailVerified), 2FA.
- **BrokerAccount**: MT5 account linkage, verification status, active/inactive state.
- **Ledger**: Financial transactions in cents (BigInt). Credits for rebates, debits for withdrawals.
- **Ticket**: Workflow management for account verifications and withdrawal requests.
- **ActionToken**: Secure token management for email verification and password resets.
- **Notification**: In-app user alerts.

## Critical Workflows

### 1. Authentication & Security
- **Middleware Guard**: Session -> isDisabled -> isEmailVerified.
- **Email Verification**: User registration triggers an email with a bcrypt-hashed ActionToken. 24h TTL.
- **Password Reset**: Secure token flow with 1h TTL.
- **TOTP**: Mandatory for withdrawals.

### 2. Rebate Processing (Cron)
- **Schedule**: Daily at 02:00 UTC.
- **Process**: Parse CSV/Excel trades -> Deduplicate via `referenceId` -> Verify active MT5 account -> Calculate rebate (80% formula) -> Aggregate per user -> Insert Ledger Credit.

### 3. Onboarding
- Redirects new users to link their MT5 account before accessing the dashboard.
- Requires country selection (mapped to IB URL) and MT5 number validation.

### 4. Admin Management
- Ticket command center for manual verification of accounts and approval of withdrawals.
- Bulk MT5 verification via CSV upload.
- User management (disable/enable, resend verification).

## Design System
- **Theme**: High-contrast dark theme (#0A0A0F background).
- **Responsive**: Mobile-first with bottom tab bar for mobile, sidebar for desktop.
- **Feedback**: Skeleton loaders, toast notifications, Lottie confetti for milestones.

## File Structure Pattern
- **Services Layer**: Business logic isolated from API routes.
- **API Routes**: Thin wrappers calling services.
- **Unit Testing**: Services tested with mocked Prisma (`jest-mock-extended`).
