'use client';

import { Skeleton, Empty } from 'antd';
import { MomentCard } from './MomentCard';
import type { Moment } from '@/core/entities/Moment';

interface Props {
  moments: Moment[];
  loading?: boolean;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export function MomentGrid({ moments, loading, isAdmin, onDelete }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4"
            style={{ border: '1px solid #E2EDE8' }}
          >
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!moments.length) {
    return (
      <div
        className="bg-white rounded-2xl flex items-center justify-center py-16"
        style={{ border: '1px solid #E2EDE8' }}
      >
        <Empty description="Chưa có khoảnh khắc nào — hãy chia sẻ kỷ niệm đầu tiên!" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {moments.map((m) => (
        <MomentCard key={m.id} moment={m} isAdmin={isAdmin} onDelete={onDelete} />
      ))}
    </div>
  );
}
