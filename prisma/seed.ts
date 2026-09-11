import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Bắt đầu nạp dữ liệu mẫu cho Personal Portfolio ---');

  // =============================================
  // 1. Seed Admin User (upsert để không bị trùng)
  // =============================================
  const adminEmail = 'ngoviethung0911@gmail.com';
  const adminPassword = 'Anhhung999@';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${adminUser.email} (Role: ${adminUser.role})`);

  // =============================================
  // 2. Seed Sample Projects
  // =============================================
  await prisma.project.deleteMany({});

  const sampleProjects = [
    {
      name: 'SHOPZONE',
      category: 'E-Commerce',
      description: 'Cửa hàng phụ kiện âm thanh cao cấp với tính năng lọc sản phẩm nhanh, thanh toán mượt mà và giao diện tối giản.',
      techStack: ['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
      features: ['Tốc độ load dưới 1.5s', 'Hỗ trợ thanh toán nhanh', 'Đạt 98 điểm di động'],
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      domain: 'https://shopzone-demo.dev',
    },
    {
      name: 'VELOCE CHRONO',
      category: 'Landing Page',
      description: 'Trang sản phẩm đồng hồ titan cao cấp với các hiệu ứng chuyển động mượt mà, cấu trúc tăng tối đa chuyển đổi mua hàng.',
      techStack: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
      features: ['Responsive 100%', 'Tối ưu hóa chuyển đổi', 'Tải trang tức thì'],
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      domain: 'https://veloce-demo.dev',
    },
    {
      name: 'HƯNG DEV STUDIO',
      category: 'Web Doanh Nghiệp',
      description: 'Hệ thống website thương hiệu và nền tảng dịch vụ tối ưu SEO, tự động hóa quản trị và vận hành trên VPS.',
      techStack: ['Next.js 16', 'TypeScript', 'Docker', 'Ubuntu 24.04', 'Nginx'],
      features: ['Tự động triển khai CI/CD', 'Chứng chỉ SSL A+', 'Sao lưu đám mây định kỳ'],
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      domain: 'https://hungwebstudio.tech',
    },
    {
      name: 'NEXUS ARCHITECTURE',
      category: 'Web Doanh Nghiệp',
      description: 'Trang giới thiệu studio kiến trúc cao cấp phong cách tối giản Bắc Âu, bố cục thoáng đãng và tối ưu tốc độ 100/100.',
      techStack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
      features: ['Phong cách tối giản Bắc Âu', 'Tải trang dưới 0.6s', 'Chuẩn SEO Google 100%'],
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      domain: 'https://nexus-arch.dev',
    },
  ];

  for (const item of sampleProjects) {
    const p = await prisma.project.create({
      data: item,
    });
    console.log(`Đã tạo dự án mẫu: ${p.name} [${p.category}] (ID: ${p.id})`);
  }

  console.log('--- Nạp dữ liệu mẫu hoàn tất thành công! ---');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
