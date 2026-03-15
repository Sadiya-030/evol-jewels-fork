"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomSliderGender({
  isOpen,
  onClose,
  onSelect,
  gender, // active value
}) {
  const options = [
    { label: "She/Her", data: "for her" },
    { label: "He/Him", data: "for him" },
    { label: "They/Them", data: "for them" },

    ,
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[9999]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* BOTTOM SHEET */}
          <motion.div
            className="fixed left-0 bottom-0 w-full z-[99999] py-[86px] px-[77px] bg-white rounded-t-2xl shadow-xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 160, damping: 25 }}
          >
            <div className="flex flex-col gap-6">
              <p className="text-5xl font-ethereal mb-10 text-black flex items-center justify-between">
                How do they identify?
                <svg
                  onClick={onClose}
                  xmlns="http://www.w3.org/2000/svg"
                  width="61"
                  height="61"
                  viewBox="0 0 61 61"
                  fill="none"
                >
                  <g clipPath="url(#clip0_2661_34903)">
                    <path
                      d="M47.6562 13.3438L13.3438 47.6562"
                      stroke="black"
                      strokeWidth="3.8125"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M47.6562 47.6562L13.3438 13.3438"
                      stroke="black"
                      strokeWidth="3.8125"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2661_34903">
                      <rect width="61" height="61" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </p>

              {/* OPTIONS */}
              {options.map((label) => {
                const active = gender === label?.data;

                return (
                  <button
                    key={label?.data}
                    onClick={() => onSelect(label?.data)}
                    className={`
                      h-[82px] text-[26px] font-semibold rounded-xl transition-all
                      ${
                        active
                          ? "bg-[#002066] text-white"
                          : "bg-[#00206612] text-[#002066]"
                      }
                    `}
                  >
                    {label?.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
