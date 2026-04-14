import Link from "next/link";
import React from "react";

const SuccessModal = ({
  isOpen,
  onClose,
  msg = "",
  vendingMachineError = false,
}) => {
  if (!isOpen) return null;

  // Check if this is a "contact staff" message (vending machine error)
  const isVendingWarning =
    vendingMachineError ||
    (msg &&
      msg.toLowerCase().includes("contact") &&
      msg.toLowerCase().includes("staff"));

  // Check if this is a "not available" error - user should pick another charm
  const isNotAvailable = msg && msg.toLowerCase().includes("is not available");

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-xs transition-opacity"></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-[24px] h-fit w-[940px] z-10 py-[95px] px-[60px] shadow-xl flex flex-col items-center justify-center">
        <p className="text-[56px] mb-[29px] text-center font-ethereal leading-[64px] text-gray-800">
          {msg ? msg : "You've Got the Gold!"}
        </p>

        {msg && isVendingWarning && (
          <p className="text-[26px] leading-[42px] mb-[45px] max-w-[750px] mx-auto text-center text-black">
            Sorry, Service Unavailable. We are Trying to Get it Back Up!
          </p>
        )}

        {isNotAvailable ? (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
          >
            Choose Another Bean
          </button>
        ) : isVendingWarning ? (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
          >
            Try Again
          </button>
        ) : msg ? (
          <Link
            href={"/home/charms"}
            onClick={onClose}
            className="flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
          >
            Try Again
          </Link>
        ) : (
          <Link
            href={"/home/charms"}
            onClick={onClose}
            className="flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
          >
            Okay
          </Link>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
