# PHASE 7: Chuẩn Bị VPS Ubuntu 24.04 (User Deploy, Docker, Nginx & UFW Firewall)

Tài liệu này hướng dẫn thiết lập bảo mật và môi trường runtime ban đầu trên máy chủ VPS chạy hệ điều hành Ubuntu 24.04 LTS: tạo tài khoản không đặc quyền `deploy`, cấu hình tường lửa UFW nghiêm ngặt (chỉ cho phép cổng 22, 80, 443), cài đặt Docker Engine chính chủ và Nginx Web Server.

---

## 1. Mục Tiêu
- Cập nhật toàn bộ các gói hệ điều hành Ubuntu 24.04 lên bản vá mới nhất.
- Tạo user chuyên dụng `deploy` có quyền sudo và quyền thực thi Docker mà không cần dùng `root`.
- Cấu hình xác thực SSH qua Public Key cho user `deploy`.
- Thiết lập tường lửa UFW: Chỉ mở 3 cổng duy nhất là **22** (SSH), **80** (HTTP) và **443** (HTTPS). Đóng toàn bộ các cổng khác (đặc biệt là 5432 của Postgres và 3000 của Next.js).
- Cài đặt Docker Engine & Docker Compose plugin chính thức từ Docker Repository (không dùng bản lỗi thời từ repo mặc định của Ubuntu).
- Cài đặt Nginx phục vụ làm Reverse Proxy sau này.
- Chuẩn bị sẵn thư mục làm việc `/home/deploy/portfolio` trên VPS.

---

## 2. File Cần Tạo / Sửa
1. `/home/deploy/.ssh/authorized_keys` — Chứa Public Key cho phép GitHub Actions và lập trình viên SSH vào.
2. `/etc/docker/daemon.json` — Cấu hình Docker logging và DNS (tùy chọn tối ưu hóa).
3. Thư mục dự án: `/home/deploy/portfolio/`

---

## 3. Command Chính Xác Để Chạy Trên VPS

Đăng nhập vào VPS lần đầu tiên bằng tài khoản `root`:
```bash
ssh root@YOUR_VPS_IP
```

### 3.1. Cập nhật hệ thống
```bash
apt update && apt upgrade -y
```

### 3.2. Tạo user `deploy` và cấu hình quyền
```bash
# Tạo user deploy
adduser --gecos "" deploy

# Thêm deploy vào nhóm sudo
usermod -aG sudo deploy

# Thiết lập SSH authorized_keys cho user deploy
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

# Dán nội dung file deploy_key.pub (sinh ra ở Phase 6) vào đây
nano /home/deploy/.ssh/authorized_keys

# Phân quyền chuẩn bảo mật SSH
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

### 3.3. Cài đặt Docker Engine & Docker Compose Plugin (Official Docker Repo)
```bash
# Gỡ bỏ các bản docker cũ không chính thức (nếu có)
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do apt-get remove -y $pkg; done

# Cài đặt các gói phụ trợ
apt install -y ca-certificates curl gnupg

# Thêm GPG key chính thức của Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Thêm Docker repository vào APT sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update

# Cài đặt Docker Engine, Containerd và Docker Compose plugin
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Phân quyền cho user deploy chạy docker mà không cần sudo
usermod -aG docker deploy
```

### 3.4. Cài đặt Nginx
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 3.5. Cấu hình Tường Lửa UFW (Bảo Mật Tối Cao)
> [!CAUTION]
> Luôn mở cổng 22 (hoặc cổng SSH tùy chỉnh) TRƯỚC KHI kích hoạt UFW để tránh bị khóa ngoài VPS!
```bash
# Thiết lập policy mặc định: Chặn tất cả kết nối đến, cho phép tất cả kết nối đi
ufw default deny incoming
ufw default allow outgoing

# Chỉ mở SSH (22), HTTP (80) và HTTPS (443)
ufw allow 22/tcp comment 'SSH Port'
ufw allow 80/tcp comment 'HTTP Nginx'
ufw allow 443/tcp comment 'HTTPS Nginx'

# Bật tường lửa UFW
ufw --force enable
```

### 3.6. Khởi tạo Thư Mục Dự Án
Chuyển sang user `deploy`:
```bash
su - deploy
mkdir -p /home/deploy/portfolio
mkdir -p /home/deploy/portfolio/scripts
mkdir -p /home/deploy/portfolio/backups
exit
```

---

## 4. Kết Quả Mong Đợi
- Lệnh `docker --version` hiển thị Docker Engine bản mới nhất (>= 26.x hoặc 27.x).
- Lệnh `docker compose version` hiển thị Docker Compose v2.x.
- Lệnh `ufw status verbose` hiển thị trạng thái `Status: active` và danh sách cổng chỉ gồm `22/tcp`, `80/tcp`, `443/tcp`.
- Thư mục `/home/deploy/portfolio` thuộc quyền sở hữu của `deploy:deploy`.

---

## 5. Cách Kiểm Tra
1. **Kiểm tra đăng nhập bằng SSH Key:**
   Mở terminal tại máy lập trình viên:
   ```bash
   ssh -i deploy_key deploy@YOUR_VPS_IP
   ```
   Kết quả: Đăng nhập thành công vào VPS mà không hỏi mật khẩu.

2. **Kiểm tra quyền Docker của user `deploy`:**
   Trên VPS (với tư cách user `deploy`):
   ```bash
   docker run --rm hello-world
   ```
   Kết quả: In ra thông báo `Hello from Docker!` mà không báo lỗi `Permission denied`.

3. **Kiểm tra Nginx đang chạy:**
   Truy cập trình duyệt tới `http://YOUR_VPS_IP`.
   Kết quả: Hiển thị trang mặc định `Welcome to nginx!`.

4. **Kiểm tra cổng database bị chặn:**
   Từ máy tính cá nhân, thử quét cổng Postgres trên VPS:
   ```bash
   nc -zv YOUR_VPS_IP 5432
   # hoặc PowerShell: Test-NetConnection -ComputerName YOUR_VPS_IP -Port 5432
   ```
   Kết quả: Báo timeout hoặc từ chối kết nối (chứng minh Postgres không bị hở ra Internet).

---

## 6. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| Bị mất kết nối SSH sau khi chạy `ufw enable` | Quên chưa chạy lệnh `ufw allow 22/tcp` | Sử dụng giao diện VNC / Web Console của nhà cung cấp VPS để đăng nhập trực tiếp và gõ lệnh: `ufw allow 22/tcp`. |
| `permission denied while trying to connect to the Docker daemon socket` khi chạy với user `deploy` | Nhóm `docker` mới được thêm vào tài khoản nhưng session hiện tại chưa nhận diện | Chạy lệnh `newgrp docker` hoặc đăng xuất khỏi SSH rồi đăng nhập lại để cập nhật quyền nhóm. |
| Port 80 bị chiếm bởi tiến trình khác như Apache | VPS có sẵn web server khác được cài từ image mẫu của nhà cung cấp | Gỡ bỏ hoặc tắt service xung đột: `systemctl stop apache2 && systemctl disable apache2`. |
