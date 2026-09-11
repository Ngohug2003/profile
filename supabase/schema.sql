-- ==============================================================================
-- SUPABASE SCHEMA: PERSONAL PORTFOLIO & CLIENT LEADS
-- ==============================================================================
-- Chạy toàn bộ file script này trong tab "SQL Editor" tại Dashboard Supabase của bạn
-- Script sẽ tự động:
--   1. Tạo bảng `projects` (Danh sách sản phẩm / dự án showcase)
--   2. Tạo bảng `contacts` (Yêu cầu tư vấn & thông tin khách hàng tiềm năng)
--   3. Kích hoạt Row Level Security (RLS) bảo vệ dữ liệu
--   4. Thiết lập Storage Bucket `project-covers` để lưu trữ ảnh tải lên
--   5. Nạp sẵn dữ liệu mẫu cho 4 dự án ban đầu
-- ==============================================================================

-- 1. BẢNG DỰ ÁN (PROJECTS)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  category varchar(100),
  description text not null,
  "techStack" text[] default '{}',
  features text[] default '{}',
  "imageUrl" varchar(500) not null,
  domain varchar(500),
  "createdAt" timestamptz default now() not null,
  "updatedAt" timestamptz default now() not null
);

-- Kích hoạt Row Level Security (RLS)
alter table public.projects enable row level security;

-- Policies cho bảng projects
drop policy if exists "Allow public select projects" on public.projects;
create policy "Allow public select projects"
  on public.projects for select
  using (true);

drop policy if exists "Allow public insert projects" on public.projects;
create policy "Allow public insert projects"
  on public.projects for insert
  with check (true);

drop policy if exists "Allow public update projects" on public.projects;
create policy "Allow public update projects"
  on public.projects for update
  using (true)
  with check (true);

drop policy if exists "Allow public delete projects" on public.projects;
create policy "Allow public delete projects"
  on public.projects for delete
  using (true);


-- 2. BẢNG YÊU CẦU TƯ VẤN (CONTACTS)
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  "fullName" varchar(255) not null,
  phone varchar(50) not null,
  email varchar(255),
  service varchar(100) default 'Tư vấn landing page' not null,
  message text,
  status varchar(50) default 'NEW' not null, -- 'NEW', 'CONTACTED', 'COMPLETED'
  "createdAt" timestamptz default now() not null,
  "updatedAt" timestamptz default now() not null
);

-- Kích hoạt Row Level Security (RLS)
alter table public.contacts enable row level security;

-- Policies cho bảng contacts
drop policy if exists "Allow public insert contacts" on public.contacts;
create policy "Allow public insert contacts"
  on public.contacts for insert
  with check (true);

drop policy if exists "Allow public select contacts" on public.contacts;
create policy "Allow public select contacts"
  on public.contacts for select
  using (true);

drop policy if exists "Allow public update contacts" on public.contacts;
create policy "Allow public update contacts"
  on public.contacts for update
  using (true)
  with check (true);

drop policy if exists "Allow public delete contacts" on public.contacts;
create policy "Allow public delete contacts"
  on public.contacts for delete
  using (true);


-- 2.1 BẢNG QUẢN TRỊ VIÊN (USERS)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) unique not null,
  password varchar(255) not null,
  role varchar(50) default 'ADMIN' not null,
  "createdAt" timestamptz default now() not null,
  "updatedAt" timestamptz default now() not null
);

alter table public.users enable row level security;

drop policy if exists "Allow public select users" on public.users;
create policy "Allow public select users"
  on public.users for select
  using (true);

-- Nạp sẵn tài khoản Admin ban đầu (Mật khẩu: Anhhung999@)
insert into public.users (id, email, password, role)
values (
  'e413808c-2bc6-4a87-b47f-929f43bd3a13',
  'ngoviethung0911@gmail.com',
  '$2b$10$mUJr/dKpFtRqe1B2FX5lcePuTeFnPJn28kqC.YGbDQcNhA7TC7hzK',
  'ADMIN'
)
on conflict (email) do update set password = excluded.password;


-- 3. CẤU HÌNH STORAGE BUCKET CHO ẢNH BÌA DỰ ÁN (PROJECT-COVERS)
-- Tạo bucket public nếu chưa tồn tại
insert into storage.buckets (id, name, public)
values ('project-covers', 'project-covers', true)
on conflict (id) do update set public = true;

-- Policies cho Storage
drop policy if exists "Public Access project-covers" on storage.objects;
create policy "Public Access project-covers"
  on storage.objects for select
  using (bucket_id = 'project-covers');

drop policy if exists "Public Upload project-covers" on storage.objects;
create policy "Public Upload project-covers"
  on storage.objects for insert
  with check (bucket_id = 'project-covers');

drop policy if exists "Public Delete project-covers" on storage.objects;
create policy "Public Delete project-covers"
  on storage.objects for delete
  using (bucket_id = 'project-covers');


-- 4. DỮ LIỆU MẪU BAN ĐẦU CHO PORTFOLIO (SEED DATA)
insert into public.projects (id, name, category, description, "techStack", features, "imageUrl", domain)
values
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'V LUXURY REAL ESTATE',
    'Landing Page',
    'Website giới thiệu căn hộ & biệt thự nghỉ dưỡng cao cấp với giao diện Dark Mode sang trọng, tối ưu tỷ lệ chuyển đổi khách VIP.',
    array['Next.js 16', 'Tailwind CSS', 'Framer Motion', 'PostgreSQL'],
    array['Điểm PageSpeed Mobile 98/100', 'Tích hợp bộ tính lãi vay thông minh', 'Form thu lead tự động qua Telegram'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    'https://luxury-demo.hungdev.studio'
  ),
  (
    'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e',
    'ECO FRESH ORGANIC',
    'Website Bán Hàng',
    'Nền tảng thương mại điện tử chuyên nông sản hữu cơ sạch, trải nghiệm đặt hàng 1-click mượt mà, tối ưu thanh toán chuyển khoản QR.',
    array['Next.js 16', 'React 19', 'Tailwind CSS', 'PostgreSQL'],
    array['Thanh toán VietQR động tức thì', 'Giao diện thân thiện người lớn tuổi', 'Chuẩn SEO Onpage Top 1 Google'],
    'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    'https://ecofresh-demo.hungdev.studio'
  ),
  (
    'c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f',
    'NOVA SAAS ANALYTICS',
    'Landing Page',
    'Landing page giới thiệu giải pháp phần mềm quản trị AI, giao diện phong cách Linear/Vercel với hiệu ứng micro-animations mượt mà 120fps.',
    array['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'PostgreSQL'],
    array['Interactive Dashboard Demo sống động', 'Tối ưu Core Web Vitals loại A', 'Tích hợp thanh toán quốc tế Stripe'],
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    'https://nova-demo.hungdev.studio'
  ),
  (
    'd4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a',
    'NEXUS ARCHITECTURE',
    'Web Doanh Nghiệp',
    'Website hồ sơ năng lực dành cho studio kiến trúc & nội thất đương đại, tôn vinh hình ảnh không gian sống tinh tế, chuẩn quốc tế.',
    array['Next.js 16', 'Tailwind CSS', 'Framer Motion', 'PostgreSQL'],
    array['Bộ sưu tập công trình đa góc nhìn', 'Đạt chứng nhận thiết kế Awwwards Nominee', 'Tải ảnh WebP nén không giảm chất lượng'],
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    'https://nexus-demo.hungdev.studio'
  )
on conflict (id) do nothing;
