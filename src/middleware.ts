import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const payload = verifyToken(token)
    if (!payload) {
      throw new Error('Invalid token')
    }
    // If the token is valid, allow the request to proceed
    return NextResponse.next()
  } catch (error) {
    // If the token is invalid or expired, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}