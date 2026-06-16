# Family Hub — Development Plan
> Ứng dụng quản lý gia đình · Next.js + Ant Design + Vercel

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router) + Ant Design 5.x + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Vercel Postgres (Neon) |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| File Storage | Vercel Blob |
| Deploy | Vercel (all-in-one) |

---

## Design System

### Color Palette

| Token | Hex | Dùng cho |
|---|---|---|
| `--color-white` | `#FFFFFF` | Background chính, card |
| `--color-surface` | `#F8FFFE` | Background page nhẹ |
| `--color-green-primary` | `#4CAF82` | CTA, active nav, badge success |
| `--color-green-dark` | `#2E7D5E` | Hover state, heading accent |
| `--color-green-light` | `#E8F5EF` | Tag background, hover row |
| `--color-teal-primary` | `#38B2AC` | Icon, chart line, link |
| `--color-teal-light` | `#E6FFFA` | Alert info, selected state |
| `--color-pink-primary` | `#F9A8C9` | Accent, avatar border, highlight |
| `--color-pink-light` | `#FFF0F6` | Card hover tint, empty state |
| `--color-text-primary` | `#1A2E25` | Heading, body text |
| `--color-text-secondary` | `#6B8F7A` | Caption, placeholder |
| `--color-border` | `#E2EDE8` | Divider, input border |

### Ant Design Theme Token

```typescript
// src/lib/antd-theme.ts
import type { ThemeConfig } from 'antd';

export const familyTheme: ThemeConfig = {
  token: {
    // Brand colors
    colorPrimary: '#4CAF82',
    colorSuccess: '#4CAF82',
    colorInfo: '#38B2AC',
    colorWarning: '#F9A8C9',

    // Background
    colorBgBase: '#FFFFFF',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F8FFFE',

    // Text
    colorTextBase: '#1A2E25',
    colorTextSecondary: '#6B8F7A',

    // Border
    colorBorder: '#E2EDE8',
    colorBorderSecondary: '#F0F7F4',

    // Shape
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,

    // Typography
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontSizeLG: 16,
  },
  components: {
    Button: {
      colorPrimary: '#4CAF82',
      colorPrimaryHover: '#2E7D5E',
      borderRadius: 10,
      controlHeight: 40,
    },
    Card: {
      colorBorderSecondary: '#E2EDE8',
      borderRadius: 16,
      boxShadow: '0 2px 12px rgba(76, 175, 130, 0.08)',
    },
    Menu: {
      colorItemBgSelected: '#E8F5EF',
      colorItemTextSelected: '#2E7D5E',
      colorItemBgHover: '#F8FFFE',
    },
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
    },
    Tag: {
      colorSuccess: '#4CAF82',
      colorSuccessBg: '#E8F5EF',
      colorInfo: '#38B2AC',
      colorInfoBg: '#E6FFFA',
    },
  },
};
```

### Tailwind Custom Colors

```javascript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        green: {
          primary: '#4CAF82',
          dark:    '#2E7D5E',
          light:   '#E8F5EF',
        },
        teal: {
          primary: '#38B2AC',
          light:   '#E6FFFA',
        },
        pink: {
          primary: '#F9A8C9',
          light:   '#FFF0F6',
        },
        surface: '#F8FFFE',
        border:  '#E2EDE8',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(76, 175, 130, 0.08)',
        'card-hover': '0 8px 24px rgba(76, 175, 130, 0.16)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
};
```

### Cách dùng màu theo Context

| Context | Màu |
|---|---|
| Header / Sidebar nền | White `#FFFFFF` + border `#E2EDE8` |
| Nút chính (CTA) | Green primary `#4CAF82` |
| Link / Icon | Teal `#38B2AC` |
| Tag / Badge | Green light bg + Green dark text |
| Card khoảnh khắc hover | Pink light `#FFF0F6` |
| Avatar border | Pink primary `#F9A8C9` |
| Finance — INCOME | Green `#4CAF82` |
| Finance — EXPENSE | Pink `#F9A8C9` |
| Task DONE | Teal `#38B2AC` |
| Empty state illustration | Pink light + Green accent |

---

## Architecture: Clean Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── (guest)/                # Route group: guest layout
│   │   └── moments/
│   ├── (admin)/                # Route group: admin layout
│   │   ├── finance/
│   │   ├── house/
│   │   ├── moments/
│   │   └── reminders/
│   └── api/                    # API Routes
│       ├── auth/
│       ├── moments/
│       ├── finance/
│       ├── house/
│       ├── reminders/
│       └── upload/
│
├── core/                       # Enterprise Business Rules
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Moment.ts
│   │   ├── Finance.ts
│   │   ├── House.ts
│   │   └── Reminder.ts
│   ├── interfaces/             # Repository contracts
│   │   ├── IMomentRepository.ts
│   │   ├── IFinanceRepository.ts
│   │   ├── IHouseRepository.ts
│   │   └── IReminderRepository.ts
│   └── use-cases/
│       ├── moments/
│       │   ├── GetPublicMomentsUseCase.ts
│       │   ├── GetAllMomentsUseCase.ts
│       │   └── CreateMomentUseCase.ts
│       ├── finance/
│       │   ├── GetFinanceSummaryUseCase.ts
│       │   └── CreateTransactionUseCase.ts
│       ├── house/
│       │   └── GetHouseTasksUseCase.ts
│       └── reminders/
│           └── GetUpcomingRemindersUseCase.ts
│
├── infrastructure/             # DB, External Services
│   ├── repositories/
│   │   ├── PrismaMomentRepository.ts
│   │   ├── PrismaFinanceRepository.ts
│   │   ├── PrismaHouseRepository.ts
│   │   └── PrismaReminderRepository.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── services/
│       └── VercelBlobService.ts
│
└── presentation/               # UI Layer
    ├── components/
    │   ├── shared/
    │   │   ├── AppHeader.tsx
    │   │   └── AppFooter.tsx
    │   ├── guest/
    │   │   ├── MomentGrid.tsx
    │   │   └── MomentCard.tsx
    │   └── admin/
    │       ├── FinanceChart.tsx
    │       ├── HouseTaskBoard.tsx
    │       └── ReminderList.tsx
    └── hooks/
        ├── useMoments.ts
        ├── useFinance.ts
        └── useReminders.ts
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String     @id @default(cuid())
  name      String
  email     String     @unique
  role      Role       @default(GUEST)
  avatar    String?
  createdAt DateTime   @default(now())

  moments   Moment[]
  finances  Finance[]
  reminders Reminder[]
}

enum Role {
  GUEST
  ADMIN
}

model Moment {
  id          String      @id @default(cuid())
  title       String
  description String?
  mediaUrls   Json        // string[]
  takenAt     DateTime
  isPublic    Boolean     @default(true)
  tags        String[]
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  createdAt   DateTime    @default(now())
}

model Finance {
  id          String      @id @default(cuid())
  type        FinanceType
  amount      Decimal
  category    String
  description String?
  date        DateTime
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  createdAt   DateTime    @default(now())
}

enum FinanceType {
  INCOME
  EXPENSE
}

model House {
  id        String      @id @default(cuid())
  name      String
  documents Json?       // string[] - urls
  tasks     HouseTask[]
}

model HouseTask {
  id      String     @id @default(cuid())
  title   String
  status  TaskStatus @default(PENDING)
  dueDate DateTime?
  houseId String
  house   House      @relation(fields: [houseId], references: [id])
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  DONE
}

model Reminder {
  id          String     @id @default(cuid())
  title       String
  description String?
  remindAt    DateTime
  repeat      RepeatType @default(NONE)
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  createdAt   DateTime   @default(now())
}

enum RepeatType {
  NONE
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}
```

---

## Setup & Bootstrap

### 1. Khởi tạo project

```bash
npx create-next-app@latest family-hub \
  --typescript --tailwind --app --src-dir

cd family-hub

npm install antd @ant-design/icons \
  prisma @prisma/client \
  next-auth @auth/prisma-adapter \
  @vercel/blob
```

### 2. Kết nối Vercel Postgres

```bash
npm i -g vercel
vercel link
vercel postgres create family-hub-db
vercel env pull .env.local
```

`.env.local` sẽ tự sinh ra:
```env
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Migrate DB

```bash
# Local dev
npx prisma migrate dev --name init

# Production (chạy sau mỗi lần thay đổi schema)
npx prisma migrate deploy
```

### 4. Auto migrate khi deploy

```json
// package.json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## API Routes Structure

```
POST   /api/auth/[...nextauth]       # NextAuth handler

GET    /api/moments                  # Public moments (guest)
POST   /api/moments                  # Create moment (admin)
PUT    /api/moments/[id]             # Update moment (admin)
DELETE /api/moments/[id]             # Delete moment (admin)

GET    /api/finance                  # Finance list + summary (admin)
POST   /api/finance                  # Create transaction (admin)
DELETE /api/finance/[id]             # Delete transaction (admin)

GET    /api/house                    # House + tasks (admin)
POST   /api/house/tasks              # Create task (admin)
PUT    /api/house/tasks/[id]         # Update task status (admin)

GET    /api/reminders                # List reminders (admin)
POST   /api/reminders                # Create reminder (admin)
DELETE /api/reminders/[id]           # Delete reminder (admin)

POST   /api/upload                   # Upload file → Vercel Blob (admin)
```

---

## Upload File (Vercel Blob)

```typescript
// src/app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File;

  const blob = await put(`moments/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  return NextResponse.json({ url: blob.url });
}
```

---

## Phân quyền

```typescript
// src/lib/auth.ts
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role; // inject role vào session
      return session;
    },
  },
};

// Middleware bảo vệ route admin
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'ADMIN';
      }
      return true;
    },
  },
});

export const config = {
  matcher: ['/admin/:path*', '/api/finance/:path*', '/api/house/:path*', '/api/reminders/:path*'],
};
```

---

## Development Phases

### Phase 1 — Foundation (Tuần 1–2)
- [ ] Setup Next.js + Prisma + Vercel Postgres + NextAuth
- [ ] Cấu hình Ant Design theme theo design system (white / green / teal / pink)
- [ ] Guest layout vs Admin layout
- [ ] Login page, phân quyền GUEST / ADMIN
- [ ] DB schema + migrations
- [ ] Deploy lên Vercel, verify DB connection

### Phase 2 — Moments Module (Tuần 3–4)
- [ ] Guest: Xem khoảnh khắc (Grid / Timeline view)
- [ ] Guest: Filter theo tag, năm, thành viên
- [ ] Admin: Upload ảnh/video lên Vercel Blob
- [ ] Admin: CRUD khoảnh khắc
- [ ] Tối ưu ảnh: nén client-side trước khi upload

### Phase 3 — Admin Modules (Tuần 5–7)
- [ ] Finance: Danh sách thu/chi, tạo/xóa giao dịch
- [ ] Finance: Báo cáo theo tháng (AntD Charts / Recharts)
- [ ] House: Danh sách task, cập nhật trạng thái (Kanban)
- [ ] Reminders: Tạo nhắc nhở, repeat logic, hiển thị upcoming

### Phase 4 — Polish & Scale (Tuần 8+)
- [ ] Responsive mobile hoàn chỉnh
- [ ] Browser push notification cho Reminder
- [ ] Export PDF báo cáo tài chính
- [ ] Dark mode
- [ ] Multi-family support (thêm `familyId` vào schema)

---

## Vercel Free Tier — Giới hạn cần biết

| Resource | Free Limit | Ghi chú |
|---|---|---|
| Postgres Storage | 256 MB | Đủ cho 20 người |
| Postgres Compute | 60h / tháng | Đủ dùng |
| Vercel Blob | 1 GB | Nên nén ảnh trước khi upload |
| Serverless Functions | 100 GB-hrs | Dư |
| Bandwidth | 100 GB | Dư |

> **Lưu ý Blob:** Nếu upload nhiều ảnh/video, nên nén client-side (dùng `browser-image-compression`) trước khi upload. Upgrade $20/tháng được 100GB Blob.

---

## Scalability Path

| Hiện tại (Free) | Khi cần scale |
|---|---|
| Vercel Postgres (256MB) | Neon Pro / Supabase |
| Next.js API Routes | Tách .NET Core API riêng |
| Vercel Blob (1GB) | S3 + CloudFront |
| NextAuth | Keycloak / Auth0 |
| Single family | Thêm `familyId` multi-tenant |

---

## Scalability Code Pattern

```typescript
// Interface-first → dễ swap DB/service sau này
// src/core/interfaces/IMomentRepository.ts
export interface IMomentRepository {
  findAll(filter: MomentFilter): Promise<Moment[]>;
  findById(id: string): Promise<Moment | null>;
  create(data: CreateMomentDto): Promise<Moment>;
  update(id: string, data: UpdateMomentDto): Promise<Moment>;
  delete(id: string): Promise<void>;
}

// Use case độc lập với framework
// src/core/use-cases/moments/GetPublicMomentsUseCase.ts
export class GetPublicMomentsUseCase {
  constructor(private repo: IMomentRepository) {}

  async execute(filter: MomentFilter): Promise<Moment[]> {
    return this.repo.findAll({ ...filter, isPublic: true });
  }
}

// Infrastructure implement interface
// src/infrastructure/repositories/PrismaMomentRepository.ts
export class PrismaMomentRepository implements IMomentRepository {
  async findAll(filter: MomentFilter): Promise<Moment[]> {
    return prisma.moment.findMany({ where: filter });
  }
  // ...
}
```

---

*Generated for Claude Agent · Family Hub Project*
