import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'admin_token';

export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_jwt_secret_key_must_be_at_least_32_chars!'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Tạo JWT token cho admin đã xác thực (Hết hạn sau 7 ngày)
 */
export async function generateJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Xác minh JWT token và trả về payload (An toàn trên cả Node.js và Edge Runtime)
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
