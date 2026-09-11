import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET: Lấy danh sách toàn bộ project (Public)
export async function GET() {
  try {
    const projects = await Promise.race([
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 1500)
      ),
    ]);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Không thể truy vấn danh sách project từ database.' },
      { status: 500 }
    );
  }
}

// POST: Tạo project mới (Admin Only)
export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quyền admin.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, category, description, techStack, features, imageUrl, domain } = body;

    if (!name || !description || !techStack || !imageUrl) {
      return NextResponse.json(
        { error: 'Thiếu các trường thông tin bắt buộc (name, description, techStack, imageUrl).' },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
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

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Lỗi khi tạo mới project.' }, { status: 500 });
  }
}
