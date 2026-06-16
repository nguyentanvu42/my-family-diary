import { prisma } from '@/lib/prisma';
import type { IReminderRepository } from '@/core/interfaces/IReminderRepository';
import type { Reminder, CreateReminderDto } from '@/core/entities/Reminder';

export class PrismaReminderRepository implements IReminderRepository {
  async findAll(userId?: string): Promise<Reminder[]> {
    return prisma.reminder.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { remindAt: 'asc' },
    }) as unknown as Reminder[];
  }

  async findById(id: string): Promise<Reminder | null> {
    return prisma.reminder.findUnique({ where: { id } }) as unknown as Reminder | null;
  }

  async findUpcoming(userId?: string, limit = 5): Promise<Reminder[]> {
    return prisma.reminder.findMany({
      where: {
        ...(userId && { userId }),
        remindAt: { gte: new Date() },
      },
      orderBy: { remindAt: 'asc' },
      take: limit,
    }) as unknown as Reminder[];
  }

  async create(data: CreateReminderDto): Promise<Reminder> {
    return prisma.reminder.create({ data }) as unknown as Reminder;
  }

  async delete(id: string): Promise<void> {
    await prisma.reminder.delete({ where: { id } });
  }
}
