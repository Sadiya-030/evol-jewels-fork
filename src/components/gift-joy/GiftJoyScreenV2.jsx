"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Player from "lottie-react";
import animation from "../../../public/circle.json";
import Keyboard from "../../components/Keyboard";
import LoadingProd from "../../components/LoadingProd";
import { AnimatePresence, motion } from "framer-motion";
import VideoLayer from "../../components/ui/VideoLayer";
import { IoArrowBackOutline } from "react-icons/io5";
import star from "../../../public/star.svg";

const GiftJoyScreenV2 = ({ setPageState }) => {
  const router = useRouter();

  const [typedValue, setTypedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);
  // Handle click outside to close keyboard
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!showKeyboard) return;
      const target = event.target;
      if (target.closest('[data-keyboard="true"]')) return;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      setShowKeyboard(false);
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
  }, [showKeyboard]);

  const sendAudioToApi = async () => {
    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/webm",
    });

    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.text) {
        setTypedValue((prev) => (prev ? prev + " " + data.text : data.text));
      }
    } catch (err) {
      console.error("STT failed", err);
      alert("Speech recognition failed");
    } finally {
      setIsTranscribing(false);
    }
  };

  const startMic = async () => {
    setTypedValue("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = sendAudioToApi;

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone permission denied");
    }
  };
  const stopMic = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsTranscribing(true);
  };

  const fetchProducts = async (sentenceQuery) => {
    if (!sentenceQuery?.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://evol.thumbstack.dev/api/products/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: sentenceQuery, // whole sentence
            topK: 21,
            sentence: true,
          }),
        }
      );

      const data = await response.json();

      if (data.success && data.products) {
        sessionStorage.setItem("products", JSON.stringify(data.products));
        sessionStorage.setItem("searchQuery", sentenceQuery);
        router.push("/products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (key) => {
    if (key === "Delete") {
      setTypedValue((prev) => prev.slice(0, -1));
    } else {
      setTypedValue((prev) => prev + key);
    }
  };

  const handleContinue = () => {
    if (!typedValue.trim()) return;
    fetchProducts(typedValue.trim());
  };
  return (
    <div className="relative w-full h-full">
      {/* Product loading layer */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <LoadingProd />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BG video */}
      <VideoLayer src="https://ts-bucket.mum-objectstore.e2enetworks.net/evol_4b2a7deae5.mp4" />

      <div className="relative z-50">
        {/* Header */}
        <div className="h-[103px] mb-[76px] bg-gray-300/20 flex justify-between items-center px-[50px] w-full">
          <p className="text-white font-hind text-[30px]">Gift a moment</p>
          <Link
            href="/home"
            className="rounded-md border-[2.207px] text-white text-xl border-[#FFFFFF66] px-3 py-2 grid place-content-center"
          >
            Home
          </Link>
        </div>

        {/* Back */}
        <div className=" px-[100px] w-full h-[108px]">
          <p
            onClick={() => setPageState("")}
            className=" flex gap-[36px] font-hind text-white text-[36px] items-center  w-fit cursor-pointer"
          >
            <IoArrowBackOutline size={50} />
            Back
          </p>
        </div>

        {/* Center animation */}
        <div className=" relative w-full flex justify-center    mt-[88px] mb-[110px]">
          <img
            src={star.src}
            className=" absolute z-0 top-10 left-[260px]"
            alt="star icon"
          />
          <div className=" h-[471px] w-[471px] opacity-45 rounded-full ">
            <Player
              animationData={animation}
              loop
              autoplay
              renderer="svg"
              className="relative h-full scale-150 w-full"
            />
          </div>
          <img
            src={star.src}
            className=" absolute bottom-24 z-0 h-16 w-auto right-[380px]"
            alt="star icon"
          />
          <div className=" absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
            <p className=" text-white no-ellipsis2 text-[60px] max-w-[700px] font-ethereal  leading-[80px] text-center">
              Tell us what you&apos;re looking for
            </p>
          </div>
        </div>

        {/* Input + mic */}
        <div className="px-[77px] ">
          <p className="text-center font-hind text-[40px] leading-[76px] text-white">
            Type or say your perfect gift in one sentence
          </p>

          <div className="px-[45px] mt-[32px] mb-[134px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[108px] w-full border-2 flex gap-4 items-center border-[#EDD9D942]">
            <input
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              onFocus={() => setShowKeyboard(true)}
              disabled={isTranscribing}
              className="text-4xl h-full bg-transparent outline-none w-full text-white placeholder-white/60"
              placeholder={
                isRecording
                  ? "Listening..."
                  : isTranscribing
                  ? "Transcribing..."
                  : "E.g. \"I'm looking for a gold ring for my daughter's engagement\""
              }
            />

            <button
              type="button"
              disabled={isTranscribing}
              onClick={isRecording ? stopMic : startMic}
              className={`
    relative flex items-center justify-center 
    h-[63px] w-[63px] rounded-full 
    transition duration-300
    ${
      isTranscribing
        ? "bg-gray-500 cursor-not-allowed"
        : isRecording
        ? "bg-red-500/80"
        : "bg-blue-800"
    }
  `}
            >
              {/* Glow effect */}
              <motion.span
                initial={false}
                animate={
                  isRecording
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(255,0,0,0.6)",
                          "0 0 20px rgba(255,0,0,0.9)",
                          "0 0 0px rgba(255,0,0,0.6)",
                        ],
                        scale: [1, 1.15, 1],
                      }
                    : {
                        boxShadow: "0 0 10px rgba(255,255,255,0.4)",
                        scale: 1,
                      }
                }
                transition={{
                  duration: isRecording ? 1.2 : 0.4,
                  repeat: isRecording ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full"
              />
              {/* Ripple ring when recording */}
              {isRecording && (
                <motion.span
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.9 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-full border border-red-400"
                />
              )}
              {/* Mic Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="29"
                viewBox="0 0 20 29"
                fill="none"
                className="relative z-[10]"
              >
                <path
                  d="M4 14V6C4 4.4087 4.63214 2.88258 5.75736 1.75736C6.88258 0.632141 8.4087 0 10 0C11.5913 0 13.1174 0.632141 14.2426 1.75736C15.3679 2.88258 16 4.4087 16 6V14C16 15.5913 15.3679 17.1174 14.2426 18.2426C13.1174 19.3679 11.5913 20 10 20C8.4087 20 6.88258 19.3679 5.75736 18.2426C4.63214 17.1174 4 15.5913 4 14ZM20 14C20 13.7348 19.8946 13.4804 19.7071 13.2929C19.5196 13.1054 19.2652 13 19 13C18.7348 13 18.4804 13.1054 18.2929 13.2929C18.1054 13.4804 18 13.7348 18 14C18 16.1217 17.1571 18.1566 15.6569 19.6569C14.1566 21.1571 12.1217 22 10 22C7.87827 22 5.84344 21.1571 4.34315 19.6569C2.84285 18.1566 2 16.1217 2 14C2 13.7348 1.89464 13.4804 1.70711 13.2929C1.51957 13.1054 1.26522 13 1 13C0.734784 13 0.48043 13.1054 0.292893 13.2929C0.105357 13.4804 0 13.7348 0 14C0.00304514 16.4782 0.924902 18.8672 2.5873 20.7051C4.24971 22.543 6.53455 23.6991 9 23.95V28C9 28.2652 9.10536 28.5196 9.29289 28.7071C9.48043 28.8946 9.73478 29 10 29C10.2652 29 10.5196 28.8946 10.7071 28.7071C10.8946 28.5196 11 28.2652 11 28V23.95C13.4654 23.6991 15.7503 22.543 17.4127 20.7051C19.0751 18.8672 19.997 16.4782 20 14Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className=" fixed bottom-0 left-0 w-full z-50">
        <Keyboard
          isOpen={showKeyboard}
          onClose={() => setShowKeyboard(false)}
          onKeyPress={handleKeyPress}
          iscloseVisible={true}
          handleContinue={handleContinue}
        />
      </div>
    </div>
  );
};

export default GiftJoyScreenV2;
