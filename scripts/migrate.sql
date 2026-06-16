-- Family Hub — Initial Migration
-- Run this in Supabase Dashboard → SQL Editor

-- Enums
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');
CREATE TYPE "FinanceType" AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE');
CREATE TYPE "RepeatType" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- User
CREATE TABLE "User" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL UNIQUE,
  "role"      "Role" NOT NULL DEFAULT 'MEMBER',
  "avatar"    TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- NextAuth: Account
CREATE TABLE "Account" (
  "id"                TEXT NOT NULL PRIMARY KEY,
  "userId"            TEXT NOT NULL,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  UNIQUE ("provider", "providerAccountId"),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- NextAuth: Session
CREATE TABLE "Session" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId"       TEXT NOT NULL,
  "expires"      TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- NextAuth: VerificationToken
CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token"      TEXT NOT NULL UNIQUE,
  "expires"    TIMESTAMP(3) NOT NULL,
  UNIQUE ("identifier", "token")
);

-- Moment
CREATE TABLE "Moment" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "mediaUrls"   JSONB NOT NULL,
  "takenAt"     TIMESTAMP(3) NOT NULL,
  "isPublic"    BOOLEAN NOT NULL DEFAULT true,
  "tags"        TEXT[],
  "userId"      TEXT NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
);

-- Finance
CREATE TABLE "Finance" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "type"        "FinanceType" NOT NULL,
  "amount"      DECIMAL(65,30) NOT NULL,
  "category"    TEXT NOT NULL,
  "description" TEXT,
  "date"        TIMESTAMP(3) NOT NULL,
  "userId"      TEXT NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
);

-- House
CREATE TABLE "House" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "name"      TEXT NOT NULL,
  "documents" JSONB
);

-- HouseTask
CREATE TABLE "HouseTask" (
  "id"      TEXT NOT NULL PRIMARY KEY,
  "title"   TEXT NOT NULL,
  "status"  "TaskStatus" NOT NULL DEFAULT 'PENDING',
  "dueDate" TIMESTAMP(3),
  "houseId" TEXT NOT NULL,
  FOREIGN KEY ("houseId") REFERENCES "House"("id")
);

-- Reminder
CREATE TABLE "Reminder" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "remindAt"    TIMESTAMP(3) NOT NULL,
  "repeat"      "RepeatType" NOT NULL DEFAULT 'NONE',
  "userId"      TEXT NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
);

-- Prisma migrations tracking table
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id"                    VARCHAR(36) NOT NULL PRIMARY KEY,
  "checksum"              VARCHAR(64) NOT NULL,
  "finished_at"           TIMESTAMPTZ,
  "migration_name"        VARCHAR(255) NOT NULL,
  "logs"                  TEXT,
  "rolled_back_at"        TIMESTAMPTZ,
  "started_at"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "applied_steps_count"   INTEGER NOT NULL DEFAULT 0
);
