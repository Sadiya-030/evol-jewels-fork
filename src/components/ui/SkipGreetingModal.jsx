import Link from "next/link";
import React from "react";
import img from "../../../public/gift.gif";
const SkipGreetingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-[24px] h-fit w-[940px] z-10 py-[95px] shadow-xl flex flex-col items-center justify-center">
        <div className=" h-[161px] w-[161px] rounded-full bg-[#E2CDF4] mb-[50px] p-5">
          <img src={img.src} alt="img icon" className="  mx-auto mt-[-10px]" />
        </div>
        <p className="text-[56px] mb-[29px] text-center font-ethereal leading-[64px] text-gray-800">
          Your gift is ready{" "}
        </p>

        <p className="text-[26px]  leading-[42px] mb-[45px] max-w-[662px] mx-auto text-center text-black">
          Your selected gift will be ready for pickup at the counter. <br /> You
          can collect your gift from there.
        </p>

        <Link
          href={"/home"}
          onClick={onClose}
          className=" flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[402px] h-[100px] bg-[#002066] text-white"
        >
          Yes, okay
        </Link>
      </div>
    </div>
  );
};

export default SkipGreetingModal;
