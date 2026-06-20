import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireHousehold } from '@/lib/household';
import { PrismaHouseRepository } from '@/infrastructure/repositories/PrismaHouseRepository';

const repo = new PrismaHouseRepository();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const householdId = requireHousehold(session);
  // Lấy house của household để có houseId
  const house = await repo.findByUserId(householdId);
  if (!house) {
    return NextResponse.json({ error: 'House not found' }, { status: 404 });
  }

  const body = await req.json();
  const task = await repo.createTask({
    ...body,
    houseId: house.id,
    ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
  });
  return NextResponse.json(task, { status: 201 });
}
