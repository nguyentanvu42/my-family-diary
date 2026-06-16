'use client';

import { Menu } from 'antd';
import {
  CameraOutlined,
  DollarOutlined,
  HomeOutlined,
  BellOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

const items = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: '/admin/moments', icon: <CameraOutlined />, label: 'Khoảnh khắc' },
  { key: '/admin/finance', icon: <DollarOutlined />, label: 'Tài chính' },
  { key: '/admin/house', icon: <HomeOutlined />, label: 'Nhà cửa' },
  { key: '/admin/reminders', icon: <BellOutlined />, label: 'Nhắc nhở' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className="w-56 min-h-screen border-r flex-shrink-0"
      style={{ borderColor: '#E2EDE8', background: '#fff' }}
    >
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={items}
        onClick={({ key }) => router.push(key)}
        style={{ border: 'none', paddingTop: 8 }}
      />
    </aside>
  );
}
