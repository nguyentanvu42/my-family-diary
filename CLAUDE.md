# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Family Hub** — a Vietnamese family management app (ứng dụng quản lý gia đình) built on Next.js App Router + Ant Design, deployed on Vercel.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js `^16.2.9` App Router, Ant Design 5.x, Tailwind CSS |
| Backend | Next.js API Routes (no server actions) |
| Database | Supabase PostgreSQL via Prisma ORM v5 |
| Auth | NextAuth.js v4 + PrismaAdapter |
| File Storage | Vercel Blob |
| Deploy | Vercel |

## Commands

```bash
npm run dev          # start dev server
npm run build        # prisma generate && prisma migrate deploy && next build
npm run db:migrate   # prisma migrate dev (local schema changes)
npm run db:push      # prisma db push (quick schema sync, no migration file)
npm run db:studio    # open Prisma Studio
```

No lint or test scripts are configured.

## Architecture: Clean Architecture

```
src/
├── app/
│   ├── (guest)/           # Route group: authenticated MEMBER users (AppHeader only)
│   ├── (admin)/           # Route group: ADMIN role only (AppHeader + AdminSidebar + BottomNav)
│   ├── login/
│   └── api/               # All mutations go through API routes, not server actions
├── core/
│   ├── entities/          # Domain TypeScript types
│   ├── interfaces/        # IXxxRepository contracts
│   └── use-cases/         # One class per use case; depends only on interfaces
├── infrastructure/
│   ├── repositories/      # PrismaXxxRepository implements IXxxRepository
│   └── services/          # VercelBlobService
├── lib/
│   ├── prisma.ts          # Singleton PrismaClient (globalThis pattern)
│   ├── auth.ts            # NextAuth authOptions
│   └── antd-theme.ts
├── presentation/
│   ├── components/        # admin/, guest/, shared/ subdirectories
│   └── hooks/             # useMoments, useFinance, useReminders
└── proxy.ts               # Middleware entry point (Next.js picks this up instead of middleware.ts)
```

**Key pattern:** API route handlers instantiate a use case with a Prisma repository and call `.execute()`. Use cases are injected with repository interfaces, not concrete Prisma classes.

**Schema location:** `prisma/schema.prisma` (not under `src/`).

## Authorization

Three roles: `MEMBER`, `CHU_HO` (Chủ hộ / Household Head), `ADMIN` (super-admin).

| Role | Access |
|---|---|
| `CHU_HO` | `/admin/*`, all family APIs (finance, house, reminders, moments, members) |
| `MEMBER` | `/moments/*`, can view/create public moments of their household |
| `ADMIN` | `/super-admin/*` only — manages all CHU_HO accounts, no family data access |

Role is stored in DB and injected into the JWT. Middleware lives in `src/middleware.ts` and guards routes via `withAuth`. Data is scoped by **householdId** (= CHU_HO's user id). Helper: `src/lib/household.ts` exports `getHouseholdId(session)` and `requireHousehold(session)`.

## Auth Details

- **CredentialsProvider**: `ADMIN` uses `ADMIN_PASSWORD` env var; `CHU_HO` and `MEMBER` use bcrypt-hashed passwords stored in `User.password`.
- **Registration** (`POST /api/auth/register`): public route, creates a `CHU_HO` account + default House. Login page has an "Đăng ký" tab.
- **EmailProvider**: magic-link login via nodemailer (`EMAIL_SERVER`, `EMAIL_FROM` env vars — not in `.env.local.example`).
- **Post-login redirect**: `CHU_HO` → `/admin/dashboard`, `ADMIN` → `/super-admin/dashboard`, `MEMBER` → `/moments`.
- Custom sign-in page: `/login`.

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```
POSTGRES_PRISMA_URL=        # Supabase pooled URL (pgbouncer, port 6543)
POSTGRES_URL_NON_POOLING=   # Supabase direct URL (port 5432, for migrations)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ADMIN_PASSWORD=             # Shared password used by CredentialsProvider
BLOB_READ_WRITE_TOKEN=      # Vercel Blob token
```

## Design System

Ant Design theme: `src/lib/antd-theme.ts`. Tailwind extends the same tokens.

| Token | Hex | Usage |
|---|---|---|
| green-primary | `#4CAF82` | CTA buttons, active nav, INCOME |
| green-dark | `#2E7D5E` | Hover states |
| teal-primary | `#38B2AC` | Icons, links, DONE tasks |
| pink-primary | `#F9A8C9` | Accents, avatar borders, EXPENSE |
| text-primary | `#1A2E25` | Headings, body |
| text-secondary | `#6B8F7A` | Captions, placeholders |
| border | `#E2EDE8` | Dividers, input borders |

Custom Tailwind utilities: `shadow-card`, `shadow-card-hover`, `rounded-card` (16px).

## Database Models

`User` (role: ADMIN/CHU_HO/MEMBER) — CHU_HO has `familyName`; MEMBER has `relationship` (vợ/chồng/...) and `householdId` → CHU_HO. `CHU_HO`/`MEMBER` have `password` (bcrypt). `User` → `Moment[]`, `Finance[]`, `Reminder[]`, `House[]`. `House` has `userId` (CHU_HO id). `House` → `HouseTask[]`. NextAuth tables: `Account`, `Session`, `VerificationToken`.

Key enums: `Role` (ADMIN/CHU_HO/MEMBER), `FinanceType` (INCOME/EXPENSE), `TaskStatus` (PENDING/IN_PROGRESS/DONE), `RepeatType` (NONE/DAILY/WEEKLY/MONTHLY/YEARLY).

Seed (`prisma/seed.ts`): `superadmin@family.local` (ADMIN, uses ADMIN_PASSWORD), `chuho@family.local` (CHU_HO, password: `password123`), `member@family.local` (MEMBER, password: `password123`).

## File Upload

`POST /api/upload` — multipart/form-data with a `file` field, stored to Vercel Blob at `moments/{timestamp}-{filename}`, returns `{ url }`. Vercel Blob also has a proxy endpoint at `GET /api/blob-image`.

`next.config.ts` allows remote images from `*.public.blob.vercel-storage.com`, `images.unsplash.com`, and `api.dicebear.com`. Server actions body size limit is set to `50mb`.
