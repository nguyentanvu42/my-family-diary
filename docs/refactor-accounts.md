# Refactor hệ thống tài khoản (CHU_HO / MEMBER / ADMIN)

## Bối cảnh

App ban đầu có 2 role: `MEMBER` (xem moments) và `ADMIN` (quản lý tất cả). Refactor này bổ sung role `CHU_HO` và phân tách rõ trách nhiệm:

| Role | Mô tả |
|---|---|
| `CHU_HO` | Chủ hộ — tài khoản chính của gia đình, tự đăng ký, sở hữu toàn bộ data (tài chính, nhắc nhở, nhà, moments) |
| `MEMBER` | Thành viên — do CHU_HO tạo trong admin panel, có trường `relationship` (vợ/chồng/mẹ/con...) |
| `ADMIN` | Super-admin — quản lý tất cả tài khoản CHU_HO, panel riêng tại `/super-admin/*` |

**Bug fix đi kèm:** Middleware cũ ở `src/proxy.ts` không chạy (Next.js chỉ nhận `src/middleware.ts`).

---

## Thiết kế kỹ thuật

### Data ownership

Tất cả data gia đình (Finance, Reminder, Moment, House) đều có `userId` = CHU_HO's id.  
Helper `src/lib/household.ts` export `getHouseholdId(session)` trả về:
- CHU_HO → `session.user.id`
- MEMBER → `session.user.householdId` (FK trỏ đến CHU_HO)
- ADMIN → `null`

### Schema thay đổi

**Role enum:**
```prisma
enum Role {
  ADMIN
  CHU_HO
  MEMBER
}
```

**User model — fields mới:**
```prisma
model User {
  password     String?    // bcrypt hash — CHU_HO và MEMBER
  familyName   String?    // tên gia đình — CHU_HO
  relationship String?    // quan hệ — MEMBER (vợ/chồng/mẹ...)
  householdId  String?    // MEMBER: FK → CHU_HO.id
  household    User?      @relation("Household", fields: [householdId], references: [id])
  members      User[]     @relation("Household")
  houses       House[]    // thêm relation mới
}
```

**House model — thêm userId:**
```prisma
model House {
  userId String?   // CHU_HO id
  user   User?     @relation(fields: [userId], references: [id])
}
```

Migration: `20260620022945_auth_role_refactor`

---

## Các file thay đổi

### Files tạo mới
| File | Mục đích |
|---|---|
| `src/middleware.ts` | Thay `proxy.ts`, route guard theo role mới |
| `src/types/next-auth.d.ts` | Module augmentation — type `role`, `householdId`, `familyName` lên Session/JWT |
| `src/lib/household.ts` | Helper `getHouseholdId()` / `requireHousehold()` |
| `src/app/api/auth/register/route.ts` | POST đăng ký CHU_HO + tạo House mặc định |
| `src/app/api/members/route.ts` | GET/POST thành viên của household |
| `src/app/api/members/[id]/route.ts` | PUT/DELETE thành viên (CHU_HO only) |
| `src/app/(admin)/admin/members/page.tsx` | Trang quản lý thành viên |
| `src/presentation/hooks/useMembers.ts` | Hook fetch/create/remove members |
| `src/app/(super-admin)/layout.tsx` | Layout super-admin |
| `src/app/(super-admin)/page.tsx` | Redirect → `/super-admin/dashboard` |
| `src/app/(super-admin)/super-admin/dashboard/page.tsx` | Danh sách tất cả CHU_HO |

### Files xóa
- `src/proxy.ts` — middleware không chạy, thay bằng `src/middleware.ts`

### Files sửa
| File | Thay đổi |
|---|---|
| `prisma/schema.prisma` | Role enum, User fields, House.userId |
| `prisma/seed.ts` | 3 tài khoản mẫu mới (superadmin/chuho/member) |
| `src/lib/auth.ts` | bcrypt cho CHU_HO/MEMBER, householdId trong JWT/session |
| `src/core/entities/User.ts` | Type `Role` thêm `CHU_HO`, thêm fields mới |
| `src/core/interfaces/IHouseRepository.ts` | `findFirst()` → `findByUserId(userId)` |
| `src/core/use-cases/house/GetHouseTasksUseCase.ts` | `execute(userId: string)` |
| `src/infrastructure/repositories/PrismaHouseRepository.ts` | `findByUserId()` |
| `src/app/login/page.tsx` | Thêm tab "Đăng ký", role-based redirect sau login |
| `src/app/api/finance/route.ts` + `[id]/route.ts` | Guard CHU_HO, scope theo householdId |
| `src/app/api/reminders/route.ts` + `[id]/route.ts` | Guard CHU_HO, scope theo householdId |
| `src/app/api/moments/route.ts` + `[id]/route.ts` | Guard CHU_HO/MEMBER, scope theo householdId |
| `src/app/api/house/route.ts` + `tasks/` | Guard CHU_HO, dùng findByUserId |
| `src/app/(admin)/admin/dashboard/page.tsx` | Gate CHU_HO, pass householdId vào use-cases |
| `src/presentation/components/shared/AppHeader.tsx` | Hiện familyName, gear icon theo role |
| `src/presentation/components/shared/AdminSidebar.tsx` | Thêm "Thành viên" |
| `src/presentation/components/shared/BottomNav.tsx` | Thêm "Thành viên" |

---

## Auth flow

### Đăng ký (CHU_HO)
1. User điền form tab "Đăng ký" trên `/login`
2. `POST /api/auth/register` → tạo User (CHU_HO) + House mặc định
3. Auto `signIn('credentials', ...)` → redirect `/admin/dashboard`

### Đăng nhập
- **CHU_HO / MEMBER**: email + bcrypt password → redirect theo role
- **ADMIN**: email + `ADMIN_PASSWORD` env var → redirect `/super-admin/dashboard`
- **Magic link**: email provider (EmailProvider), hỗ trợ tất cả roles

### Redirect theo role
| Role | Redirect sau login |
|---|---|
| `CHU_HO` | `/admin/dashboard` |
| `ADMIN` | `/super-admin/dashboard` |
| `MEMBER` | `/moments` |

---

## Middleware (`src/middleware.ts`)

```
/super-admin/*      → ADMIN only
/admin/*            → CHU_HO only
/api/members/*      → CHU_HO only
/api/finance/*      → CHU_HO only
/api/house/*        → CHU_HO only
/api/reminders/*    → CHU_HO only
/api/upload         → any logged-in user
/moments/*          → any logged-in user
/api/auth/register  → public (không có trong matcher)
```

---

## Seed data

```
superadmin@family.local  →  ADMIN    (login: ADMIN_PASSWORD env var)
chuho@family.local       →  CHU_HO   (login: password123)
member@family.local      →  MEMBER   (login: password123, quan hệ: Vợ)
```

---

## Verification checklist

- [ ] `npm run db:migrate` thành công
- [ ] `npx prisma db seed` thành công
- [ ] `npx tsc --noEmit` pass
- [ ] Không đăng nhập → vào `/admin/dashboard` → redirect `/login` (middleware chạy)
- [ ] Đăng ký CHU_HO mới → auto login → vào `/admin/dashboard`
- [ ] CHU_HO tạo MEMBER → MEMBER login → vào `/moments`, không vào được `/admin/*`
- [ ] CHU_HO không vào được `/super-admin/*`
- [ ] ADMIN login → `/super-admin/dashboard`, thấy danh sách CHU_HO
- [ ] 2 CHU_HO khác nhau không thấy data của nhau
- [ ] `npm run build` pass
