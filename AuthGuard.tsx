// "use client";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { ReactNode, useEffect } from "react";

// interface AuthGuardProps {  children: ReactNode;
// }

// export default function AuthGuard({ children }: AuthGuardProps) {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       // Redirect to login if unauthenticated
//       router.push("/auth/login");
//     }
//   }, [status, router]);

//   if (status === "loading") {
//     // While session is loading, display a loading spinner or any placeholder content
//     return <div>Loading...</div>;
//   }

//   if (status === "unauthenticated") {
//     // Prevent rendering children until the redirection happens
//     return null;
//   }

//   return <>{children}</>;
// }
