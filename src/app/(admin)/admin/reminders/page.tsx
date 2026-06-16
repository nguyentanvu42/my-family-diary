'use client';

import { useState } from 'react';
import {
  Button, Form, Input, DatePicker, Select, Modal, Typography, message, Spin,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ReminderList } from '@/presentation/components/admin/ReminderList';
import { useReminders } from '@/presentation/hooks/useReminders';

const { Title } = Typography;

const repeatOptions = [
  { value: 'NONE', label: 'Không lặp' },
  { value: 'DAILY', label: 'Hàng ngày' },
  { value: 'WEEKLY', label: 'Hàng tuần' },
  { value: 'MONTHLY', label: 'Hàng tháng' },
  { value: 'YEARLY', label: 'Hàng năm' },
];

export default function RemindersPage() {
  const { reminders, loading, create } = useReminders();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: {
    title: string;
    description?: string;
    remindAt: { toDate: () => Date };
    repeat: string;
  }) => {
    setSubmitting(true);
    const ok = await create({ ...values, remindAt: values.remindAt.toDate().toISOString() });
    setSubmitting(false);
    if (ok) {
      message.success('Đã thêm nhắc nhở');
      setOpen(false);
      form.resetFields();
    } else {
      message.error('Lỗi khi thêm nhắc nhở');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0, color: '#1A2E25' }}>
          Nhắc nhở
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Thêm nhắc nhở
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <ReminderList reminders={reminders} />
      )}

      <Modal
        title="Thêm nhắc nhở"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ repeat: 'NONE' }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="remindAt" label="Thời gian nhắc" rules={[{ required: true }]}>
            <DatePicker showTime className="w-full" />
          </Form.Item>
          <Form.Item name="repeat" label="Lặp lại">
            <Select options={repeatOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
