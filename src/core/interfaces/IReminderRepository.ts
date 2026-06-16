import type { Reminder, CreateReminderDto } from '../entities/Reminder';

export interface IReminderRepository {
  findAll(userId?: string): Promise<Reminder[]>;
  findById(id: string): Promise<Reminder | null>;
  findUpcoming(userId?: string, limit?: number): Promise<Reminder[]>;
  create(data: CreateReminderDto): Promise<Reminder>;
  delete(id: string): Promise<void>;
}
