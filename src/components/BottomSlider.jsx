"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const BottomSlider = ({ open, setOpen, data, onEdit }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "40%" }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="fixed bottom-0 left-0 w-full h-[100%] bg-white rounded-t-[50px] shadow-[24px] z-[100] pt-[83px] px-[77px]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-[50px] font-medium text-black">
              Edit Preferences
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-black font-semibold hover:opacity-70 transition"
            >
              {/* Close Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="61"
                height="61"
                viewBox="0 0 61 61"
                fill="none"
              >
                <path
                  d="M47.6562 13.3438L13.3438 47.6562M47.6562 47.6562L13.3438 13.3438"
                  stroke="black"
                  strokeWidth="3.8125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex flex-col gap-[86px] h-[50%] pb-10 mt-[71px]  overflow-y-scroll">
            {data?.map((item, i) => (
              <div
                key={i}
                className="flex gap-[62px] items-center justify-between w-full h-fit"
              >
                <div className="flex-shrink-0 border-[0.7px] cursor-pointer border-[#E2CDF4] p-1 rounded-full w-[185px] h-[185px] transition">
                  <div className="border relative border-[#FFBD7D] w-full h-full overflow-hidden rounded-full bg-[#D9D9D9] flex items-center justify-center text-[24px] text-white">
                    <p className="text-center z-50 px-2">{item?.answer}</p>
                    <div className="w-full absolute top-0 left-0 h-full object-cover">
                      <img
                        src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=1654"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex  flex-col">
                  <p className="text-[#302B2C] text-[30px] leading-[42px]">
                    {item?.question}
                  </p>
                  <p className="mb-[20px] text-black mt-[12px] text-[28px] font-semibold leading-[28px]">
                    {item?.answer}
                  </p>
                  <button
                    onClick={() => onEdit(i)}
                    className="text-black px-[32px] h-[64px] text-[20px] w-fit rounded-[200px] border-[1px] min-w-[216px]"
                  >
                    Edit Answer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomSlider;
