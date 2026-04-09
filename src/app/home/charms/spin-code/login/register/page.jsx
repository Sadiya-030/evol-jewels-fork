"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import charms1 from "../../../../../../../public/charmsicons1.png";
import charms2 from "../../../../../../../public/charmsicons2.png";
import charms3 from "../../../../../../../public/charmsicons3.png";
import ServiceError from "../../../../../../components/ui/ServiceError";
import { throttle } from "../../../../../../utils/throttle";

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
    {label === "Back" && "Back"}
    {label === "Space" && "Space"}
    {!["Caps", "Back", "Space"].includes(label) && label}
  </button>
);

const Page = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isCaps, setIsCaps] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showServiceError, setShowServiceError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const charms = [charms1, charms2, charms3, charms2];

  // Get phone number from session storage
  useEffect(() => {
    const storedPhone = sessionStorage.getItem("spinPhoneNumber");
    if (!storedPhone) {
      router.push("/home/charms/spin-code/login");
      return;
    }
    setPhoneNumber(storedPhone);
  }, [router]);

  // Auto change charms every 2 seconds
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

  const handleKeyPress = (key) => {
    if (key === "Back") {
      setName((prev) => prev.slice(0, -1));
      setError("");
    } else if (key === "Caps") {
      setIsCaps((prev) => !prev);
    } else if (key === "Space") {
      setName((prev) => prev + " ");
    } else {
      const char = isCaps ? key.toUpperCase() : key.toLowerCase();
      setName((prev) => prev + char);
      setError("");
    }
  };

  const createUser = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user-spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: phoneNumber,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // User already exists - shouldn't happen but handle gracefully
        setError("This phone number is already registered");
        return;
      }

      if (res.status === 500 || !res.ok) {
        setShowServiceError(true);
        return;
      }

      if (data.success) {
        sessionStorage.setItem("spinUserName", data.data.name);
        router.push("/home/charms/spin-code/spin");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setShowServiceError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserRef = useRef(createUser);
  useEffect(() => {
    createUserRef.current = createUser;
  }, [name, phoneNumber]);

  const throttledCreateUser = useMemo(
    () =>
      throttle(() => {
        createUserRef.current();
      }, 2000),
    []
  );

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Caps", "Z", "X", "C", "V", "B", "N", "M", "Back"],
    ["Space"],
  ];

  return (
    <div className="relative w-full h-screen">
      {/* Service Error Modal */}
      {showServiceError && (
        <ServiceError
          onRetry={() => {
            setShowServiceError(false);
            createUser();
          }}
          homeLink="/home/charms"
        />
      )}

      {/* Background video */}
      <div className="w-full h-screen absolute top-0 left-0 z-0">
        <video
          src="https://ts-bucket.mum-objectstore.e2enetworks.net/evol_4b2a7deae5.mp4"
          loop
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-50 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="h-[103px] flex-shrink-0 bg-gray-100/10 flex justify-between items-center px-[50px] w-full">
          <Link
            href="/home/charms/spin-code/login"
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

        {/* Content */}
        <div className="px-[100px] h-fit flex-col flex items-start mt-[40px]">
          <div className="w-full h-fit mt-[65px] mb-12">
            <div className="flex flex-col justify-center items-center w-full mb-[58px]">
              {/* Charms Icon */}
              <div className="h-[224px] w-[224px] rounded-full border-2 border-gray-500 mb-[77px] p-[22px]">
                <div className="bg-white h-full rounded-full p-7 flex items-center justify-center">
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

              {/* Title */}
              <p className="text-[50px] font-ethereal text-center text-white mb-[26px] leading-[80px]">
                Welcome! What's your name?
              </p>
              <p className="text-[26px] leading-[56px] text-[#F4EFEF]">
                Just one more step before you spin the wheel.
              </p>
            </div>

            {/* Name Input */}
            <div className="w-full mb-[40px]">
              <label className="text-white text-[24px] w-full leading-[50px]">
                Your Name
              </label>
              <div
                onClick={() => setIsKeyboardOpen(true)}
                className={`px-[45px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[108px] w-full border-2 flex gap-2 items-center cursor-pointer ${
                  error ? "border-red-500" : "border-[#EDD9D942]"
                }`}
              >
                <p className="text-4xl text-white">
                  {name || (
                    <span className="text-white/60">Enter your name</span>
                  )}
                </p>
              </div>
              {error && (
                <p className="text-red-400 text-[20px] mt-3">{error}</p>
              )}
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
              className="border-t border-white/20 bg-gray-200/20 backdrop-blur-md py-8 h-fit pb-[100px] flex flex-col gap-4 items-center justify-start pt-[60px] px-[100px]"
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
                      label={
                        key === "Caps" || key === "Back" || key === "Space"
                          ? key
                          : isCaps
                          ? key.toUpperCase()
                          : key.toLowerCase()
                      }
                      onClick={() => handleKeyPress(key)}
                      className={
                        key === "Caps"
                          ? isCaps
                            ? "mr-10 px-5"
                            : "bg-[#FFFFFF25] mr-10 px-5"
                          : key === "Back"
                          ? "ml-10 px-5 hover:bg-red-300/80 text-[24px]"
                          : key === "Space"
                          ? "min-w-[400px]"
                          : ""
                      }
                    />
                  ))}
                </div>
              ))}
              <button
                onClick={throttledCreateUser}
                disabled={isLoading}
                className="bg-white font-ethereal text-[30px] h-[106px] text-center text-black mt-[60px] flex items-center justify-center w-full rounded-full disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Start Spinning"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show button when keyboard is hidden */}
        {!isKeyboardOpen && (
          <div className="px-[100px] pb-[50px]">
            <button
              onClick={() => setIsKeyboardOpen(true)}
              className="bg-white font-ethereal text-[30px] h-[106px] text-center text-black flex items-center justify-center w-full rounded-full"
            >
              Enter Your Name
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
