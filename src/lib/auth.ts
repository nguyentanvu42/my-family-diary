import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM ?? 'noreply@familyhub.app',
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        (session.user as typeof session.user & { id: string; role: string }).id = user.id;
        (session.user as typeof session.user & { id: string; role: string }).role = (
          user as typeof user & { role: string }
        ).role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
