"use client";

import { useSearchParams } from "next/navigation";

export default function ParallelRouteLayout({
  children,
  create,
}: {
  children: React.ReactNode;
  create: React.ReactNode;
}) {
  const searchParams = useSearchParams(); // Get the query parameters
  const createPage = searchParams.get("create"); // Extract the 'create' parameter

  return (
    <div>
      {children}
      {createPage === "true" && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white sm:p-8 p-6 rounded shadow-lg xl:w-[40vw] lg:w-[45vw] sm:w-[55vw] w-[96vw]">
            {create}
          </div>
        </div>
      )}
    </div>
  );
}
