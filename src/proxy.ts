import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const { pathname } = req.nextUrl;
      const role = token?.role as string | undefined;
      const isLoggedIn = !!token;
      const isChuHo = role === 'CHU_HO';
      const isAdmin = role === 'ADMIN';

      if (pathname.startsWith('/super-admin')) return isAdmin;
      if (pathname.startsWith('/admin')) return isChuHo;
      if (pathname.startsWith('/api/members')) return isChuHo;
      if (/^\/api\/(finance|house|reminders)/.test(pathname)) return isChuHo;
      if (pathname.startsWith('/api/upload')) return isLoggedIn;
      if (pathname.startsWith('/moments')) return isLoggedIn;
      return true;
    },
  },
});

export const config = {
  matcher: [
    '/super-admin/:path*',
    '/admin/:path*',
    '/moments/:path*',
    '/moments',
    '/api/members/:path*',
    '/api/finance/:path*',
    '/api/house/:path*',
    '/api/reminders/:path*',
    '/api/upload',
  ],
};
