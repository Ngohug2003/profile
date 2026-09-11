import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH: Cập nhật trạng thái liên hệ (Admin Only)
export async function PATCH(request: Request, context: RouteContext) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quyền admin.' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Thiếu trạng thái cập nhật.' }, { status: 400 });
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating contact status:', error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật trạng thái liên hệ.' }, { status: 500 });
  }
}

// DELETE: Xóa yêu cầu liên hệ (Admin Only)
export async function DELETE(_request: Request, context: RouteContext) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quyền admin.' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa liên hệ thành công.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa liên hệ.' }, { status: 500 });
  }
}
