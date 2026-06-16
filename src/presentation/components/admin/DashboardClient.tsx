'use client';

import { Card, Col, Row, Typography } from 'antd';
import { ReminderList } from './ReminderList';
const { Title, Text } = Typography;

interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface SerializableReminder {
  id: string;
  title: string;
  description?: string | null;
  remindAt: string;
  repeat: string;
  userId: string;
  createdAt: string;
}

interface Props {
  finance: { summary: FinanceSummary };
  reminders: SerializableReminder[];
}

export function DashboardClient({ finance, reminders }: Props) {
  return (
    <div>
      <Title level={2} style={{ color: '#1A2E25', marginBottom: 24 }}>
        Tổng quan
      </Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Text style={{ color: '#6B8F7A' }}>Thu nhập</Text>
            <div className="text-2xl font-bold mt-1" style={{ color: '#4CAF82' }}>
              {finance.summary.totalIncome.toLocaleString('vi-VN')} ₫
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Text style={{ color: '#6B8F7A' }}>Chi tiêu</Text>
            <div className="text-2xl font-bold mt-1" style={{ color: '#F9A8C9' }}>
              {finance.summary.totalExpense.toLocaleString('vi-VN')} ₫
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Text style={{ color: '#6B8F7A' }}>Số dư</Text>
            <div
              className="text-2xl font-bold mt-1"
              style={{ color: finance.summary.balance >= 0 ? '#4CAF82' : '#F9A8C9' }}
            >
              {finance.summary.balance >= 0 ? '+' : ''}
              {finance.summary.balance.toLocaleString('vi-VN')} ₫
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Title level={5} style={{ marginBottom: 12 }}>
          Nhắc nhở sắp tới
        </Title>
        <ReminderList reminders={reminders} />
      </Card>
    </div>
  );
}
