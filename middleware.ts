import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Nhận diện subdomain "project"
  // Hỗ trợ cả test local (project.localhost:3000) và domain production (project.hungworks.io.vn)
  const isProjectSubdomain =
    host.startsWith("project.hungworks.io.vn") ||
    host.startsWith("project.localhost") ||
    host.startsWith("project.");

  if (isProjectSubdomain) {
    // Khi truy cập trang chủ subdomain (http://project.localhost:3000/)
    // Next.js sẽ ngầm chuyển tiếp sang route /project mà thanh địa chỉ trình duyệt vẫn giữ nguyên URL subdomain
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/project", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Loại trừ các file tĩnh, ảnh, thư mục uploads và api route để tối ưu hiệu năng
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|.*\\..*).*)",
  ],
};
