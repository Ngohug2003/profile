# PHASE 11: Production Database Migration & Endpoint Giám Sát /api/health

Tài liệu này hướng dẫn quy trình áp dụng Migration an toàn trên môi trường Production bằng lệnh `prisma migrate deploy`, nguyên tắc phòng ngừa lỗi Breaking Change khi thay đổi cấu trúc bảng, và xây dựng Endpoint `/api/health` giám sát sức khỏe toàn diện của ứng dụng và kết nối Cơ sở dữ liệu.

---

## 1. Mục Tiêu
- Nắm vững sự khác biệt sinh tử giữa `prisma migrate dev` (Local) và `prisma migrate deploy` (Production).
- Thực thi áp dụng các migration chưa chạy lên cơ sở dữ liệu PostgreSQL thật trên VPS một cách tự động và an toàn.
- Thiết lập quy trình ứng phó với các Migration có nguy cơ gây gián đoạn (Breaking Changes: đổi tên cột, xóa cột, thêm ràng buộc NOT NULL).
- Xây dựng API route `app/api/health/route.ts` thực hiện truy vấn `SELECT 1` xuống PostgreSQL để trả về mã `200 OK` chỉ khi cả Web Server và Database đều hoạt động ổn định.
- Tích hợp endpoint health check này vào Docker Compose để phục vụ cơ chế kiểm tra `condition: service_healthy` trước khi cutover container.

---

## 2. File Cần Tạo / Sửa
1. `app/api/health/route.ts` — API giám sát sức khỏe ứng dụng và kết nối DB.
2. `scripts/migrate-prod.sh` — Script an toàn để chạy migration trên VPS.

---

## 3. Quy Tắc Xử Lý Migration Trên Production

> [!CAUTION]
> **1. TUYỆT ĐỐI KHÔNG DÙNG `prisma migrate dev` TRÊN VPS:**
> - `prisma migrate dev` được thiết kế để tạo file migration mới và có khả năng tự động drop/reset database nếu phát hiện lịch sử migration bị lệch. Chạy lệnh này trên production có thể dẫn đến việc mất trắng toàn bộ dữ liệu dự án!
> - Trên Production, **CHỈ ĐƯỢC DÙNG `prisma migrate deploy`**. Lệnh này chỉ đọc các file migration đã có sẵn trong repo và áp dụng những migration chưa chạy, không bao giờ reset database.

> [!WARNING]
> **2. NGUYÊN TẮC EXPAND AND CONTRACT KHI CÓ BREAKING CHANGE:**
> - Trong khoảnh khắc deployment diễn ra (minimal-downtime), container phiên bản cũ vẫn đang phục vụ người dùng trong khi container phiên bản mới đang khởi động.
> - Nếu bạn xóa hoặc đổi tên một cột trong database ngay lập tức, container cũ sẽ gặp lỗi `Column does not exist` dẫn đến sập trang cho người dùng.
> - **Quy trình chuẩn khi đổi cột:**
>   - **Bước 1 (Expand):** Thêm cột mới dạng `NULLABLE` (hoặc có giá trị `DEFAULT`), giữ nguyên cột cũ. Deploy phiên bản code mới ghi dữ liệu vào cả 2 cột.
>   - **Bước 2 (Contract):** Sau khi phiên bản mới đã chạy ổn định 100%, tạo migration tiếp theo để xóa cột cũ.

---

## 4. Nội Dung File Hoàn Chỉnh

### 4.1. `app/api/health/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = -1;

  try {
    // Thực hiện truy vấn nhẹ nhất SELECT 1 để kiểm tra kết nối tới Postgres
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = 'healthy';
  } catch (error) {
    console.error('Healthcheck DB Ping Failed:', error);
    dbStatus = 'unhealthy';
  }

  const isHealthy = dbStatus === 'healthy';
  const totalDurationMs = Date.now() - startTime;

  const payload = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    responseTimeMs: totalDurationMs,
  };

  // Trả về HTTP 200 nếu khỏe mạnh, HTTP 503 nếu mất kết nối Database
  return NextResponse.json(payload, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
```

### 4.2. `scripts/migrate-prod.sh`
```bash
#!/usr/bin/env bash
set -e

echo "=== [PRISMA MIGRATION] Bắt đầu kiểm tra và áp dụng Migration ==="

# Chạy một container tạm thời chung mạng nội bộ Docker với Postgres để thực thi migration deploy
docker run --rm \
  --network portfolio_net \
  -v /home/deploy/portfolio/prisma:/app/prisma \
  --env-file /home/deploy/portfolio/.env.production \
  node:20-alpine \
  sh -c "npm install -g prisma && npx prisma migrate deploy --schema=/app/prisma/schema.prisma"

echo "=== [PRISMA MIGRATION] Hoàn thành áp dụng Migration an toàn! ==="
```

---

## 5. Command Chính Xác Để Chạy

### 5.1. Thực Thi Migration Trên VPS
Khi có migration mới cần chạy trên server:
```bash
ssh deploy@YOUR_VPS_IP
cd /home/deploy/portfolio
bash scripts/migrate-prod.sh
```

### 5.2. Tích Hợp Tự Động Vào Workflow GitHub Actions
Trong file `.github/workflows/deploy.yml` (hoặc trong `scripts/deploy.sh`), chạy migration ngay trước bước pull và reload ứng dụng:
```bash
# Trong scripts/deploy.sh, thêm dòng này trước khi up container app
bash scripts/migrate-prod.sh
docker compose -f docker-compose.prod.yml up -d app
```

---

## 6. Kết Quả Mong Đợi
- Lệnh `migrate-prod.sh` hiển thị:
  ```
  Prisma Migrate applied 1 migration.
  All migrations have been successfully applied.
  ```
- Gọi API health check trả về JSON trạng thái `healthy` kèm độ trễ kết nối database:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-09-10T14:30:00.000Z",
    "uptimeSeconds": 145,
    "database": {
      "status": "healthy",
      "latencyMs": 2
    },
    "responseTimeMs": 4
  }
  ```

---

## 7. Cách Kiểm Tra
1. **Kiểm tra endpoint /api/health từ bên ngoài:**
   ```bash
   curl -i https://yourdomain.com/api/health
   ```
   Kết quả: Trả về HTTP Status `200 OK`.

2. **Kiểm tra trạng thái Health Check trong Docker:**
   ```bash
   docker inspect --format='{{json .State.Health}}' portfolio_app_prod
   ```
   Kết quả: Trường `Status` hiển thị `"healthy"`.

---

## 8. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `P3005: The database schema is not empty` khi chạy migrate | Database đã có bảng sẵn từ trước nhưng chưa được Prisma đánh dấu lịch sử | Chạy lệnh `npx prisma migrate resolve --applied <migration_name>` để đánh dấu migration đó đã được thực thi mà không cố tạo lại bảng. |
| `/api/health` trả về HTTP 503 Service Unavailable | Container Next.js không thể kết nối tới PostgreSQL container qua mạng Docker | Kiểm tra `DATABASE_URL` trong `.env.production` xem hostname có đúng là `postgres` không; kiểm tra log container db bằng `docker logs portfolio_postgres_prod`. |
| App bị gián đoạn khi deploy migration xóa cột | Xóa cột đột ngột khi code cũ vẫn đang đọc cột đó | Áp dụng chiến lược 2 giai đoạn: Deploy code bỏ đọc cột cũ trước, sau đó mới tạo migration xóa cột. |
