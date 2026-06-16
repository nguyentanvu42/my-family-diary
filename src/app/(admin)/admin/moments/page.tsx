'use client';

import { useState } from 'react';
import {
  Button, Form, Input, DatePicker, Switch, Upload, Modal, message, Typography, Select,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { MomentGrid } from '@/presentation/components/guest/MomentGrid';
import { useMoments } from '@/presentation/hooks/useMoments';

const { Title } = Typography;

export default function AdminMomentsPage() {
  const { moments, loading, refetch } = useMoments();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setUploadedUrls((prev) => [...prev, url]);
    }
    return false;
  };

  const onFinish = async (values: {
    title: string;
    description?: string;
    takenAt: { toDate: () => Date };
    isPublic: boolean;
    tags?: string[];
  }) => {
    setSubmitting(true);
    const res = await fetch('/api/moments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        takenAt: values.takenAt.toDate().toISOString(),
        mediaUrls: uploadedUrls,
        tags: values.tags ?? [],
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      message.success('Đã tạo khoảnh khắc');
      setOpen(false);
      form.resetFields();
      setUploadedUrls([]);
      refetch();
    } else {
      message.error('Lỗi khi tạo khoảnh khắc');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0, color: '#1A2E25' }}>
          Khoảnh khắc
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Thêm khoảnh khắc
        </Button>
      </div>

      <MomentGrid moments={moments} loading={loading} />

      <Modal
        title="Thêm khoảnh khắc"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isPublic: true }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="takenAt" label="Ngày chụp" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Thêm tag..." />
          </Form.Item>
          <Form.Item name="isPublic" label="Hiển thị công khai" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Ảnh / Video">
            <Upload beforeUpload={handleUpload} multiple showUploadList={false} accept="image/*,video/*">
              <Button icon={<UploadOutlined />}>Tải lên</Button>
            </Upload>
            {uploadedUrls.length > 0 && (
              <div className="mt-2 text-sm" style={{ color: '#6B8F7A' }}>
                Đã upload {uploadedUrls.length} file
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
