import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import SideBar from "@/components/SideBar/SideBar";
import Header from "@/components/Header/Header";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { AuthProvider } from "@/app/Provider";
import QueryProvider from "@/lib/react-query/QueryProvider";
import NextTopLoader from "nextjs-toploader";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ScrollArea } from "@/components/ui/scroll-area";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <StoreProvider>
                <ReactQueryDevtools initialIsOpen={false} />{" "}
                <div className="flex h-screen">
                  <SideBar />
                  <div className="flex flex-col flex-1 h-screen">
                    <Header />
                    <ScrollArea className="flex-1 bg-primary_light dark:bg-primary_dark sm:p-4  p-2 h-0 min-h-0 overflow-y-auto">
                      <NextTopLoader color="#fe9443" showSpinner={false} />
                      <Toaster />
                      {children}
                    </ScrollArea>
                  </div>
                </div>
              </StoreProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
