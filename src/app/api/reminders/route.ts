import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireHousehold } from '@/lib/household';
import { PrismaReminderRepository } from '@/infrastructure/repositories/PrismaReminderRepository';

const repo = new PrismaReminderRepository();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const householdId = requireHousehold(session);
  const reminders = await repo.findAll(householdId);
  return NextResponse.json(reminders);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const householdId = requireHousehold(session);
  const body = await req.json();
  const reminder = await repo.create({
    ...body,
    remindAt: new Date(body.remindAt),
    userId: householdId,
  });
  return NextResponse.json(reminder, { status: 201 });
}
