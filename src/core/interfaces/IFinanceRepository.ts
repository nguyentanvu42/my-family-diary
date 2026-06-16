import type { Finance, CreateFinanceDto, FinanceSummary } from '../entities/Finance';

export interface IFinanceRepository {
  findAll(userId?: string): Promise<Finance[]>;
  findById(id: string): Promise<Finance | null>;
  create(data: CreateFinanceDto): Promise<Finance>;
  delete(id: string): Promise<void>;
  getSummary(userId?: string): Promise<FinanceSummary>;
}
