"use client";
import React from "react";
import envolap from "../../public/envolap.gif";
import Link from "next/link";
const PrintModal = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-[24px] h-[837px] w-[940px] z-10 p-8 shadow-xl flex flex-col items-center justify-center">
        <div className="  h-[161px]  overflow-hidden w-[161px] rounded-full mb-[70px] bg-[#E2CDF4]">
          <img src={envolap.src} alt="" className="  mx-auto mt-[-10px]" />
        </div>
        <p className="text-[56px] font-ethereal leading-[64px] text-gray-800">
          Your card is being printed…
        </p>
        <p className=" text-[26px] mt-[24px] mb-[70px] leading-[42px] max-w-[664px] mx-auto text-center text-black">
          Please complete your payment at the counter and return here to collect
          your printed greeting card. We’ll have it ready for you to pair with
          your gift
        </p>
        <div className=" flex gap-[34px] items-center">
          <button
            onClick={() => setIsOpen(false)}
            className=" h-[100px] w-[345px] text-[26px] text-black border  rounded-[200px]"
          >
            View gift again
          </button>
          <Link
            href="/home"
            className=" h-[100px]  flex items-center justify-center bg-[#002066] w-[345px] text-[26px] text-white border  rounded-[200px]"
          >
            Yes, okay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
