import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { HouseholdsTable } from './HouseholdsTable';

export default async function SuperAdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const raw = await prisma.user.findMany({
    where: { role: 'CHU_HO' },
    select: {
      id: true,
      name: true,
      email: true,
      familyName: true,
      createdAt: true,
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize: chuyển Date → string và _count → số để truyền qua Server→Client boundary
  const households = raw.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    familyName: r.familyName,
    createdAt: r.createdAt.toISOString(),
    memberCount: r._count.members,
  }));

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold m-0" style={{ color: '#1A2E25' }}>Quản trị hệ thống</h3>
        <p className="mt-1" style={{ color: '#6B8F7A' }}>Danh sách tất cả tài khoản gia đình</p>
      </div>

      <HouseholdsTable data={households} />
    </div>
  );
}
