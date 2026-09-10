# PHASE 4: Dockerize Next.js (Multi-Stage Dockerfile, Standalone & Non-Root User)

Tài liệu này hướng dẫn tối ưu hóa ứng dụng Next.js  16.3.4  sang định dạng Container Image siêu nhẹ, an toàn và chuẩn production bằng cơ chế `output: 'standalone'`, kỹ thuật Multi-stage build và chạy bằng tài khoản người dùng không đặc quyền (`non-root user`).

---

## 1. Mục Tiêu
- Kích hoạt chế độ `standalone` trong `next.config.ts` để Next.js chỉ đóng gói những dependencies thực sự cần thiết lúc runtime, giúp giảm kích thước Docker image từ ~1GB xuống ~150MB.
- Viết file `Dockerfile` gồm 3 tầng (Multi-stage):
  - **Tầng 1 (`deps`):** Cài đặt dependencies sạch từ `package-lock.json`.
  - **Tầng 2 (`builder`):** Sinh mã Prisma Client và build mã nguồn Next.js.
  - **Tầng 3 (`runner`):** Runtime tối giản chạy trên Node.js 20 Alpine với tài khoản `nextjs` (UID 1001), không có quyền root.
- Cấu hình file `.dockerignore` triệt để tránh đưa các file rác hoặc file nhạy cảm (`.env*`, `.git`, `node_modules`) vào ngữ cảnh build của Docker.

---

## 2. File Cần Tạo / Sửa
1. `next.config.ts` — Cấu hình `output: 'standalone'`.
2. `Dockerfile` — File định nghĩa quy trình build container image.
3. `.dockerignore` — Danh sách loại trừ khi copy vào Docker daemon.

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Bắt buộc để xuất ra server.js độc lập cho Docker container siêu nhẹ
  output: 'standalone',

  // Cấu hình cho phép hiển thị ảnh từ domain ngoài nếu cần
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

### 3.2. `.dockerignore`
```
Dockerfile
.dockerignore
node_modules
npm-debug.log
yarn-error.log
.git
.gitignore
.next
.env*
!.env.example
README.md
docs
scripts
```

### 3.3. `Dockerfile`
```dockerfile
# ==============================================================================
# TẦNG 1: DEPS (Cài đặt dependencies)
# ==============================================================================
FROM node:20-alpine AS deps
# Cài đặt libc6-compat cho môi trường alpine tương thích với Prisma engine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy các file định nghĩa package để tận dụng Docker layer caching
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Cài đặt chính xác các gói phụ thuộc
RUN npm ci

# ==============================================================================
# TẦNG 2: BUILDER (Sinh Prisma Client & Compile Next.js)
# ==============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Lấy dependencies đã cài từ tầng deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Thiết lập biến môi trường build-time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Sinh mã Prisma Client tương thích với runtime Alpine
RUN npx prisma generate

# Build ứng dụng sang định dạng standalone
RUN npm run build

# ==============================================================================
# TẦNG 3: RUNNER (Runtime chính thức chạy trên Production)
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cài đặt wget hoặc curl để phục vụ Healthcheck nếu cần
RUN apk add --no-cache curl

# Tạo group và user non-root để tăng cường bảo mật container
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Tạo sẵn thư mục public/uploads và cấp quyền cho user nextjs
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Copy các assets công khai và thư mục standalone từ tầng builder
COPY --from=builder /app/public ./public

# Cấp quyền cho thư mục .next
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy output standalone và static assets đã build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Chuyển sang người dùng không có quyền root
USER nextjs

EXPOSE 3000

# Khởi động server Next.js standalone
CMD ["node", "server.js"]
```

---

## 4. Command Chính Xác Để Chạy

### 4.1. Thực hiện Build Docker Image tại Local
```bash
docker build -t portfolio-nextjs:local-test .
```

### 4.2. Kiểm tra Dung lượng Image đã Build
```bash
docker images portfolio-nextjs:local-test
```

---

## 5. Kết Quả Mong Đợi
- Quá trình `docker build` hoàn thành mà không có lỗi TypeScript hoặc lỗi Prisma generator.
- Dung lượng (Size) của image `portfolio-nextjs:local-test` chỉ dao động trong khoảng **130MB - 180MB** (thay vì >1GB nếu không dùng multi-stage standalone).
- Tầng runner được chạy dưới định danh user `nextjs` (UID 1001).

---

## 6. Cách Kiểm Tra
1. Kiểm tra user bên trong container:
   ```bash
   docker run --rm portfolio-nextjs:local-test whoami
   ```
   **Kết quả in ra:** `nextjs` (Không phải `root`).

2. Kiểm tra sự tồn tại của file `server.js`:
   ```bash
   docker run --rm portfolio-nextjs:local-test ls -la server.js
   ```

---

## 7. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `Cannot find module '@prisma/client'` trong quá trình build | Chưa chạy `npx prisma generate` trước khi chạy `npm run build` ở tầng builder | Đảm bảo Dockerfile có dòng `COPY prisma ./prisma/` và `RUN npx prisma generate` trước lệnh build. |
| `Error: EACCES: permission denied, open '/app/public/uploads/...'` | Thư mục upload không có quyền ghi đối với user `nextjs` | Đảm bảo trong Dockerfile có lệnh `RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads`. |
| Thiếu CSS hoặc hình ảnh tĩnh giao diện vỡ nát | Quên không copy thư mục `.next/static` vào `.next/static` trong tầng runner | Phải có dòng `COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static` trong Dockerfile. |
