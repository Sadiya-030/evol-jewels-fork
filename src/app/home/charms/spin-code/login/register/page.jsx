"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import CapsLockIcon from "../../../../../../components/icons/CapsLockIcon";
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
    {label === "Caps" && <CapsLockIcon />}
    {label === "Back" && "Back"}
    {label === "Space" && "Space"}
    {!["Caps", "Back", "Space"].includes(label) && label}
  </button>
);

const Page = () => {
  const router = useRouter();
  const inputRef = useRef(null);
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
    const storedPhone = sessionStorage.getItem("userPhoneNumber");
    if (!storedPhone) {
      router.push("/home/charms/spin-code/login");
      return;
    }
    setPhoneNumber(storedPhone);
  }, [router]);

  // Decorative animation: cycles through charm images in the circular icon
  // display at the top of the page to create visual interest while user enters name
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
      if (target.closest('[data-name-input="true"]')) return;
      setIsKeyboardOpen(false);
    };

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

  // Handle physical keyboard input
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setError("");
  };

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
    [],
  );

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Caps", "Z", "X", "C", "V", "B", "N", "M", "Back"],
    ["Space"],
  ];

  return (
    <div className="relative w-full h-screen">
      {/* Background */}
      <div className="w-full h-screen z-0 absolute top-0 left-0">
        <div className="absolute top-0 left-0 h-screen z-[1] w-full bg-blue-950/80"></div>
      </div>

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
          <p className="text-white text-[30px]">Beans</p>
          <Link
            href="/home"
            className="rounded-md border-[2.207px] text-xl text-white border-[#FFFFFF66] black px-3 py-2 grid place-content-center"
          >
            Home
          </Link>
        </div>

        {/* Content */}
        <div className="px-[100px] h-fit flex-col flex items-start mt-[40px]">
          <div className="w-full h-fit mt-[65px] mb-12">
            <div className="flex flex-col justify-center items-center w-full mb-[58px]">
              {/* Beans Icon */}
              <div className="h-[224px] w-[224px] rounded-full border-2 border-gray-500 mb-[77px] p-[22px]">
                <div className="bg-white h-full rounded-full p-7 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentIndex}
                      src={charms[currentIndex].src}
                      alt="Beans"
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
                data-name-input="true"
                onClick={() => {
                  setIsKeyboardOpen(true);
                  inputRef.current?.focus();
                }}
                className={`px-[45px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[108px] w-full border-2 flex gap-2 items-center cursor-text ${
                  error ? "border-red-500" : "border-[#EDD9D942]"
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onFocus={() => setIsKeyboardOpen(true)}
                  placeholder="Enter your name"
                  className="text-4xl h-full bg-transparent outline-none w-full text-white placeholder-white/60"
                />
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
