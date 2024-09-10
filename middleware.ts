// File: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export {default} from "next-auth/middleware";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret });
  // console.log(session);

  const { pathname } = request.nextUrl;

  if (
    session &&
    (pathname === "/auth/login" || pathname === "/auth/register")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [ "/auth/login",],
};
