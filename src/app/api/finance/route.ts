import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaFinanceRepository } from '@/infrastructure/repositories/PrismaFinanceRepository';
import { GetFinanceSummaryUseCase } from '@/core/use-cases/finance/GetFinanceSummaryUseCase';
import { CreateTransactionUseCase } from '@/core/use-cases/finance/CreateTransactionUseCase';

const repo = new PrismaFinanceRepository();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const useCase = new GetFinanceSummaryUseCase(repo);
  const result = await useCase.execute();
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const useCase = new CreateTransactionUseCase(repo);
  const transaction = await useCase.execute({
    ...body,
    amount: Number(body.amount),
    date: new Date(body.date),
    userId: (session.user as { id: string }).id,
  });
  return NextResponse.json(transaction, { status: 201 });
}
