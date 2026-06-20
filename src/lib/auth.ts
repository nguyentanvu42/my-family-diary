import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;

        if (user.role === 'ADMIN') {
          // Super admin dùng shared ADMIN_PASSWORD env var
          const adminPassword = process.env.ADMIN_PASSWORD;
          if (!adminPassword || credentials.password !== adminPassword) return null;
        } else {
          // CHU_HO và MEMBER dùng bcrypt password
          if (!user.password) return null;
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          householdId: user.householdId,
          familyName: user.familyName,
        };
      },
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM ?? 'noreply@familyhub.app',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as typeof user & {
          role: string;
          householdId?: string | null;
          familyName?: string | null;
        };
        token.id = u.id;
        token.role = u.role;
        token.householdId = u.householdId ?? null;
        token.familyName = u.familyName ?? null;
      }
      // Fetch fresh data when token is missing role (e.g. after email magic-link)
      if (token.email && !token.role) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.householdId = dbUser.householdId ?? null;
          token.familyName = dbUser.familyName ?? null;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'ADMIN' | 'CHU_HO' | 'MEMBER';
        session.user.householdId = token.householdId as string | null | undefined;
        session.user.familyName = token.familyName as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
