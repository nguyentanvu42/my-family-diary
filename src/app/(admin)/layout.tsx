import { AppHeader } from '@/presentation/components/shared/AppHeader';
import { AdminSidebar } from '@/presentation/components/shared/AdminSidebar';
import { BottomNav } from '@/presentation/components/shared/BottomNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FFFE' }}>
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
