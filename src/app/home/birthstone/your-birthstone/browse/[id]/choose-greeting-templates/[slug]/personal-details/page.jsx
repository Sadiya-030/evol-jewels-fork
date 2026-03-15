"use client";
import React, { useState, useEffect } from "react";
import img1 from "../../../../../../../../../../public/close.svg";
import "swiper/css";
import { BsInfoCircle } from "react-icons/bs";
import Keyboard from "../../../../../../../../../components/Keyboard";
import { usePathname, useRouter } from "next/navigation";
import { useGreetingStore } from "../../../../../../../../../store/greetingStore";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[0];
  const secondLast = parts[1];
  const { setSelectedCard, product, selectedCard, setProduct } =
    useGreetingStore();

  // form state
  const [personalDetails, setPersonalDetails] = useState({
    yourName: selectedCard?.yourName ? selectedCard?.yourName : "",
    theirName: selectedCard?.theirName ? selectedCard?.theirName : "",
  });

  // which input is active?
  const [activeField, setActiveField] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const handleInputFocus = (fieldName) => {
    setActiveField(fieldName);
    setIsKeyboardOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isKeyboardOpen) return;
      const target = event.target;
      if (target.closest('[data-keyboard="true"]')) return;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      setIsKeyboardOpen(false);
      setActiveField("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isKeyboardOpen]);

  // ⭐ FIXED: Properly update only the active field
  const handleKeyPress = (key) => {
    if (!activeField) return;

    setPersonalDetails((prev) => {
      if (key === "Delete") {
        return {
          ...prev,
          [activeField]: prev[activeField].slice(0, -1),
        };
      }
      return {
        ...prev,
        [activeField]: prev[activeField] + key,
      };
    });
  };

  const SkipHandleContinue = () => {
    setSelectedCard({
      ...selectedCard,
      yourName: "",
      theirName: "",
    });
    setProduct({
      ...product,
      isSkip: true,
    });
    router.push(`/${last}/${secondLast}/print-greeting`);
  };

  const handleContinue = () => {
    setSelectedCard({
      ...selectedCard,

      yourName: personalDetails?.yourName,
      theirName: personalDetails?.theirName,
    });
    setProduct({
      ...product,
      isSkip: false,
    });
    router.push(`${pathname}/print-greeting`);
  };
  return (
    <div className=" relative">
      <div className=" w-full h-screen z-0 absolute top-0 left-0">
        <video
          src="https://ts-bucket.mum-objectstore.e2enetworks.net/7946210_hd_720_1366_30fps_3_c58042e06d.mp4"
          loop
          autoPlay
          muted
          className=" w-full h-full object-cover"
        ></video>
        <div className=" absolute top-0 left-0 h-screen z-[1] w-full bg-white/80"></div>
      </div>

      <div className="min-h-screen h-full w-full  relative z-50 bg-white/70">
        <div className=" h-[137px] border-b border-[#CECECE] w-full flex items-center justify-between px-[50px]">
          <p className=" text-4xl  text-black">Gift a Moment</p>
          <button className=" bg-white border h-[63px] w-[63px] rounded-full grid place-content-center">
            <img
              src={img1.src}
              alt=""
              className=" h-[23px] object-cover w-[23px]"
            />
          </button>
        </div>
        <p
          onClick={() => {
            setSelectedCard({
              ...selectedCard,
              yourName: "",
              theirName: "",
            });
            router.back();
          }}
          className=" px-[50px] flex items-center gap-5 mt-[107px] mb-[38px] text-[#302B2C] font-hind text-[40px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="63"
            height="63"
            viewBox="0 0 63 63"
            fill="none"
          >
            <g clipPath="url(#clip0_2644_33929)">
              <path
                d="M53.1562 31.5H9.84375"
                stroke="#302B2C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M27.5625 13.7812L9.84375 31.5L27.5625 49.2188"
                stroke="#302B2C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_2644_33929">
                <rect width="63" height="63" fill="white" />
              </clipPath>
            </defs>
          </svg>{" "}
          Which template feels just right for your gift?
        </p>

        <p className="mx-[100px] mb-[107px] rounded-[2000px] text-[22px] font-medium text-[#7C50E3] w-[calc(100vw-200px)] flex items-center justify-center gap-6 h-[66px] border border-[#7C50E336] bg-[#7C50E30A]">
          <BsInfoCircle size={28} />
          Tap a piece to view details or add it to your shortlist
        </p>

        {/* INPUTS */}
        <div className=" flex justify-center flex-col w-full items-center gap-[86px]">
          {/* THEIR NAME */}
          <div className=" w-fit flex flex-col gap-8">
            <p className=" font-hind text-[40px] text-[#302B2C]">
              Who’s this gift for?
            </p>
            <input
              type="text"
              value={personalDetails.theirName}
              onFocus={() => handleInputFocus("theirName")}
              onChange={(e) =>
                setPersonalDetails((prev) => ({
                  ...prev,
                  theirName: e.target.value,
                }))
              }
              placeholder="Enter Their Name"
              className=" h-[108px] px-11 placeholder:text-3xl placeholder:text-[#302B2C] text-3xl text-[#302B2C] w-[925px] border border-[#6F6F6F94] rounded-xl bg-[#FFFFFF29]"
            />
          </div>

          {/* YOUR NAME */}
          <div className=" w-fit flex flex-col gap-8">
            <p className=" font-hind text-[40px] text-[#302B2C]">
              Who is this coming from?
            </p>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={personalDetails.yourName}
              onFocus={() => handleInputFocus("yourName")}
              onChange={(e) =>
                setPersonalDetails((prev) => ({
                  ...prev,
                  yourName: e.target.value,
                }))
              }
              className=" h-[108px] mt-6 px-11 placeholder:text-3xl placeholder:text-[#302B2C] text-3xl text-[#302B2C] w-[925px] border border-[#6F6F6F94] rounded-xl bg-[#FFFFFF29]"
            />
          </div>
        </div>

        {/* KEYBOARD */}
        <Keyboard
          isOpen={isKeyboardOpen}
          version={2}
          handleContinue={handleContinue}
          onKeyPress={handleKeyPress}
          SkipHandleContinue={SkipHandleContinue}
          continueClassName={` !text-white !bg-[#002066]`}
          onClose={() => setIsKeyboardOpen(false)}
        />
      </div>
    </div>
  );
};

export default Page;
