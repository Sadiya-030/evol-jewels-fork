import Link from "next/link";
import React from "react";

const SuccessModal = ({ isOpen, onClose, msg = "" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-xs transition-opacity"
        // onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-[24px] h-fit w-[940px] z-10 py-[95px] shadow-xl flex flex-col items-center justify-center">
        <p className="text-[56px] mb-[29px] text-center font-ethereal leading-[64px] text-gray-800">
          {msg ? msg : "You’ve Got the Gold!"}
        </p>

        {msg ? null : (
          <p className="text-[26px]  leading-[42px] mb-[45px] max-w-[632px] mx-auto text-center text-black">
            You can collect your charm right away from the vending machine on
            the side. Just follow the on-screen instructions there.{" "}
          </p>
        )}
        <Link
          href={"/home/charms"}
          onClick={onClose}
          className=" flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
        >
          {msg ? "Try Again" : "Okay"}
        </Link>
      </div>
    </div>
  );
};

export default SuccessModal;
