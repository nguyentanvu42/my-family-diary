'use client';

import { Avatar, Image, Tag, Typography, Button, Popconfirm } from 'antd';
import { DeleteOutlined, LockOutlined } from '@ant-design/icons';
import type { Moment } from '@/core/entities/Moment';

const { Text } = Typography;

function relativeDate(date: Date | string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))} tháng trước`;
  return `${Math.floor(diff / (86400 * 365))} năm trước`;
}

interface Props {
  moment: Moment;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export function MomentCard({ moment, isAdmin, onDelete }: Props) {
  const images = moment.mediaUrls as string[];

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E2EDE8' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${moment.userId}`}
            size={40}
            style={{ border: '2px solid #F9A8C9', flexShrink: 0 }}
          />
          <div>
            <div className="font-semibold text-sm" style={{ color: '#1A2E25' }}>
              Gia đình
            </div>
            <div className="text-xs flex items-center gap-1" style={{ color: '#6B8F7A' }}>
              {relativeDate(moment.takenAt)}
              {!moment.isPublic && (
                <span className="flex items-center gap-0.5 ml-1">
                  · <LockOutlined style={{ fontSize: 10 }} /> Riêng tư
                </span>
              )}
            </div>
          </div>
        </div>
        {isAdmin && onDelete && (
          <Popconfirm
            title="Xóa khoảnh khắc này?"
            onConfirm={() => onDelete(moment.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              style={{ color: '#6B8F7A' }}
            />
          </Popconfirm>
        )}
      </div>

      {/* Images */}
      {images.length > 0 && (
        <Image.PreviewGroup>
          {images.length === 1 ? (
            <div style={{ lineHeight: 0 }}>
              <Image
                src={images[0]}
                alt={moment.title}
                width="100%"
                style={{ maxHeight: 480, objectFit: 'cover', display: 'block' }}
                preview={{ mask: false }}
              />
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
              }}
            >
              {images.slice(0, 4).map((url, i) => (
                <div key={url} className="relative" style={{ aspectRatio: '1', overflow: 'hidden', lineHeight: 0 }}>
                  <Image
                    src={url}
                    alt={`${moment.title} ${i + 1}`}
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover', display: 'block' }}
                    preview={{ mask: false }}
                  />
                  {i === 3 && images.length > 4 && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 28, fontWeight: 700 }}
                    >
                      +{images.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Image.PreviewGroup>
      )}

      {/* Body */}
      <div className="px-4 py-3">
        <div className="font-semibold mb-1" style={{ color: '#1A2E25', fontSize: 15 }}>
          {moment.title}
        </div>
        {moment.description && (
          <Text style={{ color: '#4A6B5A', fontSize: 14, display: 'block', lineHeight: 1.6, marginBottom: 8 }}>
            {moment.description}
          </Text>
        )}
        {moment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {moment.tags.map((tag) => (
              <Tag key={tag} color="success" style={{ borderRadius: 20, fontSize: 12, margin: 0 }}>
                #{tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
