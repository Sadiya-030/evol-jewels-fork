import React from "react";
import charms2 from "../../public/charmsicons2.png";

const CharmsWithName = () => {
  return (
    <div className=" h-[398px] w-[398px] overflow-hidden border border-[#A3C4EB] p-3 rounded-full">
      <div className=" rounded-full h-full border  border-[#A3C4EB] flex flex-col  w-full">
        <div className="w-full h-[65%] rounded-full  mt-[20px] p-12">
          <img
            src={charms2.src}
            alt=""
            className=" h-full w-full scale-125  object-contain"
          />
        </div>
        <div className=" h-[40%] mt-[-38px]">
          <p className=" text-[42px] text-[#302B2C] h-full leading-[122px] text-center">
            Cactus
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharmsWithName;
