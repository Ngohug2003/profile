# PHASE 12: Sao Lưu Tự Động (Offsite Backup), Xoay Vòng Log & Security Checklist Cuối Cùng

Tài liệu này hướng dẫn thiết lập hệ thống sao lưu tự động định kỳ cho Cơ sở dữ liệu và Thư mục ảnh Upload (sử dụng `pg_dump` kết hợp `rclone` đẩy dữ liệu ra bên ngoài máy chủ VPS), cấu hình xoay vòng log (Logrotate) chống tràn ổ cứng và bảng kiểm tra an ninh (Security Checklist) toàn diện trước khi chính thức bàn giao vận hành.

---

## 1. Mục Tiêu
- **Sao lưu tự động phía Supabase Cloud:** Supabase tự động quản lý Daily Backups và Point-in-Time Recovery (PITR) cho PostgreSQL cũng như bảo toàn dữ liệu Storage CDN mà không tốn tài nguyên VPS.
- **Hạ tầng VPS không trạng thái (Stateless):** Do không lưu DB và ảnh trên ổ đĩa VPS, nếu VPS gặp sự cố phần cứng, bạn có thể tạo mới VPS khác và triển khai lại chỉ trong 2-3 phút mà không lo mất mát dữ liệu.
- Cấu hình Logrotate cho Docker container và Nginx để tránh tình trạng log phình to làm cạn kiệt dung lượng ổ đĩa.
- Rà soát bảng kiểm an ninh cuối cùng trước khi công bố website ra công chúng.

> [!TIP]
> **Lợi ích vượt trội của kiến trúc Supabase Cloud:**
> Toàn bộ dữ liệu khách hàng (Leads) và danh mục dự án được Supabase bảo vệ bằng hạ tầng đám mây phân tán tại Singapore AWS ap-southeast-1. VPS chỉ thuần túy đóng vai trò tính toán (Compute Layer), giúp loại bỏ hoàn toàn các lỗi sập ổ cứng do phình to dung lượng `pg_dump`.

---

## 2. File Cần Tạo / Sửa Trên VPS
1. `scripts/backup.sh` — Script sao lưu DB và ảnh upload, đồng bộ lên Cloud.
2. `/etc/cron.d/portfolio-backup` — Lịch biểu tự động chạy cronjob.
3. `/etc/logrotate.d/portfolio` — Cấu hình xoay vòng log cho hệ thống.

---

## 3. Nội Dung File Hoàn Chỉnh

### 3.1. `scripts/backup.sh`
```bash
#!/usr/bin/env bash
set -e

# Khai báo các biến đường dẫn
DEPLOY_DIR="/home/deploy/portfolio"
BACKUP_DIR="${DEPLOY_DIR}/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_BACKUP_FILE="${BACKUP_DIR}/db_portfolio_${TIMESTAMP}.sql.gz"
UPLOADS_BACKUP_FILE="${BACKUP_DIR}/uploads_portfolio_${TIMESTAMP}.tar.gz"

# Đọc các biến cấu hình từ file .env.production
if [ -f "${DEPLOY_DIR}/.env.production" ]; then
  export $(grep -v '^#' "${DEPLOY_DIR}/.env.production" | xargs)
fi

mkdir -p "$BACKUP_DIR"

echo "=== [1/4] Đang sao lưu Database PostgreSQL ==="
docker exec portfolio_postgres_prod pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" | gzip > "$DB_BACKUP_FILE"

echo "=== [2/4] Đang sao lưu Thư mục Ảnh Upload từ Docker Volume ==="
# Mount volume vào container phụ tạm thời để nén thành file tar.gz
docker run --rm \
  -v portfolio_uploads_data:/volume_data:ro \
  -v "${BACKUP_DIR}:/backup" \
  alpine \
  tar -czf "/backup/uploads_portfolio_${TIMESTAMP}.tar.gz" -C /volume_data .

echo "=== [3/4] Đẩy bản sao lưu ra Cloud Storage qua rclone ==="
# Cần cấu hình remote 'rclone_remote' trước trong rclone config
if command -v rclone &> /dev/null && rclone listremotes | grep -q "rclone_remote:"; then
  rclone copy "$DB_BACKUP_FILE" rclone_remote:portfolio-backups/database/
  rclone copy "$UPLOADS_BACKUP_FILE" rclone_remote:portfolio-backups/uploads/
  echo "Đã đẩy bản sao lưu ra Cloud Storage ngoài VPS thành công."
else
  echo "[CẢNH BÁO] Chưa cấu hình rclone hoặc remote rclone_remote chưa tồn tại. Bản sao chỉ được lưu cục bộ trên VPS."
fi

echo "=== [4/4] Dọn dẹp các bản sao lưu cũ trên VPS (xóa file cũ hơn 7 ngày) ==="
find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +7 -delete

echo "=== Quy trình sao lưu hoàn tất: ${TIMESTAMP} ==="
```

### 3.2. Cấu hình Cron Job: `/etc/cron.d/portfolio-backup`
```cron
# Chạy sao lưu vào lúc 02:00 sáng mỗi ngày dưới quyền user deploy
0 2 * * * deploy /bin/bash /home/deploy/portfolio/scripts/backup.sh >> /home/deploy/portfolio/backups/backup.log 2>&1
```

### 3.3. Cấu hình Giới Hạn Log Docker (`/etc/docker/daemon.json`)
Tránh tình trạng các container Next.js và Postgres ghi log làm đầy ổ cứng VPS sau nhiều tháng vận hành:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "20m",
    "max-file": "3"
  }
}
```

---

## 4. Hướng Dẫn Cài Đặt và Cấu Hình `rclone` (Đẩy Backup Ra Ngoài VPS)

### 4.1. Cài đặt `rclone` trên Ubuntu
```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

### 4.2. Cấu hình kết nối tới Storage Đám Mây (Ví dụ Cloudflare R2 hoặc S3)
Chạy trình cấu hình tương tác:
```bash
rclone config
```
- Chọn `n` (New remote).
- Đặt tên remote: `rclone_remote`.
- Loại lưu trữ: Chọn `s3` (Dùng chung cho AWS S3, Cloudflare R2, MinIO, Backblaze B2).
- Nhập `access_key_id` và `secret_access_key`.
- Nhập `endpoint` (nếu dùng Cloudflare R2).

Kiểm tra kết nối bằng cách liệt kê bucket:
```bash
rclone lsd rclone_remote:
```

---

## 5. Command Chính Xác Để Chạy

### 5.1. Phân quyền thực thi script sao lưu
```bash
chmod +x /home/deploy/portfolio/scripts/backup.sh
```

### 5.2. Chạy thử nghiệm sao lưu ngay lập tức
```bash
bash /home/deploy/portfolio/scripts/backup.sh
```

### 5.3. Kiểm tra file backup sinh ra trong thư mục
```bash
ls -lh /home/deploy/portfolio/backups/
```

### 5.4. Kích hoạt cấu hình giới hạn log Docker
```bash
sudo nano /etc/docker/daemon.json
# (Dán nội dung mục 3.3 vào)
sudo systemctl restart docker
```

---

## 6. Security Checklist Cuối Cùng Trước Khi Go-Live

Trước khi công bố đường link Portfolio ra công chúng, hãy kiểm tra lần lượt từng mục sau:

| STT | Hạng mục kiểm tra | Tiêu chuẩn đạt | Trạng thái |
| :---: | :--- | :--- | :---: |
| 1 | **Tường lửa UFW** | Chỉ mở port `22`, `80`, `443`. Port `5432` và `3000` tuyệt đối không xuất hiện trong `ufw status`. | [ ] ĐẠT |
| 2 | **PostgreSQL Exposure** | Container Postgres chỉ chạy trong Docker network nội bộ, không có ánh xạ `- "5432:5432"` trên production compose. | [ ] ĐẠT |
| 3 | **Git Secrets Leak** | Kiểm tra repo GitHub không chứa `.env`, `.env.production` hay bất kỳ private key SSH nào. | [ ] ĐẠT |
| 4 | **Phân quyền File trên VPS** | File `.env.production` chỉ cho phép user `deploy` đọc: `chmod 600 .env.production`. | [ ] ĐẠT |
| 5 | **Non-Root Container** | Container Next.js chạy dưới định danh `USER nextjs` (UID 1001), không chạy bằng `root`. | [ ] ĐẠT |
| 6 | **HTTPS & SSL Rating** | Website truy cập hoàn toàn qua HTTPS, kiểm tra trên Qualys SSL Labs đạt điểm **A** hoặc **A+**. | [ ] ĐẠT |
| 7 | **Admin Security** | Mật khẩu `ADMIN_PASSWORD` có độ dài tối thiểu 16 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt. | [ ] ĐẠT |
| 8 | **Thử nghiệm Khôi phục (Disaster Recovery)** | Đã test thử lệnh giải nén và restore file `.sql.gz` vào database phụ để đảm bảo file backup không bị rỗng hay lỗi cú pháp. | [ ] ĐẠT |

---

## 7. Lỗi Thường Gặp & Cách Xử Lý

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| File `.sql.gz` sinh ra dung lượng 0 byte | Container `portfolio_postgres_prod` chưa chạy hoặc sai tên database/user | Kiểm tra log lệnh `pg_dump` bằng cách chạy trực tiếp: `docker exec portfolio_postgres_prod pg_dump -U ...` để xem mã lỗi chi tiết của Postgres. |
| Cronjob không tự động chạy lúc 2 giờ sáng | File `/etc/cron.d/portfolio-backup` bị sai quyền hạn hoặc thiếu ký tự xuống dòng ở cuối file | 1. Phân quyền file cron: `sudo chmod 644 /etc/cron.d/portfolio-backup`.<br>2. Đảm bảo file kết thúc bằng một dòng trống mới (newline).<br>3. Kiểm tra log hệ thống: `grep CRON /var/log/syslog`. |
| VPS bị đầy 100% dung lượng ổ cứng sau 1 tháng | Docker log tích lũy quá lớn hoặc các bản backup cục bộ không được dọn dẹp | 1. Cấu hình `/etc/docker/daemon.json` giới hạn dung lượng log.<br>2. Chạy lệnh dọn rác: `docker system prune -af`. |
