import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET: Chi tiết 1 project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return NextResponse.json({ error: 'Không tìm thấy project.' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Lỗi truy vấn project.' }, { status: 500 });
  }
}

// PUT: Cập nhật project (Admin Only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quyền admin.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const { name, category, description, techStack, features, imageUrl, domain } = body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name,
        category: category || null,
        description,
        techStack: Array.isArray(techStack) ? techStack : [techStack],
        features: Array.isArray(features) ? features : (features ? [features] : []),
        imageUrl,
        domain: domain || null,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật project.' }, { status: 500 });
  }
}

// DELETE: Xóa project (Admin Only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quyền admin.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Đã xóa project.' });
  } catch {
    return NextResponse.json({ error: 'Lỗi khi xóa project.' }, { status: 500 });
  }
}
