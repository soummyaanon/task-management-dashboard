import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  throw new Error('JWT_SECRET is not defined');
}

export function signToken(userId: string): string {
  try {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
  } catch (error) {
    console.error('Error signing token:', error);
    throw new Error('Failed to sign token');
  }
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export function setAuthCookie(token: string) {
  try {
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    throw new Error('Failed to set auth cookie');
  }
}

export function getAuthCookie(): string | undefined {
  try {
    return cookies().get('auth_token')?.value;
  } catch (error) {
    console.error('Error getting auth cookie:', error);
    return undefined;
  }
}

export function removeAuthCookie() {
  try {
    cookies().delete('auth_token');
  } catch (error) {
    console.error('Error removing auth cookie:', error);
    throw new Error('Failed to remove auth cookie');
  }
}