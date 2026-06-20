import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireHousehold } from '@/lib/household';
import { PrismaFinanceRepository } from '@/infrastructure/repositories/PrismaFinanceRepository';
import { GetFinanceSummaryUseCase } from '@/core/use-cases/finance/GetFinanceSummaryUseCase';
import { CreateTransactionUseCase } from '@/core/use-cases/finance/CreateTransactionUseCase';

const repo = new PrismaFinanceRepository();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const householdId = requireHousehold(session);
  const useCase = new GetFinanceSummaryUseCase(repo);
  const result = await useCase.execute(householdId);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const householdId = requireHousehold(session);
  const body = await req.json();
  const useCase = new CreateTransactionUseCase(repo);
  const transaction = await useCase.execute({
    ...body,
    amount: Number(body.amount),
    date: new Date(body.date),
    userId: householdId,
  });
  return NextResponse.json(transaction, { status: 201 });
}
