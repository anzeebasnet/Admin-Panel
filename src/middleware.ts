import { NextResponse } from "next/server";

export function middleware(request: any) {
  console.log("Middleware triggered on:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/login", "/:path*" , "/((?!_next/static|_next/image|favicon.ico).*)"],
};

// import { NextResponse } from "next/server";
// import { auth } from "@/auth";

// export async function middleware(request: any) {
//   const { nextUrl, method, headers } = request;
//   const loginPagePath = "/auth/login";

//   // Exclude static and other irrelevant paths
//   if (
//     nextUrl.pathname.startsWith("/_next") ||
//     nextUrl.pathname.includes("/favicon.ico")
//   ) {
//     return NextResponse.next();
//   }

//    // Allow POST requests for login submissions
//    if (nextUrl.pathname === "/auth/login" && request.method === "POST") {
//     return NextResponse.next();
//   }

//   // Allow access to the login page for unauthenticated users on GET requests
//   if (nextUrl.pathname === "/auth/login" && request.method === "GET") {
//     return NextResponse.next();
//   }


//   const session = await auth();
//   const isAuthenticated = !!session?.accessToken;

//   console.log("Session:", session);
//   console.log("Authenticated:", isAuthenticated);
//   console.log("Pathname:", nextUrl.pathname);

 
//   if (nextUrl.pathname === loginPagePath) {
//     if (isAuthenticated) {
//       return NextResponse.redirect(new URL("/", request.url));
//     } else {
//       return NextResponse.next();
//     }
//   } else if(nextUrl.pathname !== loginPagePath) {
//     if(!isAuthenticated){
//       return NextResponse.redirect(new URL("/auth/login", request.url));
//     }
//   }

//   // // Redirect authenticated users away from the login page on GET requests
//   // if (
//   //   isAuthenticated &&
//   //   nextUrl.pathname === "/auth/login" &&
//   //   method === "GET"
//   // ) {
//   //   return NextResponse.redirect(new URL("/", request.url));
//   // }

//   // // Redirect unauthenticated users away from protected routes on GET requests
//   // if (
//   //   !isAuthenticated &&
//   //   nextUrl.pathname !== "/auth/login" &&
//   //   method === "GET"
//   // ) {
//   //   return NextResponse.redirect(new URL("/auth/login", request.url));
//   // }

//   // Allow access to the login page or if already authenticated
//   return NextResponse.next();
// }

// export const config = {
//   // matcher: ["/", "/:path*", "/auth/login", "/((?!_next/static|favicon.ico).*)"],
//   matcher: ["/((?!_next/static|favicon.ico).*)"], // Adjusted matcher
// };
