import { AppHeader } from '@/presentation/components/shared/AppHeader';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FFFE' }}>
      <AppHeader />
      <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
