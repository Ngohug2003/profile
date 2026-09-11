# Personal Portfolio & Client Showcase

Trang Portfolio cá nhân kết hợp hệ thống giới thiệu sản phẩm kỹ thuật và thu hút khách hàng tiềm năng (Leads Generation) của **Ngọ Viết Hưng (Hưng Dev)**.

Ứng dụng được tối ưu hóa kiến trúc hiện đại:
- **Backend & Database:** **Supabase Cloud (BaaS)** - PostgreSQL tốc độ cao (<15ms từ Singapore), Storage CDN toàn cầu cho hình ảnh dự án, và bảo mật Row Level Security (RLS).
- **Hosting Production:** **VPS Ubuntu 24.04** ($3-$5/mo) - Chỉ chạy 01 container Next.js siêu nhẹ (<100MB RAM) kết hợp Nginx Reverse Proxy + SSL tự động.

---

## ⚡ Kiến Trúc Công Nghệ (Tech Stack)

- **Frontend & Full-Stack:** Next.js (App Router, Server Components), React 19, TypeScript.
- **Giao Diện & Chuyển Động:** Tailwind CSS v4, Motion (Framer Motion), Embla Carousel, Lucide Icons.
- **Cơ Sở Dữ Liệu & API:** Supabase Cloud PostgreSQL, PostgREST (<15ms), Row Level Security (RLS).
- **Lưu Trữ Tệp Tin:** Supabase Storage (Bucket `project-covers` tích hợp CDN & tối ưu ảnh).
- **CI/CD & Đóng Gói:** GitHub Actions, GitHub Container Registry (GHCR), Docker Standalone đa tầng.
- **Hạ Tầng Production:** VPS Ubuntu 24.04, Nginx Reverse Proxy, Let's Encrypt SSL.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local Dev)

### 1. Yêu cầu môi trường
- **Node.js**: >= 20.x
- **Git**
- Tài khoản [Supabase.com](https://supabase.com) (hoàn toàn miễn phí)

### 2. Các bước cài đặt nhanh

**Bước 1: Clone mã nguồn và cài đặt dependencies**
```bash
git clone git@github.com:Ngohug2003/profile.git
cd profile
npm install
```

**Bước 2: Cấu hình Supabase Cloud**
1. Đăng nhập [Supabase Dashboard](https://supabase.com/dashboard) và tạo project mới (khuyên chọn Region **Singapore (ap-southeast-1)** để có độ trễ thấp nhất cho người dùng Việt Nam).
2. Vào mục **SQL Editor** trên thanh menu trái.
3. Mở file [`supabase/schema.sql`](supabase/schema.sql) trong project này, sao chép toàn bộ nội dung và dán vào SQL Editor -> Bấm **Run**.
   - *Script sẽ tự động tạo bảng `projects`, bảng `contacts`, bảng `users`, cấu hình Storage bucket `project-covers` và nạp sẵn 4 dự án mẫu chất lượng cao.*
4. Vào mục **Project Settings -> API** để lấy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (dùng phía server)

**Bước 3: Thiết lập biến môi trường**
Tạo file `.env` từ file mẫu:
```bash
cp .env.example .env
```
*(Trên Windows PowerShell: `Copy-Item .env.example .env`)*

Mở file `.env` và điền thông tin Supabase của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

JWT_SECRET="your_custom_jwt_secret_at_least_32_chars"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
```

**Bước 4: Khởi chạy môi trường phát triển**
```bash
npm run dev
```

Mở trình duyệt truy cập: **http://localhost:3000**

---

## 🛡️ Trang Quản Trị (Admin Dashboard)

- **Đường dẫn:** `http://localhost:3000/admin`
- **Email quản trị mặc định:** `ngoviethung0911@gmail.com`
- **Mật khẩu mặc định:** `Anhhung999@`
- **Tính năng nổi bật:**
  - Quản lý danh mục dự án (Thêm, Xóa, Xem danh sách).
  - Tải ảnh bìa trực tiếp lên **Supabase Storage CDN** (không tốn dung lượng ổ cứng máy chủ).
  - Tiếp nhận và xử lý danh sách yêu cầu tư vấn (Leads) gửi từ khách hàng.

---

## 📚 Tài Liệu Triển Khai VPS & CI/CD

Toàn bộ quy trình triển khai lên VPS từ Phase 6 đến Phase 12 được ghi chép chi tiết trong thư mục `docs/`:
- [Tổng quan kiến trúc triển khai VPS](docs/deployment-guide.md)
- [Phase 06: Thiết lập GitHub Repository & CI](docs/phase-06-github-setup.md)
- [Phase 07: Chuẩn bị máy chủ VPS Ubuntu 24.04 (Docker & UFW)](docs/vps-deployment/phase-07-vps-setup.md)
- [Phase 08: Thiết lập CI/CD tự động qua GHCR & Deploy Key](docs/vps-deployment/phase-08-cicd-ghcr.md)
- [Phase 09: Cấu hình Nginx Reverse Proxy](docs/vps-deployment/phase-09-nginx-domain.md)
- [Phase 10: Kích hoạt SSL HTTPS tự động với Certbot](docs/vps-deployment/phase-10-https-certbot.md)
- [Phase 11: Kiểm tra sức khỏe & Vận hành Production](docs/vps-deployment/phase-11-prod-migration-health.md)
- [Phase 12: Sao lưu & Tăng cường bảo mật VPS](docs/vps-deployment/phase-12-backup-security.md)
