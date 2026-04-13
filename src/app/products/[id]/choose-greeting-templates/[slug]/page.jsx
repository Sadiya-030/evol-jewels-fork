"use client";
import React, { useState } from "react";
import img1 from "../../../../../../public/close.svg";
import "swiper/css";
import Link from "next/link";
import { BsInfoCircle } from "react-icons/bs";
import { useGreetingStore } from "../../../../../store/greetingStore";
import template5 from "../../../../../../public/greetings/A5 - 6.jpg";
import { greetingData } from "../../../../../data/greetingData";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { RiLoopLeftFill } from "react-icons/ri";
import Keyboard from "../../../../../components/Keyboard";

const page = () => {
  const { product } = useGreetingStore();
  const pathname = usePathname();
  const { slug } = useParams();
  const router = useRouter();
  const { setSelectedCard, selectedCard } = useGreetingStore();
  const generateMsgPicks = [
    "Romantic",
    "Funny",
    "Poetic",
    "Thoughtful",
    "Funny",
    "Romantic",
  ];
  const generateMsgEdit = [
    "Try a variation",
    "Make it shorter",
    "Make it warmer",
    "Make it more playful",
    "Change tone",
  ];
  const template = greetingData.find((item) => item.slug === slug);
  const [greetingDataText, setgreetingDataText] = useState(
    !selectedCard?.msg ? (template?.msg || "") : selectedCard?.msg,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboard, setisKeyboard] = useState(false);
  const [grtpicks, setgrtpicks] = useState("");
  const handleOptionClick = async (option) => {
    setIsLoading(true);
    const wordLimit = 18;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMSURL}/api/products/greet-message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pick: option,
            tone: "Keep Original",
            template: template.templateName, // use current template
            words: wordLimit,
            product: product?.product?.pineconeMetadata?.productTitle,
          }),
        },
      );

      const data = await res.json();

      if (data.success && data.data?.greetingMessage) {
        setgreetingDataText(data.data.greetingMessage); // <-- update textarea
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOptionToneClick = async (option) => {
    setIsLoading(true);
    const wordLimit = option === "Make it shorter" ? 14 : 20;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMSURL}/api/products/greet-message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pick: grtpicks,
            tone: option,
            template: template.templateName, // use current template
            words: wordLimit,
            product: product?.product?.pineconeMetadata?.productTitle,
          }),
        },
      );

      const data = await res.json();

      if (data.success && data.data?.greetingMessage) {
        setgreetingDataText(data.data.greetingMessage); // <-- update textarea
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (key) => {
    if (key === "Delete") {
      setgreetingDataText((prev) => prev.slice(0, -1));
    } else {
      setgreetingDataText((prev) => prev + key);
    }
  };

  const [steps, setsteps] = useState(1);
  const handleStepChange = () => {
    if (steps === 1) {
      setsteps(2);
    } else {
      setSelectedCard({ ...selectedCard, msg: greetingDataText });
      router.push(`${pathname}/personal-details`);
    }
  };

  return (
    <div className=" relative">
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
            setSelectedCard({ ...selectedCard, msg: "" });

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
        <p className="mx-[100px]  mb-[58px]  rounded-[2000px] text-[22px] font-medium text-[#7C50E3] w-[calc(100vw-200px)] flex items-center justify-center gap-6 h-[66px] border border-[#7C50E336] bg-[#7C50E30A]">
          <BsInfoCircle size={28} />
          Tap a piece to view details or add it to your shortlist
        </p>

        <div className=" px-8 ">
          <div className=" relative">
            <img
              src={template5?.src}
              alt={template.title}
              className=" w-full h-full object-cover"
            />
            <div className=" absolute bottom-0 left-0 w-full h-full flex items-center justify-center">
              {isLoading ? (
                <p className=" text-2xl text-[#302B2C]">Loading...</p>
              ) : (
                <div className=" text-3xl h-fit max-w-[680px] w-full text-[#302B2C] font-ethereal">
                  <textarea
                    className="  w-full text-center h-fit flex items-center"
                    name="msg"
                    id="msg"
                    rows="4"
                    value={greetingDataText}
                    onChange={(e) => setgreetingDataText(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-[56px] w-full my-[108px]">
          <p className=" text-[28px] font-hind text-center flex items-center text-[#302B2C] justify-center gap-4 ">
            Smart Picks for You <RiLoopLeftFill />
          </p>
          <div className="overflow-auto no-scrollbar flex items-center gap-[24px]">
            {steps === 1
              ? generateMsgPicks.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setgrtpicks(item);
                      handleOptionClick(item);
                    }}
                    style={{
                      marginRight:
                        index === generateMsgPicks.length - 1 ? "100px" : "0",
                      marginLeft: index === 0 ? "100px" : "0",
                    }}
                    className=" px-8 min-w-[220px] py-6  flex-shrink-0 rounded-full  bg-[#7C50E312] text-[#002066]  font-ethereal text-[28px]"
                  >
                    {item}
                  </button>
                ))
              : generateMsgEdit.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setgrtpicks(item);
                      handleOptionToneClick(item);
                    }}
                    style={{
                      marginRight:
                        index === generateMsgEdit.length - 1 ? "100px" : "0",
                      marginLeft: index === 0 ? "100px" : "0",
                    }}
                    className=" px-8 min-w-[220px] py-6  flex-shrink-0 rounded-full  bg-[#7C50E312] text-[#002066]  font-ethereal text-[28px]"
                  >
                    {item}
                  </button>
                ))}
          </div>
        </div>
        <div className=" px-[100px] flex flex-col  h-fit  gap-6 items-center">
          <p
            onClick={handleStepChange}
            className="px-10 py-4  font-ethereal flex items-center justify-center  text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-[#002066] text-white text-2xl font-semibold"
          >
            Use this message
          </p>
          <p
            onClick={() => setisKeyboard(true)}
            className="px-10 py-4  font-ethereal flex items-center justify-center  text-[30px]  h-[103px] w-full rounded-[2000px] bg-[#F4EFEFCC] text-[#302B2C] font-light"
          >
            Write my message
          </p>
        </div>
        <Keyboard
          isOpen={isKeyboard}
          onClose={() => setisKeyboard(false)}
          onKeyPress={handleKeyPress}
          handleContinue={handleStepChange}
        />
      </div>
    </div>
  );
};

export default page;
