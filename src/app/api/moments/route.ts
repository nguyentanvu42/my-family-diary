import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getHouseholdId } from '@/lib/household';
import { PrismaMomentRepository } from '@/infrastructure/repositories/PrismaMomentRepository';
import { GetPublicMomentsUseCase } from '@/core/use-cases/moments/GetPublicMomentsUseCase';
import { GetAllMomentsUseCase } from '@/core/use-cases/moments/GetAllMomentsUseCase';
import { CreateMomentUseCase } from '@/core/use-cases/moments/CreateMomentUseCase';

const repo = new PrismaMomentRepository();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = req.nextUrl;
  const tags = searchParams.getAll('tag');
  const role = session?.user?.role;

  if (role === 'CHU_HO') {
    // CHU_HO xem tất cả moments của gia đình (public + private)
    const householdId = getHouseholdId(session!);
    const useCase = new GetAllMomentsUseCase(repo);
    const moments = await useCase.execute({
      userId: householdId ?? undefined,
      tags: tags.length ? tags : undefined,
    });
    return NextResponse.json(moments);
  }

  if (role === 'MEMBER') {
    // MEMBER chỉ xem public moments của gia đình
    const householdId = getHouseholdId(session!);
    const useCase = new GetPublicMomentsUseCase(repo);
    const moments = await useCase.execute({
      userId: householdId ?? undefined,
      tags: tags.length ? tags : undefined,
    });
    return NextResponse.json(moments);
  }

  // Khách hoặc ADMIN: chỉ xem public moments
  const useCase = new GetPublicMomentsUseCase(repo);
  const moments = await useCase.execute({ tags: tags.length ? tags : undefined });
  return NextResponse.json(moments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user || (role !== 'CHU_HO' && role !== 'MEMBER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const householdId = getHouseholdId(session);
  if (!householdId) {
    return NextResponse.json({ error: 'No household' }, { status: 403 });
  }

  const body = await req.json();
  const useCase = new CreateMomentUseCase(repo);
  const moment = await useCase.execute({
    ...body,
    userId: householdId,
    takenAt: new Date(body.takenAt),
    isPublic: role === 'CHU_HO' ? (body.isPublic ?? true) : true,
  });
  return NextResponse.json(moment, { status: 201 });
}
