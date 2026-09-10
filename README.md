# 🚀 Hưng Dev Studio — Personal Portfolio & Showcase Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)
[![CI Quality Gate](https://img.shields.io/badge/CI%20Gate-Passing-emerald?style=flat-square&logo=githubactions)](https://github.com/Ngohug2003/profile/actions)

Trang Portfolio cá nhân và nền tảng dịch vụ thiết kế Website / Landing Page chuyên nghiệp của **Ngọ Viết Hưng**. Dự án được xây dựng với ngôn ngữ thiết kế tối giản cao cấp (Apple Aesthetic), tối ưu hóa tốc độ tải trang vượt trội, chuẩn SEO On-page và tích hợp bảng quản trị nội bộ độc lập.

---

## 🌟 Tính Năng Nổi Bật

- **🎨 Giao Diện Đẳng Cấp & Tối Giản:** Tông màu Parchment / White tinh tế, hiệu ứng Micro-animations mượt mà, tối ưu 100% hiển thị trên mọi thiết bị di động.
- **⚡ Tốc Độ & Chuẩn SEO:** Xây dựng trên Next.js App Router (Server-side Rendering & Standalone Build), cam kết điểm số PageSpeed xanh tối đa, đầy đủ cấu trúc OpenGraph, Meta Tags, Semantic HTML.
- **🛡️ Trang Quản Trị Độc Lập (`/admin`):**
  - Xác thực an toàn bằng cơ chế Cookie Session mã hóa HMAC SHA-256 (`admin_session`), không lưu mật khẩu trần.
  - Quản lý danh sách dự án (Thêm, Xóa, Xem trực quan).
  - Tải lên ảnh bìa dự án (`/api/upload`) và lưu trữ bền vững qua Docker Named Volume.
- **🐳 Container Hóa Đa Tầng (Multi-Stage Docker):** Image đóng gói standalone siêu nhẹ (~95MB), vận hành bằng user không đặc quyền (`nextjs:nodejs`, UID 1001) bảo mật cao.
- **🔄 CI Quality Gate Tự Động:** Pipeline GitHub Actions kiểm tra toàn diện Lint, TypeScript Typecheck, Next.js Build và Dockerfile trước khi cho phép Merge vào nhánh `main`.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, Lucide Icons |
| **Backend & API** | Next.js App Router Route Handlers, Node.js 20 |
| **Cơ sở dữ liệu & ORM** | PostgreSQL 16 (Docker Alpine), Prisma ORM 6.x |
| **Bảo mật & Phiên** | Cookie HttpOnly, HMAC SHA-256, Dynamic Route Caching |
| **DevOps & Môi trường** | Docker, Docker Compose, GitHub Actions CI/CD |

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Local

### 1. Yêu Cầu Tiên Quyết (Prerequisites)
Đảm bảo máy tính của bạn đã cài đặt:
- **Node.js**: Phiên bản `>= 20.x`
- **npm**: Phiên bản `>= 10.x`
- **Docker Desktop**: Đang ở trạng thái hoạt động (Running)
- **Git**

---

### 2. Các Bước Cài Đặt Chi Tiết

#### **Bước 1: Clone Repository về máy**
```bash
git clone git@github.com:Ngohug2003/profile.git
cd profile
```

#### **Bước 2: Cài đặt thư viện (Dependencies)**
```bash
npm install
```

#### **Bước 3: Thiết lập biến môi trường**
Sao chép file cấu hình mẫu:
```bash
# Trên Windows PowerShell:
Copy-Item .env.example .env

# Hoặc trên Linux/MacOS:
cp .env.example .env
```
*(Nội dung file `.env` mặc định đã cấu hình sẵn cổng 5432 cho database cục bộ).*

#### **Bước 4: Khởi động Database PostgreSQL qua Docker**
```bash
docker compose -f docker-compose.local.yml up -d
```
> Database PostgreSQL 16 sẽ được khởi tạo tại cổng `5432` với user `portfolio_user` và cơ sở dữ liệu `portfolio_db`.

#### **Bước 5: Áp dụng Migration & Nạp dữ liệu mẫu ban đầu**
```bash
# Sinh mã Prisma Client (hỗ trợ cả Windows và Alpine Linux)
npx prisma generate

# Tạo cấu trúc bảng
npx prisma migrate dev --name init

# Nạp dữ liệu mẫu (3 dự án khởi tạo)
npx prisma db seed
```

#### **Bước 6: Khởi chạy Development Server**
```bash
npm run dev
```
🎉 Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Các Đường Dẫn Quan Trọng Khi Chạy Local

| Đường dẫn | Mục đích | Thông tin đăng nhập |
| :--- | :--- | :--- |
| **`http://localhost:3000`** | Trang chủ Portfolio giới thiệu | Không yêu cầu |
| **`http://localhost:3000/admin/login`** | Đăng nhập trang Quản trị Admin | Mật khẩu: `admin123_local_dev` |
| **`http://localhost:3000/admin`** | Bảng điều khiển quản lý dự án | Yêu cầu đăng nhập |
| **`http://localhost:3000/api/health`** | Giám sát trạng thái app & database | Không yêu cầu |
| **`http://localhost:5555`** | Giao diện Prisma Studio trực quan | Mở bằng lệnh `npx prisma studio` |

---

## 🧪 Chạy Thử Nghiệm Bản Đóng Gói Docker Production Tại Local

Nếu bạn muốn kiểm tra thử nghiệm toàn bộ hệ thống dưới dạng container khép kín (giống hệt môi trường máy chủ thật):

```bash
# 1. Khởi động full-stack Production Local (DB cổng 5433, App cổng 3001)
docker compose -f docker-compose.prod.local.yml up -d

# 2. Áp dụng schema lên DB Production Local
$env:DATABASE_URL="postgresql://portfolio_prod_user:portfolio_prod_secure_password@localhost:5433/portfolio_prod_db?schema=public"; npx prisma migrate deploy
```

- **Website Production Local:** **[http://localhost:3001](http://localhost:3001)**
- **Admin Production Local:** **[http://localhost:3001/admin/login](http://localhost:3001/admin/login)** *(Mật khẩu: `prod_admin_password_987`)*
- Dữ liệu ảnh tải lên ở cổng này được lưu trữ độc lập trong Named Volume `portfolio_uploads_prod_local`, không bị mất khi container bị restart hoặc xóa đi tạo lại.

---

## 🚦 Quy Trình Phát Triển & Đóng Góp (CI/CD Workflow)

Dự án áp dụng quy chuẩn **Pull Request Gate** với GitHub Actions:

```text
[Tạo nhánh feature/...] ──> [Sửa code & Push] ──> [CI tự động kiểm tra]
                                                          │
                                                    (Phải XANH 100%)
                                                          ▼
                                               [Mở PR vào main]
                                                          │
                                               [Merge & CI check lần 2]
```

Trước khi đẩy code, bạn có thể tự kiểm tra nhanh tại local:
```bash
# Kiểm tra chuẩn mã nguồn
npx eslint app components lib

# Kiểm tra kiểu dữ liệu tĩnh TypeScript
npx tsc --noEmit

# Kiểm tra build thành phẩm
npm run build
```

---

## 📚 Tài Liệu Kỹ Thuật Chi Tiết

Toàn bộ tài liệu kiến trúc, đặc tả dữ liệu và quy trình triển khai máy chủ được lưu trữ trong thư mục [`docs/`](./docs/):

- 📖 **[`docs/deployment-guide.md`](./docs/deployment-guide.md):** Sổ tay kiến trúc mục tiêu, 10 nguyên tắc bất biến và lộ trình tổng thể.
- 📐 **[`docs/phase-01-spec.md`](./docs/phase-01-spec.md):** Đặc tả kỹ thuật, Schema Prisma & cơ chế Admin Session.
- 💻 **[`docs/phase-02-scaffold-local.md`](./docs/phase-02-scaffold-local.md):** Cấu trúc mã nguồn Next.js & API CRUD.
- 🗄️ **[`docs/phase-03-docker-db-local.md`](./docs/phase-03-docker-db-local.md):** Thiết lập cơ sở dữ liệu Docker PostgreSQL cục bộ.
- 📦 **[`docs/phase-04-dockerize-nextjs.md`](./docs/phase-04-dockerize-nextjs.md):** Tối ưu hóa Dockerfile Standalone.
- 🔬 **[`docs/phase-05-test-prod-local.md`](./docs/phase-05-test-prod-local.md):** Kiểm thử Production Local & Named Volume.
- 🛡️ **[`docs/phase-06-github-setup.md`](./docs/phase-06-github-setup.md):** Cấu hình GitHub Actions CI & Branch Protection Rules.
- 🚀 **[`docs/vps-deployment/`](./docs/vps-deployment/):** Thư mục lưu trữ tài liệu triển khai VPS Ubuntu 24.04, Nginx, HTTPS Certbot và Backup định kỳ.

---

## 👤 Tác Giả & Bản Quyền

- **Tác giả:** Ngọ Viết Hưng (Hung Dev Studio)
- **Website:** [hungdev.studio](https://hungdev.studio)
- **Giấy phép:** Dự án cá nhân phục vụ Portfolio & Khách hàng.
