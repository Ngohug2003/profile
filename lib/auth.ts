import { cookies } from 'next/headers';
import { COOKIE_NAME, verifyJWT, generateJWT, type JWTPayload } from './jwt';

export { COOKIE_NAME, verifyJWT, generateJWT, type JWTPayload };

/**
 * Kiểm tra request hiện tại có được xác thực admin hay không
 * Đọc JWT từ httpOnly cookie
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(COOKIE_NAME);
    if (!tokenCookie || !tokenCookie.value) {
      return false;
    }
    const payload = await verifyJWT(tokenCookie.value);
    return payload !== null && payload.role === 'ADMIN';
  } catch {
    return false;
  }
}

/**
 * Lấy thông tin user hiện tại từ JWT cookie
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(COOKIE_NAME);
    if (!tokenCookie || !tokenCookie.value) {
      return null;
    }
    return await verifyJWT(tokenCookie.value);
  } catch {
    return null;
  }
}
