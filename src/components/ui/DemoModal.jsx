import Link from "next/link";
import React from "react";

const DemoModal = ({ stone, isOpen, onClose }) => {
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
        <p className="text-[36px] mt-[29px] leading-[42px] mb-[45px] max-w-[632px] mx-auto text-center text-black">
          Get in touch with the store attendant to customize your {stone}{" "}
          jewelry.
        </p>
        <Link
          href={"/home"}
          onClick={onClose}
          className=" flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
        >
          Okay
        </Link>
      </div>
    </div>
  );
};

export default DemoModal;
