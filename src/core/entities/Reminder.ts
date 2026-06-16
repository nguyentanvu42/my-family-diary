export type RepeatType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Reminder {
  id: string;
  title: string;
  description?: string | null;
  remindAt: Date;
  repeat: RepeatType;
  userId: string;
  createdAt: Date;
}

export interface CreateReminderDto {
  title: string;
  description?: string;
  remindAt: Date;
  repeat?: RepeatType;
  userId: string;
}
