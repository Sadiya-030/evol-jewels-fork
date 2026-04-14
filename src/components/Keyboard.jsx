"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

const CapsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="30"
    viewBox="0 0 34 30"
    fill="none"
  >
    <path
      d="M9.17379 18.3827H0.894161C0.105791 18.3827 -0.295367 17.434 0.253529 16.8672L16.3251 0.271519C16.6757 -0.0905063 17.256 -0.0905063 17.6066 0.271519L33.6782 16.8672C34.2271 17.434 33.8259 18.3827 33.0376 18.3827H24.7568V28.2163C24.7568 28.7097 24.3572 29.1098 23.8643 29.1098H10.0663C9.57342 29.1098 9.17379 28.7097 9.17379 28.2163V18.3827Z"
      fill="black"
    />
  </svg>
);

const Key = ({ label, wide, onClick }) => (
  <button
    onClick={onClick}
    className={`h-[78px] w-[83px] flex-shrink-0 text-black bg-white  rounded-[8px] 
      active:scale-95 transition flex items-center justify-center
      ${wide ? "w-[135px] text-[31px]  " : "min-w-[65px] text-[41px]   px-3"}`}
  >
    {label}
  </button>
);

const Keyboard = ({
  onKeyPress,
  handleContinue,
  SkipHandleContinue,
  isOpen,
  onClose,
  version = 1,
  iscloseVisible = true,
  continueClassName = "",
  number = false,
}) => {
  const [isCaps, setisCaps] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[9999]"
          data-keyboard="true"
        >
          <div className="pt-[48px] relative bg-[#00000033] backdrop-blur-2xl " data-keyboard="true">
            {iscloseVisible && (
              <div
                onClick={onClose}
                className="w-10 rounded-full opacity-50 hover:opacity-100 text-black flex items-center justify-center bg-white p-2 text-lg h-10 absolute top-4 right-4"
              >
                <IoCloseOutline size={42} />
              </div>
            )}
            {/* ROW 1 */}
            {number && (
              <div className="flex justify-center gap-3 mb-5">
                {"1234567890".split("").map((key) => (
                  <Key
                    key={key}
                    label={isCaps ? key : key.toLowerCase()}
                    onClick={() => onKeyPress(isCaps ? key : key.toLowerCase())}
                  />
                ))}
              </div>
            )}
            <div className="flex justify-center gap-3 mb-5">
              {"QWERTYUIOP".split("").map((key) => (
                <Key
                  key={key}
                  label={isCaps ? key : key.toLowerCase()}
                  onClick={() => onKeyPress(isCaps ? key : key.toLowerCase())}
                />
              ))}
            </div>

            {/* ROW 2 */}
            <div className="flex justify-center gap-3 mb-5">
              {"ASDFGHJKL".split("").map((key) => (
                <Key
                  key={key}
                  label={isCaps ? key : key.toLowerCase()}
                  onClick={() => onKeyPress(isCaps ? key : key.toLowerCase())}
                />
              ))}
            </div>

            {/* ROW 3 */}
            <div className="flex justify-center gap-3 mb-5">
              <button
                onClick={() => setisCaps(!isCaps)}
                className={`min-w-[65px] h-[78px] w-[83px] rounded-[8px] flex items-center justify-center bg-white ${
                  isCaps ? "opacity-100" : "opacity-60"
                }`}
              >
                <CapsIcon />
              </button>

              {"ZXCVBNM".split("").map((key) => (
                <Key
                  key={key}
                  label={isCaps ? key : key.toLowerCase()}
                  onClick={() => onKeyPress(isCaps ? key : key.toLowerCase())}
                />
              ))}

              <Key label="&" onClick={() => onKeyPress("&")} />
            </div>

            {/* ROW 4 */}
            <div className="flex justify-center gap-3 mb-5">
              <Key label="Space" wide onClick={() => onKeyPress(" ")} />

              {["!", ".", ",", "“", ":", "(", ")"].map((key) => (
                <Key key={key} label={key} onClick={() => onKeyPress(key)} />
              ))}
              <Key label="Delete" wide onClick={() => onKeyPress("Delete")} />
            </div>

            <div className="text-center px-[80px] h-full pb-[78px] pt-7">
              {handleContinue && (
                <button
                  onClick={() => {
                    handleContinue();
                    onClose();
                  }}
                  className={`${continueClassName} px-10 py-4 cursor-pointer font-ethereal text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-white text-[#302B2C] font-semibold`}
                >
                  Continue
                </button>
              )}
              {version === 2 && (
                <button
                  onClick={() => {
                    SkipHandleContinue();
                    onClose();
                  }}
                  className="px-10 py-4 cursor-pointer mt-6 font-ethereal text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] border border-[#B7AEDB] bg-white text-black font-semibold"
                >
                  Skip
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Keyboard;
