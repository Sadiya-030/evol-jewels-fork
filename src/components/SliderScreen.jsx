"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CardSlider from "./CardSlider";
import { browseStore } from "../store/browseProduct";
import { usePreferenceProdStore } from "../store/preferenceProdStore";
import { useLikedStore } from "../store/shortlistedProd";
import { useGreetingStore } from "../store/greetingStore";

const SliderScreen = () => {
  const router = useRouter();
  const idleTimer = useRef(null);
  const {
    browseProducts,
    setBrowseProducts,
    clearBrowseProducts,
    hasHydrated,
  } = browseStore();
  const { clearPreferenceProd } = usePreferenceProdStore();
  const { clearLikes } = useLikedStore();
  const { resetSelectedCard } = useGreetingStore();
  const IDLE_TIME = 2 * 60 * 1000; // 2 minutes

  const resetTimer = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }

    idleTimer.current = setTimeout(() => {
      router.push("/");
    }, IDLE_TIME);
  };

  useEffect(() => {
    resetTimer();
    clearBrowseProducts();
    clearPreferenceProd();
    clearLikes();
    resetSelectedCard();
    const events = [
      "touchstart", // finger touches
      "touchmove", // swiping / dragging slider
      "mousedown",
      "mousemove",
      "scroll",
      "keydown",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <div className="w-full relative h-full">
      <div className="w-full h-screen z-0 absolute top-0 left-0">
        <div className=" absolute top-0 left-0 h-screen z-[1] w-full bg-blue-950/80"></div>
      </div>

      <div className="pt-[68px] pb-5 relative z-50 px-[0px]">
        <p className="font-hind mb-[80px] text-white backdrop-blur-3xl rounded-[2000px] mx-auto flex items-center justify-center gap-[18px] text-2xl w-fit border min-h-[83px] px-[68px] border-[#FFFFFF54]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 33 33"
            fill="none"
          >
            <g clipPath="url(#clip0)">
              <path
                d="M16.5 28.875C23.3345 28.875 28.875 23.3345 28.875 16.5C28.875 9.66548 23.3345 4.125 16.5 4.125C9.66548 4.125 4.125 9.66548 4.125 16.5C4.125 23.3345 9.66548 28.875 16.5 28.875Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.4688 15.4688C15.7423 15.4688 16.0046 15.5774 16.198 15.7708C16.3914 15.9642 16.5 16.2265 16.5 16.5V21.6562C16.5 21.9298 16.6086 22.1921 16.802 22.3855C16.9954 22.5789 17.2577 22.6875 17.5312 22.6875"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.9844 12.375C16.8387 12.375 17.5312 11.6824 17.5312 10.8281C17.5312 9.97381 16.8387 9.28125 15.9844 9.28125C15.1301 9.28125 14.4375 9.97381 14.4375 10.8281C14.4375 11.6824 15.1301 12.375 15.9844 12.375Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="33" height="33" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className=" mt-1.5">
            Select a journey and we’ll craft the perfect jewellery experience
            for you.
          </span>
        </p>

        <p className="font-ethereal text-[44px] text-white text-center">
          Ready to find your perfect gift?
        </p>

        <CardSlider />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[400px] pointer-events-none bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default SliderScreen;
