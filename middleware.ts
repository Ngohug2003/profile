import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyJWT } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 1. Nhận diện subdomain "project"
  const isProjectSubdomain =
    host.startsWith("project.hungworks.io.vn") ||
    host.startsWith("project.localhost") ||
    host.startsWith("project.");

  if (isProjectSubdomain) {
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/project", request.url));
    }
  }

  // 2. Bảo vệ các route /admin
  if (url.pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? await verifyJWT(token) : null;
    const isAuthenticatedAdmin = payload !== null && payload.role === "ADMIN";

    // Nếu đang vào trang login
    if (url.pathname === "/admin/login") {
      // Đã đăng nhập rồi thì chuyển hướng thẳng vào dashboard
      if (isAuthenticatedAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Với tất cả các trang /admin khác: bắt buộc phải có token admin hợp lệ
    if (!isAuthenticatedAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);

      // Nếu token rác hoặc hết hạn, xóa cookie luôn để sạch sẽ
      if (token) {
        response.cookies.delete(COOKIE_NAME);
      }
      return response;
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

