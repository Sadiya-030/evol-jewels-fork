import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationModal = ({
  isOpen,
  onClose,
  msg,
  vendingMachineError = false,
  wonBean = null,
}) => {
  // Check if this is a vending machine error
  const isVendingError =
    vendingMachineError ||
    (msg &&
      msg.toLowerCase().includes("contact") &&
      msg.toLowerCase().includes("staff"));

  // Check if this is a spin win with vending error (show won bean)
  // Ensure wonBean has title or grams to be considered valid
  const isSpinWinVendError =
    isVendingError && wonBean && (wonBean.title || wonBean.grams);

  // If showing won bean, use SpinSuccess styling
  if (isSpinWinVendError) {
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
              onClick={onClose}
            />

            {/* Modal Box - Matching SpinSuccess styling */}
            <motion.div
              key="modal"
              className="fixed z-[101] top-1/2 left-1/2 w-[996px] h-[716px] rounded-[24px] bg-white flex items-center justify-center shadow-xl"
              initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="w-full px-[67px]">
                {/* Bean Image */}
                <div className="bg-white h-[191px] overflow-hidden mb-[55px] mx-auto w-[191px] flex items-center justify-center">
                  {wonBean?.image ? (
                    <img
                      src={wonBean.image}
                      alt={wonBean.title || "Bean"}
                      className="w-auto mx-auto h-[191px] object-cover rounded-full"
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80"
                      alt="Bean"
                      className="w-auto mx-auto h-[191px] object-cover rounded-full"
                    />
                  )}
                </div>

                {/* Title */}
                <p className="text-black text-center text-[58px] leading-[68px]">
                  You've got {wonBean?.grams || "0.5"}gms{" "}
                  {wonBean?.title || "Coffee"} Bean!
                </p>

                {/* Description */}
                <p className="text-[30px] mt-[24px] mb-[55px] text-black leading-[54px] text-center">
                  Sorry, Service Unavailable. Please Contact Store Staff to
                  Collect Your Prize.
                </p>

                {/* Button */}
                <Link
                  href="/home/charms"
                  onClick={onClose}
                  className="text-white text-[30px] leading-[54px] rounded-[200px] h-[100px] flex items-center justify-center w-full bg-[#002066]"
                >
                  Okay
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Standard error modal
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-[24px] h-fit w-[940px] z-10 py-[95px] px-[60px] shadow-xl flex flex-col items-center justify-center">
        <p className="text-[56px] mb-[29px] text-center font-ethereal leading-[64px] text-gray-800">
          {msg}
        </p>

        {isVendingError && (
          <p className="text-[26px] leading-[42px] mb-[45px] max-w-[750px] mx-auto text-center text-black">
            Sorry, Service Unavailable. We are Trying to Get it Back Up!
          </p>
        )}

        <Link
          href={"/home/charms"}
          onClick={onClose}
          className="flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
        >
          Okay
        </Link>
      </div>
    </div>
  );
};

export default NotificationModal;
