import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateJWT } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

    const cleanEmail = email.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL || 'ngoviethung0911@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Anhhung999@';

    // 1. Kiểm tra tài khoản Admin mặc định / qua ENV
    if (cleanEmail === adminEmail.toLowerCase() && password === adminPassword) {
      const token = await generateJWT({
        userId: 'admin-master',
        email: cleanEmail,
        role: 'ADMIN',
      });

      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: { email: cleanEmail, role: 'ADMIN' },
      });

      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // 2. Nếu có Supabase users table
    if (isSupabaseConfigured) {
      try {
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', cleanEmail)
          .single();

        if (!error && user && user.password) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            const token = await generateJWT({
              userId: user.id,
              email: user.email,
              role: user.role || 'ADMIN',
            });

            const response = NextResponse.json({
              success: true,
              message: 'Đăng nhập thành công',
              user: { email: user.email, role: user.role },
            });

            response.cookies.set({
              name: 'admin_token',
              value: token,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 7 * 24 * 60 * 60,
            });

            return response;
          }
        }
      } catch (err) {
        console.warn('Không thể truy vấn users từ Supabase:', err);
      }
    }

    return NextResponse.json(
      { error: 'Email hoặc mật khẩu không chính xác.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
