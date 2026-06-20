'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, Typography, message, Tabs } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function redirectByRole(role: string, router: ReturnType<typeof useRouter>) {
  if (role === 'ADMIN') router.push('/super-admin/dashboard');
  else if (role === 'CHU_HO') router.push('/admin/dashboard');
  else router.push('/moments');
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onCredentials = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setLoading(false);
      message.error('Email hoặc mật khẩu không đúng.');
      return;
    }
    const session = await getSession();
    setLoading(false);
    if (session?.user?.role) {
      redirectByRole(session.user.role, router);
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

  const onRegister = async (values: {
    familyName: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        familyName: values.familyName,
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      message.error(data.error ?? 'Đăng ký thất bại. Thử lại sau.');
      return;
    }
    // Auto sign-in sau khi đăng ký
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      message.error('Đăng ký thành công nhưng đăng nhập thất bại. Vui lòng đăng nhập thủ công.');
      return;
    }
    message.success('Chào mừng đến với Family Hub!');
    router.push('/admin/dashboard');
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
                label: 'Đăng nhập',
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
                        placeholder="email@example.com"
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
                key: 'register',
                label: 'Đăng ký',
                children: (
                  <Form layout="vertical" onFinish={onRegister}>
                    <Form.Item
                      name="familyName"
                      label="Tên gia đình"
                      rules={[{ required: true, message: 'Vui lòng nhập tên gia đình' }]}
                    >
                      <Input
                        prefix={<HomeOutlined style={{ color: '#6B8F7A' }} />}
                        placeholder="VD: Gia đình Nguyễn"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="name"
                      label="Tên của bạn"
                      rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: '#6B8F7A' }} />}
                        placeholder="VD: Nguyễn Văn A"
                        size="large"
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
                      <Input
                        prefix={<MailOutlined style={{ color: '#6B8F7A' }} />}
                        placeholder="email@example.com"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Mật khẩu"
                      rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu' },
                        { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: '#6B8F7A' }} />}
                        placeholder="Tối thiểu 6 ký tự"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="confirmPassword"
                      label="Xác nhận mật khẩu"
                      rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: '#6B8F7A' }} />}
                        placeholder="Nhập lại mật khẩu"
                        size="large"
                      />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                      Tạo tài khoản gia đình
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
