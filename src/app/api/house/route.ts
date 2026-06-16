import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaHouseRepository } from '@/infrastructure/repositories/PrismaHouseRepository';
import { GetHouseTasksUseCase } from '@/core/use-cases/house/GetHouseTasksUseCase';

const repo = new PrismaHouseRepository();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const useCase = new GetHouseTasksUseCase(repo);
  const house = await useCase.execute();
  return NextResponse.json(house);
}
