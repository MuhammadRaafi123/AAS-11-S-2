import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  // kalau tidak ada token & bukan halaman login → redirect
  if (!token && !isLoginPage && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // kalau sudah login tapi buka login → lempar ke home
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// halaman yang dilindungi
export const config = {
  matcher: [
    "/home/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};