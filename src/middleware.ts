import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: any) {
  const { nextUrl, method } = request;
  const loginPagePath = "/auth/login";

  // Exclude static and other irrelevant paths
  if (
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.includes("/favicon.ico") ||
    nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const session = await auth();
  const isAuthenticated = !!session?.accessToken;

  console.log("Session:", session);
  console.log("Authenticated:", isAuthenticated);
  console.log("Pathname:", nextUrl.pathname);

  // if (nextUrl.pathname.startsWith(loginPagePath)) {
  //   if (isAuthenticated) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  //     return NextResponse.next();
  // } else if (!nextUrl.pathname.startsWith(loginPagePath)) {
  //   if (!isAuthenticated) {
  //     return NextResponse.redirect(new URL("/auth/login", request.url));
  //   }
  // }

   // Allow login POST method to go through for login submissions
   if (method === "POST" && nextUrl.pathname.startsWith(loginPagePath)) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from the login page on GET requests
  if (isAuthenticated && nextUrl.pathname.startsWith(loginPagePath)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users away from protected routes on GET requests
  if (!isAuthenticated && !nextUrl.pathname.startsWith(loginPagePath)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Allow access to the login page or if already authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"], // Adjusted matcher
};

