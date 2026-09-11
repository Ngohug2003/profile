import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, service, message } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (họ tên, số điện thoại).' },
        { status: 400 }
      );
    }

    // Gửi thông báo tới Telegram (chạy server-side, bảo mật tuyệt đối Bot Token)
    const sent = await sendTelegramNotification({
      fullName,
      phone,
      email,
      service,
      message,
    });

    return NextResponse.json({ success: true, notified: sent });
  } catch (error) {
    console.error('Lỗi khi gửi thông báo notify:', error);
    return NextResponse.json(
      { error: 'Không thể xử lý gửi thông báo.' },
      { status: 500 }
    );
  }
}
