# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Family Hub** — a family management app (Vietnamese: ứng dụng quản lý gia đình) built on Next.js + Ant Design, deployed on Vercel. Currently in pre-development (only `docs/plan.md` exists).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ App Router, Ant Design 5.x, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Vercel Postgres (Neon) via Prisma ORM |
| Auth | NextAuth.js v5 + PrismaAdapter |
| File Storage | Vercel Blob |
| Deploy | Vercel |

## Commands

```bash
# Install dependencies
npm install antd @ant-design/icons prisma @prisma/client next-auth @auth/prisma-adapter @vercel/blob

# Pull Vercel env vars (requires `vercel link` first)
vercel env pull .env.local

# Database migrations
npx prisma migrate dev --name <migration-name>   # local dev
npx prisma migrate deploy                         # production

# Build (runs prisma generate + migrate + next build)
npm run build
```

The `build` script must include: `prisma generate && prisma migrate deploy && next build`.

## Architecture: Clean Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (guest)/            # Public layout — unauthenticated visitors
│   ├── (admin)/            # Protected layout — ADMIN role only
│   └── api/                # API Route handlers
├── core/                   # Framework-independent business logic
│   ├── entities/           # Domain types (User, Moment, Finance, House, Reminder)
│   ├── interfaces/         # Repository contracts (IXxxRepository)
│   └── use-cases/          # One class per use case, depends only on interfaces
├── infrastructure/         # Concrete implementations
│   ├── repositories/       # PrismaXxxRepository implements IXxxRepository
│   ├── prisma/schema.prisma
│   └── services/           # VercelBlobService etc.
└── presentation/           # React UI layer
    ├── components/
    └── hooks/              # useMoments, useFinance, useReminders
```

**Key pattern:** Use cases receive repository interfaces via constructor injection, making them testable and DB-agnostic. Infrastructure layer implements those interfaces with Prisma.

## Authorization

Two roles: `GUEST` (public read) and `ADMIN` (full access). Role is injected into the NextAuth session via a callback and enforced in `src/middleware.ts` using `withAuth`. Protected routes/APIs: `/admin/*`, `/api/finance/*`, `/api/house/*`, `/api/reminders/*`.

## Design System

Ant Design theme is configured in `src/lib/antd-theme.ts`. Key brand colors:

| Token | Hex | Usage |
|---|---|---|
| `colorPrimary` / green-primary | `#4CAF82` | CTA buttons, active nav, INCOME |
| green-dark | `#2E7D5E` | Hover states |
| teal-primary | `#38B2AC` | Icons, links, DONE tasks |
| pink-primary | `#F9A8C9` | Accents, avatar borders, EXPENSE |
| text-primary | `#1A2E25` | Headings, body |
| text-secondary | `#6B8F7A` | Captions, placeholders |
| border | `#E2EDE8` | Dividers, input borders |

Tailwind extends these same colors under `green.primary`, `teal.primary`, `pink.primary`, `surface`, `border`.

## Database Models

`User` (GUEST/ADMIN role) → owns `Moment[]`, `Finance[]`, `Reminder[]`. `House` → has `HouseTask[]`. Key enums: `FinanceType` (INCOME/EXPENSE), `TaskStatus` (PENDING/IN_PROGRESS/DONE), `RepeatType` (NONE/DAILY/WEEKLY/MONTHLY/YEARLY).

Database connection uses two env vars: `POSTGRES_PRISMA_URL` (pooled) and `POSTGRES_URL_NON_POOLING` (direct, for migrations).

## File Upload

`POST /api/upload` — accepts `multipart/form-data` with a `file` field, stores to Vercel Blob under `moments/{timestamp}-{filename}` with `access: 'public'`, returns `{ url }`. Compress images client-side before upload (e.g. `browser-image-compression`) to stay within Vercel Blob free tier (1 GB).

## Vercel Free Tier Limits

Postgres: 256 MB storage / 60 compute-hours per month. Blob: 1 GB. Stay mindful of these when adding features that store media or run heavy queries.
