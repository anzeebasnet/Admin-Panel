next-auth.d.ts
import { AdapterUser } from "next-auth/adapters";
import { User } from "./Type";

declare module "next-auth" {

  interface Session {
    sub: string; // Subject (user ID)
    name: string; // Username
    email: string; // Email address
    picture: string; // Profile picture URL
    iat: number; // Issued at (timestamp)
    accessToken: string; // Access token
    refreshToken: string; // Refresh token
    accessTokenExpires: number; // Access token expiration time (milliseconds)
    user: User; // User object
  }

  interface JWT {
    sub: string; // Subject (user ID)
    name: string; // Username
    email: string; // Email address
    picture: string; // Profile picture URL
    iat: number; // Issued at (timestamp)
    accessToken: string; // Access token
    refreshToken: string; // Refresh token
    accessTokenExpires: number; // Access token expiration time (milliseconds)
    user: User; // User object
  }
}