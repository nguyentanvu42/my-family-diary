'use client';

import { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Switch, Upload, Button, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';

interface Props {
  open: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateMomentModal({ open, isAdmin, onClose, onCreated }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const customRequest: NonNullable<UploadProps['customRequest']> = async (options) => {
    const { file, onSuccess, onError } = options;
    const fd = new FormData();
    fd.append('file', file as File);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setUploadedUrls((prev) => [...prev, url]);
      onSuccess?.(url);
    } else {
      message.error('Upload ảnh thất bại');
      onError?.(new Error('Upload failed'));
    }
  };

  const onFinish = async (values: {
    title: string;
    description?: string;
    takenAt: dayjs.Dayjs;
    tags?: string[];
    isPublic?: boolean;
  }) => {
    setLoading(true);
    const res = await fetch('/api/moments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: values.title,
        description: values.description ?? null,
        takenAt: values.takenAt.toISOString(),
        tags: values.tags ?? [],
        isPublic: isAdmin ? (values.isPublic ?? true) : true,
        mediaUrls: uploadedUrls,
      }),
    });
    setLoading(false);
    if (res.ok) {
      message.success('Đã đăng khoảnh khắc!');
      form.resetFields();
      setUploadedUrls([]);
      setFileList([]);
      onCreated();
      onClose();
    } else {
      message.error('Đăng thất bại, thử lại.');
    }
  };

  const handleClose = () => {
    form.resetFields();
    setUploadedUrls([]);
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Chia sẻ khoảnh khắc"
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ takenAt: dayjs(), isPublic: true }}
        className="mt-4"
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="Tiêu đề khoảnh khắc..." size="large" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Kể về khoảnh khắc này..." rows={3} />
        </Form.Item>

        <Form.Item
          name="takenAt"
          label="Ngày chụp"
          rules={[{ required: true, message: 'Chọn ngày' }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select
            mode="tags"
            placeholder="Thêm tag (tết, gia đình...)"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Ảnh">
          <Upload
            accept="image/*"
            multiple
            customRequest={customRequest}
            fileList={fileList}
            onChange={({ fileList: fl }) => setFileList(fl)}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {isAdmin && (
          <Form.Item name="isPublic" label="Hiển thị" valuePropName="checked">
            <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
          </Form.Item>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleClose}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đăng
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
