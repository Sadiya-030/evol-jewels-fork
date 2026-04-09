"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";
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

  // Auto change charms every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % charms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [charms.length]);

  const handleTryDifferentNumber = () => {
    sessionStorage.removeItem("spinPhoneNumber");
    sessionStorage.removeItem("spinUserName");
    router.push("/home/charms/spin-code/login");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Premium Background with Unsplash Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2070&auto=format&fit=crop"
          alt="Elegant jewelry background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* Animated Charms Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl scale-150"></div>

            {/* Charms container */}
            <div className="relative h-[200px] w-[200px] rounded-full border-2 border-amber-400/50 p-[18px]">
              <div className="bg-white h-full rounded-full p-6 flex items-center justify-center shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={charms[currentIndex].src}
                    alt="Charms"
                    className="h-full w-full object-contain"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Sparkle decorations */}
            <Sparkles className="absolute -top-2 -right-2 text-amber-400 w-8 h-8" />
            <Sparkles className="absolute -bottom-2 -left-2 text-amber-400/60 w-6 h-6" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-[800px]"
        >
          {userName && (
            <p className="text-amber-400 text-[28px] mb-4 font-medium">
              Hi {userName}!
            </p>
          )}

          <h1 className="text-[56px] font-ethereal text-white leading-[70px] mb-6">
            You've Already Used Your Spin
          </h1>

          <p className="text-[26px] text-white/80 leading-[42px] mb-4">
            Thank you for participating in our lucky wheel!
          </p>

          <p className="text-[22px] text-white/60 leading-[36px]">
            Come back later for more exciting rewards and chances to win beautiful gold charms.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-col gap-5 w-full max-w-[500px]"
        >
          {/* Primary CTA - Explore More */}
          <Link
            href="/home/charms"
            className="flex items-center justify-center gap-4 w-full h-[90px] bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-[28px] font-medium shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-[1.02]"
          >
            Explore More Charms
            <ArrowRight size={28} />
          </Link>

          {/* Secondary CTA - Try Different Number */}
          <button
            onClick={handleTryDifferentNumber}
            className="flex items-center justify-center gap-4 w-full h-[90px] bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full text-[26px] font-medium hover:bg-white/20 transition-all"
          >
            <RefreshCw size={24} />
            Use Different Phone Number
          </button>

          {/* Home Link */}
          <Link
            href="/home"
            className="flex items-center justify-center w-full h-[70px] text-white/60 text-[22px] hover:text-white transition-colors"
          >
            Return to Home
          </Link>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute bottom-8 text-white/40 text-[18px] text-center"
        >
          Each phone number gets one spin per visit. Check back soon for new opportunities!
        </motion.p>
      </div>
    </div>
  );
};

export default Page;
