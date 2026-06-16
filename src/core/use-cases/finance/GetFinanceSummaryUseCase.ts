import type { IFinanceRepository } from '../../interfaces/IFinanceRepository';
import type { Finance, FinanceSummary } from '../../entities/Finance';

export class GetFinanceSummaryUseCase {
  constructor(private repo: IFinanceRepository) {}

  async execute(userId?: string): Promise<{ transactions: Finance[]; summary: FinanceSummary }> {
    const [transactions, summary] = await Promise.all([
      this.repo.findAll(userId),
      this.repo.getSummary(userId),
    ]);
    return { transactions, summary };
  }
}
