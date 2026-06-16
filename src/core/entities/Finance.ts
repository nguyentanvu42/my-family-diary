import type { Decimal } from '@prisma/client/runtime/library';

export type FinanceType = 'INCOME' | 'EXPENSE';

export interface Finance {
  id: string;
  type: FinanceType;
  amount: Decimal;
  category: string;
  description?: string | null;
  date: Date;
  userId: string;
  createdAt: Date;
}

export interface CreateFinanceDto {
  type: FinanceType;
  amount: number;
  category: string;
  description?: string;
  date: Date;
  userId: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: { category: string; total: number; type: FinanceType }[];
}
