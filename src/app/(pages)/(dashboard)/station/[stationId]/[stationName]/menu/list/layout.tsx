"use client";

import { useSearchParams } from "next/navigation";

export default function ParallelMenuRouteLayout({
  children,
  createMenu,
}: {
  children: React.ReactNode;
  createMenu: React.ReactNode;
}) {
  const searchParams = useSearchParams(); // Get the query parameters
  const createMenuPage = searchParams.get("createMenu"); // Extract the 'createMenu' parameter

  return (
    <div>
      {children}
      {createMenuPage === "true" && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white sm:p-8 p-6 rounded shadow-lg xl:w-[40vw] lg:w-[45vw] sm:w-[55vw] w-[96vw]">
            {createMenu}
          </div>
        </div>
      )}
    </div>
  );
}
