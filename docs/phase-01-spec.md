# PHASE 1: Chốt Spec Kỹ Thuật, Schema Prisma, Thư Mục & Biến Môi Trường

Tài liệu này xác lập nền móng kỹ thuật chuẩn mực cho dự án Personal Portfolio trước khi tiến hành viết code ở Phase 2.

---

## 1. Mục Tiêu
- Định nghĩa chính xác Database Schema bằng Prisma ORM theo đúng yêu cầu bài toán.
- Thiết lập chuẩn cấu trúc thư mục ứng dụng Next.js 16.3.4 (App Router).
- Liệt kê và giải thích đầy đủ các biến môi trường cho các môi trường: Local Dev, Local Docker, và Production.
- Chốt cơ chế xác thực trang `/admin` (Cookie Session bảo vệ bằng `ADMIN_PASSWORD`).

---

## 2. File Cần Tạo / Sửa
1. `prisma/schema.prisma` — Định nghĩa cấu hình Prisma generator, datasource Postgres và model `Project`.
2. `.env.example` — Mẫu danh sách biến môi trường (cam kết commit lên Git làm mẫu).
3. `.env.local` — File biến môi trường chạy trực tiếp tại máy lập trình viên (không commit lên Git).

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `prisma/schema.prisma`
```prisma
// datasource định cấu hình kết nối PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// generator sinh mã Prisma Client cho TypeScript
generator client {
  provider = "prisma-client-js"
}

// Bảng lưu trữ thông tin dự án cá nhân (đồng bộ hoàn hảo với PortfolioSection của hungwebstudio.tech)
model Project {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @db.VarChar(255)
  category    String?  @db.VarChar(100) // E-Commerce, Landing Page, SaaS, Web App
  description String   @db.Text
  techStack   String[] // Mảng công nghệ text[] trong PostgreSQL
  features    String[] // Các điểm nổi bật text[] hiển thị trên card dự án
  imageUrl    String   @db.VarChar(500)
  domain      String?  @db.VarChar(500) // Link demo / production (có thể null)
  createdAt   DateTime @default(now()) @db.Timestamptz(6)
  updatedAt   DateTime @updatedAt @db.Timestamptz(6)

  @@map("projects")
}
```

### 3.2. `.env.example`
```env
# Database connection string (PostgreSQL)
# Cú pháp: postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=public
DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5432/portfolio_db?schema=public"

# Mật khẩu quản trị cho trang /admin
ADMIN_PASSWORD="super_secret_admin_password_change_me"

# Khóa bí mật dùng để ký/mã hóa Session Cookie (32+ ký tự ngẫu nhiên)
SESSION_SECRET="your_32_character_random_session_secret_key_here"

# Domain công khai của trang web (dùng cho metadata, OpenGraph, upload URL)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Cấu hình môi trường Node
NODE_ENV="development"
```

### 3.3. Cấu Trúc Thư Mục Dự Án (Nằm trực tiếp tại C:\profile)
```
C:\profile\ (Thư mục gốc dự án)
├── .github/
│   └── workflows/
│       └── deploy.yml                # CI/CD GitHub Actions
├── docs/                             # Tài liệu hướng dẫn 12 phase
├── prisma/
│   ├── schema.prisma                 # Định nghĩa Database Schema
│   ├── seed.ts                       # Script tạo dữ liệu mẫu ban đầu
│   └── migrations/                   # Thư mục lịch sử migration tự sinh
├── public/
│   ├── favicon.ico
│   └── uploads/                      # Local dev upload (Production mount named volume)
├── scripts/
│   ├── deploy.sh                     # Script triển khai tự động trên VPS
│   └── backup.sh                     # Script sao lưu database hàng ngày
├── src/ (hoặc app/ ở root, ta dùng app/ ở root theo Next.js 15)
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Form đăng nhập mật khẩu admin
│   │   │   └── page.tsx              # Dashboard CRUD project
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts    # Xử lý xác thực session
│   │   │   │   └── logout/route.ts   # Xóa cookie session
│   │   │   ├── health/
│   │   │   │   └── route.ts          # Health check endpoint cho Docker / Nginx
│   │   │   ├── projects/
│   │   │   │   ├── [id]/route.ts     # GET / PUT / DELETE chi tiết project
│   │   │   │   └── route.ts          # GET danh sách / POST tạo mới project
│   │   │   └── upload/
│   │   │       └── route.ts          # Nhận file ảnh và lưu vào volume /uploads
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Trang chủ danh sách project (Public)
│   │   └── globals.css               # Vanilla CSS styles & design tokens
│   ├── components/                   # Toàn bộ UI components từ giao diện mẫu hungwebstudio.tech
│   │   ├── Navbar.tsx                # Thanh menu điều hướng & CTA tư vấn
│   │   ├── HeroSection.tsx           # Hero banner & trust badges
│   │   ├── HeroMockup.tsx            # Mockup thiết bị / browser trực quan
│   │   ├── TrustCard.tsx             # Card cam kết (Responsive, SEO, Tốc độ)
│   │   ├── ProblemsSection.tsx       # Vấn đề thường gặp của khách hàng
│   │   ├── AboutSection.tsx          # Giới thiệu Hưng - Full-stack Developer
│   │   ├── ServicesSection.tsx       # Các gói dịch vụ thiết kế web
│   │   ├── WorkflowSection.tsx       # Quy trình làm việc 5 bước
│   │   ├── PortfolioSection.tsx      # Danh sách dự án (LOAD ĐỘNG TỪ POSTGRESQL QUA PRISMA)
│   │   ├── FaqSection.tsx            # Câu hỏi thường gặp accordion
│   │   ├── ContactSection.tsx        # Khối liên hệ chân trang
│   │   ├── ContactModal.tsx          # Popup form tư vấn nhanh
│   │   └── Footer.tsx                # Chân trang bản quyền
│   ├── constants/
│   │   └── content.ts                # Nội dung tĩnh website & SEO metadata
│   ├── types/
│   │   └── content.ts                # TypeScript interfaces cho UI
│   └── lib/
│       ├── auth.ts                   # Helper kiểm tra session cookie admin
│       └── prisma.ts                 # Prisma Client singleton kết nối PostgreSQL
├── .dockerignore
├── .env.example
├── .env.local (Không commit)
├── .gitignore
├── docker-compose.local.yml          # Chạy database Postgres local
├── docker-compose.prod.yml           # Chạy stack production trên VPS
├── Dockerfile                        # Multi-stage build standalone
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Cơ Chế Xác Thực Admin (Session Cookie)
- **Thiết kế:** Không dùng hệ thống tài khoản phức tạp, không cần bảng `User`. Chỉ có 1 admin duy nhất xác thực bằng mật khẩu cấu hình trong `ADMIN_PASSWORD`.
- **Cơ chế:**
  1. Người quản trị truy cập `/admin`, nếu chưa đăng nhập sẽ được redirect tới `/admin/login`.
  2. Người dùng nhập mật khẩu gửi lên `POST /api/auth/login`.
  3. API so sánh mật khẩu với biến `ADMIN_PASSWORD` (dùng thuật toán so sánh an toàn constant-time tránh timing attack).
  4. Nếu hợp lệ, server tạo một session token ký bằng `SESSION_SECRET` và gắn vào cookie `admin_session` với các cờ bảo mật: `HttpOnly=true`, `SameSite=Lax`, `Secure=true` (trên production), `Path=/`.
  5. Các API nhạy cảm (`POST`, `PUT`, `DELETE /api/projects`, `POST /api/upload`) kiểm tra cookie này ở middleware hoặc trong handler.

---

## 5. Command Chính Xác Để Chạy
Tạo file `.env.example` và kiểm tra tính toàn vẹn của thư mục:
```bash
# Tạo file .env.example từ nội dung trên
cat << 'EOF' > .env.example
DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5432/portfolio_db?schema=public"
ADMIN_PASSWORD="super_secret_admin_password_change_me"
SESSION_SECRET="your_32_character_random_session_secret_key_here"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
EOF
```

---

## 6. Kết Quả Mong Đợi
- File `.env.example` đã có mặt tại thư mục gốc.
- Mọi thành viên trong nhóm hoặc tài liệu triển khai đều nắm rõ cấu trúc database và cấu trúc cây thư mục của dự án.
- Không có bất kỳ secret thật nào bị lộ trong `.env.example`.

---

## 7. Cách Kiểm Tra
1. Đọc nội dung file `.env.example`:
   ```bash
   cat .env.example
   ```
2. Đảm bảo file `.env.local` nếu được tạo sau này đã nằm trong `.gitignore`:
   ```bash
   grep -E "^\.env" .gitignore
   ```

---

## 8. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| Lỡ commit file `.env` chứa mật khẩu thật lên Git | Chưa cấu hình `.gitignore` trước khi commit | 1. Xóa ngay file khỏi git cache: `git rm --cached .env`<br>2. Thêm `.env*` vào `.gitignore`<br>3. Đổi ngay toàn bộ mật khẩu (`ADMIN_PASSWORD`, `DATABASE_URL`) vì secret đã bị coi là lộ. |
| `String[]` không được hỗ trợ trong SQLite/MySQL | Prisma chỉ hỗ trợ native array type trên PostgreSQL | Đảm bảo datasource provider trong `schema.prisma` luôn là `postgresql`. |
| Cổng 5432 bị xung đột tại máy Local | Máy tính lập trình viên đã có một service PostgreSQL cài trực tiếp trên OS đang chiếm cổng 5432 | Đổi port ngoài của Docker Compose local sang `5433:5432` và cập nhật `DATABASE_URL` thành port 5433. |
