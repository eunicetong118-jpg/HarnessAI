# Project: Rebate Portal V4

## Context
High-performance brokerage rebate portal. Next.js 14, Prisma v7, NextAuth v5. Layered service pattern.

## Goal
Automated rebate processing with MT5 linkage, 2FA-secured withdrawals, and admin command center.

## Core Tech
- Next.js 14 (App Router)
- PostgreSQL + Prisma v7
- NextAuth v5
- Tailwind CSS + shadcn/ui
- Nodemailer

## Conventions
- Services isolated from API routes.
- Units in cents (BigInt).
- ActionTokens for secure flows.
- Sequential middleware guards.
