import TableComponent from '@/components/Table/Table'
import { Roboto } from 'next/font/google';
import React from 'react'

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const Page = () => {
  return (
    <div className="sm:p-4 p-2 flex flex-col gap-6 min-h-screen">
      <h1
        className={`text-bg_orange dark:text-white text-2xl font-normal ${roboto.className}`}
      >Reports</h1>
        <TableComponent/>
    </div>
  )
}

export default Page