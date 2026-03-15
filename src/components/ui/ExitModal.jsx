import Link from "next/link";
import React from "react";
// import exitvd from "../../../public/exit.mp4";
import { FaExclamation } from "react-icons/fa6";

const ExitModal = ({ isOpen, onClose }) => {
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
        <div className=" bg-[#E2CDF4] flex items-center justify-center h-[160px] w-[160px] rounded-full mb-[60px]">
          <div className=" bg-[#002066] p-5 w-fit h-fit rounded-full">
            <FaExclamation className=" text-white text-3xl" />
          </div>
        </div>
        <p className="text-[56px] text-center font-ethereal leading-[64px] text-[#002066]">
          Want to exit?{" "}
        </p>

        <p className="text-[26px] mt-[29px] leading-[42px] mb-[45px] max-w-[632px] mx-auto text-center text-black">
          If you leave now, your selections won’t be saved.
        </p>
        <div className=" flex  w-full px-[101px] gap-9">
          <p
            onClick={onClose}
            className=" flex items-center bg-[#00206614] justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px]  text-[#002066]"
          >
            Cancel
          </p>
          <Link
            href={"/home"}
            onClick={() => {
              oncancel();
            }}
            className=" flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
          >
            End Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExitModal;
