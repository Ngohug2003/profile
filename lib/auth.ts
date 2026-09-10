import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';

export function generateSessionToken(): string {
  const secret = process.env.SESSION_SECRET || 'default_super_secret_session_key_32_characters!';
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`admin:${timestamp}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const secret = process.env.SESSION_SECRET || 'default_super_secret_session_key_32_characters!';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`admin:${timestamp}`)
    .digest('hex');

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );

  if (!isMatch) return false;

  // Hạn session 7 ngày
  const sessionAge = Date.now() - parseInt(timestamp, 10);
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  return sessionAge < maxAge;
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return false;
    }
    return verifySessionToken(sessionCookie.value);
  } catch {
    return false;
  }
}
