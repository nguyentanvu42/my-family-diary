'use client';

import { Card, Typography, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { FinanceSummary } from '@/core/entities/Finance';

const { Title } = Typography;

interface Props {
  summary: FinanceSummary;
}

export function FinanceChart({ summary }: Props) {
  return (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Thu nhập"
              value={summary.totalIncome}
              precision={0}
              valueStyle={{ color: '#4CAF82' }}
              prefix={<ArrowUpOutlined />}
              suffix="₫"
              formatter={(v) => Number(v).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Chi tiêu"
              value={summary.totalExpense}
              precision={0}
              valueStyle={{ color: '#F9A8C9' }}
              prefix={<ArrowDownOutlined />}
              suffix="₫"
              formatter={(v) => Number(v).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Số dư"
              value={Math.abs(summary.balance)}
              precision={0}
              valueStyle={{ color: summary.balance >= 0 ? '#4CAF82' : '#F9A8C9' }}
              prefix={summary.balance >= 0 ? '+' : '-'}
              suffix="₫"
              formatter={(v) => Number(v).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Title level={5} style={{ marginBottom: 16 }}>
          Theo danh mục
        </Title>
        <div className="space-y-3">
          {summary.byCategory.map((item) => (
            <div key={`${item.type}-${item.category}`} className="flex justify-between items-center">
              <span style={{ color: '#1A2E25' }}>{item.category}</span>
              <span
                style={{
                  color: item.type === 'INCOME' ? '#4CAF82' : '#F9A8C9',
                  fontWeight: 600,
                }}
              >
                {item.type === 'INCOME' ? '+' : '-'}
                {item.total.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
