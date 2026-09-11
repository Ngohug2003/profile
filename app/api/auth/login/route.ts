import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateJWT } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập email và mật khẩu.' },
        { status: 400 }
      );
    }

    // Tìm user theo email trong database
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // So sánh password với bcrypt hash trong DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // Tạo JWT token
    const token = await generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: { email: user.email, role: user.role },
    });

    // Set JWT vào httpOnly cookie
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
