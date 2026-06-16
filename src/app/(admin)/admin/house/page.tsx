'use client';

import { useState, useEffect } from 'react';
import { App, Button, Form, Input, DatePicker, Modal, Typography, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { HouseTaskBoard } from '@/presentation/components/admin/HouseTaskBoard';
import type { House, TaskStatus } from '@/core/entities/House';

const { Title } = Typography;

export default function HousePage() {
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { message } = App.useApp();

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/house');
    if (res.ok) setHouse(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onFinish = async (values: { title: string; dueDate?: { toDate: () => Date } }) => {
    if (!house) return;
    setSubmitting(true);
    const res = await fetch('/api/house/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: values.title,
        houseId: house.id,
        ...(values.dueDate && { dueDate: values.dueDate.toDate().toISOString() }),
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      message.success('Đã thêm công việc');
      setOpen(false);
      form.resetFields();
      await load();
    } else {
      message.error('Lỗi khi thêm công việc');
    }
  };

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    await fetch(`/api/house/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0, color: '#1A2E25' }}>
          {house?.name ?? 'Nhà cửa'}
        </Title>
        {house && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
            Thêm việc
          </Button>
        )}
      </div>

      <HouseTaskBoard tasks={house?.tasks ?? []} onUpdateStatus={handleUpdateStatus} />

      <Modal
        title="Thêm công việc"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Tên công việc" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dueDate" label="Hạn hoàn thành">
            <DatePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
