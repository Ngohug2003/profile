# PHASE 3: Docker Hóa Database Local (PostgreSQL, Migration, Seed Data)

Tài liệu này hướng dẫn thiết lập cơ sở dữ liệu PostgreSQL 16 trong Docker cho môi trường lập trình Local, chạy migration tạo bảng đầu tiên và nạp dữ liệu mẫu ban đầu bằng Prisma Seed.

---

## 1. Mục Tiêu
- Tạo file `docker-compose.local.yml` để chạy PostgreSQL 16 Alpine cô lập trên máy lập trình viên.
- Khởi tạo migration đầu tiên (`prisma migrate dev --name init`) sinh cấu trúc bảng `projects` trong cơ sở dữ liệu.
- Viết script `prisma/seed.ts` để nạp sẵn 2-3 dự án mẫu giúp kiểm tra giao diện ngay lập tức.
- Làm quen với việc quản lý dữ liệu trực quan bằng Prisma Studio.

---

## 2. File Cần Tạo / Sửa
1. `docker-compose.local.yml` — Định nghĩa container PostgreSQL và volume lưu trữ local.
2. `prisma/seed.ts` — Script tạo dữ liệu mẫu với TypeScript.
3. `package.json` — Bổ sung khai báo cấu hình seed của Prisma và gói `tsx` để thực thi TypeScript.
4. `.env.local` — Cấu hình chuỗi kết nối tới container Postgres local.

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `docker-compose.local.yml`
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: portfolio_postgres_local
    restart: unless-stopped
    environment:
      POSTGRES_USER: portfolio_user
      POSTGRES_PASSWORD: portfolio_password
      POSTGRES_DB: portfolio_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_local_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio_user -d portfolio_db"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_local_data:
    name: portfolio_postgres_local_data
```

### 3.2. `.env.local`
```env
# Kết nối tới container PostgreSQL chạy trên cổng 5432 của máy host
DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5432/portfolio_db?schema=public"

# Mật khẩu quản trị local
ADMIN_PASSWORD="local_admin_password_123"

# Session secret local
SESSION_SECRET="local_very_secret_key_random_1234567890"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3.3. `prisma/seed.ts`
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Bắt đầu nạp dữ liệu mẫu (Seed Data) ---');

  // Xóa dữ liệu cũ nếu muốn làm sạch môi trường test (chỉ dùng ở local)
  await prisma.project.deleteMany({});

  const sampleProjects = [
    {
      name: 'E-Commerce Microservices Platform',
      description: 'Hệ thống thương mại điện tử kiến trúc Microservices chịu tải cao, tích hợp cổng thanh toán trực tuyến và hệ thống thông báo realtime.',
      techStack: ['Next.js 15', 'NestJS', 'PostgreSQL', 'Docker', 'Redis', 'TailwindCSS'],
      imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
      domain: 'https://ecommerce.example.com',
    },
    {
      name: 'DevOps Automated Deployment Pipeline',
      description: 'Hạ tầng triển khai CI/CD hoàn toàn tự động từ GitHub Actions tới VPS Ubuntu với Docker Swarm, Nginx SSL và giám sát Prometheus.',
      techStack: ['GitHub Actions', 'Docker', 'Ubuntu 24.04', 'Nginx', 'Bash Scripting'],
      imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
      domain: 'https://devops.example.com',
    },
    {
      name: 'Realtime Chat & Task Collaboration',
      description: 'Ứng dụng quản lý công việc nhóm kết hợp trò chuyện thời gian thực, đồng bộ dữ liệu tức thì giữa các thiết bị.',
      techStack: ['React', 'TypeScript', 'Socket.io', 'Node.js', 'PostgreSQL'],
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      domain: null, // Trường hợp không có domain demo
    },
  ];

  for (const item of sampleProjects) {
    const p = await prisma.project.create({
      data: item,
    });
    console.log(`Đã tạo dự án mẫu: ${p.name} (ID: ${p.id})`);
  }

  console.log('--- Nạp dữ liệu mẫu hoàn tất thành công! ---');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 3.4. Cấu hình `package.json` bổ sung
Thêm đoạn cấu hình sau vào `package.json`:
```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

---

## 4. Command Chính Xác Để Chạy

### 4.1. Cài đặt công cụ chạy TypeScript cho script (`tsx`)
```bash
npm install -D tsx
```

### 4.2. Khởi động PostgreSQL Container Local
```bash
# Bật container postgres ở chế độ background
docker compose -f docker-compose.local.yml up -d
```

### 4.3. Kiểm tra Container đã Healthy chưa
```bash
docker ps --filter "name=portfolio_postgres_local"
```

### 4.4. Chạy Migration tạo bảng Database
```bash
npx prisma migrate dev --name init
```

### 4.5. Chạy Seed nạp dữ liệu mẫu
```bash
npx prisma db seed
```

### 4.6. Mở Prisma Studio để xem dữ liệu bảng
```bash
npx prisma studio
```

---

## 5. Kết Quả Mong Đợi
- Output của lệnh `docker ps` hiển thị `portfolio_postgres_local` ở trạng thái `Up (healthy)`.
- Lệnh `prisma migrate dev` thông báo: `Your database is now in sync with your schema.` và sinh ra thư mục `prisma/migrations/<timestamp>_init/migration.sql`.
- Lệnh `prisma db seed` in ra 3 dòng xác nhận đã tạo 3 project mẫu.
- Prisma Studio mở tại địa chỉ `http://localhost:5555`, hiển thị bảng `projects` chứa 3 dòng dữ liệu với đầy đủ các trường `id` (UUID), `name`, `techStack`, `imageUrl`.

---

## 6. Cách Kiểm Tra
1. Dùng lệnh `docker exec` truy vấn trực tiếp trong Postgres:
   ```bash
   docker exec -it portfolio_postgres_local psql -U portfolio_user -d portfolio_db -c "SELECT id, name, array_to_string(tech_stack, ', ') FROM projects;"
   ```
2. Chạy ứng dụng Next.js ở dev mode:
   ```bash
   npm run dev
   ```
   Truy cập `http://localhost:3000` trên trình duyệt: 3 thẻ card project cùng các badge công nghệ và ảnh cover phải hiển thị hoàn hảo.

---

## 7. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `Bind for 0.0.0.0:5432 failed: port is already allocated` | Có service Postgres hoặc app khác đang chạy trên cổng 5432 của máy thật | Sửa cổng map trong `docker-compose.local.yml` thành `"5433:5432"`, đồng thời sửa port trong `.env.local` thành `5433`. |
| `P1001: Can't reach database server at localhost:5432` | Container postgres chưa kịp sẵn sàng hoặc đang bị stop | Kiểm tra trạng thái bằng `docker logs portfolio_postgres_local`. Chờ vài giây để container đạt trạng thái `healthy`. |
| Lỗi `Unknown type "tsx"` khi chạy `prisma db seed` | Chưa cài đặt gói `tsx` | Chạy lệnh `npm install -D tsx`. |
| Dữ liệu bị mất sau khi tắt máy | Dùng `docker compose down -v` vô tình xóa named volume | **CẢNH BÁO QUAN TRỌNG:** Chỉ dùng `docker compose down`, tuyệt đối không thêm cờ `-v` (volume) để bảo vệ dữ liệu database. |
