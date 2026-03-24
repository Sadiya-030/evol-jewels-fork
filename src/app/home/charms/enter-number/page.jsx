"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import charms1 from "../../../../../public/charmsicons1.png";
import charms2 from "../../../../../public/charmsicons2.png";
import charms3 from "../../../../../public/charmsicons3.png";
import { motion, AnimatePresence } from "framer-motion";

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
    )}{" "}
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
  const [inputValue, setInputValue] = useState("");
  const [isCaps, setIsCaps] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // List of charms images
  const charms = [charms1, charms2, charms3, charms2];

  // Auto change every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % charms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [charms.length]);

  // Handle click outside to close keyboard
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isKeyboardOpen) return;
      const target = event.target;
      if (target.closest('[data-keyboard="true"]')) return;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      setIsKeyboardOpen(false);
    };

    // Add event listeners with proper options for production touch devices
    const eventOptions = { passive: false, capture: true };

    document.addEventListener("mousedown", handleClickOutside, eventOptions);
    document.addEventListener("touchstart", handleClickOutside, eventOptions);
    document.addEventListener("pointerdown", handleClickOutside, eventOptions);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, eventOptions);
      document.removeEventListener("touchstart", handleClickOutside, eventOptions);
      document.removeEventListener("pointerdown", handleClickOutside, eventOptions);
    };
  }, [isKeyboardOpen]);

  const handleInputFocus = () => {
    setIsKeyboardOpen(true);
  };

  const handleKeyPress = (key) => {
    if (key === "Back") {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (key === "Caps") {
      setIsCaps((prev) => !prev);
    } else {
      setInputValue(
        (prev) => prev + (isCaps ? key.toUpperCase() : key.toLowerCase())
      );
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
      {/* Background video */}
      <div className="w-full h-screen absolute top-0 left-0 z-0">
        <video
          src="https://ts-bucket.mum-objectstore.e2enetworks.net/evol_4b2a7deae5.mp4"
          loop
          autoPlay
          muted
          className="w-full h-full object-cover"
        ></video>
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-50 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="h-[103px] flex-shrink-0 bg-gray-100/10 flex justify-between items-center px-[50px] w-full">
          <p className="text-white text-[30px]">Charms</p>
          <Link
            href="/home"
            className="rounded-full border-[2.207px] border-[#FFFFFF66] h-[64px] w-[64px] grid place-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="37"
              height="37"
              viewBox="0 0 37 37"
              fill="none"
            >
              <g clipPath="url(#clip0_1305_623)">
                <path
                  d="M28.7358 8.04492L8.04614 28.7346"
                  stroke="white"
                  strokeWidth="2.29885"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28.7358 28.7346L8.04614 8.04492"
                  stroke="white"
                  strokeWidth="2.29885"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1305_623">
                  <rect width="36.7816" height="36.7816" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </div>

        {/* Input area */}
        <div className="px-[100px] h-fit flex-col flex items-start mt-[40px]">
          <div className=" w-full h-fit mt-[65px] mb-12">
            <Link
              href="/"
              className=" flex items-center h-fit text-[36px] leading-[71px] gap-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="51"
                height="51"
                viewBox="0 0 51 51"
                fill="none"
              >
                <g clipPath="url(#clip0_1584_3815)">
                  <path
                    d="M43.0312 25.5H7.96875"
                    stroke="white"
                    strokeWidth="1.61905"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.3125 11.1562L7.96875 25.5L22.3125 39.8438"
                    stroke="white"
                    strokeWidth="1.61905"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1584_3815">
                    <rect width="51" height="51" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Back
            </Link>
          </div>
          <div className=" flex flex-col justify-center items-center w-full mb-[58px]">
            <div className=" h-[224px] w-[224px] rounded-full border-2 border-gray-500 mb-[77px] p-[22px]">
              <div className=" bg-white h-full rounded-full p-7 flex items-center justify-center text-black w-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={charms[currentIndex].src}
                    alt="Charms"
                    className="h-full w-full object-contain"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </AnimatePresence>
              </div>
            </div>
            <p className=" text-[50px] text-center text-white mb-[26px] leading-[80px]">
              Spin the Wheel , Just One Step Away!{" "}
            </p>
            <p className=" text-[26px] leading-[56px] text-[#F4EFEF]">
              Enter your mobile number to spin the wheel once today. We’ll never
              spam{" "}
            </p>
          </div>
          <div className=" w-full mb-[64px]">
            <label
              htmlFor=" Code"
              className=" text-[24px] w-full leading-[50px]"
            >
              {" "}
              Phone Number
            </label>
            <div className=" flex gap-[24px]">
              <div className=" px-[40px] justify-center min-w-[109px] whitespace-nowrap text-[30px] leading-[54px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[108px]  border-2 flex  items-center border-[#EDD9D942]">
                +91
              </div>
              <div className="px-[45px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[108px] w-full border-2 flex gap-2 items-center border-[#EDD9D942]">
                <input
                  type="number"
                  value={inputValue}
                  readOnly
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={handleInputFocus}
                  className="text-4xl h-full bg-transparent outline-none w-full text-white placeholder-white/60"
                  placeholder="|Enter your Phone Number"
                />
              </div>
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
                <div key={rowIndex} className="flex gap-3 justify-center" data-keyboard="true">
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
                          ? " ml-10 px-5 hover:bg-red-300/80 text-black"
                          : ""
                      }
                    />
                  ))}
                </div>
              ))}
              <div className=" bg-white text-[30px] h-[106px] text-center text-black  mt-[96px] flex items-center justify-center w-full rounded-full">
                Get OTP
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show button when keyboard is hidden */}
        {!isKeyboardOpen && (
          <div className="px-[100px] pb-[50px]">
            <div className=" bg-white text-[30px] h-[106px] text-center text-black flex items-center justify-center w-full rounded-full">
              Get OTP
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
