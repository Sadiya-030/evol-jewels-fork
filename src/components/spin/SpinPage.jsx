"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import charms1 from "../../../public/charmsicons1.png";
import charms2 from "../../../public/charmsicons2.png";
import charms3 from "../../../public/charmsicons3.png";
import { motion, AnimatePresence } from "framer-motion";
import SpinSucess from "../../components/SpinSucess";
import VideoLayer from "../../components/ui/VideoLayer";
import { markCouponAsUsed, markSpinCouponAsUsed } from "../../utils/Apis";
import { charmsCode } from "../../store/CharmsCode/charmsCode";
import { useRouter } from "next/navigation";
import NotificationModal from "../ui/NotificationModal";
import { ArrowLeft } from "lucide-react";

const SpinPage = ({ charmsssr, Probability }) => {
  const charmsData = [
    ...charmsssr,
    ...charmsssr,
    ...charmsssr,
    ...charmsssr,
    ...charmsssr,
  ];
  const { charmsSize, setCharmsSize } = charmsCode();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [notifimodal, setnotifimodal] = useState(false);
  const [notifymsg, setnotifymsg] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Fallback images for charms
  const fallbackImages = [charms1.src, charms2.src, charms3.src];

  const segments = [
    {
      id: 1,
      emoji: charmsData[0]?.image?.url || fallbackImages[0],
      label: charmsData[0]?.title || "Charm 1",
      isWin: true,
      weight: 0.5,
      probability: 0.08,
    },
    { id: 2, emoji: "", label: "", isWin: false, probability: 0.25 },
    {
      id: 3,
      emoji: charmsData[1]?.image?.url || fallbackImages[1],
      label: charmsData[1]?.title || "Charm 2",
      isWin: true,
      weight: 0.5,
      probability: 0.08,
    },
    { id: 4, emoji: "", label: "", isWin: false, probability: 0.25 },
    {
      id: 5,
      emoji: charmsData[2]?.image?.url || fallbackImages[2],
      label: charmsData[2]?.title || "Charm 3",
      isWin: true,
      weight: 0.5,
      probability: 0.09,
    },
    { id: 6, emoji: "", label: "", isWin: false, probability: 0.2 },
    {
      id: 7,
      emoji: charmsData[3]?.image?.url || fallbackImages[0],
      label: charmsData[3]?.title || "Charm 4",
      isWin: true,
      weight: 0.5,

      probability: 0.08,
    },
    { id: 8, emoji: "", label: "", isWin: false, probability: 0.05 },
  ];

  // Track if this is phone-based flow
  const [isPhoneFlow, setIsPhoneFlow] = useState(false);
  const [spinPhoneNumber, setSpinPhoneNumber] = useState("");

  // Wait for store hydration before checking session
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check session only after hydration
  useEffect(() => {
    if (!isHydrated) return;

    // Check for phone-based flow first
    const phoneNumber = sessionStorage.getItem("spinPhoneNumber");
    if (phoneNumber) {
      setIsPhoneFlow(true);
      setSpinPhoneNumber(phoneNumber);
      return;
    }

    // Check both store and sessionStorage for valid session (legacy coupon flow)
    const hasSession = sessionStorage.getItem("charmSessionId");
    const hasCharmsSize = charmsSize !== null && charmsSize !== "";

    if (!hasSession && !hasCharmsSize) {
      router.push("/home/charms");
    }
  }, [isHydrated, charmsSize]);

  const segmentAngle = 360 / segments.length;

  const selectSegmentByProbability = () => {
    const isWinner = Math.random() < WIN_PROBABILITY;

    const pool = isWinner ? winSegments : loseSegments;

    const selected = pool[Math.floor(Math.random() * pool.length)];

    return {
      ...selected,
      index: segments.findIndex((seg) => seg.id === selected.id),
    };
  };
  const [issuccessspin, setisSucesssSpin] = useState(false);

  // Decrement spin for phone-based flow
  const decrementUserSpin = async () => {
    try {
      const res = await fetch("/api/user-spin/spin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: spinPhoneNumber }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error decrementing spin:", error);
      return { success: false, error: error.message };
    }
  };

  const handelSelectCharm = async (spinresult) => {
    if (!spinresult) return;

    // Handle phone-based flow
    if (isPhoneFlow) {
      // Decrement spin count
      const decrementResult = await decrementUserSpin();
      if (decrementResult?.success === false) {
        setnotifymsg(decrementResult?.message || decrementResult?.error || "Failed to record spin");
        setnotifimodal(true);
        return;
      }

      // Show result modal
      setisSucesssSpin(spinresult?.isWin === true);
      setsucessModal(true);

      // Clear session data
      sessionStorage.removeItem("spinPhoneNumber");
      sessionStorage.removeItem("spinUserName");
      return;
    }

    // Legacy coupon-based flow
    const sesId = sessionStorage.getItem("charmSessionId");
    if (spinresult?.isWin === false) {
      const data2 = await markSpinCouponAsUsed(sesId);
      if (data2?.success === false) {
        setisSucesssSpin(false);
        setsucessModal(true);
        setCharmsSize(null);
        return;
      }
      sessionStorage.removeItem("charmSessionId");
      setisSucesssSpin(false);
      setsucessModal(true);
      setCharmsSize(null);
      return;
    }

    const data = await markCouponAsUsed(
      charmsSize,
      true,
      0.5,
      spinresult?.label,
      sesId
    );
    if (data?.success === false) {
      setnotifymsg(data?.error);
      setnotifimodal(true);
      // setisSucesssSpin(false);
      // setsucessModal(true);
      setCharmsSize(null);
      return;
    }
    sessionStorage.removeItem("charmSessionId");
    setisSucesssSpin(true);
    setsucessModal(true);
    setCharmsSize(null);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const targetSegment = selectSegmentByProbability();
    const targetIndex = targetSegment.index;

    const fullRotations = 5 + Math.floor(Math.random() * 3);

    // each segment = segmentAngle degrees
    const segmentCenterOffset = (targetIndex + 0.5) * segmentAngle;

    // current position of wheel (mod 360)
    const currentRotation = rotation % 360;

    // target position so pointer hits the middle of the chosen segment
    const targetPosition = 360 - segmentCenterOffset;

    let rotationNeeded = targetPosition - currentRotation;
    if (rotationNeeded < 0) rotationNeeded += 360;

    const finalRotation = rotation + fullRotations * 360 + rotationNeeded;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(targetSegment);
      // open modal after result is decided
      handelSelectCharm(targetSegment);
    }, 5000);
  };

  const charms = [charms1, charms2, charms3, charms2];

  // Auto change every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % charms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [charms.length]);

  const [sucessModal, setsucessModal] = useState(false);
  const WIN_PROBABILITY = Number(Probability) || 0.05; // 1 in 100
  const winSegments = segments.filter((seg) => seg.isWin);
  const loseSegments = segments.filter((seg) => !seg.isWin);

  return (
    <div className="relative w-full h-screen">
      {/* Background video */}
      <VideoLayer
        src={
          "https://ts-bucket.mum-objectstore.e2enetworks.net/evol_4b2a7deae5.mp4"
        }
      />
      <NotificationModal
        msg={notifymsg}
        isOpen={notifimodal}
        onClose={() => setnotifimodal(false)}
      />
      {/* Win/Lose Modal */}
      <SpinSucess
        isOpen={sucessModal}
        setIsOpen={setsucessModal}
        isSucess={issuccessspin}
      ></SpinSucess>

      {/* Foreground content */}
      <div className="relative overflow-hidden z-50 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="h-[103px] flex-shrink-0 bg-gray-100/10 flex justify-between items-center px-[50px] w-full">
          <button
            onClick={() => router.back()}
            className="flex text-white items-center gap-4 text-[24px]"
          >
            <ArrowLeft size={32} className="text-white" />
            Back
          </button>
          <p className="text-white text-[30px]">Charms</p>
          <Link
            href="/home"
            className="rounded-md border-[2.207px] text-xl text-white border-[#FFFFFF66] px-3 py-2 grid place-content-center"
          >
            Home
          </Link>
        </div>

        {/* Input area */}
        <div className="px-[100px] h-fit flex-col flex items-start mt-[40px]">
          <div className=" w-full h-fit mt-[65px] mb-12">
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
            <p className=" text-[50px] font-ethereal text-center text-white mb-[26px] leading-[80px]">
              Try Your Luck!
            </p>
            <p className=" text-[26px] leading-[56px] text-[#F4EFEF]">
              One Week. One Spin. Unlock Your Charm!
            </p>
          </div>
          <div className=" w-full flex items-start  h-[300px] ">
            <div
              onClick={spinWheel}
              // 'disabled' here doesn’t affect div, keeping as-is to not change your logic
              disabled={isSpinning}
              className=" bg-white font-ethereal text-[30px] h-[106px] text-center text-black   flex items-center justify-center w-full rounded-full"
            >
              Spin Now
            </div>
          </div>
        </div>
        </div>

        {/* spin */}
        <div className="  w-full overflow-hidden  scale-100 pt-[100px]   h-full">
          <div className="relative  w-full  mx-auto  ">
            <div className="relative w-full pb-[100%]">
              <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="86"
                  height="124"
                  viewBox="0 0 86 124"
                  fill="none"
                >
                  <path
                    d="M0 9.19054C33.1462 -3.06351 52.5317 -3.06351 85.6779 9.19054C69.0546 49.1669 59.9645 74.9808 42.839 123.947C25.7134 74.9808 16.6233 49.1669 0 9.19054Z"
                    fill="url(#paint0_linear_2482_5088)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2482_5088"
                      x1="42.839"
                      y1="123.947"
                      x2="42.839"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FFA347" />
                      <stop offset="0.13" stop-color="#FFE2AF" />
                      <stop offset="0.16" stop-color="#E9C694" />
                      <stop offset="0.22" stop-color="#B0814F" />
                      <stop offset="0.28" stop-color="#703200" />
                      <stop offset="0.49" stop-color="#FFF0CE" />
                      <stop offset="0.61" stop-color="#FFBB57" />
                      <stop offset="0.83" stop-color="#562C02" />
                      <stop offset="1" stop-color="#FFE2AF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="absolute  inset-0 ">
                <div className="absolute  shadow-[inset_0_0_40px_rgba(255,200,0,0.18)] inset-0 rounded-full overflow-hidden border-[56px] border-[#FFBB57]">
                  <div className="absolute shadow-[inset_0_6px_8px_rgba(0,0,0,0.45)]  inset-0 rounded-full overflow-hidden border-[8px] border-[#FFA950]">
                    <div
                      className="absolute inset-0 w-full h-full transition-transform duration-[5000ms] ease-out"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transitionTimingFunction:
                          "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
                      }}
                    >
                      <svg
                        className="w-full h-full scale-105"
                        viewBox="0 0 100 100"
                      >
                        {segments.map((segment, index) => {
                          const startAngle =
                            (index * segmentAngle - 90) * (Math.PI / 180);
                          const endAngle =
                            ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

                          const x1 = 50 + 50 * Math.cos(startAngle);
                          const y1 = 50 + 50 * Math.sin(startAngle);
                          const x2 = 50 + 50 * Math.cos(endAngle);
                          const y2 = 50 + 50 * Math.sin(endAngle);

                          const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                          const fillColor =
                            index % 2 === 0 ? "#462985" : "#F8F7F7";

                          const midAngle =
                            startAngle + (segmentAngle / 2) * (Math.PI / 180);
                          const emojiX = 50 + 30 * Math.cos(midAngle);
                          const emojiY = 50 + 30 * Math.sin(midAngle);
                          const DemojiX = 50 + 43.5 * Math.cos(midAngle);
                          const DemojiY = 50 + 43.5 * Math.sin(midAngle);

                          return (
                            <g key={segment.id}>
                              <defs>
                                <radialGradient
                                  id="dotStrokeGradient"
                                  cx="50%"
                                  cy="50%"
                                  r="50%"
                                >
                                  <stop offset="0%" stopColor="#FFF2CC" />
                                  <stop offset="50%" stopColor="#FFD480" />
                                  <stop offset="100%" stopColor="#3b1a01" />
                                </radialGradient>
                              </defs>
                              <path
                                d={pathData}
                                fill={fillColor}
                                stroke="url(#dotStrokeGradient)"
                                strokeWidth="0.7" // border thickness
                              />
                              {!segment?.emoji && (
                                <circle
                                  cx={DemojiX}
                                  cy={DemojiY}
                                  r="1.7"
                                  fill="#C1A05A" // inner color
                                  filter="drop-shadow(0 0 4px #FFD480)"
                                />
                              )}
                              {segment?.emoji && (
                                <circle
                                  cx={DemojiX}
                                  cy={DemojiY}
                                  r="1.4"
                                  fill="#FFD480" // inner color
                                  stroke="#3b1a01" // border color
                                  strokeWidth="0.7" // border thickness
                                  filter="drop-shadow(0 0 4px #FFD480)"
                                />
                              )}
                              {segment?.emoji && (
                                <image
                                  href={segment.emoji}
                                  x={emojiX - 5}
                                  y={emojiY - 5}
                                  width="10"
                                  height="10"
                                  preserveAspectRatio="xMidYMid meet"
                                />
                              )}
                            </g>
                          );
                        })}
                      </svg>

                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[190px] h-[190px] bg-gradient-to-br  rounded-full   z-10 flex items-center justify-center">
                        {/* <img
                          src={Circle.src}
                          className=" h-full w-full scale-125 object-contain"
                          alt=""
                        /> */}

                        <div className=" h-[150px] w-[150px] flex items-center justify-center shadow-[0_6px_15px_rgba(0,0,0,0.45)] bg-[#EBD3B9] rounded-full">
                          <div className=" h-[50px] w-[50px]  shadow-md bg-[#C1A05A] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinPage;
