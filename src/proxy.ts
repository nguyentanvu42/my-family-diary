import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const { pathname } = req.nextUrl;
      const isAdmin = token?.role === 'ADMIN';

      if (pathname.startsWith('/admin') || pathname.includes('/(admin)')) {
        return isAdmin;
      }
      if (
        pathname.startsWith('/api/finance') ||
        pathname.startsWith('/api/house') ||
        pathname.startsWith('/api/reminders') ||
        pathname.startsWith('/api/upload')
      ) {
        return isAdmin;
      }
      return true;
    },
  },
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/finance/:path*',
    '/api/house/:path*',
    '/api/reminders/:path*',
    '/api/upload',
  ],
};
