'use client';

import { Avatar, Dropdown, Tooltip } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';

export function AppHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role;
  const isChuHo = role === 'CHU_HO';
  const isSuperAdmin = role === 'ADMIN';

  const adminTarget = isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard';
  const showAdminGear = isChuHo || isSuperAdmin;

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => signOut({ callbackUrl: '/login' }),
    },
  ];

  const displayName = isChuHo && session?.user?.familyName
    ? session.user.familyName
    : (session?.user?.name ?? session?.user?.email);

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 h-16 border-b"
      style={{ borderColor: '#E2EDE8', background: '#fff' }}
    >
      <span className="text-lg font-semibold" style={{ color: '#1A2E25' }}>
        🏡 Family Hub
      </span>
      {session?.user && (
        <div className="flex items-center gap-3">
          {showAdminGear && (
            <Tooltip title={isSuperAdmin ? 'Quản trị hệ thống' : 'Trang quản trị'}>
              <button
                onClick={() => router.push(adminTarget)}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer"
                style={{ background: '#E8F5EF', border: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#C8E6D7')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#E8F5EF')}
              >
                <SettingOutlined style={{ color: '#2E7D5E', fontSize: 16 }} />
              </button>
            </Tooltip>
          )}
          <Dropdown menu={{ items }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar
                src={session.user.image}
                icon={<UserOutlined />}
                style={{ border: '2px solid #F9A8C9' }}
              />
              <span className="hidden sm:block text-sm" style={{ color: '#1A2E25' }}>
                {displayName}
              </span>
            </div>
          </Dropdown>
        </div>
      )}
    </header>
  );
}
