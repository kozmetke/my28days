import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
    const isPublicRoute = req.nextUrl.pathname === '/' || isApiAuthRoute;

    // Allow public routes and API auth routes
    if (isPublicRoute) {
      return null;
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    }

    // Protect all other routes
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      
      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true // Let the middleware function handle the auth check
    },
  }
);

// Only protect specific routes
export const config = {
  matcher: [
    '/create',
    '/profile/:path*',
    '/notifications',
    '/onboarding',
    '/auth/:path*',
    '/api/posts/:path*',
    '/api/users/:path*',
    '/api/notifications/:path*',
    '/api/search/:path*',
  ],
};
