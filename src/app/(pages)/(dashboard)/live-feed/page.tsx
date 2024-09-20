import ModalTrigger from "@/components/ModalTrigger/ModalTrigger";
import { Roboto } from "next/font/google";
import React from "react";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const Page = () => {
  return (
    <div className="sm:p-4 p-2 flex flex-col gap-6">
      <h1
        className={`text-bg_orange dark:text-white text-2xl font-normal ${roboto.className}`}
      >
        Live Feed
      </h1>
      <div className="w-20">
        <ModalTrigger />
      </div>
    </div>
  );
};

export default Page;
