"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import charms1 from "../../../../../../public/charmsicons1.png";
import charms2 from "../../../../../../public/charmsicons2.png";
import charms3 from "../../../../../../public/charmsicons3.png";
import ServiceError from "../../../../../components/ui/ServiceError";
import { throttle } from "../../../../../utils/throttle";
import { validatePhoneNumber } from "../../../../lib/userSpinService";

// Static keyboard layout - moved outside component for optimization
const NUM_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "Back"],
];

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
];

const KeyboardKey = ({ label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`min-w-[75px] px-2 h-[79px] rounded-[8px] text-black text-[40px] font-semibold bg-[#fff] backdrop-blur-sm hover:bg-[#FFFFFF25] transition-all ${className}`}
  >
    {label}
  </button>
);

const Page = () => {
  const router = useRouter();
  const inputRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showServiceError, setShowServiceError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const charms = [charms1, charms2, charms3, charms2];

  // Decorative animation: cycles through charm images in the circular icon
  // display at the top of the page to create visual interest while user enters phone
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % charms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [charms.length]);

  // Handle click outside to close keyboard and country picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      // Close country picker
      if (
        showCountryPicker &&
        !target.closest('[data-country-picker="true"]')
      ) {
        setShowCountryPicker(false);
      }

      // Close keyboard
      if (!isKeyboardOpen) return;
      if (target.closest('[data-keyboard="true"]')) return;
      if (target.closest('[data-phone-input="true"]')) return;
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
  }, [isKeyboardOpen, showCountryPicker]);

  // Handle physical keyboard input
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const handleKeyPress = (key) => {
    if (key === "Back") {
      setPhoneNumber((prev) => prev.slice(0, -1));
      setError("");
    } else if (phoneNumber.length < 10) {
      setPhoneNumber((prev) => prev + key);
      setError("");
    }
  };

  const checkUser = async () => {
    // Use the shared validation function
    const fullPhone = `${countryCode}${phoneNumber}`;
    const validation = validatePhoneNumber(fullPhone);
    if (!validation.valid) {
      setError(validation.error || "Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/user-spin?phoneNumber=${encodeURIComponent(fullPhone)}`,
      );
      const data = await res.json();

      if (res.status === 404) {
        // First-time user - redirect to register page
        sessionStorage.setItem("userPhoneNumber", fullPhone);
        sessionStorage.setItem("spinCountryCode", countryCode);
        router.push("/home/charms/spin-code/login/register");
        return;
      }

      if (res.status === 500 || !res.ok) {
        setShowServiceError(true);
        return;
      }

      if (data.success) {
        // Existing user - check spin availability
        sessionStorage.setItem("userPhoneNumber", fullPhone);
        sessionStorage.setItem("spinUserName", data.data.name);

        if (data.data.spinAvailable >= 1) {
          // Has spins - go to spin page
          router.push("/home/charms/spin-code/spin");
        } else {
          // No spins - go to no-spins page
          router.push("/home/charms/spin-code/no-spins");
        }
      }
    } catch (err) {
      console.error("Error checking user:", err);
      setShowServiceError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserRef = useRef(checkUser);
  useEffect(() => {
    checkUserRef.current = checkUser;
  }, [phoneNumber, countryCode]);

  const throttledCheckUser = useMemo(
    () =>
      throttle(() => {
        checkUserRef.current();
      }, 2000),
    [],
  );

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  return (
    <div className="relative w-full h-screen">
      {/* Service Error Modal */}
      {showServiceError && (
        <ServiceError
          onRetry={() => {
            setShowServiceError(false);
            checkUser();
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
            href="/home/charms"
            className="flex text-black items-center gap-4 text-[24px]"
          >
            <ArrowLeft size={32} className="text-black" />
            Back
          </Link>
          <p className="text-black text-[30px]">Charms</p>
          <Link
            href="/home"
            className="rounded-md border-[2.207px] text-xl text-black border-black px-3 py-2 grid place-content-center"
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
                Spin the Wheel, Just One Step Away!
              </p>
              <p className="text-[26px] leading-[56px] text-[#F4EFEF]">
                Enter your mobile number to spin the wheel. We'll never spam.
              </p>
            </div>

            {/* Phone Input */}
            <div className="w-full mb-[40px]">
              <label className="text-white text-[24px] w-full leading-[50px]">
                Phone Number
              </label>
              <div className="flex gap-[24px]">
                {/* Country Code Selector */}
                <div className="relative" data-country-picker="true">
                  <button
                    onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="px-[30px] justify-center min-w-[160px] whitespace-nowrap text-[28px] leading-[54px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[108px] border-2 flex items-center gap-3 border-[#EDD9D942] text-white hover:bg-[#FFFFFF40] transition-colors"
                  >
                    <span className="text-[32px]">{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <ChevronDown
                      size={24}
                      className={`transition-transform ${showCountryPicker ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Country Dropdown */}
                  <AnimatePresence>
                    {showCountryPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-[16px] shadow-2xl overflow-hidden z-[100] min-w-[280px] max-h-[400px] overflow-y-auto"
                      >
                        {COUNTRY_CODES.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => {
                              setCountryCode(country.code);
                              setShowCountryPicker(false);
                            }}
                            className={`w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-100 transition-colors ${
                              countryCode === country.code ? "bg-blue-50" : ""
                            }`}
                          >
                            <span className="text-[28px]">{country.flag}</span>
                            <span className="text-[22px] text-gray-800 flex-1">
                              {country.country}
                            </span>
                            <span className="text-[20px] text-gray-500">
                              {country.code}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phone Input Field */}
                <div
                  data-phone-input="true"
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
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onFocus={() => setIsKeyboardOpen(true)}
                    placeholder="Enter your phone number"
                    className="text-4xl h-full bg-transparent outline-none w-full text-white placeholder-white/60"
                    maxLength={10}
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-400 text-[20px] mt-3">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Numeric Keyboard */}
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
              {NUM_ROWS.map((row, rowIndex) => (
                <div
                  key={`row-${rowIndex}`}
                  className="flex gap-6 justify-center"
                  data-keyboard="true"
                >
                  {row.map((key, keyIndex) =>
                    key === "" ? (
                      <div
                        key={`empty-${rowIndex}-${keyIndex}`}
                        className="min-w-[100px] h-[79px]"
                      />
                    ) : (
                      <KeyboardKey
                        key={`key-${rowIndex}-${keyIndex}-${key}`}
                        label={key}
                        onClick={() => handleKeyPress(key)}
                        className={`min-w-[100px] ${
                          key === "Back"
                            ? "text-[24px] hover:bg-red-300/80"
                            : ""
                        }`}
                      />
                    ),
                  )}
                </div>
              ))}
              <button
                onClick={throttledCheckUser}
                disabled={isLoading}
                className="bg-white font-ethereal text-[30px] h-[106px] text-center text-black mt-[60px] flex items-center justify-center w-full rounded-full disabled:opacity-50"
              >
                {isLoading ? "Checking..." : "Continue"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show button when keyboard is hidden */}
        {!isKeyboardOpen && (
          <div className="px-[100px] pb-[50px]">
            <button
              onClick={throttledCheckUser}
              disabled={isLoading}
              className="bg-white font-ethereal text-[30px] h-[106px] text-center text-black flex items-center justify-center w-full rounded-full disabled:opacity-50"
            >
              {isLoading ? "Checking..." : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
