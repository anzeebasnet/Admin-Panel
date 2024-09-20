import Image from "next/image";
import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsGraphUp } from "react-icons/bs";

interface EmpCardProps {
    colorgradtop: string;
    colorgradbottom: string;
}

const EmployeeCard = ({colorgradtop, colorgradbottom}: EmpCardProps) => {
  return (
    <div>
      <div className={`w-64 h-36 p-6 rounded-md flex flex-col justify-between`}
       style={{
        background: `linear-gradient(to bottom, ${colorgradtop} 10%, ${colorgradbottom} 90%)`,
      }}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Image
              src={"/images/boy.jpg"}
              alt="profile"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <p className="text-white font-sm">Sebastian Green</p>
          </div>
          <HiOutlineDotsVertical color="white" />
        </div>
       <div className="flex justify-between items-center">
       <div className="flex flex-col gap-1">
          <p className="text-white text-xs">Total Time</p>
          <p className="text-white text-lg font-normal">54:23:12</p>
        </div>
        <BsGraphUp color="white" size={45}/>
       </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
