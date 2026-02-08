import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    const auth = await getAuthFromRequest(request);
    if (auth) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const auth = await getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/sections") || pathname.startsWith("/api/gallery") || pathname.startsWith("/api/menu") || pathname.startsWith("/api/submissions") || pathname.startsWith("/api/settings")) {
    if (request.method !== "GET" && !pathname.startsWith("/api/contact")) {
      const auth = await getAuthFromRequest(request);
      if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/sections/:path*", "/api/gallery/:path*", "/api/menu/:path*", "/api/submissions/:path*", "/api/settings/:path*"],
};
