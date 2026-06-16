import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaMomentRepository } from '@/infrastructure/repositories/PrismaMomentRepository';
import { GetPublicMomentsUseCase } from '@/core/use-cases/moments/GetPublicMomentsUseCase';
import { GetAllMomentsUseCase } from '@/core/use-cases/moments/GetAllMomentsUseCase';
import { CreateMomentUseCase } from '@/core/use-cases/moments/CreateMomentUseCase';

const repo = new PrismaMomentRepository();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = req.nextUrl;
  const tags = searchParams.getAll('tag');

  if (session?.user && (session.user as { role?: string }).role === 'ADMIN') {
    const useCase = new GetAllMomentsUseCase(repo);
    const moments = await useCase.execute({ tags: tags.length ? tags : undefined });
    return NextResponse.json(moments);
  }

  const useCase = new GetPublicMomentsUseCase(repo);
  const moments = await useCase.execute({ tags: tags.length ? tags : undefined });
  return NextResponse.json(moments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string })?.role;
  if (!session?.user || !userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const useCase = new CreateMomentUseCase(repo);
  const moment = await useCase.execute({
    ...body,
    userId: (session.user as { id: string }).id,
    takenAt: new Date(body.takenAt),
    isPublic: userRole === 'ADMIN' ? (body.isPublic ?? true) : true,
  });
  return NextResponse.json(moment, { status: 201 });
}
