export type Role = 'MEMBER' | 'CHU_HO' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  familyName?: string | null;
  relationship?: string | null;
  householdId?: string | null;
  createdAt: Date;
}
