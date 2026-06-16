'use client';

import { useState } from 'react';
import {
  Button, Form, Input, InputNumber, Select, DatePicker, Modal,
  Table, Tag, Typography, message, Popconfirm,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FinanceChart } from '@/presentation/components/admin/FinanceChart';
import { useFinance } from '@/presentation/hooks/useFinance';
import type { Finance } from '@/core/entities/Finance';

const { Title } = Typography;

const incomeCategories = ['Lương', 'Thưởng', 'Đầu tư', 'Khác'];
const expenseCategories = ['Ăn uống', 'Nhà cửa', 'Di chuyển', 'Giải trí', 'Sức khỏe', 'Giáo dục', 'Khác'];

export default function FinancePage() {
  const { transactions, summary, loading, create, remove } = useFinance();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  const onFinish = async (values: {
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    category: string;
    description?: string;
    date: { toDate: () => Date };
  }) => {
    setSubmitting(true);
    const ok = await create({ ...values, date: values.date.toDate().toISOString() });
    setSubmitting(false);
    if (ok) {
      message.success('Đã thêm giao dịch');
      setOpen(false);
      form.resetFields();
    } else {
      message.error('Lỗi khi thêm giao dịch');
    }
  };

  const columns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (t: string) => (
        <Tag color={t === 'INCOME' ? 'success' : 'error'}>{t === 'INCOME' ? 'Thu' : 'Chi'}</Tag>
      ),
    },
    { title: 'Danh mục', dataIndex: 'category' },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (v: number, r: Finance) => (
        <span style={{ color: r.type === 'INCOME' ? '#4CAF82' : '#F9A8C9', fontWeight: 600 }}>
          {r.type === 'INCOME' ? '+' : '-'}
          {Number(v).toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    { title: 'Mô tả', dataIndex: 'description', render: (v: string) => v ?? '—' },
    {
      title: 'Ngày',
      dataIndex: 'date',
      render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
    },
    {
      title: '',
      render: (_: unknown, r: Finance) => (
        <Popconfirm title="Xóa giao dịch?" onConfirm={() => remove(r.id)} okText="Xóa" cancelText="Hủy">
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0, color: '#1A2E25' }}>
          Tài chính
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Thêm giao dịch
        </Button>
      </div>

      <FinanceChart summary={summary} />

      <div className="mt-6">
        <Table
          dataSource={transactions as Finance[]}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20 }}
        />
      </div>

      <Modal
        title="Thêm giao dịch"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: 'EXPENSE' }}
          onValuesChange={(changed) => { if (changed.type) setType(changed.type); }}
        >
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select options={[{ value: 'INCOME', label: 'Thu nhập' }, { value: 'EXPENSE', label: 'Chi tiêu' }]} />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
            <Select
              options={(type === 'INCOME' ? incomeCategories : expenseCategories).map((c) => ({
                value: c, label: c,
              }))}
            />
          </Form.Item>
          <Form.Item name="amount" label="Số tiền (₫)" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
