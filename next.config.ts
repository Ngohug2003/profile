import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js config - standalone mode for Docker production
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

// Tự động reload Prisma Client khi cấu hình thay đổi
export default nextConfig;

