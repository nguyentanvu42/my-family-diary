'use client';

import {
  DashboardOutlined,
  CameraOutlined,
  DollarOutlined,
  HomeOutlined,
  BellOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: '/admin/moments',   icon: <CameraOutlined />,   label: 'Khoảnh khắc' },
  { key: '/admin/finance',   icon: <DollarOutlined />,   label: 'Tài chính' },
  { key: '/admin/house',     icon: <HomeOutlined />,     label: 'Nhà cửa' },
  { key: '/admin/reminders', icon: <BellOutlined />,     label: 'Nhắc nhở' },
  { key: '/admin/members',   icon: <TeamOutlined />,     label: 'Thành viên' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t"
      style={{
        background: '#ffffff',
        borderColor: '#E2EDE8',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex items-stretch h-14">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.key);
          return (
            <button
              key={item.key}
              onClick={() => router.push(item.key)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? '#4CAF82' : '#6B8F7A',
                paddingTop: 8,
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1, color: isActive ? '#4CAF82' : '#6B8F7A' }}>
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: 1.2,
                  color: isActive ? '#4CAF82' : '#6B8F7A',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
