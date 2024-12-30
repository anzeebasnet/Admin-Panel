"use client";

import { useSearchParams } from "next/navigation";

export default function ParallelRouteCuisineLayout({
  children,
  createCuisine,
}: {
  children: React.ReactNode;
  createCuisine: React.ReactNode;
}) {
  const searchParams = useSearchParams(); // Get the query parameters
  const createCuisinePage = searchParams.get("createCuisine"); // Extract the 'createCuisine' parameter

  return (
    <div>
      {children}
      {createCuisinePage === "true" && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white sm:p-8 p-6 rounded shadow-lg xl:w-[40vw] lg:w-[45vw] sm:w-[55vw] w-[96vw]">
            {createCuisine}
          </div>
        </div>
      )}
    </div>
  );
}
