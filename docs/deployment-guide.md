# Sổ Tay Hướng Dẫn Triển Khai Personal Portfolio: Local → Production VPS

Tài liệu này đóng vai trò là kim chỉ nam toàn diện, hướng dẫn từng bước chi tiết để xây dựng, container hóa và triển khai ứng dụng **Personal Portfolio** (Next.js 16.3.4, Prisma, PostgreSQL) từ môi trường Local lên máy chủ Production (VPS Ubuntu 24.04).

---

## 1. Kiến Trúc Mục Tiêu (VPS Siêu Nhẹ + Supabase Cloud)

```
+-------------------------------------------------------------------------------+
|                                LOCAL MACHINE                                  |
|  Next.js 16 (Server Components) + Supabase Client SDK + Local Dev             |
+---------------------------------------+---------------------------------------+
                                        |
                                    git push
                                        v
+-------------------------------------------------------------------------------+
|                                GITHUB REPO                                    |
|  Main branch triggers GitHub Actions Workflow (.github/workflows)             |
+---------------------------------------+---------------------------------------+
                                        |
                                        +-----------------------------+
                                        |                             |
                                        v (Docker Build & Push GHCR)  v (SSH Auto Deploy)
+--------------------------------------------+         +-------------------------------+
|        GITHUB CONTAINER REGISTRY (GHCR)    |         |           VPS UBUNTU          |
|  ghcr.io/<owner>/portfolio-app:<sha>       |         |  scripts/deploy.sh            |
|  ghcr.io/<owner>/portfolio-app:latest      |         |  docker compose pull + up -d  |
+--------------------+-----------------------+         +---------------+---------------+
                     |                                                 |
                     +------------------- docker pull <----------------+
                                                                       v
+-----------------------------------------------------------------------------------------------+
|                                      PRODUCTION VPS STACK                                     |
|                                                                                               |
|   Internet (Port 80/443)                                                                      |
|         |                                                                                     |
|         v                                                                                     |
|     [ Nginx Reverse Proxy ] + [ Let's Encrypt SSL (Certbot) ]                                 |
|         |                                                                                     |
|         +---> Proxy pass (http://127.0.0.1:3000)                                              |
|                     |                                                                         |
|                     v                                                                         |
|             [ Container: nextjs-app (Next.js 16 Standalone, RAM < 90MB) ]                     |
+-------------------------------------+---------------------------------------------------------+
                                      |
                         (Kết nối HTTPS / WSS an toàn)
                                      v
+-----------------------------------------------------------------------------------------------+
|                                    SUPABASE CLOUD (BaaS)                                      |
|                                                                                               |
|  * Managed PostgreSQL Database (Singapore Region - AWS ap-southeast-1, latency <15ms)         |
|  * Row Level Security (RLS) bảo vệ truy cập dữ liệu trực tiếp từ client                        |
|  * Storage CDN Toàn cầu (Bucket `project-covers`, tự động resize & WebP compression)          |
|  * Tự động Point-in-Time Recovery & Daily Backup từ Supabase Cloud                            |
+-----------------------------------------------------------------------------------------------+
```

---

## 2. Tech Stack Cố Định

| Thành phần | Công nghệ / Lựa chọn | Lý do & Quy định |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.2.9 (App Router) | Tối ưu RSC, streaming HTML, standalone output cho Docker |
| **Ngôn ngữ** | TypeScript | An toàn kiểu dữ liệu, giảm thiểu lỗi runtime |
| **Runtime** | Node.js 20 LTS | Phiên bản LTS ổn định, tối ưu kích thước image Alpine |
| **Styling** | Tailwind CSS v4 | Hiệu năng CSS compilation cao, bundle cực nhỏ |
| **Database & API** | Supabase Cloud (PostgreSQL 16) | Nền tảng BaaS đám mây, độ trễ <15ms, không tốn RAM trên VPS |
| **Security** | Row Level Security (RLS) | Phân quyền bảng trực tiếp tại database |
| **Authentication** | JWT HttpOnly Cookie | Quản lý phiên admin bảo mật, không lộ token ra Client |
| **Image Storage** | Supabase Storage CDN | Lưu trữ ảnh bìa dự án trên CDN toàn cầu, không tốn ổ cứng VPS |
| **Container Registry**| GitHub Packages (GHCR) | Tích hợp sâu với GitHub Actions, bảo mật, tải siêu tốc |
| **Web Server** | Nginx Reverse Proxy | Terminate SSL, nén gzip/brotli, bảo vệ port 3000 |
| **SSL / HTTPS** | Let's Encrypt (Certbot) | Cấp chứng chỉ HTTPS tự động, gia hạn tự động |

---

## 3. Các Nguyên Tắc Bất Biến (Bắt Buộc Tuân Thủ)

1. **Không bao giờ xóa dữ liệu:** Không tùy tiện chạy `docker volume rm`, `DROP DATABASE`, `docker compose down -v`.
2. **Không expose PostgreSQL ra Internet:** Cổng 5432 trên VPS chỉ mở trong mạng nội bộ Docker (`internal network`). Tuyệt đối không map `5432:5432` trên production.
3. **Không hard-code Secrets:** Tất cả secret (`DATABASE_URL`, `ADMIN_PASSWORD`, `CR_PAT`) phải lấy từ biến môi trường hoặc GitHub Secrets.
4. **Không commit file môi trường:** Không bao giờ push `.env`, `.env.local`, `.env.production` lên Git.
5. **Không dùng `prisma migrate dev` trên Production:** Production bắt buộc chỉ dùng `prisma migrate deploy`.
6. **Docker chạy Non-Root User:** Container chạy bằng user `nextjs` (UID 1001), không chạy bằng `root`.
7. **VPS không build image:** Docker image được build hoàn toàn trên GitHub Actions và đẩy lên GHCR. VPS chỉ việc pull image về chạy để tránh nghẽn CPU/RAM (OOM).
8. **Rollback tức thì bằng Commit SHA:** Mỗi image đều được đánh tag theo mã commit Git (ví dụ `sha-a1b2c3d`) bên cạnh tag `latest`.
9. **Minimal-downtime với Health Check:** Container mới phải vượt qua kiểm tra `/api/health` trước khi hệ thống ngắt container cũ.
10. **Sao lưu độc lập (Offsite Backup):** Bản dump database phải được nén và đẩy ra ngoài VPS định kỳ bằng `rclone` (lên Cloudflare R2 / S3 / Google Drive).

---

## 4. Lộ Trình Triển Khai Thực Tế (Phân Tách 2 Giai Đoạn)

### Giai Đoạn 1: Phát Triển Local & Thiết Lập GitHub CI Quality Gate (Hiện Tại)
| Phase | Tên Phase | Mục tiêu chính | Tài liệu chi tiết |
| :---: | :--- | :--- | :---: |
| **01** | **Chốt Spec Kỹ Thuật** | Schema Prisma, cấu trúc thư mục, biến môi trường, Admin Auth | [Xem Phase 1](./phase-01-spec.md) |
| **02** | **Scaffold Code Local** | Khởi tạo Next.js 16, Prisma Client, API CRUD, Admin & Public UI | [Xem Phase 2](./phase-02-scaffold-local.md) |
| **03** | **Docker DB Local** | Docker Compose Postgres, Migration `dev`, Seed Data | [Xem Phase 3](./phase-03-docker-db-local.md) |
| **04** | **Dockerize Next.js** | Multi-stage Dockerfile standalone, Non-root user, .dockerignore | [Xem Phase 4](./phase-04-dockerize-nextjs.md) |
| **05** | **Test Prod Local** | Test Full-stack Local với Docker Compose Prod, Upload Volume | [Xem Phase 5](./phase-05-test-prod-local.md) |
| **06** | **GitHub CI & PR Gate** | Đẩy code lên GitHub, thiết lập CI Quality Gate, Branch Protection bắt buộc CI xanh mới cho Merge | [Xem Phase 6](./phase-06-github-setup.md) |

---

### Giai Đoạn 2: Triển Khai Máy Chủ Thật (Kích hoạt sau khi mua VPS & Tên Miền)
*Toàn bộ tài liệu giai đoạn 2 đã được lưu trữ sẵn sàng tại thư mục: [`docs/vps-deployment/`](./vps-deployment/)*

| Phase | Tên Phase | Mục tiêu chính | Tài liệu chi tiết |
| :---: | :--- | :--- | :---: |
| **07** | **Chuẩn bị VPS Ubuntu** | Cài đặt Docker CE, Docker Compose v2, Nginx, UFW Firewall | [Xem Phase 7](./vps-deployment/phase-07-vps-setup.md) |
| **08** | **GitHub Actions CI/CD** | Pipeline build GHCR + SSH deploy VPS (`scripts/deploy.sh`) | [Xem Phase 8](./vps-deployment/phase-08-cicd-ghcr.md) |
| **09** | **Nginx & Domain DNS** | Cấu hình Reverse Proxy, Static Serve Uploads, Trỏ DNS A-Record | [Xem Phase 9](./vps-deployment/phase-09-nginx-domain.md) |
| **10** | **HTTPS Let's Encrypt** | Certbot SSL, Auto-renew Cron/Timer, Xử lý Cloudflare Proxy | [Xem Phase 10](./vps-deployment/phase-10-https-certbot.md) |
| **11** | **Production Migration** | `prisma migrate deploy`, Endpoint `/api/health` giám sát DB | [Xem Phase 11](./vps-deployment/phase-11-prod-migration-health.md) |
| **12** | **Backup & Security** | `pg_dump` + `rclone` offsite, Logrotate, Checklist Go-live | [Xem Phase 12](./vps-deployment/phase-12-backup-security.md) |

---

## 5. Hướng Dẫn Sử Dụng Bộ Tài Liệu

- **Thực hiện tuần tự:** Bắt đầu từ Phase 1 và chỉ chuyển sang Phase tiếp theo sau khi đã hoàn thành các bước kiểm tra (Verification) của Phase hiện tại.
- **Tuân thủ command:** Tất cả command được cung cấp chính xác cho cả Windows PowerShell (khi làm local) và Linux Bash (khi làm trên VPS).
- **Gặp lỗi:** Tra cứu ngay mục **Lỗi thường gặp & Cách xử lý** ở cuối mỗi tài liệu phase tương ứng trước khi sửa đổi cấu hình.
