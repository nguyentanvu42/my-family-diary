import { PrismaClient, Role, FinanceType, TaskStatus, RepeatType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Super Admin (quản trị hệ thống) ─────────────────────────
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@family.local' },
    update: {},
    create: {
      id: 'user-superadmin-001',
      name: 'Super Admin',
      email: 'superadmin@family.local',
      role: Role.ADMIN,
      // Login bằng ADMIN_PASSWORD env var, không cần password hash
    },
  });

  const chuHoPassword = bcrypt.hashSync('password123', 10);
  const memberPassword = bcrypt.hashSync('password123', 10);

  // ── Chủ hộ (upsert by id để kế thừa FK của Moment/Finance/Reminder) ──
  const chuHo = await prisma.user.upsert({
    where: { id: 'user-admin-001' },
    update: {
      email: 'chuho@family.local',
      role: Role.CHU_HO,
      familyName: 'Gia đình Nguyễn',
      password: chuHoPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chuho',
    },
    create: {
      id: 'user-admin-001',
      name: 'Nguyễn Tấn Vũ',
      email: 'chuho@family.local',
      role: Role.CHU_HO,
      familyName: 'Gia đình Nguyễn',
      password: chuHoPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chuho',
    },
  });

  // ── Thành viên gia đình (do chủ hộ tạo) ─────────────────────
  const member = await prisma.user.upsert({
    where: { id: 'user-guest-001' },
    update: {
      email: 'member@family.local',
      role: Role.MEMBER,
      relationship: 'Vợ',
      householdId: chuHo.id,
      password: memberPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member',
    },
    create: {
      id: 'user-guest-001',
      name: 'Thu Hương',
      email: 'member@family.local',
      role: Role.MEMBER,
      relationship: 'Vợ',
      householdId: chuHo.id,
      password: memberPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member',
    },
  });

  console.log('✅ Users:', superAdmin.name, '|', chuHo.name, '|', member.name);

  // ── Moments ──────────────────────────────────────────────────
  const moments = await Promise.all([
    prisma.moment.upsert({
      where: { id: 'moment-001' },
      update: {},
      create: {
        id: 'moment-001',
        title: 'Tết Nguyên Đán 2025',
        description: 'Cả gia đình quây quần bên nhau đón giao thừa, không khí ấm áp và vui vẻ.',
        mediaUrls: [
          'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800',
        ],
        takenAt: new Date('2025-01-29'),
        isPublic: true,
        tags: ['tết', 'gia đình', '2025'],
        userId: chuHo.id,
      },
    }),
    prisma.moment.upsert({
      where: { id: 'moment-002' },
      update: {},
      create: {
        id: 'moment-002',
        title: 'Sinh nhật bé Na',
        description: 'Bé Na tròn 3 tuổi, tiệc sinh nhật nhỏ ấm cúng tại nhà.',
        mediaUrls: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        ],
        takenAt: new Date('2025-03-15'),
        isPublic: true,
        tags: ['sinh nhật', 'bé Na', 'gia đình'],
        userId: chuHo.id,
      },
    }),
    prisma.moment.upsert({
      where: { id: 'moment-003' },
      update: {},
      create: {
        id: 'moment-003',
        title: 'Du lịch Đà Lạt',
        description: 'Chuyến đi Đà Lạt 3 ngày 2 đêm, thời tiết mát mẻ, cảnh đẹp.',
        mediaUrls: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1573408259040-4f17025fa72d?w=800',
        ],
        takenAt: new Date('2025-05-01'),
        isPublic: true,
        tags: ['du lịch', 'Đà Lạt', '2025'],
        userId: chuHo.id,
      },
    }),
    prisma.moment.upsert({
      where: { id: 'moment-004' },
      update: {},
      create: {
        id: 'moment-004',
        title: 'Giỗ ông nội',
        description: 'Cúng giỗ ông nội, cả họ về đông đủ.',
        mediaUrls: [],
        takenAt: new Date('2025-06-10'),
        isPublic: false,
        tags: ['gia đình', 'giỗ'],
        userId: chuHo.id,
      },
    }),
    prisma.moment.upsert({
      where: { id: 'moment-005' },
      update: {},
      create: {
        id: 'moment-005',
        title: 'Khai trương cửa hàng mới',
        description: 'Mở cửa hàng mới, mọi người đến chúc mừng rất đông.',
        mediaUrls: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        ],
        takenAt: new Date('2025-08-20'),
        isPublic: true,
        tags: ['kinh doanh', 'gia đình'],
        userId: chuHo.id,
      },
    }),
  ]);

  console.log('✅ Moments:', moments.length);

  // ── Finance ──────────────────────────────────────────────────
  const finances = await Promise.all([
    prisma.finance.upsert({
      where: { id: 'finance-001' },
      update: {},
      create: {
        id: 'finance-001',
        type: FinanceType.INCOME,
        amount: 25000000,
        category: 'Lương',
        description: 'Lương tháng 6/2025',
        date: new Date('2025-06-05'),
        userId: chuHo.id,
      },
    }),
    prisma.finance.upsert({
      where: { id: 'finance-002' },
      update: {},
      create: {
        id: 'finance-002',
        type: FinanceType.INCOME,
        amount: 5000000,
        category: 'Freelance',
        description: 'Thiết kế web cho khách hàng',
        date: new Date('2025-06-12'),
        userId: chuHo.id,
      },
    }),
    prisma.finance.upsert({
      where: { id: 'finance-003' },
      update: {},
      create: {
        id: 'finance-003',
        type: FinanceType.INCOME,
        amount: 25000000,
        category: 'Lương',
        description: 'Lương tháng 7/2025',
        date: new Date('2025-07-05'),
        userId: chuHo.id,
      },
    }),
    prisma.finance.upsert({
      where: { id: 'finance-004' },
      update: {},
      create: {
        id: 'finance-004',
        type: FinanceType.EXPENSE,
        amount: 8000000,
        category: 'Ăn uống',
        description: 'Chi phí ăn uống tháng 6',
        date: new Date('2025-06-30'),
        userId: chuHo.id,
      },
    }),
    prisma.finance.upsert({
      where: { id: 'finance-005' },
      update: {},
      create: {
        id: 'finance-005',
        type: FinanceType.EXPENSE,
        amount: 3500000,
        category: 'Điện nước',
        description: 'Tiền điện + nước tháng 6',
        date: new Date('2025-06-15'),
        userId: chuHo.id,
      },
    }),
    prisma.finance.upsert({
      where: { id: 'finance-006' },
      update: {},
      create: {
        id: 'finance-006',
        type: FinanceType.EXPENSE,
        amount: 1200000,
        category: 'Internet',
        description: 'Cước internet + điện thoại',
        date: new Date('2025-06-10'),
        userId: chuHo.id,
      },
    }),
    prisma.finance.upsert({
      where: { id: 'finance-007' },
      update: {},
      create: {
        id: 'finance-007',
        type: FinanceType.EXPENSE,
        amount: 4500000,
        category: 'Học phí',
        description: 'Học phí tiếng Anh cho bé',
        date: new Date('2025-07-01'),
        userId: chuHo.id,
      },
    }),
    prisma.finance.upsert({
      where: { id: 'finance-008' },
      update: {},
      create: {
        id: 'finance-008',
        type: FinanceType.EXPENSE,
        amount: 2000000,
        category: 'Mua sắm',
        description: 'Quần áo mùa hè cho bé',
        date: new Date('2025-07-10'),
        userId: chuHo.id,
      },
    }),
  ]);

  console.log('✅ Finance:', finances.length);

  // ── House (thuộc chủ hộ) ─────────────────────────────────────
  const house = await prisma.house.upsert({
    where: { id: 'house-001' },
    update: { userId: chuHo.id },
    create: {
      id: 'house-001',
      name: 'Nhà phố Phước Long',
      documents: [
        'https://example.com/docs/so-do.pdf',
        'https://example.com/docs/hop-dong.pdf',
      ],
      userId: chuHo.id,
    },
  });

  console.log('✅ House:', house.name);

  // ── HouseTasks ───────────────────────────────────────────────
  const houseTasks = await Promise.all([
    prisma.houseTask.upsert({
      where: { id: 'task-001' },
      update: {},
      create: {
        id: 'task-001',
        title: 'Sơn lại tường phòng khách',
        status: TaskStatus.DONE,
        dueDate: new Date('2025-06-01'),
        houseId: house.id,
      },
    }),
    prisma.houseTask.upsert({
      where: { id: 'task-002' },
      update: {},
      create: {
        id: 'task-002',
        title: 'Sửa vòi nước nhà bếp bị rỉ',
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date('2025-07-15'),
        houseId: house.id,
      },
    }),
    prisma.houseTask.upsert({
      where: { id: 'task-003' },
      update: {},
      create: {
        id: 'task-003',
        title: 'Lắp thêm camera an ninh',
        status: TaskStatus.PENDING,
        dueDate: new Date('2025-08-01'),
        houseId: house.id,
      },
    }),
    prisma.houseTask.upsert({
      where: { id: 'task-004' },
      update: {},
      create: {
        id: 'task-004',
        title: 'Thay bóng đèn hành lang',
        status: TaskStatus.DONE,
        dueDate: null,
        houseId: house.id,
      },
    }),
    prisma.houseTask.upsert({
      where: { id: 'task-005' },
      update: {},
      create: {
        id: 'task-005',
        title: 'Vệ sinh máy lạnh phòng ngủ',
        status: TaskStatus.PENDING,
        dueDate: new Date('2025-07-20'),
        houseId: house.id,
      },
    }),
  ]);

  console.log('✅ HouseTasks:', houseTasks.length);

  // ── Reminders ────────────────────────────────────────────────
  const reminders = await Promise.all([
    prisma.reminder.upsert({
      where: { id: 'reminder-001' },
      update: {},
      create: {
        id: 'reminder-001',
        title: 'Sinh nhật mẹ',
        description: 'Nhớ mua quà và đặt bàn nhà hàng trước 1 ngày',
        remindAt: new Date('2025-09-12T08:00:00'),
        repeat: RepeatType.YEARLY,
        userId: chuHo.id,
      },
    }),
    prisma.reminder.upsert({
      where: { id: 'reminder-002' },
      update: {},
      create: {
        id: 'reminder-002',
        title: 'Đóng tiền học phí',
        description: 'Đóng học phí tiếng Anh cho bé Na — hạn ngày 5 hàng tháng',
        remindAt: new Date('2025-07-05T09:00:00'),
        repeat: RepeatType.MONTHLY,
        userId: chuHo.id,
      },
    }),
    prisma.reminder.upsert({
      where: { id: 'reminder-003' },
      update: {},
      create: {
        id: 'reminder-003',
        title: 'Khám sức khỏe định kỳ',
        description: 'Lịch khám tổng quát hàng năm tại Bệnh viện FV',
        remindAt: new Date('2025-12-01T07:30:00'),
        repeat: RepeatType.YEARLY,
        userId: chuHo.id,
      },
    }),
    prisma.reminder.upsert({
      where: { id: 'reminder-004' },
      update: {},
      create: {
        id: 'reminder-004',
        title: 'Họp phụ huynh trường bé Na',
        description: 'Cuối học kỳ 1',
        remindAt: new Date('2025-11-20T17:00:00'),
        repeat: RepeatType.NONE,
        userId: chuHo.id,
      },
    }),
    prisma.reminder.upsert({
      where: { id: 'reminder-005' },
      update: {},
      create: {
        id: 'reminder-005',
        title: 'Gia hạn bảo hiểm xe',
        description: 'Gia hạn bảo hiểm xe máy trước khi hết hạn',
        remindAt: new Date('2025-08-15T08:00:00'),
        repeat: RepeatType.YEARLY,
        userId: chuHo.id,
      },
    }),
  ]);

  console.log('✅ Reminders:', reminders.length);

  console.log('\n🎉 Seed completed!');
  console.log('   Super Admin : superadmin@family.local  (dùng ADMIN_PASSWORD env)');
  console.log('   Chủ hộ     : chuho@family.local        (password: password123)');
  console.log('   Thành viên : member@family.local       (password: password123)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
