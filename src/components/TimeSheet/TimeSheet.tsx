import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const TimeSheet = () => {
  return (
    <div className="dark:bg-dark_gray bg-white sm:p-8 p-4 sm:w-[55%] w-full h-full rounded-md border-none flex flex-col gap-8">
      <div className="flex justify-between">
        <h2 className="dark:text-white text-black font-medium text-lg">TimeSheet</h2>
        <div className="flex gap-2 py-2 sm:px-4 px-2 border-2 border-gray-400 rounded-3xl">
          <p className="text-xs dark:text-white text-black font-normal">October</p>
          <MdKeyboardArrowDown className="dark:text-white text-black"/>
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-4">
          <p className="dark:text-white text-black sm:text-sm text-xs">65h</p>
          <p className="dark:text-white text-black sm:text-sm text-xs">61h</p>
          <p className="dark:text-white text-black sm:text-sm text-xs">54h</p>
          <p className="dark:text-white text-black sm:text-sm text-xs">50h</p>
          <p className="dark:text-white text-black sm:text-sm text-xs">46h</p>
          <p className="dark:text-white text-black sm:text-sm text-xs">39h</p>
        </div>
        <div className="flex sm:gap-3 gap-2  overflow-x-hidden">
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-10% to-[#5f229d] to-90% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-52% to-[#5f229d] to-60% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-10% to-[#5f229d] to-90% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-20% to-[#5f229d] to-80% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-55% to-[#5f229d] to-45% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-25% to-[#5f229d] to-75% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-15% to-[#5f229d] to-85% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-10% to-[#5f229d] to-90% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-10% to-[#5f229d] to-90% "></div>
          <div className="w-[3vw] sm:h-[35vh] h-[30vh] bg-gradient-to-b from-[#331c4b]  from-40% to-[#5f229d] to-60% "></div>
        </div>
      </div>
    </div>
  );
};

export default TimeSheet;
