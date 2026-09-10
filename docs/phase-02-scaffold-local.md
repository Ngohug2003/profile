# PHASE 2: Scaffold Code Local (Next.js 15, TypeScript, Prisma, API & UI)

Tài liệu này hướng dẫn khởi tạo dự án Next.js 15 App Router với TypeScript, cấu hình Prisma ORM, xây dựng toàn bộ mã nguồn API CRUD, xử lý upload ảnh, trang chủ hiển thị dự án và trang quản trị `/admin`.

---

## 1. Mục Tiêu
- Khởi tạo khung dự án Next.js 15 (TypeScript, App Router, ESLint).
- Cài đặt và cấu hình thư viện Prisma, Prisma Client.
- Xây dựng module kết nối cơ sở dữ liệu `lib/prisma.ts` theo cơ chế Singleton để tránh cạn kiệt connection pool trong môi trường dev Next.js HMR.
- Xây dựng module xác thực Cookie Session an toàn `lib/auth.ts`.
- Hoàn thiện các API Route:
  - `POST /api/auth/login`, `POST /api/auth/logout`
  - `GET`, `POST /api/projects`
  - `GET`, `PUT`, `DELETE /api/projects/[id]`
  - `POST /api/upload` (lưu trữ ảnh)
- Xây dựng giao diện trang chủ `app/page.tsx` và trang quản trị `app/admin/page.tsx`.

---

## 2. File Cần Tạo / Sửa
1. `package.json` — Danh sách dependencies và scripts.
2. `lib/prisma.ts` — Prisma client singleton.
3. `lib/auth.ts` — Cookie session validator và generator.
4. `app/api/auth/login/route.ts` — API đăng nhập admin.
5. `app/api/auth/logout/route.ts` — API đăng xuất admin.
6. `app/api/projects/route.ts` — API lấy danh sách và tạo mới project.
7. `app/api/projects/[id]/route.ts` — API lấy chi tiết, sửa và xóa project.
8. `app/api/upload/route.ts` — API tiếp nhận Multipart Form Data và lưu vào disk/volume.
9. `app/page.tsx` — Giao diện công khai giới thiệu các project.
10. `app/admin/login/page.tsx` — Giao diện nhập mật khẩu quản trị.
11. `app/admin/page.tsx` — Giao diện bảng điều khiển thêm/sửa/xóa project.

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `lib/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client';

// Khai báo global để tránh tạo nhiều connection pool khi Next.js Fast Refresh chạy ở dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### 3.2. `lib/auth.ts`
```typescript
import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';

// Tạo hash token từ mật khẩu và secret
export function generateSessionToken(): string {
  const secret = process.env.SESSION_SECRET || 'default_secret_key_32_chars_long!';
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`admin:${timestamp}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

// Kiểm tra tính hợp lệ của token
export function verifySessionToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const secret = process.env.SESSION_SECRET || 'default_secret_key_32_chars_long!';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`admin:${timestamp}`)
    .digest('hex');

  // So sánh constant time để chống timing attacks
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );

  if (!isMatch) return false;

  // Thời hạn session: 7 ngày (tính theo ms)
  const sessionAge = Date.now() - parseInt(timestamp, 10);
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  return sessionAge < maxAge;
}

// Hàm xác thực request có quyền admin hay không
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return false;
  }
  return verifySessionToken(sessionCookie.value);
}
```

### 3.3. `app/api/auth/login/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { generateSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: 'Chưa cấu hình biến môi trường ADMIN_PASSWORD trên server.' },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Mật khẩu quản trị không chính xác.' },
        { status: 401 }
      );
    }

    const token = generateSessionToken();
    const response = NextResponse.json({ success: true, message: 'Đăng nhập thành công' });

    response.cookies.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
```

### 3.4. `app/api/auth/logout/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Đã đăng xuất.' });
  response.cookies.set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
```

### 3.5. `app/api/projects/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET: Lấy danh sách toàn bộ project (công khai)
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Không thể truy vấn danh sách project từ database.' },
      { status: 500 }
    );
  }
}

// POST: Tạo project mới (yêu cầu quyền admin)
export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quản trị.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, techStack, imageUrl, domain } = body;

    if (!name || !description || !techStack || !imageUrl) {
      return NextResponse.json(
        { error: 'Thiếu các trường thông tin bắt buộc (name, description, techStack, imageUrl).' },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        techStack: Array.isArray(techStack) ? techStack : [techStack],
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
```

### 3.6. `app/api/projects/[id]/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET: Xem chi tiết 1 project
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
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn project.' }, { status: 500 });
  }
}

// PUT: Cập nhật thông tin project (Admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quản trị.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const { name, description, techStack, imageUrl, domain } = body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        techStack: Array.isArray(techStack) ? techStack : [techStack],
        imageUrl,
        domain: domain || null,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật project.' }, { status: 500 });
  }
}

// DELETE: Xóa project (Admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quản trị.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Đã xóa project.' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi xóa project.' }, { status: 500 });
  }
}
```

### 3.7. `app/api/upload/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập quản trị.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file tải lên.' }, { status: 400 });
    }

    // Kiểm tra định dạng ảnh cho phép
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Định dạng file không được hỗ trợ. Chỉ nhận JPG, PNG, WEBP, GIF.' },
        { status: 400 }
      );
    }

    // Giới hạn dung lượng tối đa 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dung lượng file vượt quá 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file ngẫu nhiên an toàn tránh trùng lặp
    const extension = path.extname(file.name) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${extension}`;

    // Thư mục lưu trữ ảnh: public/uploads (local) hoặc mount volume (production)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Không thể xử lý lưu file ảnh.' }, { status: 500 });
  }
}
```

### 3.8. `app/page.tsx` (Trang chủ Public)
```tsx
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Could not fetch projects in homepage:', error);
  }

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Personal Portfolio</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Tuyển tập các sản phẩm công nghệ và dự án kỹ thuật đã xây dựng.
        </p>
      </header>

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
          <p>Chưa có dự án nào được thêm. Hãy đăng nhập /admin để cập nhật.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {projects.map((project) => (
            <article
              key={project.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '200px', background: '#f3f4f6' }}>
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.name}</h2>
                <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1, marginBottom: '1rem' }}>
                  {project.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {project.techStack.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#e0e7ff',
                        color: '#3730a3',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.domain && (
                  <a
                    href={project.domain}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      textAlign: 'center',
                      background: '#111827',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      padding: '0.6rem 1rem',
                      borderRadius: '6px',
                    }}
                  >
                    Truy cập dự án &rarr;
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
```

### 3.9. `app/admin/login/page.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Đăng nhập thất bại.');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError('Lỗi kết nối tới máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form
        onSubmit={handleLogin}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
          Đăng Nhập Quản Trị
        </h2>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            Mật khẩu Admin:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Nhập mật khẩu quản trị..."
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
        </button>
      </form>
    </div>
  );
}
```

### 3.10. `app/admin/page.tsx` (Bảng điều khiển Admin CRUD)
```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [domain, setDomain] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const router = useRouter();

  const loadProjects = async () => {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Vui lòng chọn ảnh đại diện cho project.');
      return;
    }

    setLoading(true);
    setStatusMsg('Đang upload ảnh bìa...');

    try {
      // 1. Upload ảnh
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Upload ảnh thất bại.');
      }
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      // 2. Tạo record project
      setStatusMsg('Đang tạo bản ghi project...');
      const stackArray = techStackInput.split(',').map((s) => s.trim()).filter(Boolean);

      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          techStack: stackArray,
          imageUrl,
          domain: domain || null,
        }),
      });

      if (projectRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!projectRes.ok) {
        throw new Error('Không thể tạo project.');
      }

      // Reset form
      setName('');
      setDescription('');
      setTechStackInput('');
      setDomain('');
      setFile(null);
      setStatusMsg('Tạo project thành công!');
      await loadProjects();
    } catch (err: any) {
      alert(err.message || 'Lỗi thao tác.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa project này?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    await loadProjects();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Quản Trị Dự Án (Admin Dashboard)</h1>
        <button
          onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Đăng Xuất
        </button>
      </div>

      <section style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Thêm Dự Án Mới</h2>
        {statusMsg && <p style={{ color: '#2563eb', fontWeight: 600 }}>{statusMsg}</p>}
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Tên Project:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Mô Tả:</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Tech Stack (ngăn cách bởi dấu phẩy):</label>
            <input
              type="text"
              required
              placeholder="Next.js, TypeScript, PostgreSQL, Docker"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Link Demo / Domain (Tùy chọn):</label>
            <input
              type="url"
              placeholder="https://myproject.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Ảnh Cover (JPG, PNG, WEBP):</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Đang Xử Lý...' : 'Lưu Dự Án'}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Danh Sách Project Hiện Tại</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Ảnh</th>
              <th style={{ padding: '0.75rem' }}>Tên</th>
              <th style={{ padding: '0.75rem' }}>Tech Stack</th>
              <th style={{ padding: '0.75rem' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem' }}>
                  <img src={p.imageUrl} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{p.techStack.join(', ')}</td>
                <td style={{ padding: '0.75rem' }}>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ padding: '0.3rem 0.6rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
```

---

## 4. Command Chính Xác Để Chạy

### 4.1. Khởi tạo dự án Next.js 15
```bash
# Khởi tạo Next.js với TypeScript, ESLint, App Router (chạy tại thư mục root)
npx create-next-app@latest . --typescript --eslint --app --src-dir=false --import-alias="@/*" --use-npm --no-tailwind
```

### 4.2. Cài đặt Prisma ORM và Prisma Client
```bash
npm install @prisma/client
npm install -D prisma
```

### 4.3. Khởi tạo Prisma Schema
```bash
npx prisma init
```

---

## 5. Kết Quả Mong Đợi
- Toàn bộ dependencies được cài đặt chuẩn xác trong `package.json`.
- Cấu trúc thư mục `app/` chứa đầy đủ mã nguồn API CRUD, Upload, Login và các trang `page.tsx`.
- Lệnh `npx prisma generate` có thể chạy thành công sinh ra các types an toàn cho TypeScript.

---

## 6. Cách Kiểm Tra
1. Kiểm tra build types TypeScript:
   ```bash
   npx tsc --noEmit
   ```
2. Khởi động môi trường dev local để kiểm tra biên dịch:
   ```bash
   npm run dev
   ```
3. Truy cập trình duyệt tại `http://localhost:3000` (Trang chủ) và `http://localhost:3000/admin/login`.

---

## 7. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `PrismaClientInitializationError: Can't reach database server` | Chưa chạy database container ở Phase 3 | Đây là hiện tượng bình thường khi chưa bật Postgres Docker. Tiếp tục sang Phase 3 để khởi động database. |
| `params should be awaited before using its properties` trong Next.js 15 | Next.js 15 quy định `params` trong Dynamic Route là một Promise | Bắt buộc dùng `const { id } = await params;` như code mẫu ở trên. |
| Lỗi permission khi ghi file trong `/api/upload` | User hệ điều hành không có quyền ghi vào thư mục `public/uploads` | Tạo trước thư mục `mkdir -p public/uploads` và cấp quyền ghi. |
