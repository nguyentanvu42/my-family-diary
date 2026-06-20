import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { requireHousehold } from '@/lib/household';
import { PrismaReminderRepository } from '@/infrastructure/repositories/PrismaReminderRepository';
import { PrismaFinanceRepository } from '@/infrastructure/repositories/PrismaFinanceRepository';
import { GetUpcomingRemindersUseCase } from '@/core/use-cases/reminders/GetUpcomingRemindersUseCase';
import { GetFinanceSummaryUseCase } from '@/core/use-cases/finance/GetFinanceSummaryUseCase';
import { DashboardClient } from '@/presentation/components/admin/DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'CHU_HO') {
    redirect('/login');
  }

  const householdId = requireHousehold(session);

  const [reminders, finance] = await Promise.all([
    new GetUpcomingRemindersUseCase(new PrismaReminderRepository()).execute(householdId),
    new GetFinanceSummaryUseCase(new PrismaFinanceRepository()).execute(householdId),
  ]);

  const remindersSerializable = reminders.map((r) => ({
    ...r,
    remindAt: r.remindAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
  }));

  return <DashboardClient finance={{ summary: finance.summary }} reminders={remindersSerializable} />;
}
