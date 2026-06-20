import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'ADMIN' | 'CHU_HO' | 'MEMBER';
      householdId?: string | null;
      familyName?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    householdId?: string | null;
    familyName?: string | null;
  }
}
