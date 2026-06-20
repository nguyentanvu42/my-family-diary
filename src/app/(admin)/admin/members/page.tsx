'use client';

import { useState } from 'react';
import {
  Button, Table, Modal, Form, Input, Select, Avatar, Popconfirm, Typography, App, Tag,
} from 'antd';
import { PlusOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMembers, type Member } from '@/presentation/hooks/useMembers';

const { Title } = Typography;

const RELATIONSHIP_OPTIONS = [
  'Chồng', 'Vợ', 'Bố', 'Mẹ', 'Con trai', 'Con gái',
  'Anh', 'Chị', 'Em', 'Ông', 'Bà', 'Cháu', 'Chú', 'Bác', 'Dì',
];

export default function MembersPage() {
  const { members, loading, refetch, create, remove } = useMembers();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    relationship?: string;
  }) => {
    setSubmitting(true);
    const res = await create(values);
    setSubmitting(false);
    if (res.ok) {
      message.success('Đã thêm thành viên');
      setOpen(false);
      form.resetFields();
    } else {
      const data = await res.json().catch(() => ({}));
      message.error(data.error ?? 'Lỗi khi thêm thành viên');
    }
  };

  const onDelete = async (id: string) => {
    const ok = await remove(id);
    if (ok) message.success('Đã xoá thành viên');
    else message.error('Lỗi khi xoá thành viên');
  };

  const columns = [
    {
      title: 'Thành viên',
      key: 'name',
      render: (_: unknown, r: Member) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={r.avatar}
            icon={!r.avatar ? <UserOutlined /> : undefined}
            style={{ backgroundColor: '#4CAF82' }}
          />
          <div>
            <div className="font-medium text-text-primary">{r.name}</div>
            <div className="text-xs text-text-secondary">{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Quan hệ',
      dataIndex: 'relationship',
      key: 'relationship',
      render: (rel: string | null) =>
        rel ? <Tag color="green">{rel}</Tag> : <span className="text-text-secondary">—</span>,
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: unknown, r: Member) => (
        <Popconfirm
          title="Xoá thành viên này?"
          onConfirm={() => onDelete(r.id)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Title level={3} style={{ margin: 0, color: '#1A2E25' }}>
          Thành viên gia đình
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Thêm thành viên
        </Button>
      </div>

      <Table
        dataSource={members}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: 'Chưa có thành viên nào. Hãy thêm thành viên gia đình!' }}
      />

      <Modal
        title="Thêm thành viên gia đình"
        open={open}
        onCancel={() => { setOpen(false); form.resetFields(); }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item
            name="name"
            label="Tên hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="VD: Nguyễn Thị B" />
          </Form.Item>

          <Form.Item
            name="relationship"
            label="Quan hệ trong gia đình"
          >
            <Select
              placeholder="Chọn quan hệ"
              allowClear
              showSearch
              options={RELATIONSHIP_OPTIONS.map((r) => ({ value: r, label: r }))}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu đăng nhập"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="Tối thiểu 6 ký tự" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => { setOpen(false); form.resetFields(); }}>Huỷ</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Thêm thành viên
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
