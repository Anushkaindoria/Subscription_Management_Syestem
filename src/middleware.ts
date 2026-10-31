import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES, RouteEntry } from "@/contracts/routes";

// Convert route manifest path (e.g. "/admin/products/[id]") into regex
function matchRoute(pathname: string): RouteEntry | undefined {
  return ROUTES.find((route) => {
    if (route.path === pathname) return true;
    if (route.path.includes("[")) {
      const regexPattern = "^" + route.path.replace(/\[\w+\]/g, "[^/]+") + "$";
      return new RegExp(regexPattern).test(pathname);
    }
    return false;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and internal Next.js paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  const matchedRoute = matchRoute(pathname);

  // If route is public, allow through
  if (matchedRoute && matchedRoute.role === "public") {
    return NextResponse.next();
  }

  // Extract auth from cookie (supports session_token and session_role)
  const sessionToken = request.cookies.get("session_token")?.value;
  // Default to admin in development / mock mode if token not set, but respect mock role cookies
  const isMock = process.env.MOCK_API === "true";
  const sessionRole = request.cookies.get("session_role")?.value || (isMock ? "admin" : null);

  // 1. Unauthenticated users -> /login
  if (!sessionToken && !isMock) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!matchedRoute) {
    return NextResponse.next();
  }

  // 2. Redirect customers away from /admin/*
  if (sessionRole === "customer" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  // 3. Redirect staff/admin away from /portal/*
  if ((sessionRole === "admin" || sessionRole === "staff") && pathname.startsWith("/portal")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 4. Block staff from admin-only routes (driven by ROUTES manifest)
  if (sessionRole === "staff" && matchedRoute.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
