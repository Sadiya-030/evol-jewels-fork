"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import charms1 from "../../../../../../public/charmsicons1.png";
import charms2 from "../../../../../../public/charmsicons2.png";
import charms3 from "../../../../../../public/charmsicons3.png";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const KeyboardKey = ({ label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`min-w-[75px] px-2 h-[79px] rounded-[8px] text-black text-[40px] font-semibold bg-[#fff] backdrop-blur-sm hover:bg-[#FFFFFF25] transition-all ${className}`}
  >
    {label === "Caps" && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="30"
        viewBox="0 0 34 30"
        fill="none"
      >
        <path
          d="M9.17379 18.3827H0.894161C0.105791 18.3827 -0.295367 17.434 0.253529 16.8672L16.3251 0.271519C16.6757 -0.0905063 17.256 -0.0905063 17.6066 0.271519L33.6782 16.8672C34.2271 17.434 33.8259 18.3827 33.0376 18.3827H24.7568V28.2163C24.7568 28.7097 24.3572 29.1098 23.8643 29.1098H10.0663C9.57342 29.1098 9.17379 28.7097 9.17379 28.2163V18.3827Z"
          fill="black"
        />
      </svg>
    )}
    {label === "Back" && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="30"
        viewBox="0 0 34 30"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.6729 15.8807V26.6079H22.2575V15.8807H29.2421L16.9658 3.2041L4.6896 15.8807H11.6729ZM16.3249 0.271519C16.6757 -0.0905063 17.256 -0.0905063 17.6066 0.271519L33.6782 16.8672C34.2271 17.434 33.8259 18.3827 33.0373 18.3827H24.7566V28.2163C24.7566 28.7097 24.357 29.1098 23.8641 29.1098H10.0663C9.57342 29.1098 9.17379 28.7097 9.17379 28.2163V18.3827H0.894161C0.105791 18.3827 -0.295367 17.434 0.253529 16.8672L16.3249 0.271519Z"
          fill="black"
        />
      </svg>
    )}
    {!["Caps", "Back"].includes(label) && label}
  </button>
);

const Page = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCaps, setIsCaps] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const charms = [charms1, charms2, charms3, charms2];
  const [charmsIndex, setCharmsIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCharmsIndex((prev) => (prev + 1) % charms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [charms.length]);

  // Handle click outside to close keyboard
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isKeyboardOpen) return;
      const target = event.target;
      if (target.closest('[data-keyboard="true"]')) return;
      if (target.closest('[data-otp-input="true"]')) return;
      setIsKeyboardOpen(false);
    };

    // Add event listeners with proper options for production touch devices
    const eventOptions = { passive: false, capture: true };

    document.addEventListener("mousedown", handleClickOutside, eventOptions);
    document.addEventListener("touchstart", handleClickOutside, eventOptions);
    document.addEventListener("pointerdown", handleClickOutside, eventOptions);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
        eventOptions,
      );
      document.removeEventListener(
        "touchstart",
        handleClickOutside,
        eventOptions,
      );
      document.removeEventListener(
        "pointerdown",
        handleClickOutside,
        eventOptions,
      );
    };
  }, [isKeyboardOpen]);

  const handleKeyPress = (key) => {
    if (key === "Back") {
      setOtp((prev) => {
        const updated = [...prev];
        let idx = currentIndex;
        if (idx > 0 && updated[idx] === "") idx = idx - 1;
        updated[idx] = "";
        setCurrentIndex(idx);
        return updated;
      });
    } else if (key === "Caps") {
      setIsCaps((prev) => !prev);
    } else if (!isNaN(key)) {
      setOtp((prev) => {
        const updated = [...prev];
        updated[currentIndex] = key;
        const nextIndex = currentIndex < 3 ? currentIndex + 1 : 3;
        setCurrentIndex(nextIndex);
        return updated;
      });
    }
  };

  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Caps", "Z", "X", "C", "V", "B", "N", "M", "Back"],
  ];

  return (
    <div className="relative w-full h-screen">
      {/* Background */}
      <div className="w-full h-screen z-0 absolute top-0 left-0">
        <div className="absolute top-0 left-0 h-screen z-[1] w-full bg-blue-950/80"></div>
      </div>

      {/* Foreground */}
      <div className="relative z-50 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="h-[103px] bg-gray-100/10 flex justify-between items-center px-[50px]">
          <Link
            href="/home/charms/enter-number"
            className="flex text-white items-center gap-4 text-[24px]"
          >
            <ArrowLeft size={32} strokeWidth={2} />
            Back
          </Link>
          <p className="text-white text-[30px]">Beans</p>
          <Link
            href="/home"
            className="rounded-md border-[2.207px] text-xl text-white border-[#FFFFFF66] px-3 py-2 grid place-content-center"
          >
            Home
          </Link>
        </div>

        {/* Content */}
        <div className="px-[100px] flex flex-col items-start mt-[40px]">
          <div className="flex flex-col justify-center items-center w-full mb-[58px] mt-[65px]">
            <div className="h-[224px] w-[224px] rounded-full border-2 border-gray-500 mb-[77px] p-[22px]">
              <div className="bg-white h-full rounded-full p-7 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={charmsIndex}
                    src={charms[charmsIndex].src}
                    alt="Beans"
                    className="h-full w-full object-contain"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                </AnimatePresence>
              </div>
            </div>
            <p className="text-[50px] text-center text-white mb-[26px] leading-[80px]">
              Spin the Wheel , Just One Step Away!
            </p>
            <p className="text-[26px] leading-[56px] text-[#F4EFEF]">
              Enter your Otp to spin the wheel once today. We’ll never spam
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="w-full mb-[64px]">
            <label className="text-[24px] leading-[50px]">Enter OTP</label>
            <div className="flex gap-[24px]">
              {otp.map((val, i) => (
                <div
                  key={i}
                  data-otp-input="true"
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsKeyboardOpen(true);
                  }}
                  className={`px-[45px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[118px] w-full border-2 flex items-center justify-center border-[#EDD9D942] cursor-pointer ${
                    i === currentIndex ? "border-white" : ""
                  }`}
                >
                  <input
                    type="text"
                    readOnly
                    value={val}
                    className="text-4xl text-center bg-transparent outline-none w-full text-white pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keyboard */}
        <AnimatePresence>
          {isKeyboardOpen && (
            <motion.div
              data-keyboard="true"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="border-t border-white/20 bg-gray-200/20 backdrop-blur-md py-8 h-fit pb-[180px] flex flex-col gap-4 items-center justify-start pt-[89px] px-[100px]"
            >
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex gap-3 justify-center"
                  data-keyboard="true"
                >
                  {row.map((key) => (
                    <KeyboardKey
                      key={key}
                      label={key}
                      onClick={() => handleKeyPress(key)}
                      className={
                        key === "Caps"
                          ? isCaps
                            ? ""
                            : "bg-[#FFFFFF25] mr-10 px-5"
                          : key === "Back"
                            ? "ml-10 px-5 hover:bg-red-300/80 text-black"
                            : ""
                      }
                    />
                  ))}
                </div>
              ))}
              <div className="bg-white text-[30px] h-[106px] text-center text-black mt-[96px] flex items-center justify-center w-full rounded-full">
                Verify OTP
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show button when keyboard is hidden */}
        {!isKeyboardOpen && (
          <div className="px-[100px] pb-[50px]">
            <div className="bg-white text-[30px] h-[106px] text-center text-black flex items-center justify-center w-full rounded-full">
              Verify OTP
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
