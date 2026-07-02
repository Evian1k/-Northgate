/**
 * Middleware: protect /admin routes (except /admin/login).
 * If no valid access cookie, redirect to /admin/login.
 */
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_COOKIE = "ng_access";
const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production-must-be-32+chars"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin and /student routes
  const isAdmin = pathname.startsWith("/admin");
  const isStudent = pathname.startsWith("/student");
  if (!isAdmin && !isStudent) return NextResponse.next();

  if (pathname === "/admin/login" || pathname === "/student/login") return NextResponse.next();

  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = isAdmin ? "/admin/login" : "/student/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    if (isAdmin && payload.role !== "ADMIN" && payload.role !== "EDITOR") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "forbidden");
      return NextResponse.redirect(url);
    }
    if (isStudent && payload.role !== "STUDENT" && payload.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/student/login";
      url.searchParams.set("error", "forbidden");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    // Try refresh via internal API call
    const refreshRes = await fetch(new URL("/api/auth/refresh", req.url), {
      method: "POST",
      headers: { cookie: req.headers.get("cookie") || "" },
    });
    if (refreshRes.ok) {
      const res = NextResponse.next();
      const setCookie = refreshRes.headers.get("set-cookie");
      if (setCookie) res.headers.set("set-cookie", setCookie);
      return res;
    }
    const url = req.nextUrl.clone();
    url.pathname = isAdmin ? "/admin/login" : "/student/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
