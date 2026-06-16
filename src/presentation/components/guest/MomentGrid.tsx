'use client';

import { Empty, Spin } from 'antd';
import { MomentCard } from './MomentCard';
import type { Moment } from '@/core/entities/Moment';

interface Props {
  moments: Moment[];
  loading?: boolean;
}

export function MomentGrid({ moments, loading }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!moments.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Chưa có khoảnh khắc nào"
        className="py-20"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {moments.map((m) => (
        <MomentCard key={m.id} moment={m} />
      ))}
    </div>
  );
}
