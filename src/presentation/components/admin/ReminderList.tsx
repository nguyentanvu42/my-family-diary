'use client';

import { List, Tag, Typography, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
const { Text } = Typography;

const repeatLabel: Record<string, string> = {
  NONE: '',
  DAILY: 'Hàng ngày',
  WEEKLY: 'Hàng tuần',
  MONTHLY: 'Hàng tháng',
  YEARLY: 'Hàng năm',
};

interface SerializableReminder {
  id: string;
  title: string;
  description?: string | null;
  remindAt: string | Date;
  repeat: string;
  userId: string;
  createdAt: string | Date;
}

interface Props {
  reminders: SerializableReminder[];
}

export function ReminderList({ reminders }: Props) {
  if (!reminders.length) {
    return <Empty description="Chưa có nhắc nhở nào" className="py-10" />;
  }

  return (
    <List
      dataSource={reminders}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: '#E6FFFA' }}
              >
                <BellOutlined style={{ color: '#38B2AC' }} />
              </div>
            }
            title={<Text style={{ color: '#1A2E25', fontWeight: 500 }}>{item.title}</Text>}
            description={
              <div className="flex items-center gap-2 flex-wrap">
                <Text style={{ color: '#6B8F7A', fontSize: 12 }}>
                  {new Date(item.remindAt).toLocaleString('vi-VN')}
                </Text>
                {item.repeat !== 'NONE' && (
                  <Tag color="processing" style={{ borderRadius: 6 }}>
                    {repeatLabel[item.repeat]}
                  </Tag>
                )}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}
