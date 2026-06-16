import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MomentsFeedClient } from '@/presentation/components/guest/MomentsFeedClient';

export const dynamic = 'force-dynamic';

export default async function MomentsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? 'MEMBER';
  return <MomentsFeedClient role={role} />;
}
