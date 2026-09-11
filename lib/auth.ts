import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_token';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_jwt_secret_key_must_be_at_least_32_chars!'
);

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Tạo JWT token cho admin đã xác thực
 * Token hết hạn sau 7 ngày
 */
export async function generateJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Xác minh JWT token và trả về payload
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

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
