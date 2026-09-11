import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET: Lấy danh sách yêu cầu tư vấn / liên hệ (Admin Only - JWT Auth)
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quyền admin.' }, { status: 401 });
  }

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Không thể truy vấn danh sách liên hệ từ database.' },
      { status: 500 }
    );
  }
}

// POST: Gửi thông tin từ form liên hệ hoặc modal tư vấn (Public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, service, message } = body;

    // Validate các trường bắt buộc
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập họ và tên.' },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập số điện thoại hoặc Zalo để liên hệ.' },
        { status: 400 }
      );
    }

    // Lưu thông tin vào bảng contacts trong PostgreSQL
    const newContact = await prisma.contact.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        service: service || 'Tư vấn landing page',
        message: message ? message.trim() : null,
        status: 'NEW',
      },
    });

    return NextResponse.json(
      { success: true, message: 'Đã lưu thông tin liên hệ thành công!', contact: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
