"use client";

import Link from "next/link";
import React from "react";
import VideoLayer from "../ui/VideoLayer";

const GiftJoyOptionScreen = ({ setPageState }) => {
  return (
    <div className="relative w-full h-full">
      <div className="w-full h-screen z-0 absolute top-0 left-0">
        <div className="absolute top-0 left-0 h-screen z-[1] w-full bg-blue-950/80"></div>
      </div>

      <div className="relative z-50 min-h-screen">
        {/* Header */}
        <div className="h-[103px] bg-gray-300/20 flex justify-between items-center px-[50px] w-full">
          <p className="text-white font-hind text-[30px]">Gift a moment</p>
          <Link
            href="/home"
            className="rounded-md border-[2.207px] text-xl text-white border-[#FFFFFF66] px-3 py-2 grid place-content-center"
          >
            Home
          </Link>
        </div>

        {/* Intro Section */}
        <div>
          <p className="font-ethereal text-[44px] mb-6 mt-20 text-white text-center">
            I’m Evol, your personal gifting companion
          </p>

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

            <span className="mt-1.5">
              Select a journey and we’ll craft the perfect jewellery experience
              for you.
            </span>
          </p>
        </div>

        {/* Option Cards */}
        <div className="px-14 flex flex-col gap-16 w-full pb-20">
          {/* Smart Guide */}
          <div
            onClick={() => setPageState("guided")}
            className="border border-[rgba(230,188,188,0.29)] h-[568px] w-full backdrop-blur-lg rounded-[45px] bg-[#ffffff1e] px-10 cursor-pointer hover:bg-[#ffffff2e] transition-all hover:shadow-[0_0_30px_4px_rgba(255,255,255,0.4)] flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <p className="font-ethereal text-[120px] text-white font-extralight leading-none">
                Smart Guide
              </p>
              <p className="max-w-[544px] text-[26px] font-hind text-white mt-4">
                Choose from curated suggestions, we'll guide you to the perfect
                gift.
              </p>
            </div>
          </div>

          {/* Free Choice */}
          <div
            onClick={() => setPageState("free")}
            className="border border-[rgba(230,188,188,0.29)] h-[568px] w-full backdrop-blur-lg rounded-[45px] bg-[#ffffff1e] px-10 cursor-pointer hover:bg-[#ffffff2e] transition-all hover:shadow-[0_0_30px_4px_rgba(255,255,255,0.4)] flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <p className="font-ethereal text-[120px] text-white font-light leading-none">
                Free Choice
              </p>
              <p className="max-w-[544px] text-[26px] font-hind text-white mt-4">
                No suggestions - just tell us what you want, in your own words.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-[400px] pointer-events-none bg-gradient-to-t from-black to-transparent"></div>
      </div>
    </div>
  );
};

export default GiftJoyOptionScreen;
