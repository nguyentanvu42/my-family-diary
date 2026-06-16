'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Finance, FinanceSummary } from '@/core/entities/Finance';

interface FinanceData {
  transactions: Finance[];
  summary: FinanceSummary;
}

const empty: FinanceData = {
  transactions: [],
  summary: { totalIncome: 0, totalExpense: 0, balance: 0, byCategory: [] },
};

export function useFinance() {
  const [data, setData] = useState<FinanceData>(empty);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const res = await window.fetch('/api/finance');
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload: object) => {
    const res = await window.fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) await fetch();
    return res.ok;
  };

  const remove = async (id: string) => {
    const res = await window.fetch(`/api/finance/${id}`, { method: 'DELETE' });
    if (res.ok) await fetch();
    return res.ok;
  };

  return { ...data, loading, refetch: fetch, create, remove };
}
