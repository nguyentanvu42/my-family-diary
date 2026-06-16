'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { familyTheme } from '@/lib/antd-theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AntdRegistry>
        <ConfigProvider theme={familyTheme}>{children}</ConfigProvider>
      </AntdRegistry>
    </SessionProvider>
  );
}
