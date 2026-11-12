import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Protects every /admin route with role-based authorization (spec 11).
// Runs before the admin layout/pages even render, so an unauthenticated or
// non-admin request never reaches admin data-fetching code.
export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  const role = (req.auth?.user as { role?: string } | undefined)?.role;
  if (!req.auth?.user || role !== "ADMIN") {
    const url = new URL("/auth/login", req.nextUrl.origin);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
