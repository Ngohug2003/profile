# PHASE 5: Test Production Build Local (Full-Stack Compose & Named Volume Uploads)

Tài liệu này hướng dẫn mô phỏng 100% môi trường Production ngay tại máy Local bằng Docker Compose: kết nối container Next.js độc lập với container PostgreSQL qua mạng nội bộ Docker, cấu hình Named Volume riêng biệt cho ảnh upload và kiểm nghiệm tính toàn vẹn dữ liệu khi restart container.

---

## 1. Mục Tiêu
- Tạo file `docker-compose.prod.local.yml` đóng vai trò bản mẫu kiểm thử trước khi đưa lên máy chủ thật.
- Kết nối ứng dụng Next.js với PostgreSQL qua Docker Network riêng biệt (`portfolio_internal_net`).
- Khởi tạo Named Volume `portfolio_uploads_local` mount vào `/app/public/uploads` để kiểm chứng nguyên tắc: dữ liệu ảnh không bị mất khi container app bị hủy hoặc build lại.
- Thực hiện kiểm tra luồng nghiệp vụ hoàn chỉnh: Đăng nhập Admin -> Thêm dự án kèm upload ảnh bìa -> Hiển thị trên trang chủ -> Restart container -> Kiểm tra ảnh vẫn tồn tại.

---

## 2. File Cần Tạo / Sửa
1. `docker-compose.prod.local.yml` — Cấu hình stack production giả lập tại local.
2. `scripts/test-local-prod.sh` (hoặc chạy từng command) — Script tự động hóa các bước kiểm thử.

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `docker-compose.prod.local.yml`
```yaml
services:
  # 1. Cơ sở dữ liệu PostgreSQL 16
  postgres:
    image: postgres:16-alpine
    container_name: portfolio_postgres_prod_local
    restart: unless-stopped
    environment:
      POSTGRES_USER: portfolio_prod_user
      POSTGRES_PASSWORD: portfolio_prod_secure_password
      POSTGRES_DB: portfolio_prod_db
    volumes:
      - portfolio_db_prod_local_data:/var/lib/postgresql/data
    networks:
      - portfolio_internal_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio_prod_user -d portfolio_prod_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  # 2. Ứng dụng Next.js Standalone
  app:
    image: portfolio-nextjs:local-test
    container_name: portfolio_app_prod_local
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      # Kết nối bằng service name 'postgres' trong mạng nội bộ Docker
      DATABASE_URL: "postgresql://portfolio_prod_user:portfolio_prod_secure_password@postgres:5432/portfolio_prod_db?schema=public"
      ADMIN_PASSWORD: "prod_admin_password_987"
      SESSION_SECRET: "prod_very_secret_key_32_characters_long_local"
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000"
      NODE_ENV: "production"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      # Named volume riêng biệt cho ảnh upload
      - portfolio_uploads_prod_local:/app/public/uploads
    networks:
      - portfolio_internal_net

networks:
  portfolio_internal_net:
    driver: bridge

volumes:
  portfolio_db_prod_local_data:
    name: portfolio_db_prod_local_data
  portfolio_uploads_prod_local:
    name: portfolio_uploads_prod_local
```

---

## 4. Command Chính Xác Để Chạy

### 4.1. Khởi động Full-Stack Container
```bash
docker compose -f docker-compose.prod.local.yml up -d
```

### 4.2. Chạy Migration tạo bảng trên DB Container
Áp dụng schema lên database vừa khởi tạo bằng lệnh `prisma migrate deploy` (tuyệt đối không dùng migrate dev):
```bash
# Sử dụng trực tiếp prisma từ máy host trỏ tới database container
DATABASE_URL="postgresql://portfolio_prod_user:portfolio_prod_secure_password@localhost:5432/portfolio_prod_db?schema=public" npx prisma migrate deploy
```
*(Nếu cổng 5432 không map ra ngoài, ta có thể chạy migrate thông qua `docker exec` vào container app hoặc một container phụ trợ chứa prisma).*

Cách tiện lợi nhất không cần map cổng postgres ra máy host:
```bash
docker run --rm \
  --network portfolio_internal_net \
  -v ${PWD}/prisma:/app/prisma \
  -e DATABASE_URL="postgresql://portfolio_prod_user:portfolio_prod_secure_password@postgres:5432/portfolio_prod_db?schema=public" \
  node:20-alpine \
  sh -c "npm install -g prisma && npx prisma migrate deploy --schema=/app/prisma/schema.prisma"
```

### 4.3. Kiểm tra trạng thái các Container
```bash
docker compose -f docker-compose.prod.local.yml ps
```

---

## 5. Kết Quả Mong Đợi
- Hai container `portfolio_postgres_prod_local` và `portfolio_app_prod_local` đều ở trạng thái `Up`.
- Cổng `3000` của máy host kết nối trực tiếp vào app.
- Truy cập `http://localhost:3000/admin/login`, nhập mật khẩu `prod_admin_password_987` đăng nhập thành công vào bảng điều khiển.

---

## 6. Cách Kiểm Tra (Thử Nghiệm Tính Bền Vững Của Named Volume)
1. **Tạo dữ liệu và upload ảnh:**
   - Tại trang `/admin`, tạo một dự án mới tên là: `Test Production Volume`.
   - Chọn một file ảnh từ máy và bấm **Lưu Dự Án**.
   - Kiểm tra ảnh hiển thị tốt tại `http://localhost:3000`.
2. **Tiêu hủy container App:**
   ```bash
   docker compose -f docker-compose.prod.local.yml stop app
   docker compose -f docker-compose.prod.local.yml rm -f app
   ```
3. **Bật lại container App:**
   ```bash
   docker compose -f docker-compose.prod.local.yml up -d app
   ```
4. **Xác nhận kết quả:**
   - Tải lại trang `http://localhost:3000`.
   - Dự án vừa tạo và file ảnh đính kèm vẫn hiển thị nguyên vẹn, chứng minh Named Volume `portfolio_uploads_prod_local` đã bảo vệ dữ liệu thành công.

---

## 7. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| Next.js báo lỗi `ECONNREFUSED postgres:5432` | Container postgres chưa khởi động xong hoặc sai tên service | Đảm bảo `DATABASE_URL` dùng hostname là `postgres` (tên service trong compose) và có cấu hình `depends_on: postgres: condition: service_healthy`. |
| Upload ảnh bị mất sau khi recreate container | Quên chưa gắn Named Volume cho thư mục `/app/public/uploads` | Kiểm tra lại phần `volumes:` của service `app` trong file compose phải có `portfolio_uploads_prod_local:/app/public/uploads`. |
| Không thể truy cập `http://localhost:3000` | Port 3000 bị chiếm dụng | Kiểm tra tiến trình khác đang chiếm cổng 3000: `netstat -ano \| findstr :3000` trên Windows hoặc `lsof -i :3000` trên Linux. |
