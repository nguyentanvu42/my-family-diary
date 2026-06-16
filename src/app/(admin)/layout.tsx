import { AppHeader } from '@/presentation/components/shared/AppHeader';
import { AdminSidebar } from '@/presentation/components/shared/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FFFE' }}>
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
