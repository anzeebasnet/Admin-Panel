import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
// import { User } from "@/lib/Type";
import { AdapterUser } from "@auth/core/adapters";
import { redirect } from "next/dist/server/api-utils";

async function refreshAccessToken(token: any) {
  if (!token.user.refreshToken) {
    return {
      ...token,
      error: "NoRefreshTokenError",
    };
  }

  if (token.user.refreshToken) {
    const decodedToken = jwtDecode(token.user.refreshToken.toString());
    const refreshTokenExpires = decodedToken?.exp
      ? decodedToken.exp * 1000
      : undefined;
    if (Date.now() >= (refreshTokenExpires as number)) {
      signOut();
    }
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEAPI}auth/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.user.refreshToken}`,
        },
        body: JSON.stringify({
          refresh: token.user.refreshToken,
        }),
      }
    );

    const tokens = await response.json();

    if (!response.ok) {
      throw new Error(
        `Token refresh failed: ${response.status} ${response.statusText}`
      );
    }

    return {
      ...token,
      user: {
        ...token.user,
        accessToken: tokens.access,
        refreshToken: tokens.refresh ?? token.user.refreshToken, // Fall back to old refresh token
      },
      accessToken: tokens.access,
      refreshToken: tokens.refresh ?? token.user.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Day
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        console.log("Credentials:",credentials)
          try {
            const res: any = await fetch(
              `https://moretrek.com/api/auth/login/`,
              // `${process.env.NEXT_PUBLIC_BASEAPI}/admin/auth/login/`,
              {
                method: "POST",
                body: JSON.stringify({
                  username: credentials.username,
                  password: credentials.password,
                }),
                headers: { "Content-Type": "application/json" },
              }
            ).then((res) => { console.log("login res", res); return res.json() });            
            const loginData = res;
            console.log("login res",res)
            if (!res.success) {
              throw new Error(
                loginData?.non_field_errors[0] || "Check login credentials"
              );
            }

            // const fetchUserDetail = await fetch(
            //   `${process.env.NEXT_PUBLIC_BASEAPI}auth/user/all/details/`,
            //   {
            //     method: "GET",
            //     headers: {
            //       Authorization: `Bearer ${loginData.data.token}`,
            //     },
            //   }
            // ).then((res) => res.json());

            // accessing the accessToken returned by server
            const accessToken = loginData.data.token;
            const refreshToken = loginData.data.refresh;
            // const user = fetchUserDetail.data;

            // console.log("user credential login", {
            //   accessToken,
            //   refreshToken,
            //   // user,
            //   // email: user?.email,
            // });

            // return user credentials together with accessToken
            return {
              accessToken,
              refreshToken,
              // user,
              // email: user?.email,
            };
          } catch (e: any) {
            throw new Error(e);
          }
        
      },
    }),
   
  ],
  callbacks: {
    jwt: async ({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user: any;
      }) => {

        // console.log("Token:",token)
        // console.log("account:", account)
        // console.log("user:", user)
     
      if (account && user) {
        // console.log("return from account && user ", {
        //   ...token,
        //   accessToken: token?.user?.accessToken,
        //   refreshToken: token?.user?.refreshToken,
        //   user,
        // });
        return {
          ...token,
          accessToken: token?.accessToken,
          refreshToken: token?.refreshToken,
          user,
        };
      }

      // console.log("return from !account && !user ", token);
      if (token.user.accessToken) {
        const decodedToken = jwtDecode(token.user.accessToken.toString());
        const expiresAt = decodedToken?.exp;
        if (expiresAt) {
          const fiveMinutesBeforeExpiration = expiresAt * 1000 - 5 * 60 * 1000;
          token.accessTokenExpires = fiveMinutesBeforeExpiration;
        } else {
          token.accessTokenExpires = undefined;
        }
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      } else {
        return refreshAccessToken(token);
      }
    },

    session: async ({ session, token }) => {
      // console.log("session", session, token);
      if (token) {
        const tokenAsToken = token as any;
        session.accessToken = tokenAsToken.user.accessToken as string;
        session.refreshToken = tokenAsToken.user.refreshToken as string;
        // session.user = tokenAsToken.user as User as AdapterUser & User;
      }
      // console.log("session", session);
      return session;
    },
  },
});