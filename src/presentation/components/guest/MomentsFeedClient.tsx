'use client';

import { useState } from 'react';
import { Avatar } from 'antd';
import { useSession } from 'next-auth/react';
import { useMoments } from '@/presentation/hooks/useMoments';
import { MomentGrid } from './MomentGrid';
import { CreateMomentModal } from './CreateMomentModal';

interface Props {
  role: string;
}

export function MomentsFeedClient({ role }: Props) {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const { moments, loading, refetch, remove } = useMoments();
  const isAdmin = role === 'ADMIN';

  const avatarSrc =
    session?.user?.image ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email ?? 'user'}`;

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="mb-6">
        <h2 style={{ color: '#1A2E25', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
          Khoảnh khắc gia đình
        </h2>
        <p style={{ color: '#6B8F7A', margin: 0, fontSize: 14 }}>
          Những kỷ niệm đẹp cùng gia đình
        </p>
      </div>

      {/* Compose box */}
      <div
        className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 mb-5 cursor-pointer transition-all"
        style={{ border: '1px solid #E2EDE8' }}
        onClick={() => setModalOpen(true)}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#4CAF82')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2EDE8')}
      >
        <Avatar
          src={avatarSrc}
          size={38}
          style={{ border: '2px solid #F9A8C9', flexShrink: 0 }}
        />
        <div
          className="flex-1 rounded-full px-4 py-2 text-sm select-none"
          style={{ background: '#F8FFFE', color: '#6B8F7A', border: '1px solid #E2EDE8' }}
        >
          Chia sẻ khoảnh khắc...
        </div>
      </div>

      <MomentGrid
        moments={moments}
        loading={loading}
        isAdmin={isAdmin}
        onDelete={remove}
      />

      <CreateMomentModal
        open={modalOpen}
        isAdmin={isAdmin}
        onClose={() => setModalOpen(false)}
        onCreated={refetch}
      />
    </div>
  );
}
