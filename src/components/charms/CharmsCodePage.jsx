"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import charms1 from "../../../public/charmsicons1.png";
import charms2 from "../../../public/charmsicons2.png";
import charms3 from "../../../public/charmsicons3.png";
import { motion, AnimatePresence } from "framer-motion";
import { charmsCode } from "../../store/CharmsCode/charmsCode";
import { useRouter } from "next/navigation";
import NotificationModal from "../ui/NotificationModal";
import { throttle } from "../../utils/throttle";
import { ArrowLeft } from "lucide-react";

const KeyboardKey = ({ label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`min-w-18.75 px-2 h-19.75 rounded-lg text-black text-[40px] font-semibold bg-white backdrop-blur-sm hover:bg-[#FFFFFF25] transition-all ${className}`}
  >
    {label.toUpperCase() === "CAPS" && (
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
    {label.toUpperCase() === "BACK" && "Back"}
    {!["CAPS", "BACK"].includes(label.toUpperCase()) && label}
  </button>
);

const CharmsCodePage = ({ link }) => {
  const route = useRouter();
  const { setCharmsSize } = charmsCode();
  const [inputValue, setInputValue] = useState("");
  const [isCaps, setIsCaps] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNotificaton, setIsNotificaton] = useState(false);
  const [msg, setMsg] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  // List of charms images
  const charms = [charms1, charms2, charms3, charms2];
  const [clickoncheckcode, setclickoncheckcode] = useState(false);
  const handleCheckEligibility = async () => {
    setclickoncheckcode(true);
    const code = inputValue.trim();
    const isSpinPage = link === "/home/charms/spin-code/spin";

    // 1️⃣ Empty check
    if (!code) {
      setIsNotificaton(true);
      setMsg("Please enter a code．"); // empty code
      return;
    }

    // 2️⃣ Code type validation (before API)
    if (isSpinPage && code.includes("CHARM")) {
      setIsNotificaton(true);
      setMsg("Invalid code．Please try again．"); // invalid code for spin
      return;
    }

    if (!isSpinPage && code.includes("SPIN")) {
      setIsNotificaton(true);
      setMsg("Invalid code．Please try again．"); // invalid code for charms
      return;
    }

    // 3️⃣ API call
    try {
      const CodeApiUrl = `/api/validate-coupon`;
      const CharmRes = await fetch(CodeApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: inputValue.toUpperCase(),
          isSpinPage: isSpinPage,
        }),
      });
      const CharmResult = await CharmRes.json();
      if (!CharmResult.success) {
        throw new Error(CharmResult.message);
      }
      // // ✅ Success
      sessionStorage.setItem("charmSessionId", CharmResult.sessionId);
      setCharmsSize({ gold: CharmResult?.goldWeight });
      route.push(link);
    } catch (error) {
      setIsNotificaton(true);
      setMsg(error?.message); // server error
    } finally {
    }
  };

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
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
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
        (prev) => prev + (isCaps ? key.toUpperCase() : key.toLowerCase()),
      );
    }
  };

  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Caps", "Z", "X", "C", "V", "B", "N", "M", "Back"],
  ];
  const handleCheckEligibilityRef = useRef(handleCheckEligibility);

  useEffect(() => {
    handleCheckEligibilityRef.current = handleCheckEligibility;
  }, [handleCheckEligibility]);

  const throttledCheckEligibility = useMemo(
    () =>
      throttle(() => {
        handleCheckEligibilityRef.current();
      }, 2000), // ⏱ 2 seconds
    [],
  );
  return (
    <div className="relative w-full h-screen">
      {/* Background video */}
      <NotificationModal
        msg={msg}
        isOpen={isNotificaton}
        onClose={() => isNotificaton(false)}
      />
      <div className="w-full h-screen absolute top-0 left-0 z-0">
        <video
          src="https://ts-bucket.mum-objectstore.e2enetworks.net/evol_4b2a7deae5.mp4"
          loop
          autoPlay
          muted
          className="w-full h-full object-cover"
        ></video>
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-50 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="h-25.75 shrink-0 bg-gray-100/10 flex justify-between items-center px-12.5 w-full">
          <Link
            href="/home/charms"
            className="flex text-white items-center gap-4 text-[24px]"
          >
            <ArrowLeft size={32} className="text-white" />
            Back
          </Link>
          <p className="text-white text-[30px]">Charms</p>
          <Link
            href="/home"
            className="rounded-md border-[2.207px] text-xl text-white border-[#FFFFFF66] px-3 py-2 grid place-content-center"
          >
            Home
          </Link>
        </div>

        {/* Input area */}
        <div className="px-25 h-fit flex-col flex items-start mt-10">
          <div className=" w-full h-fit mt-16.25 mb-12">
            <div className=" flex flex-col justify-center items-center w-full mb-14.5">
              <div className=" h-56 w-56 rounded-full border-2 border-gray-500 mb-19.25 p-5.5">
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
              <p className="  text-[50px] font-ethereal  text-center text-white mb-6.5 leading-20">
                Have a Code? Let’s Check it．
              </p>
              <p className=" text-[26px] leading-14 text-[#F4EFEF]">
                Enter your code below to see if you’ve unlocked a gold charm.
              </p>
            </div>
            <div className=" w-full mb-16">
              <label
                htmlFor=" Code"
                className=" text-white text-[24px] w-full leading-12.5"
              >
                {" "}
                Code
              </label>

              <div className="px-11.25 rounded-xl overflow-hidden bg-[#FFFFFF29] h-27 w-full border-2 flex gap-2 items-center border-[#EDD9D942]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={handleInputFocus}
                  className="text-4xl h-full bg-transparent outline-none w-full text-white placeholder-white/60"
                  placeholder="Type your answer..."
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
              className="border-t border-white/20 bg-gray-200/20 backdrop-blur-md py-8 h-fit pb-45 flex flex-col gap-4 items-center justify-start pt-22.25 px-25"
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
                      label={isCaps ? key.toUpperCase() : key.toLowerCase()}
                      onClick={() => handleKeyPress(key)}
                      className={
                        key === "Caps"
                          ? isCaps
                            ? "mr-10 px-5"
                            : "bg-[#FFFFFF25] mr-10 px-5"
                          : key === "Back"
                            ? " ml-10 px-5 hover:bg-red-300/80 text-black"
                            : ""
                      }
                    />
                  ))}
                </div>
              ))}
              <button
                onClick={throttledCheckEligibility}
                className=" bg-white font-ethereal text-[30px] h-26.5 text-center text-black mt-24 flex items-center justify-center w-full rounded-full"
              >
                {clickoncheckcode ? "Checking..." : "Check Eligibility"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show button when keyboard is hidden */}
        {!isKeyboardOpen && (
          <div className="px-25 pb-12.5">
            <button
              onClick={throttledCheckEligibility}
              className=" bg-white font-ethereal text-[30px] h-26.5 text-center text-black flex items-center justify-center w-full rounded-full"
            >
              {clickoncheckcode ? "Checking..." : "Check Eligibility"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharmsCodePage;
