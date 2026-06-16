'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, Typography, message, Tabs } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onCredentials = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      message.error('Email hoặc mật khẩu không đúng.');
    } else {
      router.push('/moments');
    }
  };

  const onMagicLink = async ({ email }: { email: string }) => {
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
          <Text style={{ color: '#6B8F7A' }}>Nhật ký gia đình</Text>
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
          <Tabs
            defaultActiveKey="credentials"
            items={[
              {
                key: 'credentials',
                label: 'Mật khẩu',
                children: (
                  <Form layout="vertical" onFinish={onCredentials}>
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
                        placeholder="admin@family.local"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Mật khẩu"
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: '#6B8F7A' }} />}
                        placeholder="Nhập mật khẩu"
                        size="large"
                      />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                      Đăng nhập
                    </Button>
                  </Form>
                ),
              },
              {
                key: 'email',
                label: 'Magic Link',
                children: (
                  <Form layout="vertical" onFinish={onMagicLink}>
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
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
