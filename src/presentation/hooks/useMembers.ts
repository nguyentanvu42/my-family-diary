'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  relationship?: string | null;
  createdAt: string;
}

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const res = await window.fetch('/api/members');
    if (res.ok) setMembers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload: object) => {
    const res = await window.fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) await fetch();
    return res;
  };

  const remove = async (id: string) => {
    const res = await window.fetch(`/api/members/${id}`, { method: 'DELETE' });
    if (res.ok) setMembers((prev) => prev.filter((m) => m.id !== id));
    return res.ok;
  };

  return { members, loading, refetch: fetch, create, remove };
}
