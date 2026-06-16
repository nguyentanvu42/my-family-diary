'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Reminder } from '@/core/entities/Reminder';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const res = await window.fetch('/api/reminders');
    if (res.ok) setReminders(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload: object) => {
    const res = await window.fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) await fetch();
    return res.ok;
  };

  const remove = async (id: string) => {
    const res = await window.fetch(`/api/reminders/${id}`, { method: 'DELETE' });
    if (res.ok) setReminders((prev) => prev.filter((r) => r.id !== id));
    return res.ok;
  };

  return { reminders, loading, refetch: fetch, create, remove };
}
