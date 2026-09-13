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
  async rewrites() {
    return [
      {
        source: '/full-stack-developer-cv-ngo-viet-hung.pdf',
        destination: '/cv',
      },
    ];
  },
};

// Tự động reload Prisma Client khi cấu hình thay đổi
export default nextConfig;

