"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const SpinSucess = ({ isOpen, setIsOpen, isSucess }) => {
  const router = useRouter();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              router.push("/home/charms");
              setIsOpen(false);
            }}
          />

          {/* Modal Box */}
          <motion.div
            key="modal"
            className="fixed z-[101] top-1/2 left-1/2 w-[996px] h-[716px] rounded-[24px] bg-white flex items-center justify-center shadow-xl"
            initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {isSucess ? (
              <div className=" w-full px-[67px]">
                <div className=" bg-white h-[191px] overflow-hidden mb-[55px] mx-auto w-[191px] flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80"
                    alt="Success"
                    className=" w-auto mx-auto h-[191px] object-cover rounded-full"
                  />
                </div>
                <p className=" text-black text-center text-[58px] leading-[68px]">
                  You Won a Real Gold Charm!{" "}
                </p>
                <p className=" text-[30px] mt-[24px] mb-[55px] text-black leading-[54px]">
                  That’s some amazing luck! A tiny token of real gold is now
                  yours.
                </p>
                <Link
                  href="/home/charms/spin-code"
                  onClick={() => setIsOpen(false)}
                  className=" text-white text-[30px] leading-[54px]  rounded-[200px] h-[100px] flex items-center justify-center w-full bg-[#002066]"
                >
                  Okay
                </Link>
              </div>
            ) : (
              <div className=" w-full px-[67px]">
                <div className=" bg-white h-[191px] overflow-hidden  mb-[55px] mx-auto w-[191px]">
                  <img
                    src="https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&q=80"
                    alt="Try again"
                    className=" w-auto mx-auto h-[191px] object-cover rounded-full"
                  />
                </div>
                <p className=" text-black text-center text-[58px] leading-[68px]">
                  Not This Time…
                </p>
                <p className=" text-[30px] mt-[24px] mb-[55px] text-black leading-[54px]">
                  Don’t worry — you’ve still got ways to get your charm today!
                </p>
                <Link
                  href="/home/charms/spin-code"
                  onClick={() => setIsOpen(false)}
                  className=" text-white text-[30px] leading-[54px]  rounded-[200px] h-[100px] flex items-center justify-center w-full bg-[#002066]"
                >
                  Try Again Tomorrow
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SpinSucess;
