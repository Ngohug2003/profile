# PHASE 9: Nginx Reverse Proxy & Thiết Lập Tên Miền (DNS A-Record)

Tài liệu này hướng dẫn cấu hình trỏ bản ghi DNS tên miền về máy chủ VPS và thiết lập Nginx đóng vai trò là Reverse Proxy: tiếp nhận lưu lượng truy cập từ cổng 80/443, gắn các header định danh cần thiết, nới rộng giới hạn kích thước upload (`client_max_body_size`) và chuyển tiếp an toàn vào ứng dụng Next.js đang chạy tại `http://127.0.0.1:3000`.

---

## 1. Mục Tiêu
- Trỏ bản ghi DNS `A` của tên miền (`yourdomain.com` và `www.yourdomain.com`) về địa chỉ IP Public của VPS.
- Tạo cấu hình Virtual Host Nginx tại `/etc/nginx/sites-available/portfolio`.
- Cấu hình chuyển tiếp (Reverse Proxy) tới `http://127.0.0.1:3000` với đầy đủ các header `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`.
- Cấu hình tăng giới hạn upload file của Nginx lên `10M` (mặc định của Nginx chỉ là 1MB, nếu không cấu hình sẽ bị lỗi `413 Request Entity Too Large` khi upload ảnh bìa).
- Kích hoạt cấu hình, kiểm tra cú pháp và khởi động lại Nginx.

---

## 2. File Cần Tạo / Sửa Trên VPS
1. `/etc/nginx/sites-available/portfolio` — File cấu hình reverse proxy cho website.
2. `/etc/nginx/sites-enabled/portfolio` — Symlink liên kết kích hoạt cấu hình.

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `/etc/nginx/sites-available/portfolio`
```nginx
# Cấu hình Upstream trỏ vào cổng nội bộ của container Next.js
upstream nextjs_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com; # Thay thế bằng tên miền thật của bạn

    # Tăng giới hạn dung lượng tải file lên server (chống lỗi 413 khi upload ảnh)
    client_max_body_size 10M;

    # Ghi log riêng biệt cho portfolio
    access_log /var/log/nginx/portfolio_access.log;
    error_log /var/log/nginx/portfolio_error.log;

    # Tối ưu hóa nén nội dung gzip
    gzip on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # Phục vụ trực tiếp tài nguyên tĩnh tĩnh của Next.js (Tùy chọn tăng tốc độ)
    location /_next/static/ {
        proxy_pass http://nextjs_upstream;
        proxy_cache_valid 200 365d;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Chuyển tiếp toàn bộ các request còn lại vào ứng dụng Next.js
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;

        # Header hỗ trợ WebSocket và Server-Sent Events
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Forward headers nhận dạng client gốc
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeout cấu hình
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## 4. Command Chính Xác Để Chạy

### 4.1. Cấu hình DNS trên Nhà Quản Lý Tên Miền
Đăng nhập vào Cloudflare, Namecheap, GoDaddy hoặc nhà cung cấp tên miền của bạn, thêm 2 bản ghi:
- **Loại:** `A` | **Tên:** `@` | **Giá trị:** `<IP_VPS_CỦA_BẠN>` | **TTL:** Auto (Nếu dùng Cloudflare, tạm thời để **DNS Only / Xám** để chuẩn bị cấp chứng chỉ Let's Encrypt ở Phase 10).
- **Loại:** `A` | **Tên:** `www` | **Giá trị:** `<IP_VPS_CỦA_BẠN>` | **TTL:** Auto.

### 4.2. Tạo và Kích Hoạt File Cấu Hình Nginx
Thực hiện trên VPS (quyền `sudo`):
```bash
# Tạo file cấu hình
sudo nano /etc/nginx/sites-available/portfolio
# (Dán nội dung mục 3.1 vào và sửa yourdomain.com thành domain thật)

# Xóa cấu hình mặc định default để tránh xung đột
sudo rm -f /etc/nginx/sites-enabled/default

# Tạo symbolic link kích hoạt site
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio

# Kiểm tra tính đúng đắn của cú pháp Nginx
sudo nginx -t

# Nạp lại cấu hình Nginx
sudo systemctl reload nginx
```

---

## 5. Kết Quả Mong Đợi
- Lệnh `sudo nginx -t` trả về thông điệp:
  ```
  nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
  nginx: configuration file /etc/nginx/nginx.conf test is successful
  ```
- Nginx reload thành công mà không gặp lỗi service.

---

## 6. Cách Kiểm Tra
1. **Kiểm tra phân giải DNS:**
   Tại máy tính cá nhân gõ:
   ```bash
   ping yourdomain.com
   # hoặc: nslookup yourdomain.com
   ```
   Kết quả: Trả về chính xác địa chỉ IP VPS của bạn.

2. **Kiểm tra truy cập qua tên miền (HTTP):**
   Mở trình duyệt truy cập: `http://yourdomain.com`.
   Kết quả: Website Portfolio hiển thị giao diện danh sách dự án (chuyển tiếp thành công từ container Next.js).

---

## 7. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `502 Bad Gateway` khi vào domain | Container `portfolio_app_prod` chưa chạy hoặc chưa lắng nghe trên cổng 3000 | 1. Chạy `docker ps` kiểm tra container có đang `Up` không.<br>2. Kiểm tra `curl http://127.0.0.1:3000` trên VPS xem app có phản hồi không. |
| `413 Request Entity Too Large` khi upload ảnh bìa | Nginx mặc định chỉ cho upload tối đa 1MB | Thêm dòng `client_max_body_size 10M;` vào khối `server { ... }` của file cấu hình Nginx rồi chạy `sudo systemctl reload nginx`. |
| `nginx: [emerg] a duplicate default server` | Có hai file cấu hình cùng lắng nghe `default_server` | Xóa liên kết mặc định: `sudo rm /etc/nginx/sites-enabled/default` và reload lại. |
