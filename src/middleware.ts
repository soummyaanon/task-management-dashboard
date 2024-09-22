import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token');
    console.log('Middleware - Auth token:', authToken ? 'Present' : 'Not present');
    console.log('Middleware - Current path:', request.nextUrl.pathname);

    if (!authToken && request.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('Middleware - Redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authToken && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
      console.log('Middleware - Redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log('Middleware - Continuing to route');
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware - Error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};