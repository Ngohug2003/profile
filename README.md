# Personal Portfolio

Trang portfolio cá nhân và giới thiệu các dự án, dịch vụ của **Ngọ Viết Hưng**. Dự án được xây dựng với Next.js App Router, Tailwind CSS, Prisma ORM và PostgreSQL.

## Tech Stack

- **Frontend & Backend:** Next.js, React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Database & ORM:** PostgreSQL 16, Prisma ORM
- **Containerization:** Docker, Docker Compose

---

## Hướng Dẫn Cài Đặt & Chạy Local

### 1. Yêu cầu môi trường
- **Node.js**: >= 20.x
- **Docker & Docker Compose** (Docker Desktop đang chạy)
- **Git**

### 2. Các bước cài đặt

**Bước 1: Clone mã nguồn và cài đặt dependencies**
```bash
git clone git@github.com:Ngohug2003/profile.git
cd profile
npm install
```

**Bước 2: Cấu hình biến môi trường**
Tạo file `.env` từ file mẫu:
```bash
cp .env.example .env
```
*(Trên Windows PowerShell có thể dùng: `Copy-Item .env.example .env`)*

**Bước 3: Khởi động Database PostgreSQL**
```bash
docker compose -f docker-compose.local.yml up -d
```

**Bước 4: Đồng bộ database & nạp dữ liệu mẫu**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

**Bước 5: Khởi chạy môi trường phát triển**
```bash
npm run dev
```

Mở trình duyệt truy cập: **http://localhost:3000**

---

## Quản Trị (Admin Dashboard)

- **Đường dẫn:** `http://localhost:3000/admin`
- **Mật khẩu đăng nhập local:** `admin123_local_dev`
- **Tính năng:** Quản lý danh sách dự án (Thêm, Xóa, Xem) và tải lên hình ảnh bìa.

---

## Các Lệnh Hữu Ích

- `npm run dev`: Chạy dev server tại cổng 3000.
- `npx prisma studio`: Mở giao diện xem và chỉnh sửa dữ liệu trực quan tại cổng 5555.
- `npm run build`: Build production kiểm tra lỗi compile.
- `docker compose -f docker-compose.local.yml down`: Dừng container database local.
