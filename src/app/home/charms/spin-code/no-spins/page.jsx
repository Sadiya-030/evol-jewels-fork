/**
 * No Spins Available Page
 *
 * This page renders when a user has already used their spin allocation (spinAvailable = 0).
 * It displays a friendly message thanking them for participating and offers options to:
 * - Explore more charms in the store
 * - Try with a different phone number
 * - Return to the home page
 *
 * Users are redirected here from the login page when their spin count is exhausted.
 */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import charms1 from "../../../../../../public/charmsicons1.png";
import charms2 from "../../../../../../public/charmsicons2.png";
import charms3 from "../../../../../../public/charmsicons3.png";

const Page = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userName, setUserName] = useState("");

  const charms = [charms1, charms2, charms3, charms2];

  useEffect(() => {
    const storedName = sessionStorage.getItem("spinUserName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Decorative animation: cycles through charm images in the circular icon
  // display to create visual interest on the "no spins available" page
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % charms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [charms.length]);

  return (
    <div className="relative w-full h-screen">
      {/* Background video - matching other spin pages */}
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
        <div className="px-[100px] flex-1 flex flex-col items-center justify-center">
          {/* Animated Charms Icon */}
          <div className="h-[224px] w-[224px] rounded-full border-2 border-gray-500 mb-[50px] p-[22px]">
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

          {/* Message */}
          <div className="text-center max-w-[800px] mb-[50px]">
            {userName && (
              <p className="text-white/80 text-[28px] mb-4">Hi {userName}!</p>
            )}

            <h1 className="text-[50px] font-ethereal text-white leading-[70px] mb-[26px]">
              You've Already Used Your Spin
            </h1>

            <p className="text-[26px] text-[#F4EFEF] leading-[42px]">
              Thank you for participating! Come back later for more exciting
              rewards.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-[600px] flex flex-col gap-5">
            {/* Primary CTA - Explore More Charms */}
            <Link
              href="/home/charms"
              className="bg-white font-ethereal text-[30px] h-[106px] text-center text-black flex items-center justify-center w-full rounded-full hover:bg-white/90 transition-colors"
            >
              Explore More Charms
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-[100px] pb-[100px]">
          <p className="text-white/40 text-[20px] text-center">
            Each phone number gets one spin per visit. Check back soon for new
            opportunities!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
