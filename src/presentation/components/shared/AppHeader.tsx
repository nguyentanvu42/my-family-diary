'use client';

import { Avatar, Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';
import type { MenuProps } from 'antd';

export function AppHeader() {
  const { data: session } = useSession();

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => signOut({ callbackUrl: '/login' }),
    },
  ];

  return (
    <header
      className="flex items-center justify-between px-6 h-16 border-b"
      style={{ borderColor: '#E2EDE8', background: '#fff' }}
    >
      <span className="text-lg font-semibold" style={{ color: '#1A2E25' }}>
        🏡 Family Hub
      </span>
      {session?.user && (
        <Dropdown menu={{ items }} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              src={session.user.image}
              icon={<UserOutlined />}
              style={{ border: '2px solid #F9A8C9' }}
            />
            <span className="hidden sm:block text-sm" style={{ color: '#1A2E25' }}>
              {session.user.name ?? session.user.email}
            </span>
          </div>
        </Dropdown>
      )}
    </header>
  );
}
