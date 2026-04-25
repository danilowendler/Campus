import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/projects", "/profile"];
const SESSION_COOKIE = "campus_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isProtected && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && hasSession) {
    const projectsUrl = request.nextUrl.clone();
    projectsUrl.pathname = "/projects";
    projectsUrl.searchParams.delete("next");
    return NextResponse.redirect(projectsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*", "/profile/:path*", "/login"],
};
