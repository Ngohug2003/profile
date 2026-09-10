import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3001';
const ADMIN_PASSWORD = 'prod_admin_password_987';

async function runTest() {
  console.log('--- BẮT ĐẦU KIỂM THỬ PHASE 5: FULL-STACK PROD LOCAL & NAMED VOLUME ---');

  // 1. Kiểm tra Health Endpoint
  console.log('\n[1/5] Kiểm tra Healthcheck...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  console.log('Healthcheck status:', healthRes.status, healthData);
  if (healthRes.status !== 200 || healthData.status !== 'healthy') {
    throw new Error('Healthcheck thất bại!');
  }

  // 2. Đăng nhập Admin
  console.log('\n[2/5] Đăng nhập Admin qua API...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  });
  console.log('Login HTTP status:', loginRes.status);
  const loginData = await loginRes.json();
  console.log('Login response:', loginData);

  const setCookie = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie received:', setCookie ? 'Đã nhận cookie phiên làm việc' : 'KHÔNG CÓ COOKIE');
  if (!setCookie) {
    throw new Error('Không nhận được cookie xác thực admin!');
  }
  const cookieHeader = setCookie.split(';')[0];

  // 3. Upload ảnh bìa dự án
  console.log('\n[3/5] Upload ảnh mẫu vào Named Volume (/app/public/uploads)...');
  const sampleImagePath = path.join(process.cwd(), 'public', 'hung_developer_avatar.png');
  const imageBuffer = fs.readFileSync(sampleImagePath);
  const blob = new Blob([imageBuffer], { type: 'image/png' });

  const formData = new FormData();
  formData.append('file', blob, 'test_phase5_upload.png');

  const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
    },
    body: formData,
  });
  console.log('Upload HTTP status:', uploadRes.status);
  const uploadData = await uploadRes.json();
  console.log('Upload response:', uploadData);

  if (!uploadData.url) {
    throw new Error('Upload ảnh thất bại: ' + JSON.stringify(uploadData));
  }
  const uploadedImageUrl = uploadData.url;

  // 4. Tạo dự án mới kèm ảnh vừa upload
  console.log('\n[4/5] Tạo dự án mới kèm ảnh bìa vừa upload...');
  const createRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      name: 'Dự Án Kiểm Thử Named Volume Prod',
      category: 'Web App',
      description: 'Dự án này được tạo tự động trong Phase 5 để kiểm tra tính bền vững của Named Volume khi container bị restart.',
      techStack: 'Next.js 16, PostgreSQL, Docker Compose, Tailwind CSS v4',
      features: 'Mô phỏng 100% môi trường Production, Lưu trữ Named Volume độc lập, Multi-stage Docker',
      imageUrl: uploadedImageUrl,
      domain: 'http://localhost:3001',
    }),
  });
  console.log('Create Project HTTP status:', createRes.status);
  const createData = await createRes.json();
  console.log('Create Project response:', createData.name ? 'Tạo thành công ID: ' + createData.id : createData);

  // 5. Kiểm tra truy cập ảnh trực tiếp qua HTTP
  console.log('\n[5/5] Kiểm tra tải ảnh trực tiếp qua HTTP GET...');
  const fetchImageRes = await fetch(`${BASE_URL}${uploadedImageUrl}`);
  console.log(`GET ${uploadedImageUrl} -> Status:`, fetchImageRes.status, 'Content-Type:', fetchImageRes.headers.get('content-type'));
  if (fetchImageRes.status !== 200) {
    throw new Error('Không thể tải ảnh qua URL công khai!');
  }

  console.log('\n>>> BƯỚC KIỂM TRA ĐẦU TIÊN THÀNH CÔNG RỰC RỠ! URL ẢNH:', uploadedImageUrl);
  return { uploadedImageUrl, projectId: createData.id };
}

runTest().catch((err) => {
  console.error('Lỗi kiểm thử:', err);
  process.exit(1);
});
