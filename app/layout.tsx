import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hưng Dev Studio | Thiết kế Website Chuyên Nghiệp & Chuẩn SEO",
  description: "Dịch vụ thiết kế Landing Page độc quyền, thiết lập Website bán hàng tinh gọn và tối ưu hóa cấu trúc SEO onpage. Tốc độ tải cực nhanh, tương thích mọi thiết bị di động.",
  keywords: "thiết kế website, thiết kế landing page, làm website bán hàng, tối ưu seo, seo onpage, website chuẩn seo, lập trình nextjs, hưng dev studio, hung dev studio",
  authors: [{ name: "Ngọ Viết Hưng", url: "https://hungdev.studio" }],
  creator: "Ngọ Viết Hưng",
  publisher: "Hưng Dev Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://hungdev.studio",
    title: "Hưng Dev Studio | Thiết kế Website Chuyên Nghiệp & Chuẩn SEO",
    description: "Tối ưu hóa tỷ lệ chuyển đổi khách hàng và tốc độ tải trang vượt trội với công nghệ Next.js và Tailwind CSS. Cam kết điểm số PageSpeed xanh tối đa.",
    siteName: "Hưng Dev Studio",
    images: [
      {
        url: "https://hungdev.studio/og-image.png", // Fallback URL for social previews
        width: 1200,
        height: 630,
        alt: "Hưng Dev Studio - Thiết kế Web & SEO chuyên nghiệp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hưng Dev Studio | Thiết kế Website Chuyên Nghiệp & Chuẩn SEO",
    description: "Thiết kế website tốc độ cao, giao diện Apple tối giản, chuẩn cấu trúc SEO giúp gia tăng doanh số tự nhiên.",
    images: ["https://hungdev.studio/og-image.png"],
  },
  alternates: {
    canonical: "https://hungdev.studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fafafa] text-[#09090b] selection:bg-blue-100 selection:text-blue-900">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
