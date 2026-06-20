import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireHousehold } from '@/lib/household';
import { PrismaReminderRepository } from '@/infrastructure/repositories/PrismaReminderRepository';

const repo = new PrismaReminderRepository();

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const householdId = requireHousehold(session);
  const { id } = await params;

  const record = await repo.findById(id);
  if (!record || record.userId !== householdId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await repo.delete(id);
  return new NextResponse(null, { status: 204 });
}
