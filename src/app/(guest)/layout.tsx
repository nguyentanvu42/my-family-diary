import { AppHeader } from '@/presentation/components/shared/AppHeader';

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#F8FFFE' }}>
      <AppHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
