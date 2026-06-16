'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Moment } from '@/core/entities/Moment';

export function useMoments(tags?: string[]) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const params = tags?.length ? `?${tags.map((t) => `tag=${t}`).join('&')}` : '';
    const res = await window.fetch(`/api/moments${params}`);
    if (res.ok) setMoments(await res.json());
    setLoading(false);
  }, [tags?.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: FormData) => {
    const res = await window.fetch('/api/moments', { method: 'POST', body: data });
    if (res.ok) await fetch();
    return res.ok;
  };

  const remove = async (id: string) => {
    const res = await window.fetch(`/api/moments/${id}`, { method: 'DELETE' });
    if (res.ok) setMoments((prev) => prev.filter((m) => m.id !== id));
    return res.ok;
  };

  return { moments, loading, refetch: fetch, create, remove };
}
