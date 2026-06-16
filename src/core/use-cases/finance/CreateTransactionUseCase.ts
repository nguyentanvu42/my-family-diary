import type { IFinanceRepository } from '../../interfaces/IFinanceRepository';
import type { Finance, CreateFinanceDto } from '../../entities/Finance';

export class CreateTransactionUseCase {
  constructor(private repo: IFinanceRepository) {}

  async execute(data: CreateFinanceDto): Promise<Finance> {
    return this.repo.create(data);
  }
}
