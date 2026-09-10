# PHASE 8: GitHub Actions CI/CD Pipeline (Build GHCR, SSH Deploy & Instant Rollback)

Tài liệu này hướng dẫn thiết lập chu trình tự động hóa tích hợp và triển khai liên tục (CI/CD) toàn diện: khi lập trình viên `git push main`, GitHub Actions sẽ đảm nhận việc build Docker Image, đánh tag theo Commit SHA và đẩy lên GitHub Container Registry (ghcr.io). Sau đó, CI sẽ SSH vào VPS để cập nhật biến môi trường an toàn qua SSH Heredoc và thực thi script `scripts/deploy.sh` đạt tiêu chuẩn minimal-downtime.

---

## 1. Mục Tiêu
- Xây dựng workflow `.github/workflows/deploy.yml` tự động kích hoạt khi có commit mới trên nhánh `main`.
- Đóng gói Docker Image hoàn toàn trên hạ tầng của GitHub (runners), **tuyệt đối không build trên VPS** nhằm tránh gây nghẽn RAM/CPU trên máy chủ.
- Đánh 2 thẻ tag cho mỗi lần build: `latest` và `<git-commit-sha>` để hỗ trợ cơ chế Rollback tức thì.
- Cơ chế ghi file `.env.production` lên VPS an toàn qua SSH Heredoc từ GitHub Secrets, bảo đảm không in (log) bất kỳ mật khẩu nào ra console.
- Viết script `scripts/deploy.sh` trên VPS thực hiện `docker compose pull` và tái khởi động ứng dụng với thời gian downtime tối thiểu.

---

## 2. File Cần Tạo / Sửa
1. `.github/workflows/deploy.yml` — Định nghĩa quy trình CI/CD của GitHub Actions.
2. `docker-compose.prod.yml` — Cấu hình stack chạy chính thức trên VPS (dùng image từ GHCR).
3. `scripts/deploy.sh` — Script điều phối cập nhật container trên máy chủ VPS.

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `docker-compose.prod.yml`
```yaml
services:
  # Cơ sở dữ liệu nội bộ - Không mở port ra ngoài Internet
  postgres:
    image: postgres:16-alpine
    container_name: portfolio_postgres_prod
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - portfolio_db_data:/var/lib/postgresql/data
    networks:
      - portfolio_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # Ứng dụng Next.js kéo từ GitHub Container Registry
  app:
    image: ${APP_IMAGE}:${IMAGE_TAG:-latest}
    container_name: portfolio_app_prod
    restart: unless-stopped
    # Port 3000 chỉ bind vào localhost để Nginx reverse proxy, không public ra Internet
    ports:
      - "127.0.0.1:3000:3000"
    env_file:
      - .env.production
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      # Named Volume lưu trữ độc lập ảnh do admin tải lên
      - portfolio_uploads_data:/app/public/uploads
    networks:
      - portfolio_net
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://127.0.0.1:3000/api/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s

networks:
  portfolio_net:
    driver: bridge

volumes:
  portfolio_db_data:
    name: portfolio_db_data
  portfolio_uploads_data:
    name: portfolio_uploads_data
```

### 3.2. `scripts/deploy.sh`
```bash
#!/usr/bin/env bash
set -e

echo "=== [1/5] Bắt đầu quy trình triển khai ứng dụng trên VPS ==="
DEPLOY_DIR="/home/deploy/portfolio"
cd "$DEPLOY_DIR"

# Đảm bảo biến IMAGE_TAG đã được truyền vào
if [ -z "$IMAGE_TAG" ]; then
  export IMAGE_TAG="latest"
fi

echo "Deploying image tag: ${IMAGE_TAG}"

echo "=== [2/5] Đăng nhập GitHub Container Registry (GHCR) ==="
# Nếu package là private, sử dụng PAT được nạp sẵn
if [ -n "$CR_PAT" ] && [ -n "$GITHUB_ACTOR" ]; then
  echo "$CR_PAT" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin
fi

echo "=== [3/5] Kéo Docker Image mới về máy chủ ==="
docker compose -f docker-compose.prod.yml pull app

echo "=== [4/5] Tái khởi động Service với Minimal Downtime ==="
docker compose -f docker-compose.prod.yml up -d --remove-orphans app

echo "=== [5/5] Dọn dẹp Docker Images cũ không còn dùng (giải phóng ổ cứng) ==="
docker image prune -af --filter "until=72h" || true

echo "=== Triển khai thành công phiên bản: ${IMAGE_TAG} ==="
```

### 3.3. `.github/workflows/deploy.yml`
```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches:
      - main

env:
  REGISTRY: ghcr.io
  # Chuyển tên repository về chữ thường để tương thích với quy định của Docker Image
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    name: Build & Push Docker Image to GHCR
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Convert Repository Name to Lowercase
        run: |
          echo "IMAGE_NAME_LOWER=${IMAGE_NAME,,}" >> $GITHUB_ENV

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME_LOWER }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME_LOWER }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-to-vps:
    name: SSH VPS & Trigger Minimal-Downtime Deployment
    needs: build-and-push
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code (for compose and scripts)
        uses: actions/checkout@v4

      - name: Convert Repository Name to Lowercase
        run: |
          echo "IMAGE_NAME_LOWER=${IMAGE_NAME,,}" >> $GITHUB_ENV

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        env:
          COMMIT_SHA: ${{ github.sha }}
          FULL_IMAGE_NAME: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME_LOWER }}
          DB_URL: ${{ secrets.DATABASE_URL }}
          DB_USER: ${{ secrets.POSTGRES_USER }}
          DB_PASS: ${{ secrets.POSTGRES_PASSWORD }}
          DB_NAME: ${{ secrets.POSTGRES_DB }}
          ADM_PASS: ${{ secrets.ADMIN_PASSWORD }}
          SESS_SEC: ${{ secrets.SESSION_SECRET }}
          SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
        with:
          host: ${{ secrets.VPS_SSH_HOST }}
          username: ${{ secrets.VPS_SSH_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_SSH_PORT }}
          envs: COMMIT_SHA,FULL_IMAGE_NAME,DB_URL,DB_USER,DB_PASS,DB_NAME,ADM_PASS,SESS_SEC,SITE_URL
          script: |
            set -e
            DEPLOY_PATH="/home/deploy/portfolio"
            mkdir -p $DEPLOY_PATH/scripts

            # 1. Ghi file .env.production an toàn tuyệt đối qua SSH Heredoc (không echo secret ra stdout)
            cat << 'EOF' > $DEPLOY_PATH/.env.production
            DATABASE_URL="${DB_URL}"
            POSTGRES_USER="${DB_USER}"
            POSTGRES_PASSWORD="${DB_PASS}"
            POSTGRES_DB="${DB_NAME}"
            ADMIN_PASSWORD="${ADM_PASS}"
            SESSION_SECRET="${SESS_SEC}"
            NEXT_PUBLIC_SITE_URL="${SITE_URL}"
            NODE_ENV="production"
            APP_IMAGE="${FULL_IMAGE_NAME}"
            IMAGE_TAG="${COMMIT_SHA}"
            EOF
            chmod 600 $DEPLOY_PATH/.env.production

            # 2. Đồng bộ file docker-compose.prod.yml và deploy.sh
            cat << 'EOF' > $DEPLOY_PATH/docker-compose.prod.yml
            ${{ steps.get_compose.outputs.compose_file }}
            EOF

            # 3. Chạy script triển khai với IMAGE_TAG cụ thể
            export APP_IMAGE="${FULL_IMAGE_NAME}"
            export IMAGE_TAG="${COMMIT_SHA}"
            bash $DEPLOY_PATH/scripts/deploy.sh
```

*(Lưu ý: Để việc đồng bộ các file cấu hình đơn giản và chuẩn xác, workflow có thể dùng lệnh `scp` chuyển file `docker-compose.prod.yml` và `scripts/deploy.sh` từ repo lên VPS trước khi gọi lệnh bash).*

---

## 4. Command Rollback Tức Thì Khi Gặp Sự Cố

Trong trường hợp code mới deploy bị bug hoặc lỗi logic, bạn có thể rollback về phiên bản ổn định trước đó chỉ trong **10 giây** mà không cần đợi GitHub build lại:

Đăng nhập vào VPS:
```bash
ssh deploy@YOUR_VPS_IP
cd /home/deploy/portfolio

# Xem danh sách các tag commit SHA đã từng tải về máy chủ
docker images --filter=reference="ghcr.io/*"

# Chỉ định SHA của phiên bản ổn định trước đó (Ví dụ: a1b2c3d)
export IMAGE_TAG="a1b2c3d..."

# Tái kích hoạt container chạy phiên bản cũ
docker compose -f docker-compose.prod.yml up -d app
```

---

## 5. Kết Quả Mong Đợi
- Mỗi khi `git push main`, tab **Actions** trên GitHub chuyển màu xanh (Success).
- Gói package mới xuất hiện tại mục **Packages** của tài khoản GitHub.
- Trên VPS, lệnh `docker ps` hiển thị container `portfolio_app_prod` đang chạy image tương ứng với mã SHA của commit mới nhất.
- Website không bị gián đoạn hoặc chỉ gián đoạn < 1 giây trong lúc container chuyển giao trạng thái healthy.

---

## 6. Cách Kiểm Tra
1. Đẩy một commit nhỏ (ví dụ cập nhật tiêu đề):
   ```bash
   git add . && git commit -m "test: verify automated ci/cd pipeline" && git push origin main
   ```
2. Mở trình duyệt xem GitHub Actions Pipeline chạy từ đầu tới cuối.
3. Kiểm tra log trên VPS xác nhận phiên bản mới:
   ```bash
   docker logs --tail 30 portfolio_app_prod
   ```

---

## 7. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `denied: installation not allowed to Write organization package` | `GITHUB_TOKEN` chưa có quyền ghi package hoặc tên repo có ký tự viết hoa | 1. Đảm bảo tên image trong `deploy.yml` đã được convert sang chữ thường (`${IMAGE_NAME,,}`).<br>2. Vào GitHub Repo Settings -> Actions -> General -> Workflow permissions -> Chọn **Read and write permissions**. |
| `Host key verification failed` khi SSH | Workflow SSH lần đầu tiên kết nối với VPS chưa lưu host key | Thêm `fingerprint` hoặc cấu hình `disable_ciphers` hoặc action tự động accept new key của `appleboy/ssh-action`. |
| VPS bị đơ/treo hoàn toàn khi build Docker | Bạn chạy lệnh `docker build` trực tiếp trên VPS có RAM 1GB-2GB | **Cảnh báo:** Tuyệt đối không build trên VPS. Luôn build trên GitHub Actions runners và chỉ `docker compose pull` trên VPS. |
