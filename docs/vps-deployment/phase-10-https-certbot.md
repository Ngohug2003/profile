# PHASE 10: Thiết Lập HTTPS Với Let's Encrypt (Certbot) & Tự Động Gia Hạn

Tài liệu này hướng dẫn cấp phát chứng chỉ số SSL/TLS miễn phí từ tổ chức Let's Encrypt thông qua công cụ Certbot, thiết lập tự động chuyển hướng toàn bộ lưu lượng HTTP (cổng 80) sang HTTPS (cổng 443) an toàn, kích hoạt cơ chế tự động gia hạn (Auto-Renew) và các lưu ý then chốt khi sử dụng kèm dịch vụ Proxy của Cloudflare.

---

## 1. Mục Tiêu
- Cài đặt Certbot và Nginx plugin chính thức thông qua Snap Daemon trên Ubuntu 24.04.
- Xin chứng chỉ SSL/TLS cho cả hai tên miền `yourdomain.com` và `www.yourdomain.com`.
- Tự động cấu hình Nginx kích hoạt HTTPS và chuyển hướng 301 từ HTTP sang HTTPS.
- Kiểm tra tính năng tự động gia hạn (Auto-renewal dry run) để đảm bảo chứng chỉ không bao giờ bị hết hạn đột ngột sau 90 ngày.
- Nắm rõ cách xử lý khi tên miền được quản lý qua Cloudflare (tắt tạm thời Orange Cloud Proxy khi xin cấp chứng chỉ lần đầu).

---

## 2. File Cần Tạo / Sửa
1. `/etc/nginx/sites-available/portfolio` — Sẽ được Certbot tự động cập nhật các khối cấu hình SSL (`ssl_certificate`, `ssl_certificate_key`, v.v.).
2. `/etc/letsencrypt/renewal/yourdomain.com.conf` — File cấu hình quy tắc gia hạn của Certbot.

---

## 3. Cảnh Báo Quan Trọng Về Cloudflare Proxy (Orange Cloud)

> [!WARNING]
> **Vấn đề xung đột HTTP-01 Challenge:**
> - Let's Encrypt sử dụng giao thức HTTP-01 challenge để xác thực quyền sở hữu tên miền: máy chủ Let's Encrypt sẽ gọi tới `http://yourdomain.com/.well-known/acme-challenge/...` để kiểm tra file xác thực trên VPS của bạn.
> - Nếu bạn đang bật tính năng **Proxy (Đám mây màu cam)** của Cloudflare, lưu lượng từ Let's Encrypt sẽ đi vào máy chủ của Cloudflare chứ không tới thẳng VPS, dẫn đến lỗi xác thực `403 Forbidden` hoặc `Invalid response`.
> - **Giải pháp:** Trước khi chạy lệnh `certbot`, hãy vào Dashboard Cloudflare -> DNS -> Chuyển trạng thái các bản ghi `@` và `www` từ **Proxied (Màu cam)** sang **DNS Only (Màu xám)**. Sau khi xin cấp chứng chỉ thành công, bạn có thể bật lại Proxy nếu muốn (chọn chế độ SSL/TLS tại Cloudflare là **Full (Strict)**).

---

## 4. Command Chính Xác Để Chạy

Thực hiện trên VPS (quyền `sudo`):

### 4.1. Cài đặt Certbot qua Snapd
```bash
# Đảm bảo hệ thống snapd đã được cập nhật phiên bản mới nhất
sudo snap install core; sudo snap refresh core

# Gỡ bỏ các bản cài certbot cũ từ apt (nếu có)
sudo apt-get remove certbot -y

# Cài đặt Certbot chính thức
sudo snap install --classic certbot

# Tạo symlink để có thể gọi lệnh certbot từ bất kỳ đâu
sudo ln -sf /snap/bin/certbot /usr/bin/certbot
```

### 4.2. Xin Cấp Chứng Chỉ và Tự Động Cấu Hình Nginx
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
*Trong quá trình chạy, Certbot sẽ yêu cầu:*
1. Nhập địa chỉ Email để nhận thông báo khẩn cấp khi chứng chỉ sắp hết hạn.
2. Đồng ý điều khoản sử dụng dịch vụ (chọn `Y`).
3. Hỏi bạn có muốn chia sẻ email cho tổ chức EFF không (chọn `Y` hoặc `N`).

### 4.3. Kiểm Tra Cấu Hình Nginx Đã Cập Nhật
Certbot sẽ tự động chèn các dòng cấu hình SSL vào file `/etc/nginx/sites-available/portfolio`. Hãy kiểm tra lại cú pháp:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4.4. Kiểm Tra Thử Nghiệm Tính Năng Tự Động Gia Hạn (Dry Run)
Certbot trên Ubuntu được quản lý gia hạn tự động bởi Systemd Timer (`certbot.timer`). Hãy chạy lệnh giả lập gia hạn:
```bash
sudo certbot renew --dry-run
```

---

## 5. Kết Quả Mong Đợi
- Certbot hoàn tất với thông báo:
  ```
  Successfully received certificate.
  Certificate is saved at: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
  Key is saved at:         /etc/letsencrypt/live/yourdomain.com/privkey.pem
  Deploying certificate
  Successfully deployed certificate for yourdomain.com to /etc/nginx/sites-enabled/portfolio
  Congratulations! You have successfully enabled HTTPS on https://yourdomain.com
  ```
- Lệnh `certbot renew --dry-run` trả về: `All simulated renewals succeeded`.
- Mọi truy cập vào `http://yourdomain.com` đều tự động được chuyển hướng sang `https://yourdomain.com`.

---

## 6. Cách Kiểm Tra
1. **Kiểm tra biểu tượng Ổ Khóa An Toàn trên trình duyệt:**
   Mở trình duyệt (Chrome/Firefox/Edge) truy cập `https://yourdomain.com`.
   Kết quả: Biểu tượng ổ khóa màu xám hiển thị trước thanh địa chỉ, chứng chỉ ghi nhận được cấp bởi **Let's Encrypt**.

2. **Kiểm tra tự động chuyển hướng HTTP -> HTTPS:**
   Dùng lệnh `curl` kiểm tra phản hồi mã trạng thái:
   ```bash
   curl -I http://yourdomain.com
   ```
   Kết quả: Phản hồi mã `HTTP/1.1 301 Moved Permanently` với header `Location: https://yourdomain.com/`.

3. **Kiểm tra Systemd Timer gia hạn:**
   ```bash
   systemctl list-timers | grep certbot
   ```
   Kết quả: Hiển thị thời gian kích hoạt định kỳ 2 lần mỗi ngày để kiểm tra gia hạn.

---

## 7. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `Certbot failed to authenticate some domains (Invalid response)` | Tên miền chưa trỏ đúng IP VPS hoặc đang bật Cloudflare Orange Proxy | 1. Dùng `ping yourdomain.com` xem IP đã về đúng VPS chưa.<br>2. Tắt Orange Cloud trên Cloudflare (chuyển sang DNS only).<br>3. Kiểm tra cổng 80 có đang mở trên UFW: `sudo ufw status`. |
| `Too many certificates already issued for exact set of domains` | Bạn yêu cầu cấp chứng chỉ quá 5 lần/tuần cho cùng 1 bộ domain (Rate Limit của Let's Encrypt) | Chờ đợi hết thời hạn phạt của Let's Encrypt hoặc thêm một subdomain phụ (ví dụ `app.yourdomain.com`) để tạo bộ domain mới. |
| `ERR_TOO_MANY_REDIRECTS` sau khi bật lại Cloudflare Proxy | Chế độ SSL trên Cloudflare đang để là "Flexible" | Vào Cloudflare Dashboard -> SSL/TLS -> Chọn chế độ **Full** hoặc **Full (Strict)** để đồng bộ mã hóa từ Cloudflare tới VPS. |
