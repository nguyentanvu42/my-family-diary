'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onFinish = async ({ email }: { email: string }) => {
    setLoading(true);
    const result = await signIn('email', { email, redirect: false });
    setLoading(false);
    if (result?.error) {
      message.error('Không thể gửi link đăng nhập. Thử lại sau.');
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md shadow-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏡</div>
          <Title level={2} style={{ color: '#1A2E25', marginBottom: 4 }}>
            Family Hub
          </Title>
          <Text style={{ color: '#6B8F7A' }}>Ứng dụng quản lý gia đình</Text>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-4">📧</div>
            <Title level={4}>Kiểm tra email của bạn</Title>
            <Text style={{ color: '#6B8F7A' }}>
              Chúng tôi đã gửi link đăng nhập đến email của bạn.
            </Text>
          </div>
        ) : (
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#6B8F7A' }} />}
                placeholder="email@example.com"
                size="large"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Gửi link đăng nhập
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
