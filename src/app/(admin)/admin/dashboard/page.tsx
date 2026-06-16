import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { PrismaReminderRepository } from '@/infrastructure/repositories/PrismaReminderRepository';
import { PrismaFinanceRepository } from '@/infrastructure/repositories/PrismaFinanceRepository';
import { GetUpcomingRemindersUseCase } from '@/core/use-cases/reminders/GetUpcomingRemindersUseCase';
import { GetFinanceSummaryUseCase } from '@/core/use-cases/finance/GetFinanceSummaryUseCase';
import { DashboardClient } from '@/presentation/components/admin/DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    redirect('/login');
  }

  const [reminders, finance] = await Promise.all([
    new GetUpcomingRemindersUseCase(new PrismaReminderRepository()).execute(
      (session.user as { id: string }).id
    ),
    new GetFinanceSummaryUseCase(new PrismaFinanceRepository()).execute(),
  ]);

  return <DashboardClient finance={finance} reminders={reminders} />;
}
