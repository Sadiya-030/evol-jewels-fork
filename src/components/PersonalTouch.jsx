"use client";
import React from "react";
import Diamond from "../../public/diamond.gif";
import { usePathname, useRouter } from "next/navigation";
import { useGreetingStore } from "../store/greetingStore";
// import { Router } from "next/router";
const PersonalTouch = ({ isOpen, href, prdName, product }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setProduct } = useGreetingStore();

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-xs transition-opacity"></div>

      {/* Modal Box */}
      <div className="relative  bg-white rounded-[24px] h-fit w-[940px] z-10 py-[95px]  shadow-xl flex flex-col items-center justify-center">
        <div className="  h-[161px]  overflow-hidden w-[161px] rounded-full mb-[70px] bg-[#E2CDF4]">
          <img src={Diamond.src} alt="" className="  mx-auto mt-[-10px]" />
        </div>
        <p className="text-[56px] text-center font-ethereal leading-[64px] text-gray-800">
          Add a Personal Touch?
        </p>
        <p className=" text-[26px] mt-[29px]  leading-[42px] mb-2 max-w-[746px] mx-auto text-center text-black">
          Would you like to add a personalised greeting card to this gift?{" "}
        </p>
        <div className=" flex gap-[34px] items-center mt-[62px]">
          <button
            onClick={() => {
              setProduct({ product: product, isSkip: true });
              router.push(`${pathname}/print-greeting`);
            }}
            className=" h-[100px] w-[345px] rounded-full text-[#002066] text-[26px] bg-[#00206614]"
          >
            No, skip for now
          </button>
          <button
            onClick={() => {
              setProduct({ product: product, isSkip: false });

              router.push(href);
            }}
            className=" flex items-center justify-center h-[100px] w-[345px] rounded-full text-white text-[26px] bg-[#002066]"
          >
            Yes, add greeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalTouch;
