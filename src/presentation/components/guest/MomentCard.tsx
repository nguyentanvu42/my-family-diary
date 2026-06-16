'use client';

import { Card, Tag, Typography } from 'antd';
import Image from 'next/image';
import type { Moment } from '@/core/entities/Moment';

const { Text, Title } = Typography;

interface Props {
  moment: Moment;
}

export function MomentCard({ moment }: Props) {
  const firstImage = moment.mediaUrls[0];

  return (
    <Card
      cover={
        firstImage ? (
          <div className="relative h-52 overflow-hidden rounded-t-card">
            <Image src={firstImage} alt={moment.title} fill className="object-cover" />
          </div>
        ) : (
          <div
            className="h-52 flex items-center justify-center rounded-t-card"
            style={{ background: '#FFF0F6' }}
          >
            <span className="text-5xl">📷</span>
          </div>
        )
      }
      className="hover:shadow-card-hover transition-shadow duration-200"
    >
      <Title level={5} style={{ marginBottom: 4, color: '#1A2E25' }}>
        {moment.title}
      </Title>
      {moment.description && (
        <Text style={{ color: '#6B8F7A', fontSize: 13 }} className="line-clamp-2 block mb-3">
          {moment.description}
        </Text>
      )}
      <Text style={{ color: '#6B8F7A', fontSize: 12, display: 'block', marginBottom: 8 }}>
        {new Date(moment.takenAt).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </Text>
      <div className="flex flex-wrap gap-1">
        {moment.tags.map((tag) => (
          <Tag key={tag} color="success" style={{ borderRadius: 6 }}>
            {tag}
          </Tag>
        ))}
      </div>
    </Card>
  );
}
