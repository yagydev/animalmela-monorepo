import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/settings'];
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    // Redirect to login page if not authenticated
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access login/register, redirect to home
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip all Next internals and API so we never touch HMR, RSC, or static chunks.
     * (Previously only _next/static + _next/image; other /_next/* paths are also dev-critical.)
     */
    '/((?!api|_next/|favicon.ico).*)',
  ],
};

