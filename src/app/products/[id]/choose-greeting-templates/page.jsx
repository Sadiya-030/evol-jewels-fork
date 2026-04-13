"use client";
import React, { useState } from "react";
import img1 from "../../../../../public/close.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";

import { BsInfoCircle } from "react-icons/bs";
import { useGreetingStore } from "../../../../store/greetingStore";
import { greetingData } from "../../../../data/greetingData";
import { usePathname, useRouter } from "next/navigation";

const CenterFocusSlider = ({ setgreetSLug }) => {
  const slides = greetingData;
  const [activeIndex, setActiveIndex] = useState(3); // start with middle one
  const [swiper, setSwiper] = useState(null);
  React.useEffect(() => {
    if (swiper) {
      swiper.update();
      window.dispatchEvent(new Event("resize")); // ✅ triggers Swiper’s resize recalculation
    }
  }, [swiper]);
  const { setSelectedCard } = useGreetingStore();

  return (
    <div className="w-full flex items-center h-full max-w-[1600px]">
      <Swiper
        onSwiper={(s) => {
          setSwiper(s);
          s.slideTo(2, 0); // start at middle
          setTimeout(() => {
            s.update(); // ✅ force Swiper to recalc sizes and centering
          }, 100); // slight delay ensures DOM fully rendered
        }}
        onSlideChange={(s) => {
          setActiveIndex(s.realIndex);
          setgreetSLug(slides[s.realIndex].slug);
        }}
        slidesPerView="auto"
        centeredSlides={true}
        spaceBetween={40}
        initialSlide={1}
        loop={true}
        grabCursor={true}
        className="   !py-10 "
      >
        {slides.map((item, i) => {
          const isActive = i === activeIndex;

          return (
            <SwiperSlide
              key={item.id}
              className=" !w-[850px] !h-[960px]   !flex !items-center !justify-center "
              onClick={() => swiper?.slideTo(i)}
            >
              <div
                className={[
                  "relative transition-all h-full duration-500 ease-out",
                  "mx-auto will-change-transform",
                ].join(" ")}
              >
                {/* Card frame */}
                <div
                  className={[
                    "transition-shadow p-2 duration-500 h-full flex flex-col justify-between",
                    isActive ? " border-white/40" : " border-white/20",
                  ].join(" ")}
                >
                  <div className=" w-[850px] relative h-[600px] border ">
                    <img
                      src={item?.img}
                      alt=""
                      className=" h-full shadow-lg w-full object-cover"
                    />
                    <div className=" absolute bottom-0 left-0 w-full h-full flex items-center justify-center">
                      <div className=" text-3xl h-fit max-w-[580px] w-full text-[#302B2C] font-ethereal">
                        {item?.msg}
                      </div>
                    </div>
                  </div>
                  <div className=" h-full flex items-center justify-center ">
                    <p className=" text-[#302B2C]  leading-[110px] text-[120px] font-ethereal text-center max-w-[541px] mx-auto">
                      {item?.templateName}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
const page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const secondLast = parts[parts.length - 3];
  const [greetSLug, setgreetSLug] = useState("");
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
          onClick={() => router.back()}
          className=" px-[50px] flex items-center gap-5 mt-[107px] mb-[69px] text-[#302B2C] font-hind text-[40px]"
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
        <p className="mx-[100px]  mb-[100px]  rounded-[2000px] text-[22px] font-medium text-[#7C50E3] w-[calc(100vw-200px)] flex items-center justify-center gap-6 h-[66px] border border-[#7C50E336] bg-[#7C50E30A]">
          <BsInfoCircle size={28} />
          Tap a piece to view details or add it to your shortlist
        </p>

        <div className=" fit ">
          <CenterFocusSlider setgreetSLug={setgreetSLug} />
        </div>
        <div className=" px-[100px] flex flex-col  h-fit  gap-6 items-center">
          <Link
            href={`${pathname}/${greetSLug}`}
            className="px-10 py-4  font-ethereal flex items-center justify-center  text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-[#002066] text-white text-2xl font-semibold"
          >
            Choose the greeting{" "}
          </Link>
          <Link
            href={`/products/${secondLast}/print-greeting`}
            className="px-10 py-4  font-ethereal flex items-center justify-center  text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-[#F4EFEFCC] text-[#302B2C] text-2xl font-semibold"
          >
            Skip the greeting
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
