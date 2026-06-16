'use client';

import { Card, Tag, Button, Typography, Empty } from 'antd';
import { CheckOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import type { HouseTask, TaskStatus } from '@/core/entities/House';

const { Text } = Typography;

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Chờ', color: 'default', icon: <ClockCircleOutlined /> },
  IN_PROGRESS: { label: 'Đang làm', color: 'processing', icon: <SyncOutlined spin /> },
  DONE: { label: 'Xong', color: 'success', icon: <CheckOutlined /> },
};

const nextStatus: Record<TaskStatus, TaskStatus> = {
  PENDING: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: 'PENDING',
};

interface Props {
  tasks: HouseTask[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

const columns: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];

export function HouseTaskBoard({ tasks, onUpdateStatus }: Props) {
  if (!tasks.length) {
    return <Empty description="Chưa có công việc nào" className="py-10" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col);
        const cfg = statusConfig[col];
        return (
          <div key={col}>
            <div className="flex items-center gap-2 mb-3">
              <Tag color={cfg.color}>{cfg.icon} {cfg.label}</Tag>
              <Text style={{ color: '#6B8F7A', fontSize: 13 }}>{colTasks.length}</Text>
            </div>
            <div className="space-y-3">
              {colTasks.map((task) => (
                <Card key={task.id} size="small" className="shadow-card">
                  <Text style={{ display: 'block', marginBottom: 8, color: '#1A2E25' }}>
                    {task.title}
                  </Text>
                  {task.dueDate && (
                    <Text style={{ color: '#6B8F7A', fontSize: 12, display: 'block', marginBottom: 8 }}>
                      Hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                    </Text>
                  )}
                  {col !== 'DONE' && (
                    <Button
                      size="small"
                      type="link"
                      style={{ padding: 0, color: '#38B2AC' }}
                      onClick={() => onUpdateStatus(task.id, nextStatus[col])}
                    >
                      → {statusConfig[nextStatus[col]].label}
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
