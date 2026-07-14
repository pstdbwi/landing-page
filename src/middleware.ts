import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import redirects from "./constant/redirects";
import { SessionData, sessionOptions } from "./lib/session";

const pageRedirectToHome = ["/login", "/register", "/accounts/activation", "/accounts/reset-password"];
const pageWithAuth = ["/history", "/accounts/user", "/campaign/:path/donate", "/campaign/:path/propose"];

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const url = request.nextUrl.pathname?.toLowerCase();

  const redirectTo = redirects[url];

  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (pageRedirectToHome.includes(url)) {
    if (session?.isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pageWithAuth.includes(url) || url.includes("donate") || url.includes("propose")) {
    if (!session?.isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/accounts/activation",
    "/accounts/reset-password",
    "/history",
    "/accounts/user",
    "/campaign/:path/donate",
    "/campaign/:path/propose",
    ...Object.keys(redirects),
  ],
};
