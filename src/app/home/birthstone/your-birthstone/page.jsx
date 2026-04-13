"use client";
import React, { useEffect } from "react";
import img1 from "../../../../../public/close.svg";
import img2 from "../../../../../public/shadow.png";

import diamond from "../../../../../public/diamond.png";
import { browseStore } from "../../../../store/browseProduct";
import DemoModal from "../../../../components/ui/DemoModal";
import { useState } from "react";
import { useStoneDataStore } from "../../../../store/birthstone/stoneData";
import { useRouter } from "next/navigation";

const page = () => {
  const { browseProducts, setBrowseProducts, clearBrowseProducts } =
    browseStore();
  const router = useRouter();
  const { setStoneData, stoneData, clearStoneData } = useStoneDataStore();
  const [isOpen, setisOpen] = useState(false);
  useEffect(() => {
    if (!stoneData?.gemstone.name) {
      router.push("/home/birthstone");
    }
  }, [stoneData]);

  return (
    <div className=" relative h-screen  overflow-hidden">
      <DemoModal
        stone={stoneData?.gemstone?.name}
        isOpen={isOpen}
        onClose={() => {
          clearStoneData();
          setisOpen(false);
        }}
      ></DemoModal>
      <div className=" relative z-[99] ">
        <div className=" h-[137px] border-b border-black w-full flex items-center justify-between px-[50px]">
          <p className=" text-4xl  text-black">Gift a Moment</p>
          <button
            onClick={() => {
              router.push("/home");
              clearStoneData();
              clearBrowseProducts();
            }}
            className=" h-[63px] w-[63px] rounded-full grid place-content-center"
          >
            <p className="rounded-md border-[2.207px] text-xl text-black border-[#00000066] px-3 py-2 grid place-content-center">
              Home
            </p>
          </button>
        </div>
        <div className=" mt-[132px] mb-[106px]">
          <h1 className=" max-w-[874px] mx-auto text-[#302B2C] font-ethereal text-center text-[56px] leading-[80px]">
            {stoneData?.signDescription}
          </h1>
        </div>
        <div className=" flex items-center relative  justify-center">
          <div
            className={` w-[879px] flex-shrink-0  bg-red-300 h-[929px]   mx-auto  flex items-center justify-center left-1/9 rounded-[125px]  bg-white   overflow-hidden`}
          >
            <div className="w-[879px]  rounded-[125px]  bg-white overflow-hidden  border border-b-0  border-[#473CE342] overflow-hidden  h-[925px]  p-4  ">
              <div className=" w-[839px] h-[890px] rounded-[112px]  bg-slate-50 overflow-hidden  border-b-0 border border-[0.2px]  bg-red-600">
                <div className="  z-50  inset-0 w-full rounded-[112px]  h-full ">
                  <div className=" h-[500px]   bg-slat-50 w-fit mx-auto white  mt-16">
                    <img
                      src={stoneData?.gemstone?.image}
                      alt={stoneData?.gemstone?.name}
                      className=" h-full   mix-blend-multiply  w-auto object-cover mx-auto "
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className=" bg-white absolute bottom-0 left-0 w-full h-[40px] rounded-t-[150px]"></div> */}

            <div className="absolute  bottom-[-33%] z-[33]  left-0 w-full scale-105 h-fit  flex items-center justify-center pb-[30px]">
              <img src={img2.src} alt="" className=" " />
              <div className=" w-full  mt-4  !h-[570px] overflow-visible  absolute inset-0 ">
                <p className=" font-ethereal text-[85px] leading-[85px] text-[#302B2C] mx-auto text-center tracking-[-4.7px] max-w-[676px]">
                  {stoneData?.gemstone?.name || ""}
                </p>
                <p className=" text-[30px] mt-8 relative z-50 text-black text-center max-w-[600px] mx-auto w-full">
                  {stoneData?.gemstone?.resonance || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" mt-[250px] flex relative z-50 justify-center">
          <button
            onClick={() => setisOpen(true)}
            className="  h-[94px] w-[883px] mx-auto rounded-full text-[30px] font-ethereal text-white bg-[#002066]"
          >
            See {stoneData?.gemstone?.name || ""} stone for {stoneData?.sunSign}
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
