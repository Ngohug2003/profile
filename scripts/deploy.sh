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
