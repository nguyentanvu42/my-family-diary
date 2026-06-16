import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { PrismaReminderRepository } from '@/infrastructure/repositories/PrismaReminderRepository';
import { PrismaFinanceRepository } from '@/infrastructure/repositories/PrismaFinanceRepository';
import { GetUpcomingRemindersUseCase } from '@/core/use-cases/reminders/GetUpcomingRemindersUseCase';
import { GetFinanceSummaryUseCase } from '@/core/use-cases/finance/GetFinanceSummaryUseCase';
import { ReminderList } from '@/presentation/components/admin/ReminderList';
import { Card, Col, Row, Typography } from 'antd';

const { Title, Text } = Typography;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    redirect('/login');
  }

  const [reminders, finance] = await Promise.all([
    new GetUpcomingRemindersUseCase(new PrismaReminderRepository()).execute(
      (session.user as { id: string }).id
    ),
    new GetFinanceSummaryUseCase(new PrismaFinanceRepository()).execute(),
  ]);

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
