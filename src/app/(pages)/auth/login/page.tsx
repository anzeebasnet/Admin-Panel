
import React from "react";
import { LogInForm } from "@/components/Forms/LoginForm/LoginForm";


const Page = () => {
  return (
    <div className="container max-w-[1600px] flex h-[70vh] items-center justify-center p-2 px-6 sm:p-6 md:h-[90vh] 2xl:h-[70vh]">
      <div className="flex w-[95%] flex-col items-center justify-center   gap-2">
        <LogInForm />
      </div>
    </div>
  );
};

export default Page;
