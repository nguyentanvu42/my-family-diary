import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireHousehold } from '@/lib/household';
import { PrismaHouseRepository } from '@/infrastructure/repositories/PrismaHouseRepository';
import { GetHouseTasksUseCase } from '@/core/use-cases/house/GetHouseTasksUseCase';

const repo = new PrismaHouseRepository();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const householdId = requireHousehold(session);
  const useCase = new GetHouseTasksUseCase(repo);
  const house = await useCase.execute(householdId);
  return NextResponse.json(house);
}
