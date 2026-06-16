import type { IReminderRepository } from '../../interfaces/IReminderRepository';
import type { Reminder } from '../../entities/Reminder';

export class GetUpcomingRemindersUseCase {
  constructor(private repo: IReminderRepository) {}

  async execute(userId?: string, limit = 5): Promise<Reminder[]> {
    return this.repo.findUpcoming(userId, limit);
  }
}
