# PHASE 6: GitHub Repository, CI Quality Gate & Branch Protection (Pull Request Gate)

Tài liệu này hướng dẫn thiết lập kho lưu trữ GitHub, bộ lọc an ninh `.gitignore`, cấu hình luồng kiểm thử tự động **GitHub Actions CI (`.github/workflows/ci.yml`)** và thiết lập quy tắc bảo vệ nhánh (**Branch Protection Rules**): chỉ khi CI kiểm tra đạt kết quả **XANH (Passed)** thì mới được phép Merge Pull Request vào nhánh chính `main`.

> [!NOTE]
> Các giai đoạn liên quan đến triển khai máy chủ thật và tên miền (Phase 7 đến 12: VPS Ubuntu, Nginx, HTTPS Certbot, SSH Deploy GHCR, Backup Cloud) đã được di chuyển vào thư mục riêng: [`docs/vps-deployment/`](file:///c:/profile/docs/vps-deployment/) để sẵn sàng kích hoạt sau khi bạn hoàn tất việc mua VPS và tên miền.

---

## 1. Mục Tiêu
- Khởi tạo Git repository local và rà soát `.gitignore` bảo đảm tuyệt đối không commit file bí mật (`.env*`) và ảnh upload cục bộ (`public/uploads/*`).
- Thiết lập quy trình làm việc chuẩn: Nhánh `main` là nhánh sản phẩm ổn định; mọi thay đổi tính năng đều làm trên nhánh nhánh phụ (`feature/...`), tạo Pull Request (PR) để nghiệm thu.
- Xây dựng file workflow `.github/workflows/ci.yml` tự động kích hoạt kiểm tra chất lượng mã nguồn (Quality Gate) trên mọi Pull Request:
  - Sinh mã Prisma Client (`prisma generate`).
  - Kiểm tra kiểu dữ liệu tĩnh TypeScript (`npx tsc --noEmit`).
  - Build ứng dụng Next.js (`npm run build`).
  - Đóng gói thử nghiệm Docker Image (`docker build`).
- Cấu hình **Branch Protection Rules** trên GitHub Repo: Bắt buộc CI phải **XANH (All checks passed)** mới mở khóa nút **Merge pull request**.

---

## 2. File Cần Tạo / Sửa
1. `.gitignore` — Bộ lọc file không được phép đưa lên Git.
2. `.github/workflows/ci.yml` — Định nghĩa kịch bản kiểm thử tự động CI trên GitHub.
3. `README.md` — Tài liệu giới thiệu dự án và hướng dẫn chạy kiểm thử.

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `.github/workflows/ci.yml`
```yaml
name: Continuous Integration (CI Quality Gate)

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Job 1: Kiểm tra chất lượng mã nguồn TypeScript & Build Next.js
  quality-check:
    name: Typecheck & Next.js Build
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Cài đặt Dependencies
        run: npm ci

      - name: Sinh mã Prisma Client
        run: npx prisma generate

      - name: Kiểm tra lỗi kiểu dữ liệu TypeScript (Typecheck)
        run: npx tsc --noEmit

      - name: Build ứng dụng Next.js
        run: npm run build
        env:
          # Giả lập biến môi trường dummy cho bước build trên CI
          DATABASE_URL: "postgresql://dummy_user:dummy_password@localhost:5432/dummy_db?schema=public"
          ADMIN_PASSWORD: "ci_test_password"
          SESSION_SECRET: "ci_dummy_session_secret_32_characters_long"
          NEXT_PUBLIC_SITE_URL: "http://localhost:3000"

  # Job 2: Kiểm tra khả năng đóng gói Dockerfile Standalone
  docker-build-check:
    name: Dockerfile Build Test
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: quality-check

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Thiết lập Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build thử Docker Image (Không đẩy lên Registry)
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: portfolio-app:ci-test
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 4. Các Bước Thực Hiện Trên Terminal & GitHub

### 4.1. Tạo Commit Đầu Tiên và Đẩy Lên GitHub
1. **Kiểm tra trạng thái Git:**
   ```powershell
   git status
   ```
2. **Commit toàn bộ mã nguồn sạch:**
   ```powershell
   git add .
   git commit -m "feat: initial portfolio codebase with Next.js, Prisma, Docker and CI workflow"
   ```
3. **Tạo Repository mới trên [GitHub](https://github.com/new):**
   - Đặt tên: `portfolio-nextjs` (chế độ Public hoặc Private tùy ý).
   - Không tick chọn "Add a README file" hay ".gitignore".
4. **Gắn link remote và đẩy code lên nhánh `main`:**
   ```powershell
   git remote add origin https://github.com/<tai-khoan-cua-ban>/portfolio-nextjs.git
   git branch -M main
   git push -u origin main
   ```

---

### 4.2. Cấu Hình Branch Protection Bắt Buộc CI Xanh Mới Được Merge

Sau khi đã đẩy code lên GitHub, tiến hành khóa nhánh `main` để bảo vệ mã nguồn:

1. Trên GitHub Repo, vào mục: **Settings** -> **Branches** (hoặc **Rules** -> **Rulesets**).
2. Tại mục **Branch protection rules**, bấm nút **Add rule** (hoặc **Add classic branch protection rule**):
   - **Branch name pattern**: Điền `main`.
3. Tích chọn các mục quan trọng sau:
   - ✅ **Require a pull request before merging** (Bắt buộc phải tạo PR, cấm push trực tiếp vào `main`).
   - ✅ **Require status checks to pass before merging**:
     - Tích chọn: **Require branches to be up to date before merging**.
     - Trong ô tìm kiếm kiểm tra (Status checks), tìm và chọn:
       - `Typecheck & Next.js Build`
       - `Dockerfile Build Test`
4. Bấm **Save changes** (hoặc **Create**).

---

## 5. Quy Trình Làm Việc Hàng Ngày (Tạo Nhánh -> Sửa Code -> PR -> CI Xanh -> Merge)

Khi bạn muốn thêm tính năng mới hoặc chỉnh sửa code:

1. **Từ nhánh `main`, tạo một nhánh mới:**
   ```powershell
   git checkout -b feature/cap-nhat-giao-dien
   ```
2. **Thực hiện chỉnh sửa code và commit:**
   ```powershell
   git add .
   git commit -m "feat: update hero section styling"
   ```
3. **Đẩy nhánh mới lên GitHub:**
   ```powershell
   git push -u origin feature/cap-nhat-giao-dien
   ```
4. **Tạo Pull Request trên giao diện GitHub:**
   - GitHub sẽ tự động hiển thị nút **Compare & pull request**, bấm vào và chọn tạo PR vào nhánh `main`.
5. **Quan sát CI chạy tự động:**
   - GitHub Actions sẽ tự động kích hoạt workflow `Continuous Integration (CI Quality Gate)`.
   - Nút **Merge pull request** sẽ tạm thời **bị khóa màu xám**.
   - Khi cả 2 job `Typecheck & Next.js Build` và `Dockerfile Build Test` chạy xong và hiện **tích XANH**:
     - Nút **Merge pull request** sẽ chuyển sang màu xanh lá.
     - Bạn bấm **Confirm merge** để hợp nhất code an toàn vào nhánh `main`!

---

## 6. Kết Quả Mong Đợi
- Toàn bộ source code, file Docker, tài liệu và kịch bản CI được lưu trữ an toàn trên GitHub.
- Nhánh `main` được bảo vệ tuyệt đối khỏi các lỗi cú pháp TypeScript hoặc lỗi hỏng Docker build.
- Bất kỳ đóng góp hoặc chỉnh sửa nào đều phải vượt qua CI Xanh mới được đưa vào sản phẩm.
