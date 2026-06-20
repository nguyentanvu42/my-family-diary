import { Session } from 'next-auth';

// Trả về householdId để scope data: CHU_HO → own id; MEMBER → householdId; ADMIN → null
export function getHouseholdId(session: Session): string | null {
  const user = session.user;
  if (user.role === 'CHU_HO') return user.id;
  if (user.role === 'MEMBER') return user.householdId ?? null;
  return null;
}

// Dùng trong API handler: trả về householdId hoặc throw 401 (ADMIN không có household)
export function requireHousehold(session: Session): string {
  const hid = getHouseholdId(session);
  if (!hid) throw new Error('No household');
  return hid;
}
