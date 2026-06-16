import { prisma } from '@/lib/prisma';
import type { IFinanceRepository } from '@/core/interfaces/IFinanceRepository';
import type { Finance, CreateFinanceDto, FinanceSummary, FinanceType } from '@/core/entities/Finance';

export class PrismaFinanceRepository implements IFinanceRepository {
  async findAll(userId?: string): Promise<Finance[]> {
    return prisma.finance.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { date: 'desc' },
    }) as unknown as Finance[];
  }

  async findById(id: string): Promise<Finance | null> {
    return prisma.finance.findUnique({ where: { id } }) as unknown as Finance | null;
  }

  async create(data: CreateFinanceDto): Promise<Finance> {
    return prisma.finance.create({ data }) as unknown as Finance;
  }

  async delete(id: string): Promise<void> {
    await prisma.finance.delete({ where: { id } });
  }

  async getSummary(userId?: string): Promise<FinanceSummary> {
    const rows = await prisma.finance.findMany({
      where: userId ? { userId } : undefined,
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = new Map<string, { total: number; type: FinanceType }>();

    for (const row of rows) {
      const amount = Number(row.amount);
      if (row.type === 'INCOME') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
      const key = `${row.type}::${row.category}`;
      const existing = categoryMap.get(key);
      categoryMap.set(key, {
        total: (existing?.total ?? 0) + amount,
        type: row.type as FinanceType,
      });
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byCategory: Array.from(categoryMap.entries()).map(([key, v]) => ({
        category: key.split('::')[1],
        total: v.total,
        type: v.type,
      })),
    };
  }
}
