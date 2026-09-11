import bcrypt from 'bcryptjs';

// Script tạo admin user trực tiếp qua Supabase connection
// Chạy: npx tsx prisma/seed-admin.ts

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  // Dynamic import để tránh conflict với dev server
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  });

  const adminEmail = 'ngoviethung0911@gmail.com';
  const adminPassword = 'Anhhung999@';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created/updated successfully!`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   ID: ${user.id}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
