import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaReminderRepository } from '@/infrastructure/repositories/PrismaReminderRepository';

const repo = new PrismaReminderRepository();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reminders = await repo.findAll((session.user as { id: string }).id);
  return NextResponse.json(reminders);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const reminder = await repo.create({
    ...body,
    remindAt: new Date(body.remindAt),
    userId: (session.user as { id: string }).id,
  });
  return NextResponse.json(reminder, { status: 201 });
}
