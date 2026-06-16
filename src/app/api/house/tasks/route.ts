import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaHouseRepository } from '@/infrastructure/repositories/PrismaHouseRepository';

const repo = new PrismaHouseRepository();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const task = await repo.createTask({
    ...body,
    ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
  });
  return NextResponse.json(task, { status: 201 });
}
